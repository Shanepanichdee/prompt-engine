/**
 * Pattern 04 — Tool Use (Agentic Loop)
 *
 * What happens:
 *   1. You send a question to the AI
 *   2. The AI decides it needs a tool — returns a tool_call (does NOT execute)
 *   3. YOUR CODE runs the actual function and gets the result
 *   4. You send the result back to the AI as an "observation"
 *   5. Steps 2–4 repeat until the AI gives a final answer
 *
 * Provider support:
 *   ✅ openai   — full support
 *   ✅ gemini   — full support (OpenAI-compatible tool format)
 *   ✅ github   — full support (OpenAI-compatible tool format)
 *   ❌ anthropic — different tool format, requires @anthropic-ai/sdk tool_use API
 *
 * Switch provider: AI_PROVIDER=gemini node 04-tool-use/index.js
 * Run:             node 04-tool-use/index.js
 */

import 'dotenv/config'
import { getOpenAICompatibleClient, DEFAULT_MODEL, logProvider } from '../client.js'

logProvider()

// getOpenAICompatibleClient() throws a clear error if AI_PROVIDER=anthropic
const openai = getOpenAICompatibleClient()

// ─── System prompt ─────────────────────────────────────────────────────────
// Generated from the Context page → Tool Use pattern
const SYSTEM_PROMPT = `You are a data analyst assistant.
You have access to the following tools:
calculator(expression: str) → float
get_current_date() → str
search_company_data(query: str) → str

Use these tools to answer questions accurately.
Always verify numbers with the calculator before stating them.
Never guess — if you need a number, use a tool to get it.`

// ─── Tool implementations ──────────────────────────────────────────────────
// These are YOUR functions. The AI never sees the code — only the name and result.

function calculator({ expression }) {
  // Note: in production use a math library (mathjs) instead of Function() for security.
  try {
    const result = Function('"use strict"; return (' + expression + ')')()
    return String(Math.round(result * 10000) / 10000)
  } catch (e) {
    return `Error: ${e.message}`
  }
}

function get_current_date() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function search_company_data({ query }) {
  const data = [
    { topic: 'revenue',   info: 'Q1: $1.2M, Q2: $1.5M, Q3: $1.8M, Q4: $2.1M. Annual: $6.6M. YoY growth: 34%.' },
    { topic: 'users',     info: 'Active users: 12,400. New this month: 1,860. Churn: 2.3%/month. MoM growth: 15%.' },
    { topic: 'costs',     info: 'Infrastructure: $45K/month. Payroll: $180K/month. Marketing: $25K/month. Total burn: $250K.' },
    { topic: 'profit',    info: 'Monthly revenue: $550K. Monthly costs: $250K. Gross profit: $300K. Margin: 54.5%.' },
    { topic: 'customers', info: 'Total: 3,200. Enterprise: 48. Pro: 820. Starter: 2,332.' },
  ]
  const q = query.toLowerCase()
  const match = data.find(d => q.includes(d.topic))
  return match ? match.info : 'No data found. Try: revenue, users, costs, profit, or customers.'
}

const toolFunctions = { calculator, get_current_date, search_company_data }

// ─── OpenAI tool definitions ───────────────────────────────────────────────
const tools = [
  {
    type: 'function',
    function: {
      name: 'calculator',
      description: 'Evaluate a math expression. Use for ALL calculations.',
      parameters: {
        type: 'object',
        properties: {
          expression: { type: 'string', description: 'e.g. "1200000 + 1500000" or "2.1 / 6.6 * 100"' },
        },
        required: ['expression'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_current_date',
      description: "Get today's date.",
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_company_data',
      description: 'Search internal company data: revenue, users, costs, profit, customers.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'What to search for' },
        },
        required: ['query'],
      },
    },
  },
]

// ─── Agentic loop ──────────────────────────────────────────────────────────
async function runAgent(userQuestion) {
  console.log(`\n❓ Question: ${userQuestion}`)
  console.log('─'.repeat(60))

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userQuestion },
  ]

  let step = 0
  while (true) {
    step++
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      tools,
      tool_choice: 'auto',
    })

    const choice = response.choices[0]
    messages.push(choice.message)

    if (choice.finish_reason === 'stop') {
      console.log(`\n✅ Answer:\n${choice.message.content}`)
      console.log('─'.repeat(60))
      break
    }

    if (choice.finish_reason === 'tool_calls') {
      for (const toolCall of choice.message.tool_calls) {
        const name = toolCall.function.name
        const args = JSON.parse(toolCall.function.arguments || '{}')
        console.log(`[Step ${step}] 🔧 ${name}(${JSON.stringify(args)})`)
        const result = toolFunctions[name](args)
        console.log(`          📊 ${result}`)
        messages.push({ role: 'tool', tool_call_id: toolCall.id, content: result })
      }
    }
  }
}

// ─── Test questions ────────────────────────────────────────────────────────
await runAgent('What percentage of our annual revenue came from Q4?')
await runAgent('If churn stays at the current rate, how many users will we lose this year?')
await runAgent('What is our current monthly profit, and what date is it today?')
