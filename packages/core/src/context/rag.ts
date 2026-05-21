import type { ContextPattern } from '../types';

export const ragPattern: ContextPattern = {
  id: 'rag',
  name: 'RAG',
  description: 'Inject retrieved documents at runtime so the model answers from current, specific knowledge.',
  layer: 'Retrieval',
  fields: [
    { key: 'role', label: 'Role', description: 'What the model is.', required: true, placeholder: 'e.g. a legal assistant' },
    { key: 'source', label: 'Knowledge Source', description: 'Where the retrieved content comes from.', required: true, placeholder: 'e.g. a repository of contract clauses' },
    { key: 'task', label: 'Task', description: 'What the model should do with the retrieved content.', required: true, placeholder: 'e.g. summarize the termination conditions using only the retrieved clauses' },
    { key: 'citation_style', label: 'Citation Style', description: 'How to cite sources in the response.', required: false, placeholder: 'e.g. Cite each clause as [Clause X.X]' },
    { key: 'output_format', label: 'Output Format', description: 'How to structure the response.', required: false, placeholder: 'e.g. Bullet list, then a one-paragraph summary' },
  ],
  assemble(inputs) {
    const s = [];
    if (inputs.role) s.push({ label: 'Role', text: `You are ${inputs.role}.` });
    if (inputs.source) s.push({ label: 'Knowledge Source', text: `You will be provided with context retrieved from: ${inputs.source}.\nUse only this context to respond — do not rely on prior knowledge.` });
    if (inputs.task) s.push({ label: 'Task', text: inputs.task });
    if (inputs.citation_style) s.push({ label: 'Citations', text: inputs.citation_style });
    if (inputs.output_format) s.push({ label: 'Output Format', text: inputs.output_format });
    s.push({ label: 'Context Injection Point', text: '--- RETRIEVED CONTEXT ---\n{{CONTEXT}}\n--- END CONTEXT ---' });
    return s;
  },
};
