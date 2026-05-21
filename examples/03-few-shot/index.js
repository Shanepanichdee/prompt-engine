/**
 * Pattern 03 — Dynamic Few-Shot
 *
 * What happens:
 *   1. A new support ticket comes in
 *   2. Your code finds the most similar past tickets from the example library
 *   3. Those examples are inserted at {{EXAMPLES}}
 *   4. The AI classifies the ticket by learning from those examples
 *
 * Switch provider: AI_PROVIDER=gemini node 03-few-shot/index.js
 * Run:             node 03-few-shot/index.js
 */

import 'dotenv/config'
import { chat, logProvider } from '../client.js'
import { ticketExamples } from './examples-library.js'

logProvider()

// ─── System prompt template ────────────────────────────────────────────────
// Generated from the Context page → Dynamic Few-Shot pattern
const SYSTEM_TEMPLATE = `You are a support ticket classifier.
Task: classify the ticket by severity (low/medium/high) and category (billing/technical/general).
Examples are selected based on: semantic similarity to the current ticket text.

Each example follows this format:
Ticket: <text>
Severity: <low|medium|high>
Category: <billing|technical|general>

--- EXAMPLES ---
{{EXAMPLES}}
--- END EXAMPLES ---

Respond with ONLY valid JSON in this exact format, no other text:
{"severity": "low|medium|high", "category": "billing|technical|general", "reason": "one sentence"}`

// ─── Example selection ─────────────────────────────────────────────────────
// Word-overlap similarity — fast and works well for support ticket keywords.
// In production: use OpenAI text-embedding-3-small + cosine similarity
// for semantic search (catches "app keeps closing" = "crashes").
function selectSimilarExamples(query, examples, topK = 3) {
  const queryWords = new Set(
    query.toLowerCase().split(/\W+/).filter(w => w.length > 2)
  )
  const scored = examples.map(ex => {
    const exWords = ex.ticket.toLowerCase().split(/\W+/)
    const overlap = exWords.filter(w => queryWords.has(w)).length
    return { ...ex, score: overlap }
  })
  return scored
    .sort((a, b) => b.score - a.score || Math.random() - 0.5)
    .slice(0, topK)
}

// ─── Classify function ─────────────────────────────────────────────────────
async function classify(ticketText) {
  console.log(`\n🎫 Ticket: "${ticketText}"`)

  const examples = selectSimilarExamples(ticketText, ticketExamples)
  console.log('📚 Using examples:')
  examples.forEach(e =>
    console.log(`   • "${e.ticket.substring(0, 50)}..." → ${e.severity}/${e.category}`)
  )

  const examplesText = examples
    .map(e => `Ticket: ${e.ticket}\nSeverity: ${e.severity}\nCategory: ${e.category}`)
    .join('\n\n')

  const systemPrompt = SYSTEM_TEMPLATE.replace('{{EXAMPLES}}', examplesText)
  const raw = await chat({ systemPrompt, userMessage: ticketText })

  const result = JSON.parse(raw.trim().replace(/^```json\n?|```$/g, ''))
  const icon = { high: '🔴', medium: '🟡', low: '🟢' }[result.severity]
  console.log(`✅ ${icon} ${result.severity.toUpperCase()} | ${result.category} — ${result.reason}`)
  console.log('─'.repeat(60))
  return result
}

// ─── Test tickets ──────────────────────────────────────────────────────────
await classify('My payment failed but I can see the charge on my bank statement')
await classify('The entire app goes blank when I click the Reports tab')
await classify('I need help exporting all our project data before end of month')
await classify('Two team members are sharing one account — can we split them?')
await classify('The API webhook is returning 503 errors since yesterday afternoon')
