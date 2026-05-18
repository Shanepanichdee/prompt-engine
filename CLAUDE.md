# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

Rule-based prompt engineering system — assembles structured prompts from user inputs using 14 prompt engineering frameworks. No AI in the engine itself. Three delivery targets from one monorepo: npm library, Next.js web UI, CLI tool.

## Monorepo Structure

```
prompt-engine/
├── apps/
│   └── web/               # Next.js App Router — two-panel prompt builder UI
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

`PromptResult` always contains all three output forms:
- `prompt` — assembled string ready to paste into any AI
- `sections` — labelled parts `{ label: string; text: string }[]`
- `fields`, `framework`, `locale`, `tokenEstimate`, `warnings` — metadata

## Multilingual

Connector words (Role:, Task:, Format:, etc.) are translated per locale. Each locale file lives in `packages/core/src/locales/<code>.ts` and exports a `LocaleStrings` object with `connectors`, `respondIn`, and `langLabel`.

**Supported:** `en` · `th` · `zh` · `ja` · `ko` · `es` · `fr` · `de` · `pt` · `ar`

Adding a language = one new locale file + register in `locales/index.ts`. No framework files change.

## Adding a New Framework

Create `packages/core/src/frameworks/<id>.ts`, export a `Framework` constant, register it in `packages/core/src/index.ts`. Use `t.connectors.*` for all connector words — never hardcode English strings.

```ts
export const MY_FRAMEWORK: Framework = {
  id: "my-framework",
  name: "My Framework",
  description: "One sentence description shown in UI and CLI.",
  fields: [
    { key: "role", label: "Role", description: "...", required: true, placeholder: "e.g. senior engineer" },
    { key: "task", label: "Task", description: "...", required: true, placeholder: "e.g. review this code" },
  ],
  assemble(inputs, t) {
    return [
      { label: "Role", text: `${t.connectors.role} ${inputs.role}.` },
      { label: "Task", text: `${t.connectors.task} ${inputs.task}` },
    ]
  },
}
```

The web UI form and CLI prompts are auto-generated from `fields` — no UI code needed.

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

- No backend — engine runs entirely client-side
- Two-panel: left = framework picker + auto-generated fields form, right = output
- Dev Mode toggle (top-right): reveals sections list + full JSON view of `PromptResult`
- State is local `useState` — no persistence, no auth

## CLI

```bash
npx prompt-engine               # interactive: select language → framework → fill fields → print
npx prompt-engine --lang th     # skip language selection, use Thai
npx prompt-engine --json        # print full PromptResult JSON instead of plain prompt
```

## Design Spec

Full design: `docs/superpowers/specs/2026-05-17-prompt-engine-design.md`
