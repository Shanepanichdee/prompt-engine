# Marketing Launch Plan — Prompt Engine

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the bootstrap organic marketing launch of Prompt Engine targeting business professionals in English and Thai markets.

**Architecture:** Three sequential phases — Pre-launch prep (content assets + Explore seeding) → Launch day spike (Product Hunt + communities) → Ongoing cadence (LinkedIn 3x/week + SEO blog). Each task produces a concrete deliverable: written copy, published prompt, or live post.

**Tech Stack:** prompts.data-shane.com (live), LinkedIn, Product Hunt, Reddit, Thai Facebook groups, Hashnode (blog).

---

## Task 1: Write the 5 Core Business Prompt Examples

These are the foundational content assets used in every channel — PH maker comment, LinkedIn posts, community posts.

**Files:**
- Create: `docs/marketing/prompt-examples.md`

- [ ] **Step 1: Create the file**

```bash
mkdir -p docs/marketing
touch docs/marketing/prompt-examples.md
```

- [ ] **Step 2: Write the 5 examples**

Paste this exact content into `docs/marketing/prompt-examples.md`:

````markdown
# Core Business Prompt Examples

## 1. HR — Job Description (CO-STAR)

**Bad prompt:** "Write a job description for a senior developer."

**CO-STAR structured prompt:**
- Context: Fast-growing B2B SaaS startup, 40-person engineering team, remote-first
- Objective: Write a compelling job description for a Senior Backend Engineer
- Style: Professional but human — we want candidates to feel excited, not intimidated
- Tone: Direct, inclusive, encouraging
- Audience: Experienced engineers with 5+ years, likely browsing multiple listings
- Response: 400 words max. Open with why this role matters. Bullet responsibilities and requirements separately.

**Why it works:** The AI knows the company culture, the audience mindset, and exactly how to format the output.

---

## 2. Sales — Cold Outreach Email (RISEN)

**Bad prompt:** "Write a cold email to a potential customer."

**RISEN structured prompt:**
- Role: Senior B2B sales consultant who specializes in SaaS outreach
- Instructions: Write a cold outreach email to a VP of Operations at a mid-size logistics company
- Steps: 1) Open with a specific pain point they likely face, 2) One sentence on what we do, 3) One concrete result a similar customer got, 4) Soft CTA asking for 15 minutes
- End Goal: Email that feels personal, not templated — gets a reply, not an unsubscribe
- Narrowing: Under 120 words. No buzzwords like "synergy" or "leverage." No attachments mentioned.

---

## 3. Analyst — Executive Summary (CO-STAR)

**Bad prompt:** "Summarize this report for executives."

**CO-STAR structured prompt:**
- Context: Q3 financial performance report, mixed results — revenue up 12%, margins down 3%
- Objective: Write an executive summary that presents results honestly without causing alarm
- Style: Confident, data-driven, brief
- Tone: Calm and measured — leadership reads this before the board meeting
- Audience: C-suite with limited time, high financial literacy, expect conclusions first
- Response: 200 words. Lead with the headline number. Explain variance in 2 sentences. End with one forward-looking statement.

---

## 4. Operations — SOP Document (RISEN)

**Bad prompt:** "Write an SOP for our onboarding process."

**RISEN structured prompt:**
- Role: Operations manager with experience writing ISO-compliant procedures
- Instructions: Write a Standard Operating Procedure for onboarding a new remote employee
- Steps: 1) Pre-start checklist (IT setup, accounts), 2) Day 1 schedule, 3) Week 1 goals, 4) 30-day check-in template
- End Goal: A new HR manager can follow this without needing to ask anyone a question
- Narrowing: Use numbered lists throughout. Include a "responsible party" column for each action. Keep under 600 words.

---

## 5. Consultant — Client Brief (RTF)

**Bad prompt:** "Help me write a project brief."

**RTF structured prompt:**
- Role: Senior management consultant at a top-tier firm
- Task: Write a project brief for a 6-week digital transformation audit for a regional bank
- Format: Four sections — Project Scope, Deliverables, Timeline (week-by-week), Success Metrics. Use headers. Max 500 words.
````

