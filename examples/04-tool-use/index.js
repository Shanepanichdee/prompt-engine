/**
 * Pattern 04 — Tool Use (Agentic Loop)
 *
 * What happens:
 *   1. You send a question to the AI
 *   2. The AI decides it needs a tool — e.g. "I should calculate this"
 *   3. The AI returns a tool_call request (it does NOT calculate itself)
 *   4. YOUR CODE runs the actual function and gets the result
 *   5. You send the result back to the AI as an "observation"
 *   6. Steps 2–5 repeat until the AI has enough to give a final answer
 *
 * The AI is the "brain" — it decides WHAT to do.
 * Your code is the "hands" — it actually DOES it.
 *
 * Run: node 04-tool-use/index.js
 */

import 'dotenv/config'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ─── System prompt ─────────────────────────────────────────────────────────
// Generated from the Context page → Tool Use pattern
// No {{PLACEHOLDERS}} here — tools are listed statically, not injected at runtime.
const SYSTEM_PROMPT = `You are a data analyst assistant.
You have access to the following tools:
calculator(expression: str) → float
get_current_date() → str
search_company_data(query: str) → str

Use these tools to answer questions accurately. Always verify numbers with the calculator before stating them. Never guess — if you need a number, use a tool to get it.`

// ─── Tool implementations ──────────────────────────────────────────────────
// These are YOUR functions — the AI never sees the code, only the name + result.

function calculator({ expression }) {
  // Note: in production use a math library (mathjs) instead of Function() for security.
  // This is fine for a controlled demo where the AI generates the expressions.
  try {
    const result = Function('"use strict"; return (' + expression + ')')()
    return String(Math.round(result * 10000) / 10000) // round to 4 decimal places
  } catch (e) {
    return `Error evaluating expression: ${e.message}`
  }
}

function get_current_date() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function search_company_data({ query }) {
  // Hardcoded company data for the demo.
  // In production: query a real database or connect to the RAG example (01-rag).
  const data = [
    { topic: 'revenue', info: 'Q1: $1.2M, Q2: $1.5M, Q3: $1.8M, Q4: $2.1M. Annual total: $6.6M. YoY growth: 34%.' },
    { topic: 'users', info: 'Active users: 12,400. New users this month: 1,860. Churn rate: 2.3% per month. MoM growth: 15%.' },
    { topic: 'costs', info: 'Infrastructure: $45K/month. Payroll: $180K/month. Marketing: $25K/month. Total monthly burn: $250K.' },
    { topic: 'profit', info: 'Monthly revenue: $550K. Monthly costs: $250K. Monthly gross profit: $300K. Gross margin: 54.5%.' },
    { topic: 'customers', info: 'Total customers: 3,200. Enterprise customers: 48. Pro customers: 820. Starter customers: 2,332.' },
  ]

  const q = query.toLowerCase()
  const match = data.find(d => q.includes(d.topic))
  return match ? match.info : 'No specific data found for that query. Try: revenue, users, costs, profit, or customers.'
}

// Map tool names to their functions
const toolFunctions = { calculator, get_current_date, search_company_data }

// ─── OpenAI tool definitions ───────────────────────────────────────────────
// These definitions tell the AI WHAT each tool does and what parameters it takes.
// They must match your actual function signatures above.
const tools = [
  {
    type: 'function',
    function: {
      name: 'calculator',
      description: 'Evaluate a mathematical expression and return the numeric result. Use this for all calculations.',
      parameters: {
        type: 'object',
        properties: {
          expression: { type: 'string', description: 'A valid math expression, e.g. "1200000 + 1500000" or "2.1 / 6.6 * 100"' },
        },
        required: ['expression'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_current_date',
      description: "Get today's date. Use when the user asks about time or when date context is needed.",
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_company_data',
      description: 'Search internal company data including revenue, users, costs, profit, and customer counts.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'What data to look for, e.g. "revenue", "active users", "monthly costs"' },
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

  // Loop runs until the AI gives a final answer (finish_reason === 'stop')
  while (true) {
    step++
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools,
      tool_choice: 'auto',
    })

    const choice = response.choices[0]
    messages.push(choice.message) // always add AI's response to history

    if (choice.finish_reason === 'stop') {
      console.log(`\n✅ Final Answer:\n${choice.message.content}`)
      console.log('─'.repeat(60))
      break
    }

    if (choice.finish_reason === 'tool_calls') {
      for (const toolCall of choice.message.tool_calls) {
        const name = toolCall.function.name
        const args = JSON.parse(toolCall.function.arguments || '{}')

        console.log(`[Step ${step}] 🔧 Calling ${name}(${JSON.stringify(args)})`)
        const result = toolFunctions[name](args)
        console.log(`          📊 Result: ${result}`)

        // Send the tool result back to the AI
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: result,
        })
      }
    }
  }
}

// ─── Test questions ────────────────────────────────────────────────────────
await runAgent('What percentage of our annual revenue came from Q4?')
await runAgent('If churn stays at the current rate, how many users will we lose this year?')
await runAgent('What is our current monthly profit, and what date is it today?')
