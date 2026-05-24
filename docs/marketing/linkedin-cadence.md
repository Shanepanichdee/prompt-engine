# LinkedIn Cadence — Weeks 2–14

Post 3x/week. Monday = framework explainer, Wednesday = prompt example, Friday = story/insight.
Launch week = May 27. Week 2 starts June 3.

No post starts with "I". Lead with value. Tool link at the end.

---

## Week 2 (June 3–7) — RTCF

### Monday — Framework Explainer

RTCF is the fastest prompt framework. Four fields. 60 seconds to fill.

Role: Who the AI should be
Task: Exactly what to do (be specific)
Context: Who this is for and any key constraints
Format: How to structure the output

Example — instead of "write a meeting agenda":

Role: Chief of Staff for a 6-person cross-functional team
Task: Create the agenda for our weekly 45-minute team meeting. Include time allocations. Start with the most important blocker.
Context: Mixed team — engineering, product, and ops. Meeting is Monday morning. Decisions need to be made, not just reported.
Format: Time-boxed sections. Header for each. Total time must equal 45 minutes.

That's it. Output goes from a generic list to something you can paste into the calendar invite.

RTCF is free at prompts.data-shane.com — 13 other frameworks too.

---

### Wednesday — Prompt Example (Analyst use case)

Most AI-generated executive summaries read like they were written by no one for everyone.

Here's why: the prompt had no context, no audience, no constraints.

Same request. Structured with CO-STAR:

**Bad:** "Summarize this report for executives."

**CO-STAR:**
Context: Q3 financial performance — revenue up 12%, margins down 3%
Objective: Write an executive summary that presents results honestly without causing alarm
Style: Confident, data-driven, brief
Tone: Calm and measured — leadership reads this before the board meeting
Audience: C-suite with limited time, high financial literacy, expect conclusions first
Response: 200 words. Lead with the headline number. Explain variance in 2 sentences. End with one forward-looking statement.

The structured version gives you a summary you can hand to a CFO.

Try CO-STAR free → prompts.data-shane.com

---

### Friday — Story (Why 10 languages)

Prompt Engine supports 10 languages. Not because it was easy — it was the hardest part of the build.

The challenge: "Act as a senior consultant" in English has a specific professional register. In Thai, Japanese, and Arabic — that register is completely different.

Didn't just translate the words. Had to translate the tone, the connector phrases, the way instructions flow.

Thai prompt: "คุณคือที่ปรึกษาอาวุโส..." (you are a senior consultant...)
Japanese: "あなたは経験豊富なコンサルタントとして..." (as an experienced consultant...)

Each locale tells the AI to respond in that language at the end. So your entire prompt — framework, instructions, language instruction — is native.

Built this for markets that most AI tools treat as afterthoughts.

prompts.data-shane.com — try it in your language.

---

## Week 3 (June 10–14) — CO-STAR

### Monday — Framework Explainer

Six fields. One of the most powerful prompt frameworks for business writing.

CO-STAR controls every dimension of AI output:

**C**ontext — what situation are you in
**O**bjective — what do you want the AI to produce
**S**tyle — how it should be written
**T**one — emotional register
**A**udience — who will read this
**R**esponse — format and length

Example — writing a job description:

Context: Fast-growing B2B SaaS startup, 40-person engineering team, remote-first
Objective: Write a compelling job description for a Senior Backend Engineer
Style: Professional but human
Tone: Direct, inclusive, encouraging
Audience: Experienced engineers with 5+ years, browsing multiple listings
Response: 400 words max. Open with why this role matters. Bullet responsibilities and requirements separately.

The AI knows the culture, the audience mindset, and exactly how to format the output.

CO-STAR is free at prompts.data-shane.com

---

### Wednesday — Prompt Example (HR use case)

"Write a job description for a senior developer."

Seven words. Produces seven paragraphs of boilerplate.

Here's the same request with CO-STAR — the framework used by professional prompt engineers:

Context: Fast-growing B2B SaaS startup, 40-person engineering team, remote-first
Objective: Write a compelling job description for a Senior Backend Engineer
Style: Professional but human — candidates should feel excited, not intimidated
Tone: Direct, inclusive, encouraging
Audience: Experienced engineers with 5+ years, likely browsing multiple listings
Response: 400 words max. Open with why this role matters. Bullet responsibilities and requirements separately.

The output is a job description you can publish. Not a template you need to rewrite.

