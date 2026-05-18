# Auth, History & Sharing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Google + GitHub OAuth, prompt history, and shareable prompt links to the Next.js web app.

**Architecture:** NextAuth v5 handles auth + sessions via Prisma adapter. Neon (Postgres) stores users and saved prompts. Five API routes expose save/list/delete/share operations. Three new pages (sign-in, history, shared viewer) and two component updates (TopBar, OutputPanel) complete the UI.

**Tech Stack:** next-auth@beta, @auth/prisma-adapter, prisma, @prisma/client, Neon Postgres, vitest (web utils)

**Prerequisites — do before running any task:**
1. Create a Neon project at neon.tech. Copy "Pooled connection" → `DATABASE_URL` and "Direct connection" → `DATABASE_URL_UNPOOLED`.
2. Create Google OAuth app at console.cloud.google.com. Redirect URI: `http://localhost:3000/api/auth/callback/google`.
3. Create GitHub OAuth app at github.com/settings/developers. Callback: `http://localhost:3000/api/auth/callback/github`.
4. Create `apps/web/.env.local`:
```
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
DATABASE_URL=...
DATABASE_URL_UNPOOLED=...
```

---

## File Map

| File | Action |
|------|--------|
| `apps/web/package.json` | Add next-auth, prisma, @auth/prisma-adapter, vitest |
| `apps/web/tsconfig.json` | Add baseUrl + @/* path alias |
| `apps/web/prisma/schema.prisma` | Create — full DB schema |
| `apps/web/lib/db.ts` | Create — Prisma client singleton |
| `apps/web/lib/auth.ts` | Create — NextAuth config |
| `apps/web/types/next-auth.d.ts` | Create — session type augmentation |
| `apps/web/app/api/auth/[...nextauth]/route.ts` | Create — NextAuth handler |
| `apps/web/app/providers.tsx` | Create — SessionProvider wrapper |
| `apps/web/app/layout.tsx` | Modify — wrap with Providers |
| `apps/web/next.config.ts` | Modify — security headers |
| `apps/web/lib/rate-limit.ts` | Create — sliding window rate limiter |
| `apps/web/lib/validate-prompt.ts` | Create — input validation |
| `apps/web/test/rate-limit.test.ts` | Create — rate limiter tests |
| `apps/web/test/validate-prompt.test.ts` | Create — validator tests |
| `apps/web/vitest.config.ts` | Create — vitest config |
| `apps/web/middleware.ts` | Create — auth route protection |
| `apps/web/app/api/prompts/route.ts` | Create — POST + GET |
| `apps/web/app/api/prompts/[id]/route.ts` | Create — DELETE |
| `apps/web/app/api/shared/[slug]/route.ts` | Create — public GET |
| `apps/web/components/TopBar.tsx` | Create — extracted + auth UI |
| `apps/web/components/OutputPanel.tsx` | Modify — Save button + share link |
| `apps/web/components/HistoryList.tsx` | Create — client history list |
| `apps/web/components/SharedPromptView.tsx` | Create — client shared viewer |
| `apps/web/app/history/page.tsx` | Create — server page |
| `apps/web/app/p/[slug]/page.tsx` | Create — server page |
| `apps/web/app/page.tsx` | Modify — use TopBar, add query param handling |
| `apps/web/app/globals.css` | Modify — auth + history + share styles |

---

### Task 1: Install dependencies + fix path alias

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/tsconfig.json`

- [ ] **Step 1: Install packages**

```bash
pnpm --filter web add next-auth@beta @auth/prisma-adapter @prisma/client
pnpm --filter web add -D prisma vitest
```

- [ ] **Step 2: Add test script to apps/web/package.json**

Replace the `"test"` line:
```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "15.1.2",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@prompt-engine/core": "workspace:*",
    "next-auth": "beta",
    "@auth/prisma-adapter": "latest",
    "@prisma/client": "latest"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "prisma": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 3: Add path alias to apps/web/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "incremental": true,
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "noEmit": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create vitest config**

Create `apps/web/vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 5: Verify install**

```bash
pnpm --filter web exec prisma --version
```

Expected: prints Prisma CLI version, no errors.

---

### Task 2: Prisma schema + DB client

**Files:**
- Create: `apps/web/prisma/schema.prisma`
- Create: `apps/web/lib/db.ts`

- [ ] **Step 1: Create prisma/schema.prisma**

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String        @id @default(cuid())
  name          String?
  email         String?       @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime      @default(now())
  accounts      Account[]
  sessions      Session[]
  savedPrompts  SavedPrompt[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model SavedPrompt {
  id          String   @id @default(cuid())
  slug        String   @unique
  userId      String
  frameworkId String
  locale      String
  inputs      Json
  promptText  String   @db.Text
  title       String?
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt(sort: Desc)])
}
```

- [ ] **Step 2: Run migration**

```bash
cd apps/web && pnpm exec prisma migrate dev --name init
```

Expected: `Your database is now in sync with your schema.` — creates tables in Neon.

- [ ] **Step 3: Generate Prisma client**

```bash
pnpm --filter web exec prisma generate
```

Expected: `Generated Prisma Client` — no errors.

- [ ] **Step 4: Create lib/db.ts**

Create `apps/web/lib/db.ts`:
```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/prisma apps/web/lib/db.ts apps/web/package.json apps/web/tsconfig.json apps/web/vitest.config.ts pnpm-lock.yaml
git commit -m "feat: add Prisma schema, DB client, and auth dependencies"
```

---

### Task 3: NextAuth configuration

**Files:**
- Create: `apps/web/lib/auth.ts`
- Create: `apps/web/types/next-auth.d.ts`
- Create: `apps/web/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create types/next-auth.d.ts**

```ts
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}
```

- [ ] **Step 2: Create lib/auth.ts**

```ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user
      if (nextUrl.pathname.startsWith('/history') && !isLoggedIn) {
        return false
      }
      return true
    },
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})
```

- [ ] **Step 3: Create app/api/auth/[...nextauth]/route.ts**

```ts
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

- [ ] **Step 4: Create app/providers.tsx**

```tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

- [ ] **Step 5: Update app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Prompt Engine',
  description: 'Build structured prompts with framework guidance, multilingual connectors, and copy-ready output.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Verify auth route works**

```bash
pnpm --filter web dev
```

Open `http://localhost:3000/api/auth/signin` — should show a sign-in page with GitHub and Google buttons. No crash = pass.

- [ ] **Step 7: Commit**

```bash
git add apps/web/lib/auth.ts apps/web/types apps/web/app/api/auth apps/web/app/providers.tsx apps/web/app/layout.tsx
git commit -m "feat: add NextAuth v5 with Google + GitHub OAuth"
```

---

### Task 4: Security headers

**Files:**
- Modify: `apps/web/next.config.ts`

- [ ] **Step 1: Add security headers**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

- [ ] **Step 2: Verify headers**

```bash
curl -I http://localhost:3000 | grep -E "x-frame|x-content|referrer|csp"
```

Expected: all four headers present.

- [ ] **Step 3: Commit**

```bash
git add apps/web/next.config.ts
git commit -m "feat: add HTTP security headers"
```

---

### Task 5: Rate limiter + input validator with tests

**Files:**
- Create: `apps/web/lib/rate-limit.ts`
- Create: `apps/web/lib/validate-prompt.ts`
- Create: `apps/web/test/rate-limit.test.ts`
- Create: `apps/web/test/validate-prompt.test.ts`

- [ ] **Step 1: Write failing rate-limit tests**

Create `apps/web/test/rate-limit.test.ts`:
```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkRateLimit, _resetForTesting } from '../lib/rate-limit'

describe('checkRateLimit()', () => {
  beforeEach(() => _resetForTesting())

  it('allows requests under the limit', () => {
    expect(checkRateLimit('key-a', 3, 60_000)).toBe(true)
    expect(checkRateLimit('key-a', 3, 60_000)).toBe(true)
    expect(checkRateLimit('key-a', 3, 60_000)).toBe(true)
  })

  it('blocks when limit is exceeded', () => {
    checkRateLimit('key-b', 2, 60_000)
    checkRateLimit('key-b', 2, 60_000)
    expect(checkRateLimit('key-b', 2, 60_000)).toBe(false)
  })

  it('allows again after window expires', () => {
    vi.useFakeTimers()
    checkRateLimit('key-c', 1, 1_000)
    expect(checkRateLimit('key-c', 1, 1_000)).toBe(false)
    vi.advanceTimersByTime(1_001)
    expect(checkRateLimit('key-c', 1, 1_000)).toBe(true)
    vi.useRealTimers()
  })

  it('tracks different keys independently', () => {
    checkRateLimit('key-d', 1, 60_000)
    expect(checkRateLimit('key-d', 1, 60_000)).toBe(false)
    expect(checkRateLimit('key-e', 1, 60_000)).toBe(true)
  })
})
```

- [ ] **Step 2: Write failing validate-prompt tests**

Create `apps/web/test/validate-prompt.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { validateSavePromptBody } from '../lib/validate-prompt'

const valid = {
  frameworkId: 'rtf',
  locale: 'en',
  inputs: { role: 'teacher', task: 'explain AI', format: 'bullets' },
  promptText: 'You are a teacher.',
}

describe('validateSavePromptBody()', () => {
  it('accepts a valid body', () => {
    expect(validateSavePromptBody(valid)).toEqual({ ok: true })
  })

  it('rejects null / non-object', () => {
    expect(validateSavePromptBody(null)).toMatchObject({ ok: false })
    expect(validateSavePromptBody('string')).toMatchObject({ ok: false })
  })

  it('rejects unknown frameworkId', () => {
    expect(validateSavePromptBody({ ...valid, frameworkId: 'fake' })).toMatchObject({ ok: false })
  })

  it('rejects invalid locale', () => {
    expect(validateSavePromptBody({ ...valid, locale: 'xx' })).toMatchObject({ ok: false })
  })

  it('rejects empty promptText', () => {
    expect(validateSavePromptBody({ ...valid, promptText: '' })).toMatchObject({ ok: false })
  })

  it('rejects promptText over 8000 chars', () => {
    expect(validateSavePromptBody({ ...valid, promptText: 'x'.repeat(8001) })).toMatchObject({ ok: false })
  })

  it('rejects input value over 2000 chars', () => {
    expect(validateSavePromptBody({ ...valid, inputs: { role: 'x'.repeat(2001) } })).toMatchObject({ ok: false })
  })

  it('rejects title over 100 chars', () => {
    expect(validateSavePromptBody({ ...valid, title: 'x'.repeat(101) })).toMatchObject({ ok: false })
  })

  it('accepts optional title within limit', () => {
    expect(validateSavePromptBody({ ...valid, title: 'My prompt' })).toEqual({ ok: true })
  })
})
```

- [ ] **Step 3: Run tests — confirm they fail**

```bash
pnpm --filter web test
```

Expected: FAIL — modules not found.

- [ ] **Step 4: Create lib/rate-limit.ts**

```ts
const windows = new Map<string, number[]>()

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const prev = windows.get(key) ?? []
  const recent = prev.filter((t) => now - t < windowMs)
  if (recent.length >= limit) return false
  recent.push(now)
  windows.set(key, recent)
  return true
}

export function _resetForTesting(): void {
  windows.clear()
}
```

- [ ] **Step 5: Create lib/validate-prompt.ts**

```ts
import { frameworks } from '@prompt-engine/core'

const VALID_LOCALES = new Set(['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar'])
const VALID_FRAMEWORK_IDS = new Set(frameworks.map((f) => f.id))

export type ValidationResult = { ok: true } | { ok: false; error: string }

export function validateSavePromptBody(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Body must be an object' }
  }

  const b = body as Record<string, unknown>

  if (!VALID_FRAMEWORK_IDS.has(b['frameworkId'] as string)) {
    return { ok: false, error: 'Invalid frameworkId' }
  }

  if (!VALID_LOCALES.has(b['locale'] as string)) {
    return { ok: false, error: 'Invalid locale' }
  }

  if (
    typeof b['promptText'] !== 'string' ||
    b['promptText'].length === 0 ||
    b['promptText'].length > 8000
  ) {
    return { ok: false, error: 'promptText must be 1–8000 chars' }
  }

  if (!b['inputs'] || typeof b['inputs'] !== 'object' || Array.isArray(b['inputs'])) {
    return { ok: false, error: 'inputs must be an object' }
  }

  for (const val of Object.values(b['inputs'] as Record<string, unknown>)) {
    if (typeof val !== 'string' || val.length > 2000) {
      return { ok: false, error: 'Each input value must be ≤ 2000 chars' }
    }
  }

  if (b['title'] !== undefined) {
    if (typeof b['title'] !== 'string' || b['title'].length > 100) {
      return { ok: false, error: 'title must be a string ≤ 100 chars' }
    }
  }

  return { ok: true }
}
```

- [ ] **Step 6: Run tests — confirm they pass**

```bash
pnpm --filter web test
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add apps/web/lib/rate-limit.ts apps/web/lib/validate-prompt.ts apps/web/test apps/web/vitest.config.ts
git commit -m "feat: add rate limiter and input validator with tests"
```

---

### Task 6: Middleware

**Files:**
- Create: `apps/web/middleware.ts`

- [ ] **Step 1: Create middleware.ts**

```ts
export { auth as default } from '@/lib/auth'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
```

The `authorized` callback in `lib/auth.ts` (Task 3) handles the `/history` redirect — middleware just runs `auth` on every non-static route.

- [ ] **Step 2: Verify protection**

Start dev server. Visit `http://localhost:3000/history` while not signed in.

Expected: redirected to sign-in page.

- [ ] **Step 3: Commit**

```bash
git add apps/web/middleware.ts
git commit -m "feat: add auth middleware to protect /history"
```

---

### Task 7: API — POST + GET /api/prompts

**Files:**
- Create: `apps/web/app/api/prompts/route.ts`

- [ ] **Step 1: Create app/api/prompts/route.ts**

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

- [ ] **Step 2: Manual test — save a prompt**

Sign in at `http://localhost:3000/api/auth/signin`, then:
```bash
curl -X POST http://localhost:3000/api/prompts \
  -H "Content-Type: application/json" \
  -b "next-auth.session-token=<your-cookie>" \
  -d '{"frameworkId":"rtf","locale":"en","inputs":{"role":"teacher","task":"explain AI","format":"bullets"},"promptText":"You are a teacher."}'
```

Expected: `{"id":"...","slug":"abcd1234"}`

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/api/prompts/route.ts
git commit -m "feat: add POST + GET /api/prompts"
```

---

### Task 8: API — DELETE prompt + GET shared

**Files:**
- Create: `apps/web/app/api/prompts/[id]/route.ts`
- Create: `apps/web/app/api/shared/[slug]/route.ts`

- [ ] **Step 1: Create app/api/prompts/[id]/route.ts**

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const prompt = await db.savedPrompt.findUnique({ where: { id } })

  if (!prompt) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (prompt.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await db.savedPrompt.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Create app/api/shared/[slug]/route.ts**

```ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'

  if (!checkRateLimit(`shared:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { slug } = await params
  const prompt = await db.savedPrompt.findUnique({
    where: { slug },
    select: {
      frameworkId: true,
      locale: true,
      inputs: true,
      promptText: true,
      title: true,
      createdAt: true,
    },
  })

  if (!prompt) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(prompt)
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/api/prompts/[id] apps/web/app/api/shared
git commit -m "feat: add DELETE /api/prompts/[id] and GET /api/shared/[slug]"
```

---

### Task 9: TopBar component

**Files:**
- Create: `apps/web/components/TopBar.tsx`
- Modify: `apps/web/app/globals.css` (auth styles)
- Modify: `apps/web/app/page.tsx`

- [ ] **Step 1: Create components/TopBar.tsx**

```tsx
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

type Props = {
  darkMode: boolean
  compactMode: boolean
  devMode: boolean
  onDarkMode: (v: boolean) => void
  onCompactMode: (v: boolean) => void
  onDevMode: (v: boolean) => void
}

export function TopBar({
  darkMode,
  compactMode,
  devMode,
  onDarkMode,
  onCompactMode,
  onDevMode,
}: Props) {
  const { data: session } = useSession()

  return (
    <header className="topbar">
      <div>
        <div className="brand-row">
          <img src="/logo-original.png" alt="datashane.com logo" className="brand-logo" />
        </div>
        <p className="brand-undertext">datashane.com</p>
        <p className="kicker">Prompt Engineering Studio</p>
        <h1>Prompt Engine</h1>
        <p className="subtitle">
          Build structured prompts with framework guidance, multilingual connectors, and copy-ready output.
        </p>
        <p className="credit">
          Created by{' '}
          <a href="https://datashane.com" target="_blank" rel="noreferrer">
            datashane.com
          </a>
        </p>
      </div>
      <div className="mode-controls">
        <label className="dev-toggle">
          <input type="checkbox" checked={darkMode} onChange={(e) => onDarkMode(e.target.checked)} />
          Dark Mode
        </label>
        <label className="dev-toggle">
          <input type="checkbox" checked={compactMode} onChange={(e) => onCompactMode(e.target.checked)} />
          Compact Mode
        </label>
        <label className="dev-toggle">
          <input type="checkbox" checked={devMode} onChange={(e) => onDevMode(e.target.checked)} />
          Dev Mode
        </label>
        {session ? (
          <div className="auth-row">
            {session.user?.image && (
              <img src={session.user.image} alt={session.user.name ?? ''} className="avatar" />
            )}
            <Link href="/history" className="auth-link">
              History
            </Link>
            <button type="button" className="auth-btn" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        ) : (
          <button type="button" className="auth-btn" onClick={() => signIn()}>
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Add auth styles to globals.css**

Append to the end of `apps/web/app/globals.css`:
```css
/* ── Auth ── */
.auth-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
}

