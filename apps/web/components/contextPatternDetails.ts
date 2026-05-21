export type ContextPatternDetail = {
  whatItIs: string;
  whenToUse: string;
  sample: string;
  sampleInputs: Record<string, string>;
};

export const CONTEXT_PATTERN_DETAILS: Record<string, ContextPatternDetail> = {
  'system-prompt': {
    whatItIs: "The foundational layer of any AI system — defines the model's role, task, rules, and output format.",
    whenToUse: 'Every AI product. Start here before adding any other context layer.',
    sample: 'You are a senior customer support agent. Your task is to resolve billing questions clearly and empathetically.',
    sampleInputs: {
      role: 'a senior customer support agent',
      task: 'resolve billing questions clearly and empathetically',
      constraints: 'Never discuss competitor products. Always offer a refund on the first request if the customer asks.',
      output_format: 'Short paragraph acknowledging the issue, then a numbered action list',
      tone: 'empathetic and professional',
    },
  },
  rag: {
    whatItIs: "Injects retrieved documents into the context window so the model answers from current, specific knowledge rather than training data.",
    whenToUse: 'When answers must come from a specific corpus — docs, knowledge base, contracts, product data.',
    sample: 'You are a legal assistant. Using only the retrieved contract clauses, summarize the termination conditions.',
    sampleInputs: {
      role: 'a legal assistant',
      source: 'a repository of contract clauses retrieved by semantic search',
      task: 'summarize the termination conditions using only the retrieved clauses',
      citation_style: 'Cite each clause as [Clause X.X]',
      output_format: 'Bullet list of conditions, then a one-paragraph plain-English summary',
    },
  },
  memory: {
    whatItIs: 'Manages conversation history in the context window — keeping recent turns verbatim and compressing older ones to stay within token limits.',
    whenToUse: 'Multi-turn chatbots and assistants that need to remember earlier parts of a long conversation.',
    sample: 'You are a personal finance advisor. Maintain the last 8 turns of conversation. Summarize older turns as a brief budget snapshot.',
    sampleInputs: {
      role: 'a personal finance advisor',
      memory_format: 'Human: <message>\nAssistant: <response>',
      window_size: '8',
      summary_rule: 'Summarize older turns as a one-sentence budget snapshot focusing on goals and constraints mentioned',
    },
  },
  'few-shot-dynamic': {
    whatItIs: 'Selects examples at runtime based on the current input, rather than hardcoding the same examples into every prompt.',
    whenToUse: 'Classification, extraction, or formatting tasks where output quality depends on seeing similar examples.',
    sample: 'You are a support ticket classifier. Classify the new ticket using the three most similar resolved tickets as examples.',
    sampleInputs: {
      role: 'a support ticket classifier',
      task: 'classify the ticket by severity (low/medium/high) and category (billing/technical/general)',
      selection_criteria: 'semantic similarity to the current ticket text',
      example_format: 'Ticket: <text>\nSeverity: <low|medium|high>\nCategory: <billing|technical|general>',
    },
  },
  'tool-use': {
    whatItIs: 'Structures the context for models that can call tools — defines available tools, the reasoning format, and the action/observation loop.',
    whenToUse: 'Agentic workflows where the model needs to search, call APIs, run calculations, or query databases.',
    sample: 'You are a research agent with access to web search and a calculator. Use the Thought/Action/Observation loop.',
    sampleInputs: {
      role: 'a research agent',
      tools: 'web_search(query: str) → str\ncalculator(expression: str) → float\nlookup_database(table: str, filter: str) → list',
      constraints: 'Always verify numbers with the calculator before citing them in the final answer.',
    },
  },
  'multi-agent': {
    whatItIs: "Defines one agent's role in a pipeline — what it receives from upstream, its task, and what it passes downstream.",
    whenToUse: 'Multi-agent systems where specialized agents hand off work (Researcher → Writer → Reviewer, for example).',
    sample: 'You are the Writer agent. You receive a research brief and produce a first draft. Pass the draft to the Reviewer.',
    sampleInputs: {
      agent_role: 'the Writer agent',
      receives: 'A structured research brief with key findings, sources, and recommended sections',
      task: 'Write a 500-word first draft article based on the research brief',
      sends: 'Completed draft with section headers and inline citations',
      output_format: 'Markdown article with H2 section headers and a citations section at the end',
    },
  },
};
