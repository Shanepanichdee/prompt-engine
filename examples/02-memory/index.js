/**
 * Pattern 02 — Conversation Memory
 *
 * What happens:
 *   1. Each message you send gets stored in a history array
 *   2. On every new message, recent turns are inserted at {{HISTORY}}
 *   3. The AI always "remembers" what was said earlier in the conversation
 *   4. When history exceeds the window, older turns are compressed
 *
 * Run: node 02-memory/index.js
 * Type your messages and press Enter. Type "exit" to quit.
 */

import 'dotenv/config'
import OpenAI from 'openai'
import readline from 'readline'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const WINDOW_SIZE = 8 // keep last 8 turns verbatim, compress older ones

// ─── System prompt template ────────────────────────────────────────────────
// Generated from the Context page → Conversation Memory pattern
const SYSTEM_TEMPLATE = `You are a personal finance advisor.
Your job is to help users manage budgets, plan savings, and make smart financial decisions.
Be warm, practical, and specific with numbers and timelines.

Conversation history is structured as:
Human: <message>
Assistant: <response>

Maintain the last ${WINDOW_SIZE} turns of conversation verbatim.
When history exceeds ${WINDOW_SIZE} turns, older turns are summarized as a one-sentence budget snapshot.

--- CONVERSATION HISTORY ---
{{HISTORY}}
--- END HISTORY ---`

// ─── History state ─────────────────────────────────────────────────────────
const history = [] // { user: string, assistant: string }[]

function buildSystemPrompt() {
  if (history.length === 0) {
    return SYSTEM_TEMPLATE.replace('{{HISTORY}}', '[No previous conversation]')
  }

  const recent = history.slice(-WINDOW_SIZE)
  const older = history.slice(0, -WINDOW_SIZE)

  let historyText = ''

  // Compress turns outside the window into a summary
  // In production: you'd ask the AI to generate this summary automatically
  if (older.length > 0) {
    const topics = older.flatMap(t =>
      t.user.toLowerCase().split(/\W+/).filter(w => w.length > 4)
    ).slice(0, 5).join(', ')
    historyText += `[Earlier conversation summary: ${older.length} turns covering topics like ${topics || 'general finance advice'}]\n\n`
  }

  historyText += recent
    .map(t => `Human: ${t.user}\nAssistant: ${t.assistant}`)
    .join('\n\n')

  return SYSTEM_TEMPLATE.replace('{{HISTORY}}', historyText)
}

// ─── Chat function ─────────────────────────────────────────────────────────
async function chat(userMessage) {
  const systemPrompt = buildSystemPrompt()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  })

  const assistantReply = response.choices[0].message.content
  history.push({ user: userMessage, assistant: assistantReply })
  return assistantReply
}

// ─── Interactive chat loop ─────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

console.log('💰 Personal Finance Advisor')
console.log(`Memory: keeps last ${WINDOW_SIZE} turns, compresses older ones`)
console.log('Type your question and press Enter. Type "exit" to quit.\n')

function prompt() {
  rl.question('You: ', async input => {
    const trimmed = input.trim()

    if (trimmed.toLowerCase() === 'exit') {
      console.log('\nGoodbye! Your conversation had', history.length, 'turns.')
      rl.close()
      return
    }

    if (!trimmed) {
      prompt()
      return
    }

    try {
      const reply = await chat(trimmed)
      console.log(`\nAdvisor: ${reply}`)
      console.log(`[Memory: ${history.length} turns stored, window: last ${Math.min(history.length, WINDOW_SIZE)}]\n`)
    } catch (err) {
      console.error('Error:', err.message)
    }

    prompt()
  })
}

prompt()