- [ ] **Step 3: Review each example**

Check each example has: a bad prompt, a structured prompt with all fields filled, a "why it works" note or clear output instruction. No "TBD" anywhere.

- [ ] **Step 4: Commit**

```bash
git add docs/marketing/prompt-examples.md
git commit -m "docs(marketing): add 5 core business prompt examples"
```

---

## Task 2: Prepare Product Hunt Assets

**Files:**
- Create: `docs/marketing/product-hunt.md`

- [ ] **Step 1: Create the file**

```bash
touch docs/marketing/product-hunt.md
```

- [ ] **Step 2: Write all PH copy**

Paste into `docs/marketing/product-hunt.md`:

````markdown
# Product Hunt Launch Assets

## Submission Details

**Product name:** Prompt Engine

**Tagline (60 chars max):**
Structure your AI prompts with 14 proven frameworks

**Description (260 chars max):**
Prompt Engine gives business professionals a guided form for writing structured AI prompts. Choose from 14 frameworks (CO-STAR, RISEN, RTF), fill in the blanks, get copy-ready output in 10 languages. Free to start.

**Website:** https://prompts.data-shane.com

**Launch day:** Pick Tuesday or Wednesday. Avoid Monday and Friday.

---

## Maker's First Comment (post within 5 minutes of going live)

Hey Product Hunt! 👋 I'm Shane, the maker.

I noticed a pattern: most people write AI prompts like they Google — one vague sentence. Then wonder why the output is generic.

Prompt engineers use frameworks like CO-STAR and RISEN to structure their requests. These exist in research papers — but no tool puts them in a simple form anyone can fill out.

That's Prompt Engine. Pick a framework, fill in the fields (role, context, objective, format), get a structured prompt ready to paste into Claude or ChatGPT.

**What's free:** All 14 frameworks, 5 generates/day, 10 languages.
**What's Pro ($5/month):** Unlimited saves, history, compare frameworks side by side.
**Day Pass ($1.99):** Full Pro for 24h — perfect for a one-time project.

Built solo over 3 months. Happy to answer anything about the build or the prompt engineering frameworks. 🙏

---

## Screenshots to prepare (760×540px each)

1. Homepage — light mode, CO-STAR framework selected with fields filled
2. Generated output panel — showing a real business prompt output
3. Framework picker — showing the grid of all 14 frameworks
4. Dark mode — same as #1 but dark
5. Explore page — showing seeded community prompts

## Thumbnail (240×240px)

