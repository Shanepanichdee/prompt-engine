import type { ContextPattern } from '../types';

export const memoryPattern: ContextPattern = {
  id: 'memory',
  name: 'Conversation Memory',
  description: 'Manage conversation history in the context window — keep recent turns, compress older ones.',
  layer: 'Memory',
  fields: [
    { key: 'role', label: 'Role', description: 'What the model is.', required: true, placeholder: 'e.g. a personal finance advisor' },
    { key: 'memory_format', label: 'Memory Format', description: 'How each turn is structured in history.', required: true, placeholder: 'e.g. Human: <message>\nAssistant: <response>' },
    { key: 'window_size', label: 'History Window (turns)', description: 'How many recent turns to keep verbatim.', required: false, placeholder: 'e.g. 10' },
    { key: 'summary_rule', label: 'Summarization Rule', description: 'How to compress older turns when the window is exceeded.', required: false, placeholder: 'e.g. Summarize older turns as a one-sentence snapshot' },
  ],
  assemble(inputs) {
    const s = [];
    if (inputs.role) s.push({ label: 'Role', text: `You are ${inputs.role}.` });
    if (inputs.memory_format) s.push({ label: 'Memory Format', text: `Conversation history is structured as:\n${inputs.memory_format}` });
    const window = inputs.window_size?.trim() || '10';
    s.push({ label: 'History Window', text: `Maintain the last ${window} turns of conversation verbatim in context.` });
    if (inputs.summary_rule) s.push({ label: 'Summarization Rule', text: `When history exceeds ${window} turns, compress older turns: ${inputs.summary_rule}` });
    s.push({ label: 'History Injection Point', text: '--- CONVERSATION HISTORY ---\n{{HISTORY}}\n--- END HISTORY ---' });
    return s;
  },
};