Try CO-STAR → prompts.data-shane.com

---

### Friday — Story (The "good enough" trap)

Most people don't write bad AI prompts on purpose. They write fast ones.

"Write me a cold email." 30 seconds. Paste. Edit for 20 minutes.

"Write me a cold email using RISEN with a specific role, step-by-step instructions, an end goal, and constraints on length and tone." 3 minutes to fill. Paste. Done.

The math works out the same. But the structured version also teaches you what makes a good prompt — so next time you're faster.

Prompt engineering isn't about being technical. It's about being specific.

14 frameworks that force specificity → prompts.data-shane.com

---

## Week 4 (June 17–21) — CRISPE

### Monday — Framework Explainer

CRISPE is the most complete prompt framework. Six dimensions, all of them matter.

**C**apacity — what expertise the AI should have
**R**ole — the persona it should take on
**I**nsight — relevant context or background it needs
**S**tatement — the specific task
**P**ersonality — how it should communicate
**E**xperiment — what to try or iterate on

Example — UX research audit:

Capacity: Senior UX researcher with strong product analytics skills
Role: A UX researcher reviewing an onboarding flow
Insight: Drop-off increases on step 2 and mobile users struggle with form length
Statement: Audit the onboarding flow and propose 5 high-impact fixes
Personality: Clear, practical, and user-centered
Experiment: Suggest quick A/B tests for each fix

The Personality field alone separates CRISPE from every other framework. It produces a distinctive, consistent voice — not generic output.

CRISPE free at prompts.data-shane.com

---

### Wednesday — Prompt Example (Sales use case)

Sales managers use AI for coaching. Most get output that sounds like a training manual.

Here's a CRISPE prompt for reviewing a cold email draft:

Capacity: Senior sales trainer, 10 years B2B SaaS
Role: Account executive coach
Insight: Rep is talented but tends to bury the value prop in paragraph 3 and writes CTAs that are too soft
Statement: Review this cold email draft and rewrite it
Personality: Direct and specific — point out exactly what's wrong, not just what to improve
Experiment: Write two versions of the CTA: one assertive, one soft — explain which fits better

Output: specific, coachable, actionable — not generic sales advice.

Try CRISPE → prompts.data-shane.com

---

### Friday — Story (Why frameworks exist)

Prompt engineering didn't start with ChatGPT. It started with form design.

The best forms in the world — tax forms, medical intake, engineering specs — share one trait: they constrain what you can say so the person processing it can do their job.

Prompt frameworks do the same thing. CO-STAR isn't magic. It's a form. Role-Task-Context-Format isn't clever — it's a checklist.

The AI doesn't get smarter when you use a framework. You get more specific. That's the whole trick.

14 forms that make AI output actually useful → prompts.data-shane.com

---

## Week 5 (June 24–28) — Chain of Thought

### Monday — Framework Explainer

Chain of Thought prompting changes what you ask the AI to do. Instead of "give me the answer," you ask it to think out loud first.

Structure:
Task: what needs to be decided or solved
Reasoning style: how to think through it (step by step, compare options, evaluate risks)
Output format: what the final answer looks like

Example — architecture decision:

Task: Compare monolith, modular monolith, and microservices for a new B2B SaaS product with a 4-person engineering team
Reasoning: Evaluate each option on complexity, team fit, scaling needs, and operational risk. Think through each dimension before concluding.
Output: Decision table plus final recommendation with one-paragraph rationale

Chain of Thought dramatically reduces confident-but-wrong answers. The AI shows its work — errors are visible and fixable before you act on them.

Chain of Thought free at prompts.data-shane.com

---

### Wednesday — Prompt Example (Analyst use case)

Interpreting a monthly metrics report sounds simple. Until you have four numbers pointing in different directions.

Chain of Thought prompt:

Task: Interpret this monthly SaaS metrics report
Context: MRR $45k, churn 3.2%, NPS 42, CAC $180
Reasoning style: Think through each metric one at a time — what's healthy, what needs attention, what's connected to what. Identify the biggest lever before recommending action.
Output format: Short paragraph per metric, then a prioritized action list of 3 items max

The step-by-step reasoning catches contradictions a summary would miss. You see the logic — not just the conclusion.

Try Chain of Thought → prompts.data-shane.com

---

### Friday — Story (When AI gets it wrong)

The most dangerous AI output isn't obviously wrong. It's confidently wrong.

