/**
 * Pattern 03 — Dynamic Few-Shot
 *
 * What happens:
 *   1. A new support ticket comes in
 *   2. Your code finds the most similar past tickets from the example library
 *   3. Those similar examples are inserted at {{EXAMPLES}}
 *   4. The AI classifies the new ticket by learning from those examples
 *
 * Why "dynamic"? Static few-shot always shows the same 3 examples.
 * Dynamic few-shot shows the 3 examples most similar to THIS specific ticket —
 * much better accuracy because the AI sees the right pattern.
 *
 * Run: node 03-few-shot/index.js
 */

import 'dotenv/config'
import OpenAI from 'openai'
import { ticketExamples } from './examples-library.js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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
{"severity": "low|medium|high", "category": "billing|technical|general", "reason": "one sentence explaining the classification"}`

// ─── Example selection ─────────────────────────────────────────────────────
// Word-overlap similarity — fast and works well for support ticket keywords.
// In production: use OpenAI text-embedding-3-small + cosine similarity
// for semantic search (catches "app keeps closing" = "app crashes").
function selectSimilarExamples(query, examples, topK = 3) {
  const queryWords = new Set(
    query.toLowerCase().split(/\W+/).filter(w => w.length > 2)
  )

  const scored = examples.map(ex => {
    const exWords = ex.ticket.toLowerCase().split(/\W+/)
    const overlap = exWords.filter(w => queryWords.has(w)).length
    return { ...ex, score: overlap }
  })

  // Sort by similarity, take top K, then shuffle slightly so we don't always
  // show the exact same 3 examples when scores are tied
  return scored
    .sort((a, b) => b.score - a.score || Math.random() - 0.5)
    .slice(0, topK)
}

// ─── Classify function ─────────────────────────────────────────────────────
async function classify(ticketText) {
  console.log(`\n🎫 Ticket: "${ticketText}"`)

  // Step 1: Select the most similar examples from the library
  const examples = selectSimilarExamples(ticketText, ticketExamples)
  console.log('📚 Using examples:')
  examples.forEach(e =>
    console.log(`   • "${e.ticket.substring(0, 50)}..." → ${e.severity}/${e.category}`)
  )

  // Step 2: Format examples and fill {{EXAMPLES}}
  const examplesText = examples
    .map(e => `Ticket: ${e.ticket}\nSeverity: ${e.severity}\nCategory: ${e.category}`)
    .join('\n\n')

  const systemPrompt = SYSTEM_TEMPLATE.replace('{{EXAMPLES}}', examplesText)

  // Step 3: Classify with AI
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: ticketText },
    ],
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(response.choices[0].message.content)
  const severityEmoji = { high: '🔴', medium: '🟡', low: '🟢' }[result.severity]
  console.log(`✅ ${severityEmoji} ${result.severity.toUpperCase()} | ${result.category} — ${result.reason}`)
  console.log('─'.repeat(60))
  return result
}

// ─── Test tickets ──────────────────────────────────────────────────────────
await classify('My payment failed but I can see the charge on my bank statement')
await classify('The entire app goes blank when I click the Reports tab')
await classify('I need help exporting all our project data before the end of the month')
await classify('Two team members are sharing one account — can we split them?')
await classify('The API webhook is returning 503 errors since yesterday afternoon')
