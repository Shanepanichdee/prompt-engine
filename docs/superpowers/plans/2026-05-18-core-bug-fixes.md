# Core Bug Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 4 bugs in `@prompt-engine/core`: dead lead-sentence code, noisy optional-field warnings, inaccurate CJK/Thai/Arabic token estimates, and silent connector-key fallback.

**Architecture:** All changes are confined to `packages/core/src`. Tests live in `packages/core/test/engine.test.ts`. No web UI or CLI changes required — the public API shape does not change.

**Tech Stack:** TypeScript, Vitest (test runner), pnpm (workspace)

---

## File Map

| File | Action | Reason |
|------|--------|--------|
| `packages/core/src/engine.ts` | Modify | Delete 190 lines of unused `DEFAULT_LEADS` / `FRAMEWORK_SPECIFIC_LEADS` |
| `packages/core/src/validate.ts` | Modify | Remove warning branch for optional empty fields |
| `packages/core/src/tokens.ts` | Modify | Add CJK/Thai/Arabic-aware token estimation |
| `packages/core/src/frameworks/utils.ts` | Modify | Add `console.warn` when connector key is missing |
| `packages/core/test/engine.test.ts` | Modify | Update test name + add token tests |

---

### Task 1: Remove dead lead-sentence objects from engine.ts

**Files:**
- Modify: `packages/core/src/engine.ts:6-196`

The two objects `DEFAULT_LEADS` and `FRAMEWORK_SPECIFIC_LEADS` are defined but never referenced anywhere in `build()`. They are ~190 lines of dead code. Delete them.

- [ ] **Step 1: Verify the objects are unused**

```bash
grep -n "DEFAULT_LEADS\|FRAMEWORK_SPECIFIC_LEADS" packages/core/src/engine.ts
```

Expected: only the `const` declaration lines — no usage lines.

- [ ] **Step 2: Run existing tests to establish baseline**

```bash
pnpm --filter @prompt-engine/core test
```

Expected: all tests pass.

- [ ] **Step 3: Delete the dead objects**

Open `packages/core/src/engine.ts`. Delete lines 6–196 (the `DEFAULT_LEADS` const and the `FRAMEWORK_SPECIFIC_LEADS` const, including all their locale entries). The file should now start at the `export function build(` declaration.

After deletion the top of the file should look like:

```ts
import { getLocale } from './locales';
import { estimateTokens } from './tokens';
import type { Framework, LocaleCode, PromptResult, PromptSection } from './types';
import { validateInputs } from './validate';

export function build(
  framework: Framework,
  inputs: Record<string, string>,
  locale: LocaleCode = 'en'
): PromptResult {
```

- [ ] **Step 4: Run tests to verify nothing broke**

```bash
pnpm --filter @prompt-engine/core test
```

Expected: all tests pass.

- [ ] **Step 5: Type-check**

```bash
pnpm --filter @prompt-engine/core typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/engine.ts
git commit -m "chore: remove unused DEFAULT_LEADS and FRAMEWORK_SPECIFIC_LEADS dead code"
```

---

### Task 2: Stop warning on optional empty fields in validate.ts

**Files:**
- Modify: `packages/core/src/validate.ts`
- Modify: `packages/core/test/engine.test.ts`

`validateInputs` currently emits `"Optional field left empty: <label>"` for every optional field the user leaves blank. This is expected usage — optional means optional. Remove that branch.

- [ ] **Step 1: Write a failing test that asserts NO optional-field warning**

Add this test inside the `describe('build()', ...)` block in `packages/core/test/engine.test.ts`, after the existing warning test:

```ts
it('does NOT warn when optional fields are empty', () => {
  const framework = frameworks.find((f) => f.id === 'crispe');
  expect(framework).toBeTruthy();
  // crispe has optional fields: insight, personality, experiment
  const result = build(
    framework!,
    { capacity: 'senior engineer', role: 'reviewer', insight: '', statement: 'review this code', personality: '', experiment: '' },
    'en'
  );
  expect(result.warnings.every((w) => !w.includes('Optional field left empty'))).toBe(true);
});
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
pnpm --filter @prompt-engine/core test -- --reporter=verbose
```

Expected: `does NOT warn when optional fields are empty` FAILS — warnings contain optional-field entries.

