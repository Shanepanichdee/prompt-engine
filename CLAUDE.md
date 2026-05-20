# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Superpowers Skills — Always Apply

These skills MUST be invoked automatically without the user asking:

| Situation | Skill |
|-----------|-------|
| Any bug, unexpected behavior, test failure, build error | `superpowers:systematic-debugging` |
| Adding new features or non-trivial changes | `superpowers:verification-before-completion` |
| Writing any new tests | `superpowers:test-driven-development` |
| Planning a multi-step implementation | `superpowers:writing-plans` |
| Finishing a feature branch before push | `superpowers:finishing-a-development-branch` |

**Never skip these.** Even if the task looks simple — invoke the skill first.

## What This Project Is

Rule-based prompt engineering system — assembles structured prompts from user inputs using 14 prompt engineering frameworks. No AI in the engine itself. Three delivery targets from one monorepo: npm library, Next.js web UI, CLI tool.

## Monorepo Structure

```
prompt-engine/
├── apps/
│   └── web/               # Next.js 15 App Router — two-panel prompt builder UI
│       ├── app/           # Routes, API handlers, layouts
│       ├── components/    # React components
│       ├── lib/           # auth.ts, auth.config.ts, db.ts, rate-limit.ts, validate-prompt.ts
│       ├── prisma/        # schema.prisma
│       └── middleware.ts  # Cookie-based route protection (NOT NextAuth middleware)
├── packages/
│   ├── core/              # Pure TS library — zero deps, npm-publishable
│   │   └── src/
│   │       ├── engine.ts       # build() — the only entry point that matters
│   │       ├── types.ts        # Framework, Field, PromptResult interfaces
│   │       ├── validate.ts     # required field checks → warnings[]
│   │       ├── tokens.ts       # token estimator (chars / 4)
│   │       ├── frameworks/     # one file per framework, all same shape
│   │       ├── locales/        # connector translations — en/th/zh/ja/ko/es/fr/de/pt/ar
│   │       └── index.ts        # public exports
│   └── cli/               # Node.js CLI — thin wrapper over core
├── turbo.json
└── package.json           # Turborepo root
```

## Commands

```bash
# Install all dependencies
pnpm install

# Dev (all packages + web UI)
pnpm dev

# Build everything
pnpm build

# Run all tests
pnpm test

# Test core package only
pnpm --filter @prompt-engine/core test

# Run a single test file
pnpm --filter @prompt-engine/core test -- src/frameworks/crispe.test.ts

# Lint
pnpm lint

# Type check
pnpm typecheck
```

## Core Architecture

The engine is a single pure function:

```ts
build(framework: Framework, inputs: Record<string, string>, locale: LocaleCode = 'en'): PromptResult
```

Flow: validate inputs → `getLocale(locale)` → `framework.assemble(inputs, t)` → join sections → append `t.respondIn` (if not `en`) → estimate tokens → return `PromptResult`.

`PromptResult` always contains:
- `prompt` — assembled string ready to paste into any AI
- `sections` — labelled parts `{ label: string; text: string }[]`
- `fields`, `framework`, `locale`, `tokenEstimate`, `warnings` — metadata

## Auth Architecture (IMPORTANT)

NextAuth v5 (beta.31) with **split-config pattern** — required because PrismaAdapter is Node.js-only but middleware runs on Edge:

- `lib/auth.config.ts` — Edge-safe config: Google provider only, custom sign-in page, `authorized` callback
- `lib/auth.ts` — Server-only: spreads authConfig + adds Resend email provider + PrismaAdapter
- `middleware.ts` — Plain cookie check (`__Secure-authjs.session-token` / `authjs.session-token`). Does NOT use NextAuth middleware — that caused `JWTSessionError` corrupting sessions.

**Never use `export { auth as middleware } from '@/lib/auth'` pattern** — it tries to decode DB session UUIDs as JWTs and breaks sign-in.

## Database

- **Neon PostgreSQL** (serverless) via `@prisma/adapter-pg`
- Schema: `User`, `Account`, `Session`, `VerificationToken`, `SavedPrompt`
- `SavedPrompt` stores: `slug` (share URL), `frameworkId`, `locale`, `inputs` (JSON), `promptText`, `title`
- `postinstall` runs `prisma generate && prisma db push` — schema syncs automatically on Render deploy
- Never run `prisma migrate dev` in production — use `prisma db push` for schema changes

## Deployment

