# Context Engineering Examples

Five working Node.js examples — one per code-based context engineering pattern.
Each example uses a system prompt generated from [prompts.data-shane.com/context](https://prompts.data-shane.com/context).

---

## Setup (do this once)

### 1. Get an OpenAI API key
Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys) → Create new secret key.

### 2. Install dependencies
```bash
cd examples
npm install
```

### 3. Create your `.env` file
```bash
cp .env.example .env
```
Open `.env` and replace `sk-...` with your real API key.

---

## Run the examples

From the `examples/` directory:

```bash
node 01-rag/index.js          # Customer support bot that answers from a knowledge base
node 02-memory/index.js       # Finance advisor chatbot that remembers your conversation
node 03-few-shot/index.js     # Ticket classifier that learns from similar past tickets
node 04-tool-use/index.js     # Data analyst that can calculate and query company data
node 05-multi-agent/index.js  # Blog pipeline: Researcher → Writer → Editor
```

---

## What each example teaches

| # | Pattern | Core concept |
|---|---------|-------------|
| **01** | RAG | Retrieve relevant docs → fill `{{CONTEXT}}` → AI answers from those docs only |
| **02** | Memory | Store turns in array → fill `{{HISTORY}}` → AI remembers the conversation |
| **03** | Few-Shot | Find similar examples → fill `{{EXAMPLES}}` → AI learns the pattern |
| **04** | Tool Use | AI decides to call a tool → your code runs it → result goes back to AI |
| **05** | Multi-Agent | Agent 1 output → fill `{{UPSTREAM_OUTPUT}}` → becomes Agent 2 input |

---

## Costs

All examples use OpenAI's API. Approximate cost per run:

| Example | Model | Est. cost |
|---------|-------|-----------|
| 01-rag | gpt-4o-mini | ~$0.001 |
| 02-memory | gpt-4o-mini | ~$0.001 per message |
| 03-few-shot | gpt-4o-mini | ~$0.001 |
| 04-tool-use | gpt-4o | ~$0.01 |
| 05-multi-agent | gpt-4o (×3 agents) | ~$0.05 |

---

## How to use these with your own data

1. Open [prompts.data-shane.com/context](https://prompts.data-shane.com/context)
2. Pick a pattern, fill in your fields, copy the template
3. Replace the `SYSTEM_TEMPLATE` or `*_PROMPT` constant in the example with your template
4. Replace the knowledge base / examples / company data with your own data

The `{{PLACEHOLDERS}}` in the template are exactly the spots your code fills in.