A one-sentence answer to a complex question sounds authoritative. You act on it. Turns out it skipped three important steps.

Chain of Thought prompting is the fix. You make the AI show its reasoning before it gives a conclusion. If the reasoning has a gap, you see it. If the logic is sound, you can trust the answer.

It's slower. The output is longer. Worth it for anything that has consequences.

prompts.data-shane.com — Chain of Thought and 13 other frameworks, free.

---

## Week 6 (July 1–5) — Few-Shot

### Monday — Framework Explainer

Few-Shot prompting teaches by example instead of instruction.

Instead of explaining what you want, you show it. Give the AI 2–3 examples of exactly the output you need. Then give it the real task.

Structure:
Examples: 2–3 input/output pairs that demonstrate the exact format, tone, and depth you want
Task: the actual thing you want it to do
Output format: confirm the structure from your examples

Example — bug ticket writing:

Examples:
BUG-101: Login fails after password reset — Users who reset passwords cannot log in for 15 minutes. Repro: reset password, try to log in immediately. Expected: instant login. Actual: auth error. Priority: High.
BUG-118: Search returns stale results — Product search shows items removed 24h ago. Priority: Medium.

Task: Write a bug ticket for a checkout timeout error on mobile.

The AI learns format, tone, and level of detail simultaneously — something instructions alone often can't achieve.

Few-Shot free at prompts.data-shane.com

---

### Wednesday — Prompt Example (Ops use case)

Consistency is the hardest thing to get from AI writing tools.

When you need every output to match a specific format — same structure, same level of detail, same tone — Few-Shot is the answer.

Example: standardizing customer case study structure across a sales team.

Examples: [paste 2 existing case study excerpts]
Task: Write a new case study for [Customer Name] using the same structure, depth, and narrative style as the examples above.
Output: Match the section headers, length per section, and the way results are quantified.

Every rep gets the same quality. No editing required.

Try Few-Shot → prompts.data-shane.com

---

### Friday — Story (What examples teach that instructions can't)

Spent an hour writing the perfect instruction for a formatting task. AI kept getting it almost right.

Added two examples instead. First try was perfect.

Instructions tell the AI what you want. Examples show it. For anything involving format, tone, or pattern — showing is faster than telling.

Few-Shot prompting. Free at prompts.data-shane.com.

---

## Week 7 (July 8–12) — BROKE

### Monday — Framework Explainer

BROKE brings OKR thinking to AI prompting. Built for strategy and business planning tasks.

**B**ackground — the situation or challenge
**R**ole — who the AI should be
**O**bjectives — what success looks like
**K**ey Results — measurable outcomes
**E**volve — how to iterate or refine

Example — retention strategy:

Background: Product adoption is strong but retention dropped 12% quarter-over-quarter
Role: Growth strategist with SaaS experience
Objectives: Improve retention and trial-to-paid conversion
Key Results: Increase 30-day retention to 65%, raise conversion rate to 18%
Evolve: Review metrics weekly and adjust experiments based on what's moving

The Key Results field forces the AI to anchor output to measurable targets. You get strategy — not just ideas.

BROKE free at prompts.data-shane.com

---

### Wednesday — Prompt Example (Strategy use case)

Most AI-generated strategy docs are lists of reasonable-sounding ideas with no way to measure success.

BROKE fixes this by requiring Key Results upfront:

Background: Early-stage B2B SaaS, 6 months post-launch, 40% monthly churn among free tier users
Role: SaaS growth consultant
Objectives: Reduce churn, increase activation rate, identify highest-intent user segments
Key Results: Cut 30-day churn to 25%, increase day-7 feature adoption to 60%, identify 3 distinct user segments by job role
Evolve: Revisit after 30 days of experiments — adjust based on cohort data

Output: a strategy doc with measurable targets built in, not added as an afterthought.

Try BROKE → prompts.data-shane.com

---

### Friday — Story (Strategy without metrics is decoration)

Every strategy deck has goals. Almost none have numbers.

"Improve customer satisfaction." Improve to what? By when? Compared to what baseline?

BROKE forces this. The Key Results field won't let you write a vague objective. You have to name the number.

Good AI output reflects good thinking. BROKE is the framework that makes you think like a strategist before the AI responds.

14 frameworks for every type of work → prompts.data-shane.com

---

## Week 8 (July 15–19) — RODES