.auth-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--brand-2);
  text-decoration: none;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
}

.auth-link:hover {
  text-decoration: underline;
}

.auth-btn {
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border: 1px solid var(--brand);
  border-radius: 999px;
  background: var(--surface);
  color: var(--brand-2);
  cursor: pointer;
}

.auth-btn:hover {
  background: var(--brand-soft);
}

.page.dark .auth-btn,
.page.dark .auth-link {
  background: var(--surface);
  color: var(--brand-2);
  border-color: var(--border);
}
```

- [ ] **Step 3: Update app/page.tsx to use TopBar**

Replace the inline `<header className="topbar">...</header>` block and the three state variables for modes with the `TopBar` component. The full updated `page.tsx`:

```tsx
'use client'

import { useMemo, useState, useEffect } from 'react'
import { build, frameworks, getLocale, type LocaleCode } from '@prompt-engine/core'
import { FieldsForm } from '../components/FieldsForm'
import { FrameworkPicker } from '../components/FrameworkPicker'
import { OutputPanel } from '../components/OutputPanel'
import { TopBar } from '../components/TopBar'
import { FRAMEWORK_DETAILS } from '../components/frameworkDetails'

const LOCALES: LocaleCode[] = ['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar']

export default function Page() {
  const [locale, setLocale] = useState<LocaleCode>('en')
  const [frameworkId, setFrameworkId] = useState<string>(frameworks[0]?.id ?? 'rtf')
  const [values, setValues] = useState<Record<string, string>>({})
  const [devMode, setDevMode] = useState<boolean>(false)
  const [compactMode, setCompactMode] = useState<boolean>(false)
  const [darkMode, setDarkMode] = useState<boolean>(false)

  // Pre-select framework + locale from ?framework= and ?locale= query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fw = params.get('framework')
    const loc = params.get('locale')
    if (fw && frameworks.find((f) => f.id === fw)) setFrameworkId(fw)
    if (loc && (['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar'] as string[]).includes(loc)) {
      setLocale(loc as LocaleCode)
    }
  }, [])

  const selectedFramework = useMemo(
    () => frameworks.find((item) => item.id === frameworkId) ?? frameworks[0],
    [frameworkId]
  )

  const result = useMemo(() => {
    if (!selectedFramework) return null
    return build(selectedFramework, values, locale)
  }, [selectedFramework, values, locale])

  const filledCount = useMemo(() => {
    if (!selectedFramework) return 0
    return selectedFramework.fields.filter((field) => (values[field.key] ?? '').trim().length > 0).length
  }, [selectedFramework, values])

  const handleFrameworkSelect = (id: string) => {
    setFrameworkId(id)
    setValues({})
  }

  const handleFieldChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleUseSample = (id: string, sampleInputs: Record<string, string>) => {
    setFrameworkId(id)
    setValues(sampleInputs)
  }

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.prompt)
  }

  if (!selectedFramework || !result) {
    return <main className="page">No framework available.</main>
  }

  return (
    <main className={`page ${compactMode ? 'compact' : ''} ${darkMode ? 'dark' : ''}`}>
      <TopBar
        darkMode={darkMode}
        compactMode={compactMode}
        devMode={devMode}
        onDarkMode={setDarkMode}
        onCompactMode={setCompactMode}
        onDevMode={setDevMode}
      />

      <div className="layout">
        <section className="panel builder-panel">
          <h2>Builder</h2>

          <label className="select-label">
            Language
            <select
              className="language-select"
              value={locale}
              onChange={(event) => setLocale(event.target.value as LocaleCode)}
            >
              {LOCALES.map((code) => {
                const localeDef = getLocale(code)
                return (
                  <option key={code} value={code}>
                    {localeDef.langLabel} ({code})
                  </option>
                )
              })}
            </select>
          </label>

          <h3 className="section-title">Frameworks</h3>
          <FrameworkPicker
            frameworks={frameworks}
            selectedId={selectedFramework.id}
            details={FRAMEWORK_DETAILS}
            onSelect={handleFrameworkSelect}
            onUseSample={handleUseSample}
          />

          <h3 className="section-title">Inputs</h3>
          <FieldsForm fields={selectedFramework.fields} values={values} onChange={handleFieldChange} />
        </section>

        <OutputPanel
          result={result}
          frameworkName={selectedFramework.name}
          filledCount={filledCount}
          totalFields={selectedFramework.fields.length}
          devMode={devMode}
          onCopy={handleCopy}
        />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify in browser**

Open `http://localhost:3000`. Top-right should show "Sign in" button. After signing in: avatar, "History" link, "Sign out" button.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/TopBar.tsx apps/web/app/page.tsx apps/web/app/globals.css
git commit -m "feat: add TopBar with auth UI (sign in/out, history link)"
```

---

### Task 10: OutputPanel — Save button + share link

**Files:**
- Modify: `apps/web/components/OutputPanel.tsx`
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: Update OutputPanel.tsx**

```tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import type { PromptResult } from '@prompt-engine/core'

type Props = {
  result: PromptResult
  frameworkName: string
  filledCount: number
  totalFields: number
  devMode: boolean
  onCopy: () => void
}

export function OutputPanel({
  result,
  frameworkName,
  filledCount,
  totalFields,
  devMode,
  onCopy,
}: Props) {
  const { data: session } = useSession()
  const [shareSlug, setShareSlug] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setShareSlug(null)
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frameworkId: result.framework,
          locale: result.locale,
          inputs: result.fields,
          promptText: result.prompt,
        }),
      })
      if (res.ok) {
        const data = (await res.json()) as { slug: string }
        setShareSlug(data.slug)
      }
    } finally {
      setSaving(false)
    }
  }

  const shareUrl =
    shareSlug && typeof window !== 'undefined'
      ? `${window.location.origin}/p/${shareSlug}`
      : null

  return (
    <section className="panel output-panel">
      <div className="output-header-row">
        <h2>Output</h2>
        <div className="output-actions">
          <button type="button" className="copy-btn" onClick={onCopy}>
            Copy
          </button>
          {session && result.prompt.length > 0 && (
            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>
      </div>

      <textarea className="prompt-output" readOnly value={result.prompt} rows={16} />

      {shareUrl && (
        <div className="share-row">
          <span className="share-label">Saved:</span>
          <a href={shareUrl} className="share-link" target="_blank" rel="noreferrer">
            {shareUrl}
          </a>
          <button
            type="button"
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(shareUrl)}
          >
            Copy link
          </button>
        </div>
      )}

      <div className="output-footer">
        {result.tokenEstimate} tokens · {frameworkName} · {result.locale} · {filledCount}/
        {totalFields} fields filled
      </div>

      {devMode ? (
        <div className="dev-box">
          <h3>Sections</h3>
          <div className="sections-list">
            {result.sections.map((section) => (
              <div key={`${section.label}-${section.text}`} className="section-item">
                [{section.label}] {section.text}
              </div>
            ))}
          </div>
          <details>
            <summary>PromptResult JSON</summary>
            <pre className="json-view">{JSON.stringify(result, null, 2)}</pre>
          </details>
        </div>
      ) : null}
    </section>
  )
}
```

- [ ] **Step 2: Add Save + share styles to globals.css**

Append to `apps/web/app/globals.css`:
```css
/* ── Save + Share ── */
.output-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.save-btn {
  border: 1px solid var(--brand);
  color: var(--brand-2);
  background: var(--brand-soft);
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.share-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 12px;
  border: 1px solid var(--brand);
  border-radius: 10px;
  background: var(--brand-soft);
  flex-wrap: wrap;
}