- Teal (#008080) background
- White "PE" initials, large
- Tagline below: "Prompt Engineering Platform"

---

## Launch Day Timeline

- 00:01 PST — Go live on Product Hunt
- 00:05 — Post maker comment (copy from above)
- 00:10 — Post on LinkedIn: "We're live on Product Hunt today — [link]"
- 00:15 — Message personal network asking for upvotes (10–15 people max, genuine ask)
- All day — Reply to every PH comment within 1 hour
- Evening — Post "thank you" update in comments with day's stats
````

- [ ] **Step 3: Review**

Confirm tagline is under 60 characters (count: 51 ✓). Confirm description is under 260 characters. Confirm maker comment is personal and not salesy.

- [ ] **Step 4: Commit**

```bash
git add docs/marketing/product-hunt.md
git commit -m "docs(marketing): add Product Hunt launch assets and copy"
```

---

## Task 3: Update LinkedIn Profile

- [ ] **Step 1: Open LinkedIn profile → Edit**

Go to linkedin.com → your profile → Edit intro.

- [ ] **Step 2: Update headline**

```
Builder @ datashane.com · Prompt Engine — AI prompt frameworks for business professionals
```

- [ ] **Step 3: Update About section**

```
I build tools that make AI actually useful for non-technical professionals.

Currently: Prompt Engine (prompts.data-shane.com) — a guided prompt builder with 14 frameworks (CO-STAR, RISEN, RTF, Chain of Thought) and 10 languages. Built for HR managers, sales reps, analysts, and consultants who want structured AI output without learning prompt engineering from scratch.

Previously: QR Code Engine (qr-engine.data-shane.com) — custom QR codes for business.

Studio: datashane.com
```

- [ ] **Step 4: Update Featured section**

Add prompts.data-shane.com as a featured link with description: "Prompt Engine — Structure your AI prompts with proven frameworks. Free."

- [ ] **Step 5: Prepare banner image**

Create a LinkedIn banner (1584×396px):
- Background: `#EEF7F7` (brand teal tint)
- Left: "Prompt Engine" in bold `#002A2A`, tagline in `#4A7575`
- Right: URL `prompts.data-shane.com` in `#008080`
- Tool: Canva (free) — use the LinkedIn Banner template

- [ ] **Step 6: Verify**

View your profile as a visitor. Confirm headline, about, featured link, and banner all show correctly.

---

## Task 4: Seed 20 Explore Prompts

The Explore page is the viral loop. Seed it before launch so it looks alive.

**How to publish a prompt to Explore:**
1. Go to prompts.data-shane.com → sign in as your Pro account
2. Select a framework, fill in the inputs below, click Generate
3. Add a title, click Save
4. Go to History → find the prompt → click "Make public"

- [ ] **Step 1: Publish these 20 prompts one by one**

| # | Title | Framework | Key inputs to fill |
|---|-------|-----------|-------------------|
| 1 | Senior Backend Engineer — Job Description | CO-STAR | Context: B2B SaaS startup remote-first / Objective: write JD for senior backend engineer / Style: professional but human / Tone: encouraging / Audience: experienced engineers 5+ years / Response: 400 words bullet format |
| 2 | Behavioral Interview Questions — Culture Fit | RISEN | Role: experienced HR interviewer / Instructions: create 10 behavioral interview questions / Steps: focus on past behavior, use STAR format, probe collaboration / End Goal: reveal culture fit and problem-solving style / Narrowing: no trick questions, inclusive language |
| 3 | 30-Day Onboarding Plan — New Remote Employee | RTF | Role: HR operations manager / Task: create 30-day onboarding checklist for new remote software engineer / Format: numbered list, group by week, include responsible party for each item |
| 4 | Performance Review — Software Engineer Q4 | CO-STAR | Context: Q4 review cycle software team / Objective: write balanced performance review / Style: professional specific / Tone: encouraging but honest / Audience: direct report and HR system / Response: 300 words, 2 strengths 1 growth area |
| 5 | Cold Outreach Email — VP Operations Logistics | RISEN | Role: B2B SaaS sales consultant / Instructions: write cold outreach to VP Operations logistics company / Steps: open with pain point, one sentence what we do, one customer result, soft CTA 15 minutes / End Goal: reply not unsubscribe / Narrowing: under 120 words no buzzwords |
| 6 | Sales Follow-Up Sequence — 3 Emails | CRISPE | Capacity: senior sales trainer / Role: B2B account executive / Insight: prospect showed interest but went quiet after demo / Statement: write 3-email follow-up sequence spaced 3 days apart / Personality: persistent but not pushy / Experiment: vary each email angle — value / social proof / urgency |
| 7 | Objection Handling — "Too Expensive" | Chain of Thought | Reasoning style: step by step / Task: respond to a prospect who says our SaaS is too expensive / Context: mid-market B2B, $500/month product, competitor charges $300 / Steps: acknowledge the objection, quantify the value gap, offer a risk-reduction option |
| 8 | Executive Summary — Q3 Financial Results | CO-STAR | Context: Q3 report revenue up 12% margins down 3% / Objective: executive summary that presents honestly without alarm / Style: confident data-driven / Tone: calm measured / Audience: C-suite before board meeting / Response: 200 words lead with headline number |
| 9 | Data Interpretation — Monthly Metrics Report | Chain of Thought | Task: interpret monthly SaaS metrics report / Context: MRR $45k, churn 3.2%, NPS 42, CAC $180 / Steps: identify what's healthy, what needs attention, what to prioritize / Reasoning: think through each metric before concluding |
| 10 | Competitive Analysis Framework | CRISPE | Capacity: senior strategy consultant / Role: analyst at a mid-size tech company / Insight: need to evaluate 3 competitors before pricing decision / Statement: structure a competitive analysis for a B2B project management tool / Personality: rigorous evidence-based / Experiment: include a scoring rubric |
| 11 | Remote Employee SOP — Onboarding | RISEN | Role: operations manager experienced with ISO procedures / Instructions: write SOP for onboarding new remote employee / Steps: pre-start IT checklist, day 1 schedule, week 1 goals, 30-day check-in template / End Goal: new HR manager can follow without asking anyone / Narrowing: numbered lists, responsible party column, under 600 words |
| 12 | Weekly Team Meeting Agenda | RTF | Role: team lead 6-person cross-functional team / Task: create weekly 45-minute team meeting agenda / Format: time-boxed sections — updates (10min), blockers (15min), priorities (15min), wrap-up (5min) |
| 13 | Project Brief — Digital Transformation Audit | RTF | Role: senior management consultant / Task: write project brief for 6-week digital transformation audit for regional bank / Format: four sections — Scope, Deliverables, Timeline week-by-week, Success Metrics. Max 500 words |
| 14 | Client Proposal — Marketing Agency | CO-STAR | Context: boutique marketing agency pitching 6-month brand strategy / Objective: write proposal that wins the project / Style: polished strategic / Tone: confident collaborative / Audience: CMO and CFO joint decision / Response: 5 sections with budget table |
| 15 | Blog Post Outline — Thought Leadership | CRISPE | Capacity: content strategist B2B SaaS / Role: company blog writer / Insight: audience is HR professionals exploring AI tools / Statement: outline a 1500-word thought leadership article on AI in HR / Personality: authoritative practical / Experiment: include a contrarian angle in section 3 |
| 16 | Customer Case Study Structure | RISEN | Role: B2B content marketer / Instructions: write customer case study structure for SaaS company / Steps: challenge → solution → implementation → results → quote / End Goal: case study sales can use in deals / Narrowing: 600 words, include 3 specific metrics, end with CTA |
| 17 | Product Launch Announcement Email | CRISPE | Capacity: email marketing specialist / Role: product marketer / Insight: launching new feature to existing customers who are power users / Statement: write launch announcement email / Personality: excited but not hypey / Experiment: lead with customer benefit not feature name |
| 18 | Few-Shot Social Media Posts — LinkedIn | Few-Shot | Examples: [Example 1: educational tip post] [Example 2: behind-the-scenes post] [Example 3: results post] / Task: write 3 LinkedIn posts for a B2B SaaS founder announcing a product milestone |
| 19 | Investor Update Email | CO-STAR | Context: early-stage startup, 6 months post-seed, hitting 70% of revenue target / Objective: write monthly investor update / Style: transparent direct / Tone: confident about plan despite miss / Audience: seed investors who want honesty / Response: 300 words — metrics, highlight, lowlight, ask |
| 20 | Annual Performance Review Self-Assessment | RISEN | Role: career coach helping professionals present themselves / Instructions: write self-assessment for annual review / Steps: achievements with metrics, skills developed, collaboration examples, goals for next year / End Goal: manager sees clear evidence of growth / Narrowing: 400 words, first-person, no self-deprecation |

- [ ] **Step 2: Verify Explore page shows all 20**

Go to prompts.data-shane.com/explore — confirm 20 prompts are visible and each has a good title.

- [ ] **Step 3: Copy 3 share URLs for use in community posts**

Pick the best HR prompt, best Sales prompt, best Analyst prompt. Copy their share URLs (`/p/[slug]`). Save to `docs/marketing/prompt-examples.md` under a "Share URLs" section.

---

## Task 5: Prepare Community Post Templates

**Files:**
- Create: `docs/marketing/community-posts.md`

- [ ] **Step 1: Create the file**

```bash
touch docs/marketing/community-posts.md
```

- [ ] **Step 2: Write all community post copy**

Paste into `docs/marketing/community-posts.md`:

````markdown
# Community Post Templates

## Reddit — r/ChatGPT (launch week)

**Title:** I mapped out 14 prompt engineering frameworks into a free tool — here's the CO-STAR one for work tasks

**Body:**
Most people write prompts like: "Write me a job description."

Prompt engineers use CO-STAR:
- **C**ontext: what situation are you in
- **O**bjective: what do you want the AI to do
- **S**tyle: writing style to use
- **T**one: emotional register
- **A**udience: who will read this
- **R**esponse: format and length

Here's that job description prompt rewritten with CO-STAR:

> Context: Fast-growing B2B SaaS startup, 40-person engineering team, remote-first
> Objective: Write a compelling job description for a Senior Backend Engineer
> Style: Professional but human
> Tone: Direct, inclusive, encouraging
> Audience: Experienced engineers with 5+ years
> Response: 400 words, bullet responsibilities and requirements separately

The output is actually usable. Not boilerplate.

I built a tool that has 14 frameworks like this in a fill-in-the-blank form: prompts.data-shane.com — free to use.

---

## Reddit — r/productivity (week 2)

**Title:** The reason your AI output is generic (and the framework that fixes it)

**Body:**
Your AI prompt is vague because you haven't told it four things:
1. Who it should be (role)
2. What you want (task)
3. How to respond (format)
4. Who's reading it (audience)

RTF is the simplest framework:
- **R**ole: Act as a senior B2B sales consultant
- **T**ask: Write a cold outreach email to a VP of Operations at a logistics company. Open with a supply chain pain point. Include one customer result. End with a 15-minute CTA.
- **F**ormat: Under 120 words. No buzzwords.

That's it. Three fields. Output goes from "here is a cold email..." to something you can actually send.

I built prompts.data-shane.com with 14 frameworks in a guided form. Free to try.

---

## Reddit — r/artificial (week 3)

**Title:** 14 prompt engineering frameworks in one place — comparison and when to use each

**Body:**
Quick reference I put together (also built into a tool):

| Framework | Best for | Key structure |
|-----------|----------|---------------|
| RTF | Quick tasks | Role, Task, Format |
| CO-STAR | Complex output | Context, Objective, Style, Tone, Audience, Response |
| RISEN | Instructions | Role, Instructions, Steps, End Goal, Narrowing |
| CRISPE | Deep expertise | Capacity, Role, Insight, Statement, Personality, Experiment |
| Chain of Thought | Reasoning | Step-by-step reasoning scaffold |
| Few-Shot | Pattern matching | Examples → task |
| ReAct | Agentic tasks | Reason → Act cycles |

For business tasks: RTF for speed, CO-STAR for quality, RISEN for anything with steps.

Tool with all 14 in a guided form: prompts.data-shane.com

---

## Thai Facebook Group Post (launch week)

**Thai AI / AI Thailand groups:**

เคยเขียน prompt แบบนี้ไหม? "ช่วยเขียน email ให้หน่อย"

แล้วก็ได้ผลลัพธ์ที่ generic มาก?

ลองใช้ RTF Framework ดูครับ:
- **R**ole: คุณคือ sales consultant ระดับ senior ที่เชี่ยวชาญ B2B
- **T**ask: เขียน cold email ถึง VP Operations ของบริษัท logistics เปิดด้วย pain point เรื่อง supply chain, ใส่ผลลัพธ์ที่ลูกค้ารายหนึ่งได้รับ, จบด้วย CTA ขอนัด 15 นาที
- **F**ormat: ไม่เกิน 120 คำ, ไม่ใช้ศัพท์เท่ๆ ที่ฟังดู corporate เกินไป

ผมสร้าง tool ที่รวม framework สำหรับ prompt engineering ไว้ 14 แบบ ใช้ฟรีที่ prompts.data-shane.com รองรับภาษาไทยด้วยครับ

---

## Thai LinkedIn Post (week 1)

คนส่วนใหญ่เขียน prompt AI แบบนี้: "สรุปรายงานให้หน่อย"

แล้วก็ได้ผลแบบนี้: สรุปที่ไม่ได้ใช้จริง

ลอง CO-STAR framework ดูครับ:
- Context: รายงาน Q3 รายได้เพิ่ม 12% margin ลด 3%
- Objective: เขียน executive summary ที่ honest แต่ไม่ทำให้ตกใจ
- Style: กระชับ มีข้อมูลสนับสนุน
- Tone: สุขุม ไม่ตื่นตระหนก
- Audience: C-suite อ่านก่อนประชุม board
- Response: 200 คำ เริ่มด้วยตัวเลขหลัก

ผมสร้าง tool ที่ช่วยให้คุณกรอก framework แบบนี้แล้ว copy ไปใช้ได้เลย
ใช้ฟรีที่ prompts.data-shane.com — รองรับภาษาไทย

---

## LinkedIn — Post 1 (Before/After prompt example)

Most people write AI prompts like they Google: one vague sentence.

"Write me a performance review."

Here's the same request using CO-STAR — a framework used by professional prompt engineers:

**Context:** Q4 review cycle, software engineering team
**Objective:** Write a constructive performance review
**Style:** Professional, specific, balanced
**Tone:** Encouraging but honest
**Audience:** Direct report + HR system
**Response:** 300 words, 2 strengths and 1 growth area

The structured version gives you a review you can actually send.

14 frameworks like this, fill-in-the-blank, free: prompts.data-shane.com

---

## LinkedIn — Post 2 (Framework explainer — RISEN)

RISEN is my go-to framework when I need AI to follow exact steps.

**R**ole → **I**nstructions → **S**teps → **E**nd Goal → **N**arrowing

Example for a sales manager:

Role: Senior sales coach, 10 years B2B
Instructions: Review this cold email draft and rewrite it
Steps: 1) Fix the weak opening 2) Strengthen the value prop 3) Rewrite the CTA
End Goal: Email that gets a >15% reply rate
Narrowing: Under 150 words. No buzzwords.

