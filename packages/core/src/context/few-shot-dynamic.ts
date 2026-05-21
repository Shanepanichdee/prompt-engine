import type { ContextPattern } from '../types';

export const fewShotDynamicPattern: ContextPattern = {
  id: 'few-shot-dynamic',
  name: 'Dynamic Few-Shot',
  description: 'Select examples at runtime based on the current input — better quality than static hardcoded examples.',
  layer: 'Examples',
  fields: [
    { key: 'role', label: 'Role', description: 'What the model is.', required: true, placeholder: 'e.g. a support ticket classifier' },
    { key: 'task', label: 'Task', description: 'What the model should do.', required: true, placeholder: 'e.g. classify the ticket by severity and category' },
    { key: 'selection_criteria', label: 'Selection Criteria', description: 'How examples are chosen at runtime.', required: false, placeholder: 'e.g. semantic similarity to the current ticket' },
    { key: 'example_format', label: 'Example Format', description: 'The template each injected example follows.', required: true, placeholder: 'e.g. Ticket: <text>\nSeverity: <low|medium|high>\nCategory: <billing|technical|general>' },
  ],
  assemble(inputs) {
    const s = [];
    if (inputs.role) s.push({ label: 'Role', text: `You are ${inputs.role}.` });
    if (inputs.task) s.push({ label: 'Task', text: inputs.task });
    if (inputs.selection_criteria) s.push({ label: 'Example Selection', text: `Examples are selected based on: ${inputs.selection_criteria}` });
    if (inputs.example_format) s.push({ label: 'Example Format', text: `Each example follows this format:\n${inputs.example_format}` });
    s.push({ label: 'Examples Injection Point', text: '--- EXAMPLES ---\n{{EXAMPLES}}\n--- END EXAMPLES ---' });
    return s;
  },
};