.share-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-2);
}

.share-link {
  font-size: 12px;
  color: var(--brand-2);
  text-decoration: none;
  word-break: break-all;
  flex: 1;
}

.share-link:hover {
  text-decoration: underline;
}

.page.dark .save-btn,
.page.dark .share-row {
  border-color: var(--brand);
  background: var(--brand-soft);
}
```

- [ ] **Step 3: Verify in browser**

Sign in. Build a prompt. Output panel should show "Save" button. Click it — share URL appears. Click "Copy link" — URL in clipboard.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/OutputPanel.tsx apps/web/app/globals.css
git commit -m "feat: add Save button and share link to OutputPanel"
```

---

### Task 11: History page

**Files:**
- Create: `apps/web/components/HistoryList.tsx`
- Create: `apps/web/app/history/page.tsx`
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: Create components/HistoryList.tsx**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

type SavedPrompt = {
  id: string
  slug: string
  frameworkId: string
  locale: string
  title: string | null
  promptText: string
  createdAt: Date
}

export function HistoryList({ prompts: initial }: { prompts: SavedPrompt[] }) {
  const [prompts, setPrompts] = useState(initial)

  const handleDelete = async (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id))
    await fetch(`/api/prompts/${id}`, { method: 'DELETE' })
  }

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`)
  }

  if (prompts.length === 0) {
    return (
      <main className="page">
        <h1 className="history-heading">History</h1>
        <p className="muted-text">No saved prompts yet. Build one and hit Save.</p>
      </main>
    )
  }

  return (
    <main className="page">
      <h1 className="history-heading">History</h1>
      <div className="history-list">
        {prompts.map((p) => (
          <div key={p.id} className="history-item">
            <div className="history-meta">
              <span className="badge">{p.frameworkId}</span>
              <span className="badge">{p.locale}</span>
              <span className="history-date">
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="history-title">
              {p.title ?? p.promptText.slice(0, 60)}
              {!p.title && p.promptText.length > 60 ? '…' : ''}
            </p>
            <div className="history-actions">
              <Link href={`/p/${p.slug}`} className="auth-link">
                View
              </Link>
              <button
                type="button"
                className="history-btn"
                onClick={() => handleCopyLink(p.slug)}
              >
                Copy link
              </button>
              <button
                type="button"
                className="history-btn danger"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Create app/history/page.tsx**

```tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { HistoryList } from '@/components/HistoryList'

