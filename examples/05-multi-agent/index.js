/**
 * Pattern 05 — Multi-Agent Handoff
 *
 * What happens:
 *   1. Agent 1 (Researcher) gets the topic and produces a research brief
 *   2. That brief is inserted at {{UPSTREAM_OUTPUT}} in Agent 2's prompt
 *   3. Agent 2 (Writer) gets the brief and writes a draft article
 *   4. That draft is inserted at {{UPSTREAM_OUTPUT}} in Agent 3's prompt
 *   5. Agent 3 (Editor) polishes the draft and returns the final article
 *
 * Each agent is a separate API call with its own focused system prompt.
 * They don't share a conversation — output flows forward through the pipeline.
 *
 * Run: node 05-multi-agent/index.js
 */

import 'dotenv/config'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ─── Agent system prompts ──────────────────────────────────────────────────
// Each generated separately from the Context page → Multi-Agent pattern.
// One prompt per agent. {{UPSTREAM_OUTPUT}} is filled by YOUR CODE between calls.

const RESEARCHER_PROMPT = `You are the Researcher agent in a blog post writing pipeline.
You receive a topic from the user.
Your task: research the topic and produce a structured research brief for the Writer agent.
Send to downstream: a research brief with key facts, statistics, main arguments, and section recommendations.
Output format: Markdown with these sections:
## Key Facts (5–7 bullet points)
## Statistics (3–5 data points with context)
## Main Arguments (3 angles worth exploring)
## Recommended Sections (4 section titles the Writer should use)`

const WRITER_PROMPT = `You are the Writer agent in a blog post writing pipeline.
You receive a structured research brief from the Researcher agent.
Your task: write a clear, engaging 450-word blog post based strictly on the research brief.
Send to downstream: a complete first draft with title, introduction, 4 sections, and conclusion.
Output format: Markdown blog post — title as H1, sections as H2, no fluff.

--- UPSTREAM OUTPUT (Research Brief from Researcher) ---
{{UPSTREAM_OUTPUT}}
--- END ---`

const EDITOR_PROMPT = `You are the Editor agent in a blog post writing pipeline.
You receive a first draft from the Writer agent.
Your task: polish the article — improve the opening hook, fix any awkward phrasing, strengthen the conclusion, and ensure the tone is consistent.
Do not change the factual content — only improve the writing quality.
Output format: Return the final polished article in full Markdown, then add:

## Editor Notes
- [Change 1 you made and why]
- [Change 2 you made and why]
- [Change 3 you made and why]

--- UPSTREAM OUTPUT (First Draft from Writer) ---
{{UPSTREAM_OUTPUT}}
--- END ---`

// ─── Agent runner ──────────────────────────────────────────────────────────
async function runAgent({ label, systemPrompt, userMessage, model = 'gpt-4o' }) {
  const divider = '═'.repeat(60)
  console.log(`\n${divider}`)
  console.log(`🤖  ${label}`)
  console.log(divider)

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  })

  const output = response.choices[0].message.content
  const tokens = response.usage.total_tokens
  console.log(output)
  console.log(`\n[${tokens} tokens used]`)
  return output
}

// ─── Pipeline orchestrator ─────────────────────────────────────────────────
async function runBlogPipeline(topic) {
  console.log(`\n📝 Blog Pipeline Starting`)
  console.log(`Topic: "${topic}"`)
  console.log(`Pipeline: Researcher → Writer → Editor`)

  // ── Agent 1: Researcher ──────────────────────────────────────────────────
  const researchBrief = await runAgent({
    label: 'RESEARCHER — producing research brief',
    systemPrompt: RESEARCHER_PROMPT,
    userMessage: `Research topic: ${topic}`,
  })

  // ── Agent 2: Writer ──────────────────────────────────────────────────────
  // The researcher's output is injected at {{UPSTREAM_OUTPUT}} by YOUR CODE.
  // The Writer never directly "talks" to the Researcher — data flows through code.
  const firstDraft = await runAgent({
    label: 'WRITER — writing first draft from research brief',
    systemPrompt: WRITER_PROMPT.replace('{{UPSTREAM_OUTPUT}}', researchBrief),
    userMessage: 'Write the blog post based on the research brief provided in your system prompt.',
  })

  // ── Agent 3: Editor ──────────────────────────────────────────────────────
  const finalArticle = await runAgent({
    label: 'EDITOR — polishing the final article',
    systemPrompt: EDITOR_PROMPT.replace('{{UPSTREAM_OUTPUT}}', firstDraft),
    userMessage: 'Edit and polish the draft article provided in your system prompt.',
  })

  console.log('\n✅ Pipeline complete! Final article above (under EDITOR section).')
  return finalArticle
}

// ─── Run the pipeline ──────────────────────────────────────────────────────
await runBlogPipeline('How AI is changing the way software developers write code in 2025')
