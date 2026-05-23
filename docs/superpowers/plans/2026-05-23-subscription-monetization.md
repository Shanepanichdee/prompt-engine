# Subscription Monetization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Stripe-powered subscriptions ($5/month Pro + $1.99 Day Pass) with feature gating — free users can build prompts but cannot save, access /history, or use /compare.

**Architecture:** Stripe Checkout handles all payment UI (no card data on our server). Webhooks sync subscription state to the DB. `isPro()` helper reads `subscriptionStatus` and `dayPassExpiry` from the User model. Pro status is embedded in the NextAuth session so client components can gate UI without extra API calls.

**Tech Stack:** Stripe SDK (`stripe` npm package), Next.js 15 App Router, Prisma + Neon PostgreSQL, NextAuth v5.

---

## File Map

| File | Change |
|------|--------|
| `apps/web/prisma/schema.prisma` | Add `stripeCustomerId`, `subscriptionStatus`, `subscriptionId`, `dayPassExpiry` to `User` |
| `apps/web/lib/subscription.ts` | New: `isPro()` helper |
| `apps/web/lib/auth.ts` | Extend session callback to include `isPro` |
| `apps/web/types/next-auth.d.ts` | New: TypeScript module augmentation for `session.user.isPro` |
| `apps/web/app/api/checkout/route.ts` | New: creates Stripe Checkout session for pro or day pass |
| `apps/web/app/api/webhooks/stripe/route.ts` | New: Stripe webhook handler |
| `apps/web/app/api/prompts/route.ts` | Add pro check to `POST` — 402 if not pro |
| `apps/web/components/UpgradeWall.tsx` | New: full-page upgrade prompt with plan cards |
| `apps/web/app/compare/page.tsx` | Add pro gate at top — renders `<UpgradeWall>` if not pro |
| `apps/web/app/history/page.tsx` | Add pro gate — renders `<UpgradeWall>` if not pro |
| `apps/web/components/OutputPanel.tsx` | Replace Save button with upgrade nudge when not pro |
| `apps/web/app/pricing/page.tsx` | New: public pricing page with plan comparison + checkout buttons |
| `apps/web/components/TopBar.tsx` | Add "Pricing" nav link |
| `apps/web/app/globals.css` | Styles for UpgradeWall, pricing page, upgrade nudge |

---

## Prerequisites (do before starting)

1. Create a [Stripe account](https://stripe.com) if you don't have one
2. In Stripe Dashboard → Products → Create two products:
   - **Pro Monthly**: recurring billing, $5.00/month → copy the Price ID (`price_...`)
   - **Day Pass**: one-time payment, $1.99 → copy the Price ID (`price_...`)
3. In Stripe Dashboard → Developers → API Keys → copy Secret Key and Publishable Key
4. Add to `apps/web/.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...   # get from Stripe CLI during local testing
   STRIPE_PRO_PRICE_ID=price_...
   STRIPE_DAY_PASS_PRICE_ID=price_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
5. Install Stripe CLI for local webhook testing: [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

---

### Task 1: Schema migration + isPro helper + session extension

**Files:**
- Modify: `apps/web/prisma/schema.prisma`
- Create: `apps/web/lib/subscription.ts`
- Create: `apps/web/types/next-auth.d.ts`
- Modify: `apps/web/lib/auth.ts`

- [ ] **Step 1: Add subscription fields to User model**

In `apps/web/prisma/schema.prisma`, replace the `User` model with:

```prisma
model User {
  id                  String        @id @default(cuid())
  name                String?
  email               String?       @unique
  emailVerified       DateTime?
  image               String?
  createdAt           DateTime      @default(now())
  stripeCustomerId    String?       @unique
  subscriptionStatus  String?
  subscriptionId      String?       @unique
  dayPassExpiry       DateTime?
  accounts            Account[]
  savedPrompts        SavedPrompt[]
  sessions            Session[]
}
```

- [ ] **Step 2: Push schema to DB**

```bash
cd apps/web && pnpm prisma db push
```

Expected: `Your database is now in sync with your Prisma schema.`

- [ ] **Step 3: Create isPro helper**

Create `apps/web/lib/subscription.ts`:

```ts
type ProCheckInput = {
  subscriptionStatus: string | null | undefined
  dayPassExpiry: Date | null | undefined
}

export function isPro(user: ProCheckInput): boolean {
  if (user.subscriptionStatus === 'active') return true
  if (user.dayPassExpiry && user.dayPassExpiry > new Date()) return true
  return false
}
```

- [ ] **Step 4: Create TypeScript module augmentation**

Create `apps/web/types/next-auth.d.ts`:

```ts
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      isPro: boolean
    } & DefaultSession['user']
  }
}
```

- [ ] **Step 5: Extend session callback in auth.ts**

In `apps/web/lib/auth.ts`, update the `session` callback to compute and embed `isPro`:

```ts
import NextAuth, { type NextAuthResult } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Resend from 'next-auth/providers/resend'
import { db } from '@/lib/db'
import { authConfig } from '@/lib/auth.config'
import { isPro } from '@/lib/subscription'