### Monday — Framework Explainer

RODES adds something most frameworks skip: a built-in quality check.

**R**ole — who the AI should be
**O**bjective — what to produce
**D**etails — specific constraints and requirements
**E**xamples — reference material to guide the output
**S**ense Check — ask the AI to verify its own work before delivering

Example — API documentation:

Role: Technical writer with API documentation experience
Objective: Write a beginner-friendly API quickstart guide
Details: Cover setup, authentication, first request, and error handling. Assume the reader is a junior developer, not a sysadmin.
Examples: Reference the Stripe quickstart guide for tone and structure
Sense Check: After drafting, review for clarity — would a developer new to APIs understand every step without Googling?

The Sense Check field alone catches more errors than most manual reviews. High-stakes documents belong in RODES.

RODES free at prompts.data-shane.com

---

### Wednesday — Prompt Example (Documentation use case)

Technical writing fails in one of two ways: too technical for the audience, or too vague to be useful.

RODES handles both:

Role: Technical writer, former software engineer
Objective: Write a step-by-step onboarding guide for a new internal analytics dashboard
Details: Audience is non-technical ops managers. Cover login, navigating reports, exporting data, and setting up alerts. No SQL, no API calls.
Examples: Mirror the tone of this existing guide: [paste link or excerpt]
Sense Check: After writing, read as a first-time user — are there any steps that assume prior knowledge?

Output: documentation that works for the actual audience, not the person who built the system.

Try RODES → prompts.data-shane.com

---

### Friday — Story (Self-review in a prompt)

The most useful thing you can ask an AI: "Does this actually make sense?"

Not as a separate message after you get the output. Built into the prompt itself.

RODES has a Sense Check field for this. Before the AI delivers, it checks its own work against the stated objective and audience. Errors surface before you act on them.

It feels redundant. It catches things every time.

prompts.data-shane.com — RODES and 13 other frameworks, free.

---

## Week 9 (July 22–26) — TRACE

### Monday — Framework Explainer

TRACE puts the audience at the center of every prompt. Designed for content that needs to land with a specific reader.

**T**ask — what needs to be created
**R**ole — who the AI is
**A**udience — who will read or use this
**C**reate — the specific deliverable
**E**xpectation — what success looks like for the reader

Example — policy summary for managers:

Task: Summarize the new data retention policy
Role: Compliance advisor
Audience: Non-technical managers across 5 departments — no legal or IT background
Create: A one-page summary with clear actions and responsibilities
Expectation: After reading, every manager knows exactly what they need to do and by when — no follow-up questions

The Audience field forces you to think about comprehension, not just content. The Expectation field keeps the output outcome-focused.

TRACE free at prompts.data-shane.com

---

### Wednesday — Prompt Example (Comms use case)

Internal communications fail when they're written for the writer, not the reader.

TRACE fixes audience alignment before the AI writes a word:

Task: Write an announcement for the new hybrid work policy
Role: Head of People
Audience: 150 employees across 3 time zones, mix of parents with childcare constraints, individual contributors, and managers with team coordination needs
Create: A 300-word all-hands email with a FAQ section at the bottom
Expectation: Employees finish reading and know: what changes, when, and what they need to do — without needing to reply with questions

Output: an email your team actually reads and understands.

Try TRACE → prompts.data-shane.com

---

### Friday — Story (Writing for the reader)

Every bad internal communication has the same root cause: the writer was thinking about themselves, not the reader.

"This is technically correct." "This covers all the points." "This is what legal approved."

None of those are the reader's problem. The reader wants to know: what do I do and when?

TRACE forces you to answer that before the AI writes anything. Who is reading this? What do they need to leave knowing? That's the whole framework.

14 frameworks for every type of work → prompts.data-shane.com

---

## Week 10 (July 29 – Aug 2) — CARE

### Monday — Framework Explainer

CARE is the most outcome-focused prompt framework. Four fields, all tied to results.

**C**ontext — what situation triggered this task
**A**ction — what needs to happen
**R**esult — what success looks like
**E**xample — an optional reference to ground the output

Example — incident response:

Context: Release quality checks failed 2 hours before scheduled deployment
Action: Define rollback steps and stakeholder communication plan
Result: Safe recovery within 15 minutes, with a clear incident message sent before rollback begins
Example: Use this past incident message as a template for tone: [paste example]

The Result field is what separates CARE from simpler frameworks. You tell the AI what done looks like — not just what to do.