Paste that into ChatGPT. Compare to "improve my sales email."

Framework prompts win. Every time.

Try RISEN free → prompts.data-shane.com

---

## LinkedIn — Post 3 (Build story / PH launch day)

I spent 3 months building a tool most people would build in a weekend.

Not because I'm slow. Because I wanted it right for non-technical users.

Prompt Engine started as my own frustration: I kept writing the same structured prompts by hand. CO-STAR for briefs. RISEN for instructions. RTF for quick tasks.

So I built a form that does the structure for you. You fill in the concepts. It builds the framework.

14 frameworks. 10 languages. Free tier. Pro at $5/month.

Live on Product Hunt today 👇
[Product Hunt link]

Would love your support — and happy to hear what framework you'd want added.
````

- [ ] **Step 3: Review all posts**

Check: no post starts with "I" (LinkedIn algo penalty). No post is just a link. Every post leads with value. All Thai posts are natural Thai, not translated English.

Fix the LinkedIn posts — Post 1, 2, 3 all start with words other than "I" ✓

- [ ] **Step 4: Commit**

```bash
git add docs/marketing/community-posts.md
git commit -m "docs(marketing): add community post templates EN + TH"
```

---

## Task 6: Launch Day Execution

- [ ] **Step 1: Go live on Product Hunt**