const result: NextAuthResult = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    ...authConfig.providers,
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.EMAIL_FROM ?? 'Prompt Engine <noreply@data-shane.com>',
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    session({ session, user }) {
      session.user.id = user.id
      session.user.isPro = isPro(user as { subscriptionStatus: string | null; dayPassExpiry: Date | null })
      return session
    },
  },
})

export const { handlers, auth, signIn, signOut } = result
```

- [ ] **Step 6: Typecheck**

```bash
cd /path/to/prompt-engine && pnpm typecheck
```

Expected: `4 successful, 4 total`. Fix any type errors before continuing.

- [ ] **Step 7: Commit**

```bash
git add apps/web/prisma/schema.prisma apps/web/lib/subscription.ts apps/web/types/next-auth.d.ts apps/web/lib/auth.ts
git commit -m "feat(subscription): add isPro helper, schema fields, session extension"
```

---

### Task 2: Install Stripe + checkout API route

**Files:**
- Create: `apps/web/app/api/checkout/route.ts`

- [ ] **Step 1: Install Stripe SDK**

```bash
pnpm --filter web add stripe
```

Expected: `packages/web/node_modules/stripe` added.

- [ ] **Step 2: Create checkout route**

Create `apps/web/app/api/checkout/route.ts`:

```ts
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
```

- [ ] **Step 3: Typecheck**

```bash
pnpm typecheck
```

Expected: `4 successful, 4 total`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/api/checkout/route.ts
git commit -m "feat(subscription): add Stripe checkout API route"
```

---

### Task 3: Stripe webhook handler

**Files:**
- Create: `apps/web/app/api/webhooks/stripe/route.ts`

- [ ] **Step 1: Create webhook route**

Create `apps/web/app/api/webhooks/stripe/route.ts`:

```ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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
        const customerId = session.customer as string
        if (session.mode === 'payment') {
          const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
          await db.user.update({
            where: { stripeCustomerId: customerId },
            data: { dayPassExpiry: expiry },
          })
        }
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        await db.user.update({
          where: { stripeCustomerId: sub.customer as string },
          data: {
            subscriptionStatus: sub.status,
            subscriptionId: sub.id,
          },
        })
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await db.user.update({
          where: { stripeCustomerId: sub.customer as string },
          data: { subscriptionStatus: 'canceled', subscriptionId: null },
        })
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await db.user.update({
          where: { stripeCustomerId: invoice.customer as string },
          data: { subscriptionStatus: 'past_due' },
        })
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: `4 successful, 4 total`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/api/webhooks/stripe/route.ts
git commit -m "feat(subscription): add Stripe webhook handler"
```

---

### Task 4: Gate save in prompts API

**Files:**
- Modify: `apps/web/app/api/prompts/route.ts`

- [ ] **Step 1: Add pro check to POST handler**

Replace the entire content of `apps/web/app/api/prompts/route.ts` with:

```ts
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { validateSavePromptBody } from '@/lib/validate-prompt'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!session.user.isPro) {
    return NextResponse.json({ error: 'Pro required', code: 'pro_required' }, { status: 402 })
  }

  if (!checkRateLimit(`prompts:${session.user.id}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body: unknown = await req.json()
  const validation = validateSavePromptBody(body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const b = body as {
    frameworkId: string
    locale: string
    inputs: Record<string, string>
    promptText: string
    title?: string
  }

  const slug = randomBytes(4).toString('hex')

  const prompt = await db.savedPrompt.create({
    data: {
      slug,
      userId: session.user.id,
      frameworkId: b.frameworkId,
      locale: b.locale,
      inputs: b.inputs,
      promptText: b.promptText,
      title: b.title ?? null,
    },
  })

  return NextResponse.json({ id: prompt.id, slug: prompt.slug })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prompts = await db.savedPrompt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      slug: true,
      frameworkId: true,
      locale: true,
      title: true,
      promptText: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ prompts })
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: `4 successful, 4 total`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/api/prompts/route.ts
git commit -m "feat(subscription): gate prompt save behind pro check"
```

---

### Task 5: UpgradeWall component + gate /compare and /history

**Files:**
- Create: `apps/web/components/UpgradeWall.tsx`
- Modify: `apps/web/app/compare/page.tsx`
- Modify: `apps/web/app/history/page.tsx`
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: Create UpgradeWall component**

Create `apps/web/components/UpgradeWall.tsx`:

```tsx
'use client'

