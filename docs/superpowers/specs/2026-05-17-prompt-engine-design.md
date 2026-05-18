# Prompt Engine — Design Spec

**Date:** 2026-05-17  
**Status:** Approved

## Overview

Rule-based prompt engineering system that assembles high-quality prompts from structured inputs using well-known prompt engineering frameworks — no AI required. Delivered as three artifacts from a single monorepo: a publishable TypeScript library, a Next.js web UI, and a CLI tool.

---

## Goals

- Generate prompts using rule-based templates, not AI
- Support 14 prompt engineering frameworks out of the box
- Generate prompts in 10 languages — connector words translate + language instruction appended
- Expose all three output forms: plain string, labelled sections, full metadata object
- Serve both non-technical users (guided form) and developers (raw JSON, sections view)
- Core engine is framework-agnostic — adding a new framework means adding one config file

---

## Monorepo Structure

```
prompt-engine/
├── apps/
│   └── web/                  # Next.js App Router — web UI
│       ├── app/
│       │   └── page.tsx      # two-panel prompt builder
│       └── components/
│           ├── FrameworkPicker.tsx
│           ├── FieldsForm.tsx
│           └── OutputPanel.tsx
├── packages/
│   ├── core/                 # pure TS library (npm-publishable)
│   │   └── src/
│   │       ├── types.ts      # Framework, Field, PromptResult
│   │       ├── engine.ts     # build() pure function
│   │       ├── validate.ts   # required field checks + warnings
│   │       ├── tokens.ts     # token estimator (chars / 4)
│   │       ├── frameworks/   # one file per framework
│   │       │   ├── crispe.ts
│   │       │   ├── costar.ts
│   │       │   ├── risen.ts
│   │       │   ├── rtf.ts
│   │       │   ├── cot.ts
│   │       │   ├── fewshot.ts
│   │       │   ├── ape.ts
│   │       │   ├── react.ts
│   │       │   ├── broke.ts
│   │       │   ├── rodes.ts
│   │       │   ├── trace.ts
│   │       │   ├── care.ts
│   │       │   ├── structured-output.ts
│   │       │   └── auto-cot.ts
│   │       ├── locales/      # connector translations per language
│   │       │   ├── index.ts  # getLocale(code) → LocaleStrings
│   │       │   ├── en.ts
│   │       │   ├── th.ts
│   │       │   ├── zh.ts
│   │       │   ├── ja.ts
│   │       │   ├── ko.ts
│   │       │   ├── es.ts
│   │       │   ├── fr.ts
│   │       │   ├── de.ts
│   │       │   ├── pt.ts
│   │       │   └── ar.ts
│   │       └── index.ts      # public exports
│   └── cli/                  # Node.js CLI (npx prompt-engine)
│       └── src/
│           └── index.ts      # interactive prompts via @clack/prompts
├── package.json              # Turborepo root
└── turbo.json
```

---

## Core Types

```ts
// 10 supported languages
type LocaleCode = 'en' | 'th' | 'zh' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'pt' | 'ar'

// Connector words each framework uses, translated per locale
interface LocaleStrings {
  connectors: Record<string, string>  // e.g. { role: 'คุณคือ', task: 'งาน:', format: 'รูปแบบ:' }
  respondIn: string                   // e.g. 'กรุณาตอบเป็นภาษาไทย'
  langLabel: string                   // e.g. 'ภาษาไทย' — shown in UI selector
}

interface Framework {
  id: string
  name: string
  description: string
  fields: Field[]
  // Receives translated connectors — returns labelled sections
  assemble: (inputs: Record<string, string>, t: LocaleStrings) => { label: string; text: string }[]
}

interface Field {
  key: string
  label: string
  description: string
  required: boolean
  placeholder?: string
}

interface PromptResult {
  prompt: string                              // assembled prompt string
  sections: { label: string; text: string }[] // labelled parts of the prompt
  framework: string                           // framework id used
  locale: LocaleCode                          // language used
  fields: Record<string, string>              // inputs that were provided
  tokenEstimate: number                       // rough count (chars / 4)
  warnings: string[]                          // missing optional fields, etc.
}
```

---

## Core Engine

`packages/core/src/engine.ts` exports a single pure function:

```ts
function build(
  framework: Framework,
  inputs: Record<string, string>,
  locale: LocaleCode = 'en'
): PromptResult
```

Steps:
1. Validate required fields — collect missing ones into `warnings`
2. Load `LocaleStrings` via `getLocale(locale)` from `locales/index.ts`
3. Call `framework.assemble(inputs, t)` → `sections: { label, text }[]`
4. Join sections into `prompt` string (framework controls separator and ordering)
5. Append `t.respondIn` as final section if locale is not `'en'`
6. Estimate token count: `Math.ceil(prompt.length / 4)`
7. Return `PromptResult` (includes `locale` field)

No side effects. No I/O. Fully synchronous.

### Locale file shape

```ts
// packages/core/src/locales/th.ts
export const th: LocaleStrings = {
  connectors: {
    role:        'คุณคือ',
    task:        'งาน:',
    format:      'รูปแบบ:',
    context:     'บริบท:',
    objective:   'เป้าหมาย:',
    style:       'รูปแบบการเขียน:',
    tone:        'น้ำเสียง:',
    audience:    'กลุ่มเป้าหมาย:',
    instructions:'คำสั่ง:',
    steps:       'ขั้นตอน:',
    endGoal:     'เป้าหมายสุดท้าย:',
    narrowing:   'ข้อจำกัด:',
    action:      'การกระทำ:',
    purpose:     'วัตถุประสงค์:',
    expectation: 'ความคาดหวัง:',
    background:  'ภูมิหลัง:',
    // ...all connector keys
  },
  respondIn: 'กรุณาตอบเป็นภาษาไทย',
  langLabel:  'ภาษาไทย',
}
```

