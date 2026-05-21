/**
 * Pattern 05 — Multi-Agent Handoff
 *
 * What happens:
 *   1. Agent 1 (Researcher) researches the topic → produces a research brief
 *   2. Brief is inserted at {{UPSTREAM_OUTPUT}} in Agent 2's prompt
 *   3. Agent 2 (Writer) writes a first draft from the brief
 *   4. Draft is inserted at {{UPSTREAM_OUTPUT}} in Agent 3's prompt
 *   5. Agent 3 (Editor) polishes the draft → final article
 *
 * Each agent is a separate API call. They don't share a conversation —
 * output flows forward through your code.
 *
 * Switch provider: AI_PROVIDER=anthropic node 05-multi-agent/index.js
 * Run:             node 05-multi-agent/index.js
 */

import 'dotenv/config'
import { chat, logProvider } from '../client.js'

logProvider()

// ─── Agent system prompts ──────────────────────────────────────────────────
// Each generated from the Context page → Multi-Agent pattern.
// {{UPSTREAM_OUTPUT}} is filled by YOUR CODE between API calls.

const RESEARCHER_PROMPT = `You are the Researcher agent in a blog writing pipeline.
Your task: research the given topic and produce a structured brief for the Writer.
Output format — Markdown with exactly these sections:
## Key Facts (5–7 bullet points)
## Statistics (3–5 data points with context)
## Main Arguments (3 angles worth exploring)
## Recommended Sections (4 section titles for the Writer to use)`

const WRITER_PROMPT = `You are the Writer agent in a blog writing pipeline.
You receive a structured research brief from the Researcher agent.
Your task: write a clear, engaging 450-word blog post from the research brief.
Output format: Markdown — H1 title, short intro, 4 H2 sections, conclusion. No fluff.

--- UPSTREAM OUTPUT (Research Brief) ---
{{UPSTREAM_OUTPUT}}
--- END ---`

const EDITOR_PROMPT = `You are the Editor agent in a blog writing pipeline.
You receive a first draft from the Writer agent.
Your task: polish the article — improve the opening hook, fix awkward phrasing, strengthen the conclusion. Do not change facts.
Output format: Return the final polished article in full Markdown, then add:

## Editor Notes
- [Change 1 and why]
- [Change 2 and why]
- [Change 3 and why]

--- UPSTREAM OUTPUT (First Draft) ---
{{UPSTREAM_OUTPUT}}
--- END ---`

// ─── Agent runner ──────────────────────────────────────────────────────────
async function runAgent({ label, systemPrompt, userMessage }) {
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`🤖  ${label}`)
  console.log('═'.repeat(60))

  const output = await chat({ systemPrompt, userMessage })
  console.log(output)
  return output
}

// ─── Pipeline orchestrator ─────────────────────────────────────────────────
async function runBlogPipeline(topic) {
  console.log(`\n📝 Blog Pipeline: "${topic}"`)
  console.log('Flow: Researcher → Writer → Editor\n')

  // Agent 1: Researcher
  const researchBrief = await runAgent({
    label: 'RESEARCHER — producing research brief',
    systemPrompt: RESEARCHER_PROMPT,
    userMessage: `Research topic: ${topic}`,
  })

  // Agent 2: Writer
  // The researcher's output is injected at {{UPSTREAM_OUTPUT}} by YOUR CODE.
  // Writer never directly "talks" to Researcher — data flows through code.
  const firstDraft = await runAgent({
    label: 'WRITER — writing first draft from research brief',
    systemPrompt: WRITER_PROMPT.replace('{{UPSTREAM_OUTPUT}}', researchBrief),
    userMessage: 'Write the blog post based on the research brief in your system prompt.',
  })

  // Agent 3: Editor
  const finalArticle = await runAgent({
    label: 'EDITOR — polishing the final article',
    systemPrompt: EDITOR_PROMPT.replace('{{UPSTREAM_OUTPUT}}', firstDraft),
    userMessage: 'Edit and polish the draft in your system prompt.',
  })

  console.log('\n✅ Pipeline complete! Final article is the EDITOR section above.')
  return finalArticle
}

// ─── Run ───────────────────────────────────────────────────────────────────
await runBlogPipeline('How AI is changing the way software developers write code in 2025')
