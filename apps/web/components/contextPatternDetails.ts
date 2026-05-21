export type ContextPatternDetail = {
  whatItIs: string;
  whenToUse: string;
  sample: string;
  sampleInputs: Record<string, string>;
  type: 'direct' | 'code';
  whereToUse: string;
};

export const CONTEXT_PATTERN_DETAILS: Record<string, ContextPatternDetail> = {
  'system-prompt': {
    type: 'direct',
    whereToUse: 'Paste this directly into: ChatGPT → "Customize ChatGPT" (custom instructions) · ChatGPT → "Create a GPT" (the instructions field) · Claude → Projects (project instructions) · OpenAI Playground → System field. No code needed.',
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
    type: 'code',
    whereToUse: 'In your app: (1) user sends a query, (2) your code searches a document database and retrieves relevant chunks, (3) replace {{CONTEXT}} with those chunks, (4) send the full prompt to the AI API. Works with any vector database (Pinecone, Supabase, Chroma) + OpenAI or Claude API.',
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
    type: 'code',
    whereToUse: 'In your app: (1) store each conversation turn in a database or array, (2) on every new user message, insert recent turns at {{HISTORY}}, (3) send the full prompt to the AI API. When history exceeds your window, summarize older turns and prepend the summary.',
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
    type: 'code',
    whereToUse: 'In your app: (1) embed the user\'s input into a vector, (2) search your example library for the most similar examples, (3) replace {{EXAMPLES}} with those examples formatted per your template, (4) send to the AI API. Tools: OpenAI Embeddings + any vector store.',
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
    type: 'code',
    whereToUse: 'The tools you list here must match real functions in your code. Use OpenAI\'s function calling API or Claude\'s tool use API — the AI decides which tool to call, your code executes it, then returns the result back to the AI as an "observation". The loop repeats until the AI has a final answer.',
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
    type: 'code',
    whereToUse: 'Each agent in your pipeline gets its own system prompt (generate one per agent). Your code calls the AI API for Agent 1, takes its output, inserts it at {{UPSTREAM_OUTPUT}} in Agent 2\'s prompt, calls the API again, and so on. Example pipeline: Researcher → Writer → Reviewer, each a separate API call.',
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
