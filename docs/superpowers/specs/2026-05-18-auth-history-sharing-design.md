# Auth, History & Sharing — Design Spec

**Date:** 2026-05-18
**Status:** Approved

---

## Goal

Add user accounts (Google + GitHub OAuth), prompt history, and shareable prompt links to the prompt-engine web app. Transforms the tool from a stateless client-side utility into a public product where users can save, revisit, and share their built prompts.

## Architecture

All backend code lives inside `apps/web` — no new monorepo packages. The prompt engine core (`packages/core`) is unchanged and continues to run client-side.

**Stack additions:**
- **NextAuth v5 (Auth.js)** — OAuth session management, CSRF protection, secure HttpOnly cookies
- **Neon** — serverless Postgres, free tier, Vercel-native
- **Prisma** — ORM, migrations, type-safe queries

**New files in `apps/web`:**
```
prisma/schema.prisma
lib/auth.ts
lib/db.ts
lib/rate-limit.ts
middleware.ts
app/api/auth/[...nextauth]/route.ts
app/api/prompts/route.ts
app/api/prompts/[id]/route.ts
app/api/shared/[slug]/route.ts
app/history/page.tsx
app/p/[slug]/page.tsx
```

**Modified files in `apps/web`:**
```
app/page.tsx                     ← add Save button + sign-in state
components/OutputPanel.tsx       ← add Save button + share link display
components/TopBar.tsx            ← add sign-in/avatar to topbar (extract from page.tsx)
next.config.ts                   ← add security headers
package.json                     ← add next-auth, prisma, @prisma/client
```

---

## Database Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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

**Key decisions:**
- `inputs` stored as JSON — accommodates any framework's fields without schema migrations when new frameworks are added
- `slug` is 8-char hex (`crypto.randomBytes(4).toString('hex')`) — short, URL-safe, collision probability negligible at this scale
- `onDelete: Cascade` on all relations — deleting a user removes all their data (GDPR-compliant)
- OAuth only — no `VerificationToken` table, no email/password

---

## API Routes

### POST /api/prompts
Auth required. Saves a built prompt.

**Request body:**
```ts
{
  frameworkId: string   // must be in frameworks array from @prompt-engine/core
  locale: LocaleCode    // must be one of 10 valid locale codes
  inputs: Record<string, string>  // each value ≤ 2000 chars
  promptText: string    // ≤ 8000 chars
  title?: string        // ≤ 100 chars
}
```

**Response:** `{ id: string, slug: string }`

**Validation:**
- `frameworkId` in known frameworks list
- `locale` in `['en','th','zh','ja','ko','es','fr','de','pt','ar']`
- `promptText.length ≤ 8000`
- Each `inputs` value `.length ≤ 2000`
- `title?.length ≤ 100`

---

### GET /api/prompts
Auth required. Returns user's saved prompts, newest first, max 100.

**Response:** `{ prompts: SavedPrompt[] }`

---

### DELETE /api/prompts/:id
Auth required. Deletes one prompt.

**Authorization:** Verifies `prompt.userId === session.user.id` before deletion.

**Response:** `{ ok: true }`

---

### GET /api/shared/:slug
Public — no auth required.

**Response:**
```ts
{
  frameworkId: string
  locale: string
  inputs: Record<string, string>
  promptText: string
  title: string | null
  createdAt: string
}
```

Returns `404` if slug not found.

---

## New Pages

### /history (auth-gated)
Protected by `middleware.ts` — unauthenticated users redirected to sign-in.

Displays the user's saved prompts as a list:
- Framework badge, locale, title or first 60 chars of prompt text, relative date
- Copy share link icon button
- Delete button (calls DELETE /api/prompts/:id, removes from list optimistically)
- Empty state: "No saved prompts yet. Build one and hit Save."
- Max 100 prompts, newest first, no pagination in v1

### /p/:slug (public, server-rendered)
Server component — fetches prompt via Prisma directly (not via API route).

Displays:
- Prompt title (or first 60 chars as fallback) as `<h1>`
- Framework name + locale badge
- Full assembled prompt in a read-only `<textarea>`
- "Copy" button
- "Open in builder" button — navigates to `/` with `?framework=:id&locale=:code` query params; `page.tsx` reads these on mount and pre-selects the framework + locale

Page `<title>` and `og:title` = prompt title or first 60 chars (SEO/share preview).

Returns Next.js `notFound()` if slug doesn't exist.

---

## UI Changes to Existing Pages

### TopBar (extracted from page.tsx into `components/TopBar.tsx`)
- Add sign-in button (right side, alongside existing mode toggles) when no session
- Add user avatar + name + "History" link + "Sign out" when session active
- Uses NextAuth `useSession()` hook

### OutputPanel changes
- Add "Save" button next to "Copy" — only rendered when `session` exists and `result.prompt` is non-empty
- On save: POST to `/api/prompts`, show inline share URL `https://<domain>/p/:slug` with a copy icon
- Optional: small text input for title that appears after save

---

## Security

### 1. Authentication & CSRF
NextAuth v5 manages session tokens, CSRF tokens on all mutations, and `HttpOnly` secure cookies automatically via `lib/auth.ts` configuration.

### 2. Authorization
All authenticated API routes check `session.user.id === resource.userId` before any read/write/delete. Prisma queries always filter by `userId` — the client never controls ownership.

### 3. Input Validation
Applied in POST handler before any DB write:
- `frameworkId` must be in the `frameworks` array from `@prompt-engine/core`
- `locale` must be a valid `LocaleCode`
- `promptText.length ≤ 8000`
- Each `inputs[key].length ≤ 2000`
- `title.length ≤ 100` if provided

Returns `400` with a message on validation failure.

### 4. Rate Limiting
Implemented in `middleware.ts` using a sliding window `Map<string, number[]>` (keyed by userId or IP):
- Authenticated mutations: 20 requests/minute
- Public shared reads: 60 requests/minute
- Returns `429 Too Many Requests` on breach
- Upgrade path: swap `Map` for Upstash Redis for multi-instance production scale

### 5. HTTP Security Headers
Added in `next.config.ts`:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 6. Environment Secrets
Never committed. Required in `.env.local` and Vercel environment variables:
```
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
DATABASE_URL=           # Neon pooled connection string
DATABASE_URL_UNPOOLED=  # Neon direct connection (migrations only)
```

---

## Out of Scope (v1)

- Email/password auth
- Prompt collections or folders
- Starring / favoriting prompts
- Public user profile pages
- Search or filter in history
- Prompt versioning
- Social features (likes, clones)
- Admin moderation tools