CARE free at prompts.data-shane.com

---

### Wednesday — Prompt Example (Ops use case)

Process breakdowns always produce the same two questions: what do we do right now, and who needs to know?

CARE handles both:

Context: Key vendor missed SLA — delivery 48 hours late, affects 3 customer projects
Action: Draft a vendor escalation email and an internal customer communication
Result: Vendor knows consequences of continued delay; customers know timeline and what's being done — no surprise
Example: Match the tone of our standard customer communication: direct, calm, no excuses

Output: two emails ready to send, not a template you need to rewrite under pressure.

Try CARE → prompts.data-shane.com

---

### Friday — Story (Knowing what done looks like)

Most task descriptions say what to do. Few say what success looks like when it's done.

"Write a rollback plan." Done when? Done how complete? Done for which audience?

The Result field in CARE forces that clarity. You define the outcome before the AI writes anything. The output is better — but more importantly, you know when you have what you need.

prompts.data-shane.com — CARE and 13 other frameworks, free.

---

## Week 11 (Aug 5–9) — APE

### Monday — Framework Explainer

APE is the most minimal useful prompt framework. Three fields. 30 seconds.

**A**ction — what to do
**P**urpose — why it matters
**E**xpectation — what a successful output looks like

Example — database migration checklist:

Action: Draft a production database migration checklist
Purpose: Reduce rollout risk and prevent data loss during the cutover
Expectation: A step-by-step checklist a junior engineer can follow independently — safe cutover with zero downtime

That's it. The Purpose field tells the AI why this matters — which changes how it weights tradeoffs. The Expectation field sets a concrete bar for quality.

APE is for well-defined tasks where you know what you want. No role, no tone, no examples needed. Just: do this, for this reason, until this is true.

APE free at prompts.data-shane.com

---

### Wednesday — Prompt Example (Engineering use case)

Not every task needs six fields. Some tasks are clear — they just need to be framed right.

APE for a code review checklist:

Action: Create a code review checklist for a Python backend team
Purpose: Catch security vulnerabilities, logic errors, and performance issues before merge — reduce post-deploy incidents
Expectation: A checklist of 15–20 items, organized by category, that a reviewer can complete in under 10 minutes per PR

Three fields. Specific output. No ambiguity about what you're trying to achieve.

Try APE → prompts.data-shane.com

---

### Friday — Story (Less is enough)

Spent too long assuming that more structure = better output.

Sometimes it does. CRISPE and CO-STAR earn their 6 fields on complex tasks. But for a clear, well-defined request — a checklist, a summary, a template — three fields and specificity beat six fields and vagueness every time.

APE is the framework for when you know what you want. You just need to say it clearly.

14 frameworks — from 3 fields to 6 — all free at prompts.data-shane.com.

---

## Week 12 (Aug 12–16) — ReAct

### Monday — Framework Explainer

ReAct is the only prompt framework built for AI agents. Every other framework produces one output. ReAct produces a loop.

Structure:
Task: what needs to be investigated or solved
Reasoning steps: hypothesize → test → observe → refine
Action format: Action: [step taken]
Observation format: Observation: [result seen]

Example — debugging API failures:

Task: Investigate intermittent 500 errors on the /checkout endpoint
Reasoning: Hypothesize causes, check logs, test each hypothesis, observe results, refine
Action: Check error logs for the past 24 hours
Observation: 73% of errors occur between 14:00–15:00 UTC
Action: Check deployment history for that window
Observation: A config change was deployed at 13:58 UTC on all affected days

ReAct maps directly to LangChain, AutoGPT, and agentic systems. It's designed for AI that uses tools — not AI that just talks.

ReAct free at prompts.data-shane.com

---

### Wednesday — Prompt Example (Engineering use case)

Most debugging prompts ask for the answer. ReAct asks for the process.

ReAct prompt for a memory leak investigation:

Task: Investigate memory leak causing weekly server restarts
Reasoning: Form a hypothesis about the leak source, test each component, observe what changes, refine until root cause is identified
Action format: Action: [specific check or test run]
Observation format: Observation: [what the data showed]
Conclude: Once root cause identified — provide a fix plan with estimated impact

The think-act-observe loop forces the AI to be systematic. Each action is informed by the last observation. Root cause, not just symptoms.

Try ReAct → prompts.data-shane.com

---

