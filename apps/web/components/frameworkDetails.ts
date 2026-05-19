export type FrameworkDetail = {
  whatItIs: string;
  whenToUse: string;
  sample: string;
  sampleInputs: Record<string, string>;
};

export const FRAMEWORK_DETAILS: Record<string, FrameworkDetail> = {
  crispe: {
    whatItIs: 'A role and capability-first framework with context and iteration hooks.',
    whenToUse: 'Use when you need controlled expert behavior and iterative improvement.',
    sample: 'You are a senior UX researcher, and your goal is to audit this onboarding flow and propose five high-impact improvements.',
    sampleInputs: {
      capacity: 'Senior UX researcher with strong product analytics skills',
      role: 'a UX researcher',
      insight: 'Drop-off increases on step 2 and mobile users struggle with form length',
      statement: 'Audit the onboarding flow and propose 5 high-impact fixes',
      personality: 'clear, practical, and user-centered',
      experiment: 'suggest quick A/B tests for each fix',
    },
  },
  costar: {
    whatItIs: 'Context-driven framework that aligns objective, style, tone, and audience.',
    whenToUse: 'Use for marketing, communication, and audience-specific writing.',
    sample: 'You are preparing a B2B SaaS launch message, and your objective is to write a concise, confident email for CTOs.',
    sampleInputs: {
      context: 'B2B SaaS product launch for engineering leaders',
      objective: 'write a concise launch email',
      style: 'direct and concise',
      tone: 'confident and professional',
      audience: 'CTOs at mid-size tech companies',
      response: 'short email with subject and body',
    },
  },
  risen: {
    whatItIs: 'Instruction-heavy framework with explicit end-goal and constraints.',
    whenToUse: 'Use when task execution needs strict control and completion criteria.',
    sample: 'You are a project planner, and you should follow a clear step-by-step process to deliver a 30-day execution plan with risks and mitigations.',
    sampleInputs: {
      role: 'a project planner',
      instructions: 'create a 30-day execution plan for a feature launch',
      steps: 'define scope, timeline, owners, dependencies, and risk mitigations',
      endGoal: 'a practical launch-ready project plan',
      narrowing: 'keep it realistic for a 6-person team',
    },
  },
  rtf: {
    whatItIs: 'A fast framework for clear instructions: Role (who the model is), Target (what outcome to achieve), Context (who/where/how much), Format (how to output).',
    whenToUse: 'Use when you want a natural, concise prompt but still need enough context for high-quality output.',
    sample: 'You are a senior data analyst, and your target is to summarize this sales dataset for regional sales managers in Thailand, highlighting key risks and opportunities in about five actionable bullet points.',
    sampleInputs: {
      role: 'a senior data analyst',
      target:
        'summarize the sales dataset and highlight key risks and opportunities',
      context:
        'for regional sales managers in a monthly review, Thailand market focus, about 5 key points, include one action per point',
      format: 'bullet list with: insight, impact, and recommended action',
    },
  },
  cot: {
    whatItIs: 'Reasoning-oriented framework for structured thinking and final outputs.',
    whenToUse: 'Use for complex analysis, planning, and decision tradeoffs.',
    sample: 'Your task is to compare three architecture options, reason through the tradeoffs step by step, and then provide a final recommendation table.',
    sampleInputs: {
      task: 'compare monolith, modular monolith, and microservices for a new product',
      reasoningStyle: 'evaluate complexity, team fit, scaling, and operational risk',
      outputFormat: 'decision table plus final recommendation',
    },
  },
  fewshot: {
    whatItIs: 'Pattern-learning framework using examples as guidance.',
    whenToUse: 'Use when output format or style must closely match references.',
    sample: 'Review these example bug tickets and then write a new ticket using the same structure, level of detail, and tone.',
    sampleInputs: {
      task: 'write a new bug ticket for a checkout timeout issue',
      examples: 'BUG-101: Login fails after password reset... BUG-118: Search returns stale results...',
      outputFormat: 'ticket with title, impact, repro steps, expected, actual, priority',
    },
  },
  ape: {
    whatItIs: 'Action-Purpose-Expectation alignment framework.',
    whenToUse: 'Use when tasks need strong goal alignment and measurable outcomes.',
    sample: 'Draft a migration checklist so the rollout risk is reduced and the expected result is a zero-downtime cutover.',
    sampleInputs: {
      action: 'draft a production database migration checklist',
      purpose: 'reduce rollout risk and prevent data loss',
      expectation: 'safe cutover with zero downtime',
    },
  },
  react: {
    whatItIs: 'Iterative think-act-observe style framework.',
    whenToUse: 'Use for multi-step problem solving and tool-driven tasks.',
    sample: 'Investigate the API failures by logging each action and observation, then conclude with the root cause and a concrete fix plan.',
    sampleInputs: {
      task: 'investigate intermittent API 500 errors',
      reasoningSteps: 'hypothesize, test, observe, and refine',
      actionFormat: 'Action: <step taken>',
      observationFormat: 'Observation: <result seen>',
    },
  },
  broke: {
    whatItIs: 'Business outcome framework linking objectives and key results.',
    whenToUse: 'Use for strategy, execution tracking, and KPI-oriented deliverables.',
    sample: 'Based on this product background and your assigned role, propose Q3 objectives and measurable key results that drive business outcomes.',
    sampleInputs: {
      background: 'Product adoption is strong but retention dropped 12% quarter-over-quarter',
      role: 'a growth strategist',
      objectives: 'improve retention and trial-to-paid conversion',
      keyResults: 'increase 30-day retention to 65%, raise conversion to 18%',
      evolve: 'review metrics weekly and adjust experiments',
    },
  },
  rodes: {
    whatItIs: 'Role-objective framework with details, examples, and self-check.',
    whenToUse: 'Use when quality control and self-validation are important.',
    sample: 'You are a technical writer, and you should draft an API guide with practical examples before performing a final clarity sense check.',
    sampleInputs: {
      role: 'a technical writer',
      objective: 'create a beginner-friendly API quickstart guide',
      details: 'include setup, auth, first request, and error handling',
      examples: 'curl and JavaScript examples',
      senseCheck: 'verify clarity for developers new to APIs',
    },
  },
  trace: {
    whatItIs: 'Audience-aware creation framework with explicit expectation setting.',
    whenToUse: 'Use for content creation targeted to specific reader groups.',
    sample: 'Create a one-page policy summary for non-technical managers so expectations and required actions are immediately clear.',
    sampleInputs: {
      task: 'summarize the new data retention policy',
      role: 'a compliance advisor',
      audience: 'non-technical managers',
      create: 'a one-page policy summary',
      expectation: 'clear actions and responsibilities',
    },
  },
  care: {
    whatItIs: 'Simple context-action-result framework with optional example grounding.',
    whenToUse: 'Use for concise task briefs and operational instructions.',
    sample: 'Because the release is delayed, define rollback actions that ensure safe recovery within fifteen minutes.',
    sampleInputs: {
      context: 'release quality checks failed 2 hours before deployment',
      action: 'define rollback and communication steps',
      result: 'safe recovery within 15 minutes',
      example: 'include a sample incident message template',
    },
  },
  'structured-output': {
    whatItIs: 'Schema-first framework for strict machine-readable responses.',
    whenToUse: 'Use when output must validate against JSON/table schema.',
    sample: 'Generate release notes in strict JSON format using the provided schema with fields for title, impact, owner, and deadline.',
    sampleInputs: {
      task: 'generate release notes for version 2.4',
      outputFormat: 'JSON',
      schema: '{"title":"string","impact":"string","owner":"string","deadline":"string"}',
      constraints: 'valid JSON only, no extra keys',
    },
  },
  'auto-cot': {
    whatItIs: 'Automatic decomposition framework for complex tasks.',
    whenToUse: 'Use when a task benefits from explicit sub-question breakdown.',
    sample: 'Break this hiring decision into four sub-questions, reason through each one, and then return a final decision matrix.',
    sampleInputs: {
      task: 'evaluate whether to hire a senior backend engineer now',
      subQuestions: '4',
      finalAnswerFormat: 'decision matrix plus final recommendation',
    },
  },
};