- [ ] **Step 3: Fix validate.ts — remove the optional-field warning branch**

Replace the entire `validateInputs` function in `packages/core/src/validate.ts` with:

```ts
import type { Framework } from './types';

export const validateInputs = (
  framework: Framework,
  inputs: Record<string, string>
): { warnings: string[] } => {
  const warnings: string[] = [];

  for (const f of framework.fields) {
    const value = (inputs[f.key] ?? '').trim();
    if (f.required && value.length === 0) {
      warnings.push(`Missing required field: ${f.label}`);
    }
  }

  return { warnings };
};
```

- [ ] **Step 4: Update the test name in engine.test.ts**

The existing test at the bottom of the `build()` describe block is named `'generates warnings for missing required and optional fields'`. Rename it to `'generates warnings for missing required fields'` since optional fields no longer generate warnings:

```ts
it('generates warnings for missing required fields', () => {
  const framework = frameworks.find((f) => f.id === 'rtf');
  expect(framework).toBeTruthy();
  const result = build(framework!, { role: '', task: '', format: '' }, 'en');
  expect(result.warnings.some((w) => w.includes('Missing required field'))).toBe(true);
});
```

- [ ] **Step 5: Run all tests**

```bash
pnpm --filter @prompt-engine/core test
```

Expected: all tests pass including the new one.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/validate.ts packages/core/test/engine.test.ts
git commit -m "fix: remove noisy warnings for optional empty fields in validateInputs"
```

---

### Task 3: Fix token estimation for CJK, Thai, and Arabic

**Files:**
- Modify: `packages/core/src/tokens.ts`
- Modify: `packages/core/test/engine.test.ts`

The current estimator does `chars / 4` for everything. CJK ideographs, Thai script, and Arabic script each tokenize at roughly 1 token per character — 4× higher than Latin. Fix by inspecting each codepoint.

Unicode ranges used:
- CJK Unified Ideographs: `0x4E00–0x9FFF`
- CJK Extension A: `0x3400–0x4DBF`
- Hiragana: `0x3040–0x309F`
- Katakana: `0x30A0–0x30FF`
- Hangul Syllables: `0xAC00–0xD7AF`
- Thai: `0x0E00–0x0E7F`
- Arabic: `0x0600–0x06FF`

- [ ] **Step 1: Write failing tests for the token estimator**

Add a new `describe('estimateTokens()', ...)` block in `packages/core/test/engine.test.ts`:

```ts
import { estimateTokens } from '../src/tokens';