Go to producthunt.com → Submit → fill in fields from `docs/marketing/product-hunt.md`.
Set hunt date to your chosen Tuesday or Wednesday.

- [ ] **Step 2: Post maker comment within 5 minutes of going live**

Copy the maker comment from `docs/marketing/product-hunt.md` and post as your first comment.

- [ ] **Step 3: Post LinkedIn launch post**

Use LinkedIn Post 3 from `docs/marketing/community-posts.md`. Add the live Product Hunt URL at the bottom.

- [ ] **Step 4: Send personal upvote requests**

Message 10–15 people in your personal network directly (not group blast). Exact message:

```
Hey [Name] — I launched Prompt Engine on Product Hunt today.
It's a tool for writing structured AI prompts using proven frameworks — built for people who use ChatGPT at work.
Would really appreciate an upvote if you get a chance: [PH link]
Takes 30 seconds. Thanks 🙏
```

- [ ] **Step 5: Post Thai Facebook group post**

Copy the Thai Facebook post from `docs/marketing/community-posts.md`. Post to: AI Thailand, กลุ่ม AI ไทย, and any Thai startup groups you're in.

- [ ] **Step 6: Monitor and reply**

Check Product Hunt every 30–60 minutes. Reply to every comment within 1 hour. Be specific in replies — reference what the commenter said, don't copy-paste the same response.

