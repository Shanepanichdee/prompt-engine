export type FrameworkGuide = {
  pros: string[]
  cons: string[]
  bestFor: string
  avoid: string
}

export const FRAMEWORK_GUIDE: Record<string, FrameworkGuide> = {
  crispe: {
    pros: [
      'Most comprehensive framework — covers every context dimension',
      'Excellent for persona-driven and creative tasks',
      'Personality field produces distinctive, consistent AI voice',
    ],
    cons: [
      'Six fields is heavy for simple tasks',
      'Easy to over-engineer straightforward requests',
    ],
    bestFor: 'Complex content generation, persona-driven writing, creative briefs',
    avoid: 'Quick factual queries or single-step tasks',
  },
  costar: {
    pros: [
      'Strong tone and audience control — ideal for communication work',
      'Style + Tone combination produces polished, consistent copy',
      'Clear objective field keeps AI focused on deliverables',
    ],
    cons: [
      'Weak for technical or analytical tasks',
      'Context and Objective fields often overlap',
    ],
    bestFor: 'Marketing copy, blog posts, communication drafts, audience-targeted content',
    avoid: 'Code generation, data analysis, structured reasoning',
  },
  risen: {
    pros: [
      'Step-by-step structure prevents AI drift on long tasks',
      'Narrowing field eliminates irrelevant output',
      'End Goal keeps every step purposeful',
    ],
    cons: [
      'Requires knowing the process steps upfront',
      'Less useful for exploratory or open-ended tasks',
    ],
    bestFor: 'SOPs, tutorials, process documentation, instructional guides',
    avoid: 'Open-ended research, brainstorming, discovery tasks',
  },
  rtf: {
    pros: [
      'Four focused fields — fast to fill, hard to leave out key info',
      'Context field prevents generic outputs without requiring a full framework',
      'Great default starting point for any structured task',
    ],
    cons: [
      'No tone, audience, or step-by-step control',
      'Less suited for multi-part reasoning or creative nuance',
    ],
    bestFor: 'Everyday business tasks, drafts, and structured deliverables',
    avoid: 'Complex reasoning chains or tasks requiring explicit tone/persona control',
  },
  cot: {
    pros: [
      'Dramatically improves accuracy on reasoning-heavy tasks',
      'Forces AI to show its work — errors are visible and fixable',
      'Proven to reduce mistakes in multi-step logic',
    ],
    cons: [
      'Produces verbose outputs — not suitable for brief responses',
      'Slower and costlier in production AI pipelines',
    ],
    bestFor: 'Math problems, logical deduction, debugging, multi-step analysis',
    avoid: 'Simple factual questions, creative writing, when brevity matters',
  },
  fewshot: {
    pros: [
      'Most reliable output format control — AI learns by example',
      'Teaches formatting, tone, and pattern simultaneously',
      'Works even when instructions alone would be ambiguous',
    ],
    cons: [
      'Requires crafting quality examples before you can use it',
      'Long prompts increase token cost',
    ],
    bestFor: 'Classification, data extraction, consistent formatting, pattern replication',
    avoid: 'Novel tasks with no clear examples, purely open-ended generation',
  },
  ape: {
    pros: [
      'Ultra-concise — forces clarity of intent',
      'Fast to fill, fast to iterate',
      'Expectation field provides built-in success criteria',
    ],
    cons: [
      'Minimal context leads to generic outputs on complex tasks',
      'No role, tone, or step control',
    ],
    bestFor: 'Simple well-defined tasks, quick one-off requests',
    avoid: 'Complex multi-part tasks, when background context matters',
  },
  react: {
    pros: [
      'Best framework for agentic AI — built for tool use and multi-step reasoning',
      'Observation loop enables error correction mid-task',
      'Maps directly to LangChain, AutoGPT, and similar agentic systems',
    ],
    cons: [
      'Complex to set up — requires understanding agentic AI concepts',
      'Overkill for standard content or analysis tasks',
    ],
    bestFor: 'AI agents, tool-using systems, autonomous task completion, code execution loops',
    avoid: 'Simple Q&A, content generation, anything without tool use',
  },
  broke: {
    pros: [
      'OKR-style structure brings business clarity to AI tasks',
      'Key Results field forces measurable outcomes',
      'Evolve field enables iterative refinement within one prompt',
    ],
    cons: [
      'Business jargon can confuse AI on non-business tasks',
      'Overkill for anything outside strategy or planning',
    ],
    bestFor: 'Business strategy, project planning, goal-setting, OKR workshops',
    avoid: 'Technical tasks, creative work, casual or personal queries',
  },
  rodes: {
    pros: [
      'Built-in quality control via Sense Check — rare among frameworks',
      'Examples field strengthens output consistency',
      'Details field allows nuanced constraint specification',
    ],
    cons: [
      'Sense Check is a novel concept that AI may not always leverage effectively',
      'Five fields is heavyweight for simple tasks',
    ],
    bestFor: 'High-stakes outputs, detailed analysis, tasks where accuracy is critical',
    avoid: 'Quick low-stakes content, simple formatting tasks',
  },
  trace: {
    pros: [
      'Audience-first design produces highly targeted communication',
      'Create field separates deliverable type from content instructions',
      'Good for educational and instructional content',
    ],
    cons: [
      'Overlaps with CO-STAR in many areas',
      'Less differentiated — CO-STAR or CRISPE often outperform it',
    ],
    bestFor: 'Audience-specific content, educational material, targeted messaging',
    avoid: 'Internal technical documentation, tasks without a clear end audience',
  },
  care: {
    pros: [
      'Result-driven framing keeps AI focused on outcomes not just actions',
      'Example field reinforces expected output format',
      'Concise — four fields covers most task dimensions',
    ],
    cons: [
      'Limited persona definition compared to CRISPE or RISEN',
      'Context field alone may not be enough for complex backgrounds',
    ],
    bestFor: 'Outcome-focused business writing, task-specific requests, professional emails',
    avoid: 'Complex multi-step processes, deep persona tasks',
  },
  'structured-output': {
    pros: [
      'Best framework for forcing specific data formats and schemas',
      'Essential for API integrations and data pipelines',
      'Constraints field prevents hallucinated fields',
    ],
    cons: [
      'Purely functional — no style, persona, or tone control',
      'Rigid structure makes it unsuitable for narrative content',
    ],
    bestFor: 'JSON extraction, data pipelines, structured data generation, API response formatting',
    avoid: 'Creative writing, conversational tasks, any output needing prose',
  },
  'auto-cot': {
    pros: [
      'Self-directed reasoning — AI generates its own sub-questions',
      'Reduces prompt engineering effort for exploratory tasks',
      'Good for tasks where you do not know the reasoning path',
    ],
    cons: [
      'Less control over reasoning direction — AI may go off-course',
      'May generate irrelevant sub-questions without careful task framing',
    ],
    bestFor: 'Research tasks, exploratory analysis, open-ended problem solving',
    avoid: 'Precise step-by-step processes where you need to control the reasoning flow',
  },
}