describe('estimateTokens()', () => {
  it('estimates Latin text at ~1 token per 4 chars', () => {
    // 'hello' = 5 chars → ceil(5/4) = 2
    expect(estimateTokens('hello')).toBe(2);
  });

  it('estimates CJK characters at 1 token each', () => {
    // 4 Chinese chars → 4 tokens (not ceil(4/4)=1)
    expect(estimateTokens('你好世界')).toBe(4);
  });

  it('estimates Thai characters at 1 token each', () => {
    // 4 Thai chars → 4 tokens
    expect(estimateTokens('สวัสดี').length === undefined).toBe(true); // guard
    const thai = 'สวัส'; // สวัส (4 Thai chars)
    expect(estimateTokens(thai)).toBe(4);
  });

  it('estimates Arabic characters at 1 token each', () => {
    // 4 Arabic chars → 4 tokens
    const arabic = 'مرحب'; // مرحب (4 Arabic chars)
    expect(estimateTokens(arabic)).toBe(4);
  });

  it('handles mixed text correctly', () => {
    // 'hi' (2 Latin) + '你好' (2 CJK) = ceil(2*0.25 + 2*1) = ceil(2.5) = 3
    expect(estimateTokens('hi你好')).toBe(3);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm --filter @prompt-engine/core test -- --reporter=verbose
```

Expected: the new `estimateTokens()` tests FAIL — CJK/Thai/Arabic return undercount.

- [ ] **Step 3: Rewrite tokens.ts with codepoint-aware estimation**

Replace the entire content of `packages/core/src/tokens.ts`:

```ts
function isSingleToken(codePoint: number): boolean {
  return (
    (codePoint >= 0x4e00 && codePoint <= 0x9fff) || // CJK Unified
    (codePoint >= 0x3400 && codePoint <= 0x4dbf) || // CJK Extension A
    (codePoint >= 0x3040 && codePoint <= 0x309f) || // Hiragana
    (codePoint >= 0x30a0 && codePoint <= 0x30ff) || // Katakana
    (codePoint >= 0xac00 && codePoint <= 0xd7af) || // Hangul
    (codePoint >= 0x0e00 && codePoint <= 0x0e7f) || // Thai
    (codePoint >= 0x0600 && codePoint <= 0x06ff)    // Arabic
  );
}

export function estimateTokens(text: string): number {
  let tokens = 0;
  for (const char of text) {
    const cp = char.codePointAt(0) ?? 0;
    tokens += isSingleToken(cp) ? 1 : 0.25;
  }
  return Math.ceil(tokens);
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm --filter @prompt-engine/core test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/tokens.ts packages/core/test/engine.test.ts
git commit -m "fix: improve token estimation for CJK, Thai, and Arabic scripts"
```

---

### Task 4: Warn on missing connector key in utils.ts

**Files:**
- Modify: `packages/core/src/frameworks/utils.ts`
- Modify: `packages/core/test/engine.test.ts`

When `t.connectors[connectorKey]` is `undefined`, `section()` silently falls back to `label`. The existing locale tests verify all keys are present, but if a new framework uses a typo'd key, the bug is invisible at runtime. Add a `console.warn` so developers catch it immediately.

- [ ] **Step 1: Write a test that spies on console.warn for a bad connector key**

Add inside the existing `describe('build()', ...)` block in `packages/core/test/engine.test.ts`:

```ts
it('warns to console when an unknown connector key is used in section()', () => {
  const { section } = await import('../src/frameworks/utils');
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const t = getLocale('en');
  section('MyLabel', 'nonExistentKey', 'some value', t);
  expect(warnSpy).toHaveBeenCalledWith(
    expect.stringContaining('nonExistentKey')
  );
  warnSpy.mockRestore();
});
```

Add `vi` to the imports at the top of the test file:

```ts
import { describe, expect, it, vi } from 'vitest';
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
pnpm --filter @prompt-engine/core test -- --reporter=verbose
```

Expected: the new spy test FAILS — no warn is currently emitted.

- [ ] **Step 3: Add console.warn to utils.ts section()**

Replace the `section` function in `packages/core/src/frameworks/utils.ts`:

```ts
import type { Field, LocaleStrings, PromptSection } from '../types';

export const section = (
  label: string,
  connectorKey: string,
  value: string,
  t: LocaleStrings
): PromptSection => {
  const connector = t.connectors[connectorKey];
  if (connector === undefined) {
    console.warn(
      `[prompt-engine] Unknown connector key "${connectorKey}" — falling back to label "${label}". Add it to locales/keys.ts and all locale files.`
    );
  }
  return {
    label,
    text: `${connector ?? label} ${value}`.trim(),
  };
};

export const compactSections = (sections: PromptSection[]): PromptSection[] =>
  sections.filter((s) => s.text.trim().length > 0);

export const field = (
  key: string,
  label: string,
  description: string,
  required: boolean,
  placeholder?: string
): Field => ({ key, label, description, required, placeholder });
```

- [ ] **Step 4: Run all tests**

```bash
pnpm --filter @prompt-engine/core test
```

Expected: all tests pass.

- [ ] **Step 5: Type-check and full build**

```bash
pnpm --filter @prompt-engine/core typecheck && pnpm --filter @prompt-engine/core build
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/frameworks/utils.ts packages/core/test/engine.test.ts
git commit -m "fix: warn on unknown connector key instead of silently falling back"
```

---

## Self-Review

### Spec coverage
- Dead code removed ✓
- Optional-field warning noise eliminated ✓  
- CJK/Thai/Arabic token fix ✓
- Connector key silent fallback surfaced ✓

### Placeholder scan
None found — every step has complete code.

### Type consistency
- `estimateTokens` signature unchanged: `(text: string) => number`
- `validateInputs` signature unchanged: `(framework, inputs) => { warnings }`
- `section` signature unchanged: `(label, connectorKey, value, t) => PromptSection`
- Public API in `packages/core/src/index.ts` untouched