import { useRouter } from 'next/navigation'

type Props = {
  feature: string
}

export function UpgradeWall({ feature }: Props) {
  const router = useRouter()

  const checkout = async (plan: 'pro' | 'day') => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    if (res.status === 401) {
      router.push('/api/auth/signin')
      return
    }
    const data = (await res.json()) as { url?: string }
    if (data.url) window.location.href = data.url
  }

  return (
    <div className="upgrade-wall">
      <div className="upgrade-wall-inner">
        <div className="upgrade-lock">🔒</div>
        <h2 className="upgrade-title">Pro feature</h2>
        <p className="upgrade-desc">{feature} requires a Pro plan or Day Pass.</p>

        <div className="upgrade-plans">
          <div className="upgrade-plan upgrade-plan-featured">
            <div className="upgrade-plan-name">Pro</div>
            <div className="upgrade-plan-price">$5<span>/month</span></div>
            <ul className="upgrade-plan-features">
              <li>Unlimited saves</li>
              <li>History page</li>
              <li>Compare frameworks</li>
              <li>Post to Explore</li>
            </ul>
            <button
              type="button"
              className="upgrade-btn upgrade-btn-primary"
              onClick={() => checkout('pro')}
            >
              Get Pro
            </button>
          </div>

          <div className="upgrade-plan">
            <div className="upgrade-plan-name">Day Pass</div>
            <div className="upgrade-plan-price">$1.99<span>/day</span></div>
            <ul className="upgrade-plan-features">
              <li>Full Pro access</li>
              <li>24-hour access</li>
              <li>Perfect for one project</li>
            </ul>
            <button
              type="button"
              className="upgrade-btn upgrade-btn-secondary"
              onClick={() => checkout('day')}
            >
              Buy Day Pass
            </button>
          </div>
        </div>

        <p className="upgrade-free-note">
          Free plan: build prompts with all 14 frameworks, browse Explore.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add UpgradeWall CSS to globals.css**

Append to the end of `apps/web/app/globals.css`:

```css
/* ── Upgrade Wall ─────────────────────────────────────────── */
.upgrade-wall {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
}

.upgrade-wall-inner {
  max-width: 560px;
  width: 100%;
  text-align: center;
}

.upgrade-lock {
  font-size: 40px;
  margin-bottom: 12px;
}

.upgrade-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
}

.upgrade-desc {
  color: var(--muted);
  font-size: 15px;
  margin: 0 0 28px;
}

.upgrade-plans {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.upgrade-plan {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px 20px;
  text-align: left;
}

.upgrade-plan-featured {
  border-color: var(--brand);
  box-shadow: 0 0 0 1px var(--brand);
}

.upgrade-plan-name {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 8px;
}

.upgrade-plan-featured .upgrade-plan-name {
  color: var(--brand);
}

.upgrade-plan-price {
  font-size: 32px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.upgrade-plan-price span {
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
}

.upgrade-plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.upgrade-plan-features li {
  font-size: 13px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.upgrade-plan-features li::before {
  content: '✓';
  color: var(--brand);
  font-weight: 700;
  flex-shrink: 0;
}

.upgrade-btn {
  width: 100%;
  padding: 10px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
  border: none;
}

.upgrade-btn:hover { opacity: 0.85; }

.upgrade-btn-primary {
  background: var(--brand);
  color: #fff;
}

.upgrade-btn-secondary {
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--border);
}

.upgrade-free-note {
  font-size: 12px;
  color: var(--muted);
  margin: 0;
}

@media (max-width: 480px) {
  .upgrade-plans {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Gate /compare page**

In `apps/web/app/compare/page.tsx`, add the pro check. The compare page is a client component so we use `useSession`. Add this at the top of the `ComparePage` component function (after existing `useState` declarations):

```tsx
'use client'

import { useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { build, frameworks, getLocale, type Field, type LocaleCode } from '@prompt-engine/core'
import { FieldsForm } from '@/components/FieldsForm'
import { CompareOutputPanel } from '@/components/CompareOutputPanel'
import { UpgradeWall } from '@/components/UpgradeWall'

const LOCALES: LocaleCode[] = ['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar']

const DEFAULT_IDS = [frameworks[0]?.id ?? 'rtf', frameworks[1]?.id ?? 'crispe']

export default function ComparePage() {
  const { data: session, status } = useSession()
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_IDS)
  const [values, setValues] = useState<Record<string, string>>({})
  const [locale, setLocale] = useState<LocaleCode>('en')
```

Then, before the `return` statement of the existing JSX, add the gate:

```tsx
  if (status === 'loading') return null
  if (!session?.user?.isPro) {
    return <UpgradeWall feature="Compare" />
  }
```

Keep the rest of the component JSX unchanged.

- [ ] **Step 4: Gate /history page**

In `apps/web/app/history/page.tsx`, add a pro check after the existing sign-in redirect:

```ts
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { HistoryList } from '@/components/HistoryList'
import { UpgradeWall } from '@/components/UpgradeWall'

export default async function HistoryPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/api/auth/signin')

  if (!session.user.isPro) {
    return <UpgradeWall feature="History" />
  }

  const prompts = await db.savedPrompt.findMany({
```

Keep the rest of the page unchanged after the `isPro` check.

- [ ] **Step 5: Typecheck**

```bash
pnpm typecheck
```

Expected: `4 successful, 4 total`.

- [ ] **Step 6: Commit**

```bash
git add apps/web/components/UpgradeWall.tsx apps/web/app/compare/page.tsx apps/web/app/history/page.tsx apps/web/app/globals.css
git commit -m "feat(subscription): add UpgradeWall, gate /compare and /history behind pro"
```

---

### Task 6: Update OutputPanel — upgrade nudge on Save

**Files:**
- Modify: `apps/web/components/OutputPanel.tsx`

The current `canSave = session && result.prompt.length > 0`. Change this so:
- Not signed in → "Sign in to save" button
- Signed in, not pro → upgrade nudge (link to /pricing)
- Signed in + pro → existing Save button

- [ ] **Step 1: Update canSave logic and add upgrade nudge**

In `apps/web/components/OutputPanel.tsx`, find and replace the `canSave` line and the save button JSX block:

Replace:
```tsx
  const canSave = session && result.prompt.length > 0
```

With:
```tsx
  const hasOutput = result.prompt.length > 0
  const canSave = !!session?.user?.isPro && hasOutput
  const showUpgradeNudge = !!session && !session.user.isPro && hasOutput
  const showSignIn = !session && hasOutput
```

Then find the save button block:
```tsx
          {canSave && (
            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
```

Replace with:
```tsx
          {canSave && (
            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
          {showUpgradeNudge && (
            <a href="/pricing" className="save-upgrade-nudge">
              Pro to save ↗
            </a>
          )}
          {showSignIn && (
            <a href="/api/auth/signin" className="save-upgrade-nudge">
              Sign in to save
            </a>
          )}
```

Also remove the old `const hasOutput` line that appears later (it was defined after `canSave` — now it's defined before it). Search for any duplicate `const hasOutput` and remove it.

- [ ] **Step 2: Add nudge CSS**

Append to `apps/web/app/globals.css` (after the upgrade wall styles from Task 5):

```css
.save-upgrade-nudge {
  height: 36px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--brand);
  border-radius: 999px;
  background: transparent;
  color: var(--brand);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
  white-space: nowrap;
}

.save-upgrade-nudge:hover {
  background: var(--brand-soft);
}
```

- [ ] **Step 3: Typecheck**

```bash
pnpm typecheck
```

Expected: `4 successful, 4 total`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/OutputPanel.tsx apps/web/app/globals.css
git commit -m "feat(subscription): show upgrade nudge on Save when user is not pro"
```

---

### Task 7: Pricing page + TopBar link

**Files:**
- Create: `apps/web/app/pricing/page.tsx`
- Modify: `apps/web/components/TopBar.tsx`
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: Create pricing page**

Create `apps/web/app/pricing/page.tsx`:

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { TopBar } from '@/components/TopBar'
import { useState } from 'react'

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)

  const checkout = async (plan: 'pro' | 'day') => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    if (res.status === 401) {
      router.push('/api/auth/signin?callbackUrl=/pricing')
      return
    }
    const data = (await res.json()) as { url?: string }
    if (data.url) window.location.href = data.url
  }

  const isPro = !!session?.user?.isPro

  return (
    <main className={`page${darkMode ? ' dark' : ''}`}>
      <TopBar darkMode={darkMode} onDarkMode={setDarkMode} />

      <div className="pricing-page">
        <div className="pricing-hero">
          <h1 className="pricing-headline">Simple pricing</h1>
          <p className="pricing-sub">Start free. Upgrade when you need more.</p>
        </div>

        <div className="pricing-grid">
          {/* Free */}
          <div className="pricing-card">
            <div className="pricing-card-name">Free</div>
            <div className="pricing-card-price">$0<span>/month</span></div>
            <ul className="pricing-features">
              <li>All 14 frameworks</li>
              <li>Build prompts</li>
              <li>Browse Explore</li>
              <li className="pricing-feature-off">Save prompts</li>
              <li className="pricing-feature-off">History</li>
              <li className="pricing-feature-off">Compare frameworks</li>
            </ul>
            <div className="pricing-card-cta">
              <span className="pricing-current-label">Your current plan</span>
            </div>
          </div>

          {/* Pro */}
          <div className="pricing-card pricing-card-featured">
            <div className="pricing-badge">Most popular</div>
            <div className="pricing-card-name">Pro</div>
            <div className="pricing-card-price">$5<span>/month</span></div>
            <ul className="pricing-features">
              <li>Everything in Free</li>
              <li>Unlimited saves</li>
              <li>History page</li>
              <li>Compare frameworks</li>
              <li>Post to Explore</li>
              <li>Cancel anytime</li>
            </ul>
            <div className="pricing-card-cta">
              {isPro ? (
                <span className="pricing-current-label pricing-current-pro">Your current plan</span>
              ) : (
                <button
                  type="button"
                  className="pricing-btn pricing-btn-primary"
                  onClick={() => checkout('pro')}
                >
                  Get Pro
                </button>
              )}
            </div>
          </div>

          {/* Day Pass */}
          <div className="pricing-card">
            <div className="pricing-card-name">Day Pass</div>
            <div className="pricing-card-price">$1.99<span>/day</span></div>
            <ul className="pricing-features">
              <li>Full Pro access</li>
              <li>24-hour access</li>
              <li>One-time payment</li>
              <li>No subscription</li>
              <li>Perfect for a project</li>
            </ul>
            <div className="pricing-card-cta">
              <button
                type="button"
                className="pricing-btn pricing-btn-secondary"
                onClick={() => checkout('day')}
              >
                Buy Day Pass
              </button>
            </div>
          </div>
        </div>

        <p className="pricing-footer-note">
          Payments processed securely by Stripe. Cancel anytime from your Stripe dashboard.
        </p>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Add pricing page CSS**

Append to `apps/web/app/globals.css`:

```css
/* ── Pricing Page ─────────────────────────────────────────── */
.pricing-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

.pricing-hero {
  text-align: center;
  margin-bottom: 40px;
}

.pricing-headline {
  font-size: 36px;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.pricing-sub {
  color: var(--muted);
  font-size: 16px;
  margin: 0;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.pricing-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 28px 24px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.pricing-card-featured {
  border-color: var(--brand);
  box-shadow: 0 0 0 1px var(--brand);
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--brand);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

.pricing-card-name {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 10px;
}

.pricing-card-featured .pricing-card-name {
  color: var(--brand);
}

.pricing-card-price {
  font-size: 40px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.pricing-card-price span {
  font-size: 15px;
  font-weight: 500;
  color: var(--muted);
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.pricing-features li {
  font-size: 14px;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.pricing-features li::before {
  content: '✓';
  color: var(--brand);
  font-weight: 700;
  flex-shrink: 0;
}

.pricing-feature-off {
  color: var(--muted) !important;
  text-decoration: line-through;
}

.pricing-feature-off::before {
  content: '–' !important;
  color: var(--muted) !important;
}

.pricing-card-cta {
  margin-top: auto;
}

.pricing-btn {
  width: 100%;
  padding: 12px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
  border: none;
}

.pricing-btn:hover { opacity: 0.85; }

.pricing-btn-primary {
  background: var(--brand);
  color: #fff;
}

.pricing-btn-secondary {
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--border);
}

.pricing-current-label {
  font-size: 13px;
  color: var(--muted);
  display: block;
  text-align: center;
  padding: 8px 0;
}

.pricing-current-pro {
  color: var(--brand);
  font-weight: 600;
}

.pricing-footer-note {
  text-align: center;
  font-size: 12px;
  color: var(--muted);
  margin: 0;
}

@media (max-width: 700px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Add Pricing link to TopBar**

In `apps/web/components/TopBar.tsx`, add `Pricing` link to the nav. Find:

```tsx
      <nav className="topbar-nav">
        <Link href="/" className="nav-link">Prompts</Link>
        <Link href="/frameworks" className="nav-link">Frameworks</Link>
        <Link href="/context" className="nav-link">Context</Link>
        <Link href="/compare" className="nav-link">Compare</Link>
        <Link href="/explore" className="nav-link">Explore</Link>
        <a href="https://qr-engine.data-shane.com" target="_blank" rel="noreferrer" className="nav-link nav-link-external">QR Engine ↗</a>
      </nav>
```

Replace with:

```tsx
      <nav className="topbar-nav">
        <Link href="/" className="nav-link">Prompts</Link>
        <Link href="/frameworks" className="nav-link">Frameworks</Link>
        <Link href="/context" className="nav-link">Context</Link>
        <Link href="/compare" className="nav-link">Compare</Link>
        <Link href="/explore" className="nav-link">Explore</Link>
        <Link href="/pricing" className="nav-link">Pricing</Link>
        <a href="https://qr-engine.data-shane.com" target="_blank" rel="noreferrer" className="nav-link nav-link-external">QR Engine ↗</a>
      </nav>
```

- [ ] **Step 4: Typecheck**

```bash
pnpm typecheck
```

Expected: `4 successful, 4 total`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/pricing/page.tsx apps/web/components/TopBar.tsx apps/web/app/globals.css
git commit -m "feat(subscription): add pricing page and TopBar link"
```

---

### Task 8: Push + verify

- [ ] **Step 1: Add Stripe env vars to Render**

In Render dashboard → your web service → Environment → add:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_DAY_PASS_PRICE_ID=price_...
```

- [ ] **Step 2: Configure Stripe webhook endpoint**

In Stripe Dashboard → Developers → Webhooks → Add endpoint:
- URL: `https://prompts.data-shane.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- Copy the webhook signing secret → set as `STRIPE_WEBHOOK_SECRET` on Render

- [ ] **Step 3: Push to production**

```bash
git push origin main
```

- [ ] **Step 4: Verify on production (after ~2 min deploy)**

1. Visit `https://prompts.data-shane.com/pricing` — three plan cards visible
2. Visit `/compare` without Pro — UpgradeWall shown
3. Visit `/history` without Pro — UpgradeWall shown
4. Build a prompt → Save button replaced with "Pro to save ↗" link (for non-pro users)
5. Click "Get Pro" on pricing page → redirects to Stripe Checkout
6. Complete test purchase (use Stripe test card `4242 4242 4242 4242`) → redirects back to `/?upgraded=1`
7. After webhook fires (check Render logs) → /history and /compare now accessible

---

## Self-Review

**Spec coverage:**
- ✅ Schema fields — Task 1
- ✅ `isPro()` helper — Task 1
- ✅ Session includes `isPro` — Task 1
- ✅ Stripe Checkout (pro + day) — Task 2
- ✅ Webhook handler — Task 3
- ✅ Save gated in API — Task 4
- ✅ /compare gated — Task 5
- ✅ /history gated — Task 5
- ✅ OutputPanel upgrade nudge — Task 6
- ✅ Pricing page — Task 7
- ✅ TopBar Pricing link — Task 7
- ✅ Security (webhook signature validation) — Task 3

**Placeholder scan:** None — all code blocks are complete.

**Type consistency:**
- `session.user.isPro: boolean` declared in `types/next-auth.d.ts` and set in `auth.ts` session callback
- `isPro()` takes `{ subscriptionStatus: string | null | undefined, dayPassExpiry: Date | null | undefined }` — matches both the DB User shape and the session callback cast
- `UpgradeWall` takes `{ feature: string }` — used as `<UpgradeWall feature="Compare" />` and `<UpgradeWall feature="History" />`
- `/api/checkout` accepts `{ plan: 'pro' | 'day' }` — matches all callers in `UpgradeWall` and `PricingPage`