- [ ] **Step 7: Post evening update**

At 6pm on launch day, add a comment on your PH page:

```
End of day update: [X] upvotes, [Y] comments, [Z] signups. 
Favorite question today: [pick one interesting comment].
Thanks everyone — genuinely surprised by [something specific that happened].
```

---

## Task 7: Week 2–4 Reddit Cadence

Post one substantive comment or post per subreddit per week. Never post the same text twice.

- [ ] **Week 2 — r/ChatGPT**

Post the r/ChatGPT post from `docs/marketing/community-posts.md`. Title and body are written. Post as-is or lightly adapt to a trending thread in the sub.

- [ ] **Week 2 — r/productivity**

Post the r/productivity post from `docs/marketing/community-posts.md`.

- [ ] **Week 3 — r/artificial**

Post the r/artificial framework comparison table from `docs/marketing/community-posts.md`.

- [ ] **Week 4 — Find a thread to comment in**

Search each sub for "prompt engineering" or "chatgpt tips" in the past week. Reply genuinely to a top thread with one of the framework explanations. Include the tool link only at the very end.

---

## Task 8: LinkedIn Weekly Cadence (Weeks 2–14)

Post 3x/week. Rotate: Monday = framework explainer, Wednesday = prompt example, Friday = story/insight.

- [ ] **Week 2: Post framework explainer — RTF**

