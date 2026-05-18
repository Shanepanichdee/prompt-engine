# @prompt-engine/core

Rule-based prompt assembly library.

## Install

```bash
pnpm add @prompt-engine/core
```

## Usage

```ts
import { build, frameworks } from '@prompt-engine/core';

const rtf = frameworks.find((f) => f.id === 'rtf')!;
const result = build(
  rtf,
  {
    role: 'a product manager',
    context: 'for startup founders, around 6 bullets',
    target: 'outline MVP scope',
    format: 'bullet points',
  },
  'en'
);

console.log(result.prompt);
```

## Exports

- `build(...)`
- `frameworks` + individual frameworks
- `getLocale(...)`, `locales`
- `estimateTokens(...)`
- `validateInputs(...)`
