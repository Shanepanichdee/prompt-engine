# prompt-engine CLI

Interactive CLI for building prompts from frameworks.

## Run

```bash
pnpm --filter prompt-engine exec prompt-engine
```

## Flags

- `--lang <code>`: preset output language (e.g. `en`, `th`)
- `--json`: print full `PromptResult`

## Non-interactive mode

Useful for scripts and tests:

```bash
pnpm --filter prompt-engine exec prompt-engine \
  --no-interactive \
  --json \
  --lang en \
  --framework rtf \
  --field role="a product manager" \
  --field context="for startup founders, around 6 bullets" \
  --field target="outline MVP scope" \
  --field format="bullet points"
```
