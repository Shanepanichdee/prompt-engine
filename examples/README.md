# Context Engineering Examples

Five working Node.js examples — one per code-based context engineering pattern.
Supports **OpenAI**, **Anthropic (Claude)**, **Google Gemini**, and **GitHub Models** via a single `AI_PROVIDER` switch.

---

## Setup (do this once)

### 1. Install dependencies
```bash
cd examples
npm install
```

### 2. Get API keys (get only the ones you want to use)

| Provider | Where to get it | Cost |
|---|---|---|
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | Pay per use |
| **Anthropic (Claude)** | [console.anthropic.com](https://console.anthropic.com) | Pay per use, free credits on signup |
| **Google Gemini** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | **Free** — 1,500 req/day |
| **GitHub Models** | [github.com/settings/tokens](https://github.com/settings/tokens) → classic token | **Free** with GitHub account |

> **About "GitHub Copilot":** Copilot is the IDE coding assistant — not a chat API.
> **GitHub Models** is the free API that runs GPT-4o, Llama 3, Mistral, Phi, and more.
> Get a GitHub personal access token (no scopes needed) and set `AI_PROVIDER=github`.

### 3. Create your `.env` file
```bash
cp .env.example .env
# Edit .env — add the keys for the providers you want to use
```

---

## Run the examples

From the `examples/` directory. Set `AI_PROVIDER` to switch providers:

```bash
# Default (OpenAI)
node 01-rag/index.js

# Use Gemini (free)
AI_PROVIDER=gemini node 01-rag/index.js

# Use Claude
AI_PROVIDER=anthropic node 01-rag/index.js

# Use GitHub Models (free)
AI_PROVIDER=github node 01-rag/index.js
```

All 5 examples:
```bash
node 01-rag/index.js           # Customer support bot — answers from a knowledge base
node 02-memory/index.js        # Finance advisor — remembers your conversation (interactive)
node 03-few-shot/index.js      # Ticket classifier — learns from similar past tickets
node 04-tool-use/index.js      # Data analyst — calls real functions (calculator, lookup)
node 05-multi-agent/index.js   # Blog pipeline — Researcher → Writer → Editor
```

---

## Provider compatibility

| Example | OpenAI | Anthropic | Gemini | GitHub Models |
|---------|--------|-----------|--------|---------------|
| 01-rag | ✅ | ✅ | ✅ | ✅ |
| 02-memory | ✅ | ✅ | ✅ | ✅ |
| 03-few-shot | ✅ | ✅ | ✅ | ✅ |
| 04-tool-use | ✅ | ❌* | ✅ | ✅ |
| 05-multi-agent | ✅ | ✅ | ✅ | ✅ |

*Tool use with Anthropic requires the `tool_use` API which has a different format. Switching to `openai`, `gemini`, or `github` for example 04.

---

## Default models per provider

| Provider | Default model | Good for |
|---|---|---|
| `openai` | gpt-4o-mini | All examples, best value |
| `anthropic` | claude-3-5-haiku-20241022 | All examples except tool use |
| `gemini` | gemini-1.5-flash | All examples, free tier |
| `github` | gpt-4o-mini | All examples, free |

Override the model per run: `DEFAULT_MODEL=gpt-4o AI_PROVIDER=openai node 01-rag/index.js`

---

## How to use these with your own data

1. Open [prompts.data-shane.com/context](https://prompts.data-shane.com/context)
2. Pick a pattern, fill your fields, copy the template
3. Replace the `SYSTEM_TEMPLATE` or `*_PROMPT` constant in the example
4. Replace the knowledge base / examples / company data with your real data
5. Set `AI_PROVIDER` to whichever provider you have a key for

The `{{PLACEHOLDERS}}` in the template map exactly to what your code fills in.