```
RTF is the fastest prompt framework. Three fields. 60 seconds to fill.

Role: Who the AI should be
Task: Exactly what to do (be specific)
Format: How to structure the output

Example — instead of "write a meeting agenda":

Role: Chief of Staff for a 6-person cross-functional team
Task: Create the agenda for our weekly 45-minute team meeting. Include time allocations. Start with the most important blocker.
Format: Time-boxed sections. Header for each. Total time must equal 45 minutes.

That's it. Output goes from a generic list to something you can paste into the calendar invite.

RTF is free at prompts.data-shane.com — 13 other frameworks too.
```

- [ ] **Week 2: Post prompt example — analyst use case**

Use the Executive Summary example from `docs/marketing/prompt-examples.md`. Format as before/after.

- [ ] **Week 2: Post story — why 10 languages**

```
Prompt Engine supports 10 languages. Not because it was easy — it was the hardest part of the build.

The challenge: "Act as a senior consultant" in English has a specific professional register. In Thai, Japanese, and Arabic — that register is completely different.

I didn't just translate the words. I had to translate the tone, the connector phrases, the way instructions flow.

Thai prompt: "คุณคือที่ปรึกษาอาวุโส..." (you are a senior consultant...)
Japanese: "あなたは経験豊富なコンサルタントとして..." (as an experienced consultant...)

Each locale tells the AI to respond in that language at the end. So your entire prompt — framework, instructions, language instruction — is native.

Built this for markets that most AI tools treat as afterthoughts.

prompts.data-shane.com — try it in your language.
```

- [ ] **Weeks 3–14: Continue framework series**

Each week, pick the next framework. Write one explainer post following the same pattern as Week 2. Frameworks to cover in order: CO-STAR → CRISPE → Chain of Thought → Few-Shot → BROKE → RODES → TRACE → CARE → APE → ReAct → Structured Output → Auto-CoT.