### Friday — Story (Agentic AI needs agentic prompts)

Standard prompts produce one answer. That's fine when one answer is all you need.

But when you're debugging a system, researching a market, or planning a multi-step project — one answer isn't the task. The task is a sequence of decisions, each informed by the last.

ReAct was designed for this. Reason before you act. Observe what happened. Reason again.

The same structure that drives LangChain agents works in a plain ChatGPT window — if you prompt for it.

prompts.data-shane.com — ReAct and 13 other frameworks, free.

---

## Week 13 (Aug 19–23) — Structured Output

### Monday — Framework Explainer

When AI output needs to feed into a system — a database, a pipeline, a spreadsheet — prose doesn't work. You need schema.

Structured Output framework:
Task: what data to generate
Output format: JSON, Markdown table, CSV, or another schema
Schema: the exact fields and types
Constraints: what the AI must not do (no extra keys, no null values, no commentary)

Example — release notes generation:

Task: Generate release notes for version 2.4
Output format: JSON
Schema: {"title": "string", "impact": "string", "owner": "string", "deadline": "string"}
Constraints: Valid JSON only. No extra keys. No markdown. No explanatory text outside the JSON block.

Structured Output is the only framework where prose is a failure mode. Every character outside the schema is an error.

Structured Output free at prompts.data-shane.com

---

### Wednesday — Prompt Example (Data pipeline use case)

Extracting structured data from unstructured text used to require custom parsers. With Structured Output prompting, it's a prompt.

Task: Extract all action items from this meeting transcript
Output format: JSON array
Schema: [{"owner": "string", "action": "string", "due_date": "string", "priority": "high|medium|low"}]
Constraints: Only include items with a clear owner. If due date is not stated, use "not specified". Valid JSON only — no surrounding text.

Input: paste meeting transcript
Output: structured JSON your task management system can ingest directly

Try Structured Output → prompts.data-shane.com

---

### Friday — Story (The right format for the right job)

Most prompt engineering content teaches you how to get better writing from AI. Useful, but narrow.

The more valuable question: how do you get AI output that doesn't require a human to process?

Structured Output answers this. You define the schema. The AI fills it. Your system reads it.

No summarizing. No copy-pasting. No reformatting. The output is the input for the next step in your pipeline.

14 frameworks — from creative writing to data pipelines — all free at prompts.data-shane.com.

---

## Week 14 (Aug 26–30) — Auto-CoT

### Monday — Framework Explainer

Auto-CoT is Chain of Thought without the predetermined steps. Instead of telling the AI how to reason, you let it generate its own sub-questions.

Structure:
Task: the complex question or decision to work through
Sub-questions: how many the AI should generate for itself
Final answer format: what the conclusion should look like

Example — hiring decision:

Task: Evaluate whether to hire a senior backend engineer now or wait 3 months
Sub-questions: Generate 4 sub-questions that need to be answered before a good decision can be made. Answer each one.
Final answer format: Decision matrix (hire now / wait / hire junior instead) with a final recommendation and one-paragraph rationale

Auto-CoT is for tasks where you don't know the right reasoning path upfront. The AI surfaces questions you might not have thought to ask.

Auto-CoT free at prompts.data-shane.com

---

### Wednesday — Prompt Example (Strategy use case)

The best strategic decisions come from asking the right questions — not just answering the obvious ones.

Auto-CoT for a market entry decision:

Task: Decide whether to expand Prompt Engine into the Japanese market in Q3
Sub-questions: Generate 5 sub-questions that must be answered before this decision makes sense. Answer each one using available data.
Final answer format: Go / No-go / Defer with a prioritized list of 3 conditions that would change the answer

Output: a decision memo with the reasoning surfaced — not just the conclusion.

Try Auto-CoT → prompts.data-shane.com

---

### Friday — Story (The 14-framework journey)

Fourteen weeks. Fourteen frameworks.

RTCF for speed. CO-STAR for audience. RISEN for processes. CRISPE for expertise. Chain of Thought for reasoning. Few-Shot for patterns. BROKE for strategy. RODES for quality. TRACE for readers. CARE for outcomes. APE for clarity. ReAct for agents. Structured Output for systems. Auto-CoT for decisions.

Each one exists because a different kind of task requires a different kind of structure.

Prompt Engineering isn't one skill. It's knowing which frame fits the problem in front of you.

All 14, free, in one tool: prompts.data-shane.com

---
