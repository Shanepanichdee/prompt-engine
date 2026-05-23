# Subscription Monetization Design

## Goal

Add Stripe-powered paid plans to Prompt Engine. Two plans: **Pro** ($5/month) and **Day Pass** ($1.99 one-time, 24h access). Free users can build prompts (5/day) and browse /explore. Paid users get unlimited builds, save/history, /compare, and can post to /explore.

---

## Access Model

| Feature | Free | Pro / Day Pass |
|---------|------|----------------|
| All 14 frameworks | ✅ | ✅ |
| Build prompts | ✅ 5/day | ✅ unlimited |
| Save prompts | ❌ | ✅ |
| History page | ❌ | ✅ |
| Compare page | ❌ | ✅ |
| Browse /explore | ✅ | ✅ |
| Post to /explore | ❌ | ✅ |

---

## Architecture

### Schema additions (`User` model)

```prisma
stripeCustomerId     String?   @unique
subscriptionStatus   String?   // 'active' | 'canceled' | 'past_due' | null
subscriptionId       String?   @unique
dayPassExpiry        DateTime? // set to now()+24h on day pass purchase
buildsToday          Int       @default(0)
buildsResetAt        DateTime? // date of last reset — reset buildsToday when date changes
```

### isPro helper (`lib/subscription.ts`)

```ts
export function isPro(user: { subscriptionStatus: string | null; dayPassExpiry: Date | null }): boolean {
  if (user.subscriptionStatus === 'active') return true
  if (user.dayPassExpiry && user.dayPassExpiry > new Date()) return true
  return false
}
```

### Stripe products (create once in Stripe dashboard)

| Product | Type | Price |
|---------|------|-------|
| Pro Monthly | Recurring subscription | $5.00/month |
| Day Pass | One-time payment | $1.99 |

### Flow — Pro subscription

1. User clicks "Upgrade" → `POST /api/checkout` with `plan=pro`
2. Server creates Stripe Checkout session (subscription mode) → returns `url`
3. Browser redirects to Stripe-hosted checkout
4. On success → Stripe webhook `checkout.session.completed` + `customer.subscription.updated`
5. Webhook handler updates `User.subscriptionStatus = 'active'`, stores `stripeCustomerId` + `subscriptionId`
6. User redirected to `/?upgraded=1`

### Flow — Day Pass

1. User clicks "Day Pass" → `POST /api/checkout` with `plan=day`
2. Server creates Stripe Checkout session (payment mode, one-time) → returns `url`
3. Browser redirects to Stripe-hosted checkout
4. On success → Stripe webhook `checkout.session.completed`
5. Webhook handler sets `User.dayPassExpiry = now() + 24h`
6. User redirected to `/?upgraded=1`

### Build limit enforcement (free users)

- On each call to `POST /api/prompts` and the client-side gate: check `buildsToday` and `buildsResetAt`
- If `buildsResetAt` is a different calendar day (UTC) → reset `buildsToday = 0`
- If `buildsToday >= 5` and not pro → return 402 with `{ error: 'limit_reached' }`
- Otherwise increment `buildsToday` and proceed

---

## Files

| File | Change |
|------|--------|
| `apps/web/prisma/schema.prisma` | Add subscription fields to `User` |
| `apps/web/lib/subscription.ts` | New: `isPro()` helper, `checkAndIncrementBuilds()` |
| `apps/web/app/api/checkout/route.ts` | New: creates Stripe Checkout session |
| `apps/web/app/api/webhooks/stripe/route.ts` | New: handles Stripe webhook events |
| `apps/web/app/api/prompts/route.ts` | Add build limit check on POST |
| `apps/web/middleware.ts` | Add `/compare` and `/history` → pro gate redirect |
| `apps/web/components/UpgradeModal.tsx` | New: shows plans + Stripe links when user hits a gate |
| `apps/web/components/OutputPanel.tsx` | Show upgrade prompt when save is blocked |
| `apps/web/app/compare/page.tsx` | Show upgrade wall if not pro |
| `apps/web/app/pricing/page.tsx` | New: public pricing page (Free vs Pro) |
| `apps/web/components/TopBar.tsx` | Add "Pricing" link |

---

## Webhook events handled

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Pro: set `subscriptionStatus=active`. Day pass: set `dayPassExpiry = now+24h` |
| `customer.subscription.updated` | Sync `subscriptionStatus` |
| `customer.subscription.deleted` | Set `subscriptionStatus = 'canceled'` |
| `invoice.payment_failed` | Set `subscriptionStatus = 'past_due'` |

---

## Env vars required

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_DAY_PASS_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Security

- Webhook endpoint validates Stripe signature (`stripe.webhooks.constructEvent`) — rejects anything unsigned
- `isPro()` always reads from DB, never from client-supplied data
- Stripe customer ID stored on User — used to create portal sessions for subscription management
- No card data ever touches the server (Stripe Checkout handles it entirely)

---

## Out of scope

- Stripe Customer Portal (self-serve cancel/update) — add after launch
- Annual billing — add after launch
- Team/org plans — add after launch
