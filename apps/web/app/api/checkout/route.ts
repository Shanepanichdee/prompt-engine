import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan } = (await req.json()) as { plan: 'pro' | 'day' }
  if (plan !== 'pro' && plan !== 'day') {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email ?? undefined,
      name: session.user.name ?? undefined,
      metadata: { userId: session.user.id },
    })
    customerId = customer.id
    await db.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    })
  }

  const baseUrl = process.env.AUTH_URL ?? 'http://localhost:3000'

  if (plan === 'pro') {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
      success_url: `${baseUrl}/?upgraded=1`,
      cancel_url: `${baseUrl}/pricing`,
    })
    return NextResponse.json({ url: checkoutSession.url })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    line_items: [{ price: process.env.STRIPE_DAY_PASS_PRICE_ID!, quantity: 1 }],
    success_url: `${baseUrl}/?upgraded=1`,
    cancel_url: `${baseUrl}/pricing`,
  })
  return NextResponse.json({ url: checkoutSession.url })
}