Framework files use `t.connectors.role`, `t.connectors.task`, etc. — never hardcoded English strings.

---

## Frameworks

Each framework lives in `packages/core/src/frameworks/<id>.ts` and exports a `Framework` constant.

| ID | Name | Fields |
|----|------|--------|
| `crispe` | CRISPE | Capacity, Role, Insight, Statement, Personality, Experiment |
| `costar` | CO-STAR | Context, Objective, Style, Tone, Audience, Response |
| `risen` | RISEN | Role, Instructions, Steps, End Goal, Narrowing |
| `rtf` | RTF | Role, Task, Format |
| `cot` | Chain of Thought | Task, Reasoning Style, Output Format |
| `fewshot` | Few-Shot | Task, Examples (repeatable), Output Format |
| `ape` | APE | Action, Purpose, Expectation |
| `react` | ReAct | Task, Reasoning Steps, Action Format, Observation Format |
| `broke` | BROKE | Background, Role, Objectives, Key Results, Evolve |
| `rodes` | RODES | Role, Objective, Details, Examples, Sense Check |
| `trace` | TRACE | Task, Role, Audience, Create, Expectation |
| `care` | CARE | Context, Action, Result, Example |
| `structured-output` | Structured Output | Task, Output Format, Schema, Constraints |
| `auto-cot` | Auto-CoT | Task, Number of Sub-questions, Final Answer Format |

All frameworks exported from `packages/core/src/index.ts` as `frameworks` array and individually by name.

---

## Multilingual Support

**Strategy:** Approach C — framework connector words translate into the target language AND a `respondIn` instruction is appended at the end. User-provided field values are passed through as-is.

**Supported languages (v1):**

| Code | Language | Native name | `respondIn` |
|------|----------|-------------|-------------|
| `en` | English | English | *(none appended)* |
| `th` | Thai | ภาษาไทย | กรุณาตอบเป็นภาษาไทย |
| `zh` | Chinese | 中文 | 请用中文回答 |
| `ja` | Japanese | 日本語 | 日本語で回答してください |
| `ko` | Korean | 한국어 | 한국어로 답변해 주세요 |
| `es` | Spanish | Español | Por favor responde en español |
| `fr` | French | Français | Veuillez répondre en français |
| `de` | German | Deutsch | Bitte auf Deutsch antworten |
| `pt` | Portuguese | Português | Por favor responda em português |
| `ar` | Arabic | العربية | يرجى الرد باللغة العربية |

**Adding a new language:** Add one file to `packages/core/src/locales/`, register it in `locales/index.ts`. No framework files change.

---

## Web UI

**Stack:** Next.js App Router, TypeScript, Tailwind CSS  
**Route:** `/` — single-page builder, no backend needed (engine runs client-side)

**Layout:** Two-panel

- **Left — Builder**
  - Language selector (dropdown, 10 languages with native names, e.g. "ภาษาไทย", "日本語")
  - Framework grid (shows name + description)
  - Auto-generated field inputs from `framework.fields`
  - Required fields marked with `*`
  - Each field shows its `placeholder` and `description` as hint text

- **Right — Output**
  - Assembled prompt in a read-only textarea (rendered in selected language)
  - Copy to clipboard button
  - Footer: token estimate · framework name · language · `n/m fields filled`
  - **Dev Mode toggle** (top-right):
    - Sections list with `[Label]` prefixes
    - Expandable JSON view of full `PromptResult` (includes `locale` field)

State is local (React `useState`). No persistence, no auth, no backend.

---

## CLI

**Entry:** `npx prompt-engine`
**Runtime:** Node.js, `@clack/prompts` for interactive UI

Flow:
1. Select language (default: `en`)
2. Select framework (list with name + description)
3. For each field: prompt input (required fields re-prompt if empty)
4. Call `build(framework, inputs, locale)`
5. Print assembled prompt to stdout
6. Optionally print full JSON with `--json` flag

Language flag: `npx prompt-engine --lang th` skips the language selection step.

---

## Data Flow

```
User input (framework + field values + locale)
  → build(framework, inputs, locale)  [packages/core]
  → validate inputs → collect warnings
  → getLocale(locale) → LocaleStrings [locales/index.ts]
  → framework.assemble(inputs, t)     [framework file]
  → join sections into prompt string
  → append t.respondIn if locale ≠ 'en'
  → estimate tokens
  → PromptResult { ...result, locale }
  → Web UI / CLI / library consumer
```

---

## Testing

- `packages/core`: unit tests for `build()` — one test per framework covering required fields, missing optional fields, and warning generation
- `packages/core`: locale tests — verify each of the 10 locale files exports all required connector keys; verify `respondIn` appended when locale ≠ `'en'`
- `packages/cli`: integration test for each framework end-to-end (English + Thai)
- `apps/web`: no tests in v1; rely on TypeScript and manual testing

---

## Out of Scope (v1)

- Prompt saving / history
- User accounts / auth
- Framework chaining / composition
- Third-party framework plugins
- AI-assisted field suggestions