---

## Task 9: Blog Setup on Hashnode

Hashnode gives free custom subdomain, good SEO, zero infrastructure cost.

- [ ] **Step 1: Create Hashnode account**

Go to hashnode.com → Sign up with GitHub or Google → Create a new blog.

- [ ] **Step 2: Set publication name and handle**

```
Publication name: Prompt Engine Blog
Handle: prompt-engine (or prompt-engine-blog if taken)
```

- [ ] **Step 3: Configure custom domain (optional but recommended)**

In Hashnode settings → Domains → add `blog.prompts.data-shane.com`.
In Cloudflare DNS → add CNAME: `blog` → `hashnode.network`.

- [ ] **Step 4: Write and publish first English blog post**

Title: `ChatGPT Prompts for HR Managers: 5 Frameworks That Actually Work`

Outline:
```
## Introduction
Most HR managers use AI like a search engine. Here's why that produces generic output.

## Why Structured Prompts Work
Brief explanation of prompt frameworks — no jargon.

## Framework 1: CO-STAR — For Job Descriptions
[Use the HR example from docs/marketing/prompt-examples.md]
When to use it, what the output looks like.

## Framework 2: RISEN — For Interview Questions
Full example with inputs and output snippet.

## Framework 3: RTF — For Quick Tasks (onboarding checklists, policy drafts)
Quick example.

## Framework 4: CRISPE — For Complex HR Policy Documents
Example with all 6 fields filled for an HR use case.

## Framework 5: Chain of Thought — For Difficult Conversations
Example: structuring a termination conversation script.

## Try These Frameworks Free
CTA → prompts.data-shane.com with link to specific framework pages.
```

Target length: 1,200–1,500 words. Include the word "ChatGPT prompts for HR" in the H1, first paragraph, and one subheading.

- [ ] **Step 5: Commit blog setup notes**

```bash
touch docs/marketing/blog-setup.md
# Add the Hashnode URL and custom domain once configured
git add docs/marketing/blog-setup.md
git commit -m "docs(marketing): add blog setup notes"
```

---

## Task 10: First Thai Blog Post

- [ ] **Step 1: Write and publish on Hashnode**

Title: `วิธีเขียน Prompt ChatGPT ที่ได้ผลจริงสำหรับงานออฟฟิศ`

Outline:
```
## ทำไม Prompt ทั่วไปถึงได้ผลลัพธ์ที่ generic?
อธิบายปัญหาของ prompt แบบสั้นๆ ทั่วไป

## Framework คืออะไร?
อธิบาย concept ของ prompt framework ง่ายๆ

## RTF — Framework ที่ง่ายที่สุด
[ตัวอย่างจาก docs/marketing/prompt-examples.md แปลเป็นภาษาไทย]

## CO-STAR — สำหรับงานที่ต้องการ output คุณภาพสูง
ตัวอย่าง: การเขียน executive summary

## RISEN — สำหรับงานที่มีหลายขั้นตอน
ตัวอย่าง: การเขียน SOP

## ทดลองใช้ฟรี
CTA → prompts.data-shane.com — รองรับภาษาไทย
```

Target length: 800–1,000 words. Natural Thai — not translated English.

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Phase 1 Launch Spike → Tasks 1, 2, 3, 4, 5, 6
- ✅ Phase 2 Content Engine → Tasks 7, 8, 9, 10
- ✅ Phase 3 Viral Loop → Task 4 (Explore seeding) + community posts include share links
- ✅ English + Thai → Both languages covered in community posts (Task 5) and blog (Tasks 9, 10)
- ✅ LinkedIn cadence → Task 8 with actual post copy for weeks 2–14
- ✅ Product Hunt → Task 2 with all copy and timeline
- ✅ Explore seeding → Task 4 with all 20 prompts specified

**No placeholders:** All post copy is written. All prompt inputs are specified. No TBDs.