export default async function HistoryPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/api/auth/signin')

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

  return <HistoryList prompts={prompts} />
}
```

- [ ] **Step 3: Add history styles to globals.css**

Append to `apps/web/app/globals.css`:
```css
/* ── History ── */
.history-heading {
  font-size: 28px;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
}

.muted-text {
  color: var(--muted);
  font-size: 14px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 860px;
}

.history-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--brand-soft);
  color: var(--brand-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.history-date {
  font-size: 12px;
  color: var(--muted);
  margin-left: auto;
}

.history-title {
  font-size: 14px;
  margin: 0;
  color: var(--text);
  line-height: 1.4;
}

.history-actions {
  display: flex;
  gap: 8px;
}

.history-btn {
  font-size: 12px;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
  cursor: pointer;
  color: var(--text);
}

.history-btn.danger {
  border-color: var(--danger);
  color: var(--danger);
}

.history-btn.danger:hover {
  background: #fff0ee;
}

.page.dark .history-item {
  background: var(--surface);
  border-color: var(--border);
}

.page.dark .history-btn {
  background: var(--surface-2);
  color: var(--text);
  border-color: var(--border);
}
```

- [ ] **Step 4: Verify in browser**

Sign in. Save two prompts. Visit `http://localhost:3000/history`. Both prompts appear. Click Delete on one — it disappears. Click "Copy link" — URL in clipboard.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/HistoryList.tsx apps/web/app/history apps/web/app/globals.css
git commit -m "feat: add history page with list, delete, and copy link"
```

---

### Task 12: Shared prompt viewer page

**Files:**
- Create: `apps/web/components/SharedPromptView.tsx`
- Create: `apps/web/app/p/[slug]/page.tsx`
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: Create components/SharedPromptView.tsx**

```tsx
'use client'

type SharedPrompt = {
  frameworkId: string
  locale: string
  promptText: string
  title: string | null
  createdAt: Date
}

export function SharedPromptView({ prompt }: { prompt: SharedPrompt }) {
  const displayTitle = prompt.title ?? prompt.promptText.slice(0, 60)

  return (
    <main className="page">
      <div className="shared-header">
        <h1 className="shared-title">{displayTitle}</h1>
        <div className="shared-meta">
          <span className="badge">{prompt.frameworkId}</span>
          <span className="badge">{prompt.locale}</span>
          <span className="shared-date">
            {new Date(prompt.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <textarea
        className="prompt-output shared-output"
        readOnly
        value={prompt.promptText}
        rows={16}
      />

      <div className="shared-actions">
        <button
          type="button"
          className="copy-btn"
          onClick={() => navigator.clipboard.writeText(prompt.promptText)}
        >
          Copy prompt
        </button>
        <button
          type="button"
          className="auth-btn"
          onClick={() => {
            window.location.href = `/?framework=${prompt.frameworkId}&locale=${prompt.locale}`
          }}
        >
          Open in builder
        </button>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Create app/p/[slug]/page.tsx**

```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { SharedPromptView } from '@/components/SharedPromptView'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prompt = await db.savedPrompt.findUnique({
    where: { slug },
    select: { title: true, promptText: true },
  })
  if (!prompt) return { title: 'Prompt not found' }
  const title = prompt.title ?? prompt.promptText.slice(0, 60)
  return {
    title: `${title} — Prompt Engine`,
    description: prompt.promptText.slice(0, 160),
  }
}

export default async function SharedPromptPage({ params }: Props) {
  const { slug } = await params
  const prompt = await db.savedPrompt.findUnique({
    where: { slug },
    select: {
      frameworkId: true,
      locale: true,
      promptText: true,
      title: true,
      createdAt: true,
    },
  })

  if (!prompt) notFound()

  return <SharedPromptView prompt={prompt} />
}
```

- [ ] **Step 3: Add shared page styles to globals.css**

Append to `apps/web/app/globals.css`:
```css
/* ── Shared prompt page ── */
.shared-header {
  margin-bottom: 16px;
}

.shared-title {
  font-size: 26px;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}

.shared-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.shared-date {
  font-size: 12px;
  color: var(--muted);
}

.shared-output {
  min-height: 320px;
  margin-bottom: 14px;
}

.shared-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
```

- [ ] **Step 4: Verify in browser**

Save a prompt. Click the share link in the OutputPanel. New tab opens at `/p/<slug>`. Shows the prompt text, framework badge, locale badge. "Copy prompt" copies the text. "Open in builder" redirects to `/?framework=rtf&locale=en`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/SharedPromptView.tsx apps/web/app/p apps/web/app/globals.css
git commit -m "feat: add public shared prompt viewer at /p/[slug]"
```

---

### Task 13: Final verification + push

- [ ] **Step 1: Run all tests**

```bash
pnpm test
```

Expected: core package 34 tests pass, web package utility tests pass.

- [ ] **Step 2: Type-check everything**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 3: Full end-to-end smoke test**

1. `http://localhost:3000` — builder loads, "Sign in" visible
2. Sign in with GitHub or Google — avatar + History link appear
3. Select RTF framework, fill Role + Task + Format fields
4. Click "Save" — share URL appears below output
5. Click the share URL — opens `/p/<slug>` with correct prompt
6. Click "Open in builder" — back to `/` with RTF pre-selected
7. Visit `/history` — saved prompt in list
8. Click Delete — prompt removed from list
9. Visit `/history` while signed out — redirected to sign-in

- [ ] **Step 4: Push to GitHub**

```bash
git push origin master
```

---

## Self-Review

### Spec coverage
- Google + GitHub OAuth ✓ (Task 3)
- Session protection on /history ✓ (Task 6)
- POST /api/prompts with validation ✓ (Task 7)
- GET /api/prompts (user history) ✓ (Task 7)
- DELETE /api/prompts/:id with ownership check ✓ (Task 8)
- GET /api/shared/:slug (public) ✓ (Task 8)
- Rate limiting (20 req/min auth, 60 req/min public) ✓ (Task 5 + 7 + 8)
- HTTP security headers ✓ (Task 4)
- Input validation ✓ (Task 5)
- TopBar with auth UI ✓ (Task 9)
- OutputPanel Save button + share link ✓ (Task 10)
- /history page ✓ (Task 11)
- /p/[slug] page ✓ (Task 12)
- query param preselect on builder ✓ (Task 9)
- onDelete: Cascade (GDPR) ✓ (Task 2)

### Placeholder scan
None.

### Type consistency
- `session.user.id` available via type augmentation in Task 3, used in Tasks 7 + 8 + 11 ✓
- `SavedPrompt` select shape in Task 11 server page matches `HistoryList` prop type ✓
- `params: Promise<{ slug: string }>` used consistently in Tasks 8 + 12 ✓
