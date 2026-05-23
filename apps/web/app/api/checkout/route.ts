import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { plan?: unknown }
  try {
    body = (await req.json()) as { plan?: unknown }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { plan } = body
  if (plan !== 'pro' && plan !== 'day') {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  try {
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await getStripe().customers.create(
        {
          email: session.user.email ?? undefined,
          name: session.user.name ?? undefined,
          metadata: { userId: session.user.id },
        },
        { idempotencyKey: `create-customer-${session.user.id}` },
      )
      customerId = customer.id
      await db.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    const baseUrl = process.env.AUTH_URL ?? 'http://localhost:3000'
    const mode = plan === 'pro' ? 'subscription' : 'payment'
    const priceId = plan === 'pro' ? process.env.STRIPE_PRO_PRICE_ID! : process.env.STRIPE_DAY_PASS_PRICE_ID!

    const checkoutSession = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/?upgraded=1`,
      cancel_url: `${baseUrl}/pricing`,
    })

    if (!checkoutSession.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 })
  }
}