- **Platform:** Render (free tier → upgrade for no cold starts)
- **Live URL:** `https://prompts.data-shane.com`
- **Custom domain:** `prompts.data-shane.com` → CNAME to `prompt-engine-9hs5.onrender.com` via Cloudflare (DNS only, not proxied)
- **Required env vars on Render:** `AUTH_SECRET`, `AUTH_URL` (= `https://prompts.data-shane.com`), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`
- Auto-deploys on push to `main`

## Email (Magic Link)

- Provider: Resend (`resend` package)
- Sender domain: `data-shane.com` (verified in Resend)
- Default from: `Prompt Engine <noreply@data-shane.com>`
- Resend provider is in `lib/auth.ts` only (not auth.config.ts — must stay Node.js-only)

## Rate Limiting

`lib/rate-limit.ts` — in-memory `Map`, 20 saves/minute per user. **Known limitation:** resets on deploy, not shared across instances. Replace with Upstash Redis when scaling.

## Multilingual

10 locales: `en` · `th` · `zh` · `ja` · `ko` · `es` · `fr` · `de` · `pt` · `ar`

Adding a language = one new locale file in `packages/core/src/locales/<code>.ts` + register in `locales/index.ts`. No framework files change.

## Adding a New Framework

Create `packages/core/src/frameworks/<id>.ts`, export a `Framework` constant, register in `packages/core/src/index.ts`. Use `t.connectors.*` — never hardcode English strings.

```ts
export const MY_FRAMEWORK: Framework = {
  id: "my-framework",
  name: "My Framework",
  description: "One sentence description shown in UI and CLI.",
  fields: [
    { key: "role", label: "Role", description: "...", required: true, placeholder: "e.g. senior engineer" },
  ],
  assemble(inputs, t) {
    return [
      { label: "Role", text: `${t.connectors.role} ${inputs.role}.` },
    ]
  },
}
```

The web UI form and CLI are auto-generated from `fields` — no UI code needed.

## Supported Frameworks (14)

| ID | Name | Key concept |
|----|------|-------------|
| `crispe` | CRISPE | Capacity · Role · Insight · Statement · Personality · Experiment |
| `costar` | CO-STAR | Context · Objective · Style · Tone · Audience · Response |
| `risen` | RISEN | Role · Instructions · Steps · End Goal · Narrowing |
| `rtf` | RTF | Role · Task · Format |
| `cot` | Chain of Thought | Step-by-step reasoning scaffold |
| `fewshot` | Few-Shot | Example input/output pairs |
| `ape` | APE | Action · Purpose · Expectation |
| `react` | ReAct | Reasoning + Acting cycles (agentic) |
| `broke` | BROKE | Background · Role · Objectives · Key Results · Evolve |
| `rodes` | RODES | Role · Objective · Details · Examples · Sense Check |
| `trace` | TRACE | Task · Role · Audience · Create · Expectation |
| `care` | CARE | Context · Action · Result · Example |
| `structured-output` | Structured Output | Forces JSON/Markdown schema output |
| `auto-cot` | Auto-CoT | Self-generated sub-question reasoning chain |

## Web UI

- Two-panel: left = framework picker + auto-generated fields form, right = output
- Dev Mode toggle: reveals sections list + full JSON view of `PromptResult`
- Builder reads `?framework=`, `?locale=`, and individual field keys from URL on mount — used by "Load in Builder" from history and "Open in Builder" from shared prompts
- Save button sends `frameworkId`, `locale`, `inputs`, `promptText`, `title` to `POST /api/prompts`
- Title input appears in output panel when signed in and output exists
- Clear all button appears next to Inputs heading when any field has content

## API Routes

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/prompts` | Required | Save prompt → returns `{ id, slug }` |
| GET | `/api/prompts` | Required | List user's prompts (last 100) |
| DELETE | `/api/prompts/[id]` | Required | Delete a saved prompt |
| GET | `/api/shared/[slug]` | None | Fetch shared prompt by slug |

## Security Rules

- Never commit `.env`, `.env.local`, `.env*.local` — real credentials live there
- Never use `--no-verify` to skip git hooks
- Never use `auth as middleware` from NextAuth with DB sessions (JWTSessionError)
- Rate limit all authenticated write endpoints
- Validate all API inputs with `validateSavePromptBody` pattern

## Design Spec

Full design: `docs/superpowers/specs/2026-05-17-prompt-engine-design.md`
