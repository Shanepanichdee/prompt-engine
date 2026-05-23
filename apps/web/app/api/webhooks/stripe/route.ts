import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET env var is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

function toCustomerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | null {
  if (!customer) return null
  return typeof customer === 'string' ? customer : customer.id
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = toCustomerId(session.customer)
        if (!customerId || session.mode !== 'payment') break
        await db.user.update({
          where: { stripeCustomerId: customerId },
          data: { dayPassExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) },
        })
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = toCustomerId(sub.customer)
        if (!customerId) break
        await db.user.update({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: sub.status, subscriptionId: sub.id },
        })
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = toCustomerId(sub.customer)
        if (!customerId) break
        await db.user.update({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: 'canceled', subscriptionId: null },
        })
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = toCustomerId(invoice.customer)
        if (!customerId) break
        await db.user.update({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: 'past_due' },
        })
        break
      }
    }
  } catch (err: unknown) {
    // P2025 = Prisma record not found — unretriable, acknowledge so Stripe stops retrying
    if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === 'P2025') {
      console.warn('Webhook: no user found for Stripe customer, skipping:', event.type)
      return NextResponse.json({ received: true })
    }
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
