/**
 * Pattern 01 — RAG (Retrieval-Augmented Generation)
 *
 * What happens:
 *   1. User asks a question
 *   2. Your code searches the knowledge base for relevant chunks
 *   3. Those chunks are inserted at {{CONTEXT}}
 *   4. The AI answers ONLY from that context — no hallucination from training data
 *
 * Switch provider: AI_PROVIDER=gemini node 01-rag/index.js
 * Run:             node 01-rag/index.js
 */

import 'dotenv/config'
import { chat, logProvider } from '../client.js'
import { knowledgeBase } from './knowledge-base.js'

logProvider()

// ─── System prompt template ────────────────────────────────────────────────
// Generated from the Context page → RAG pattern (prompts.data-shane.com/context)
const SYSTEM_TEMPLATE = `You are a customer support assistant.
You will be provided with context retrieved from: the Nexus product knowledge base.
Use only this context to respond — do not rely on prior knowledge.
If the context does not contain the answer, say "I don't have that information in my knowledge base."
Cite each piece of information with its source ID in brackets, e.g. [pricing-pro].

--- RETRIEVED CONTEXT ---
{{CONTEXT}}
--- END CONTEXT ---`

// ─── Retrieval function ────────────────────────────────────────────────────
// Simple word-overlap scoring. Works well for exact terms (pricing, refund, etc.)
// In production: replace with OpenAI Embeddings + cosine similarity for semantic search.
function retrieveChunks(query, chunks, topK = 3) {
  const queryTerms = new Set(
    query.toLowerCase().split(/\W+/).filter(w => w.length > 2)
  )
  const scored = chunks.map(chunk => {
    const chunkTerms = chunk.content.toLowerCase().split(/\W+/)
    const overlap = chunkTerms.filter(w => queryTerms.has(w)).length
    return { ...chunk, score: overlap }
  })
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(c => c.score > 0)
}

// ─── Main RAG function ─────────────────────────────────────────────────────
async function ask(question) {
  console.log(`\n❓ Question: ${question}`)

  const relevant = retrieveChunks(question, knowledgeBase)
  if (relevant.length === 0) {
    console.log('⚠️  No relevant chunks found in knowledge base.')
    return
  }
  console.log(`📄 Retrieved: ${relevant.map(c => c.id).join(', ')}`)

  // Fill {{CONTEXT}} with retrieved chunks
  const context = relevant.map(c => `[${c.id}] ${c.content}`).join('\n\n')
  const systemPrompt = SYSTEM_TEMPLATE.replace('{{CONTEXT}}', context)

  const answer = await chat({ systemPrompt, userMessage: question })
  console.log(`\n💬 Answer:\n${answer}`)
  console.log('─'.repeat(60))
}

// ─── Test questions ────────────────────────────────────────────────────────
await ask('What is your refund policy?')
await ask('How much does the Pro plan cost and what does it include?')
await ask('Do you have GitHub integration?')
await ask('Is your platform GDPR compliant?')
await ask('What happens to my data if I cancel?')
