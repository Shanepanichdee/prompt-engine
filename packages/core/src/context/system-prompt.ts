import type { ContextPattern } from '../types';

export const systemPromptPattern: ContextPattern = {
  id: 'system-prompt',
  name: 'System Prompt',
  description: "Define the model's role, task, rules, and output format — the foundation of every AI system.",
  layer: 'System',
  fields: [
    { key: 'role', label: 'Role', description: 'What the model is.', required: true, placeholder: 'e.g. a senior customer support agent' },
    { key: 'task', label: 'Task', description: 'The primary job of this system.', required: true, placeholder: 'e.g. resolve billing questions clearly and empathetically' },
    { key: 'constraints', label: 'Rules / Constraints', description: 'Hard rules the model must follow.', required: false, placeholder: 'e.g. Never discuss competitor products. Always offer a refund on the first request.' },
    { key: 'output_format', label: 'Output Format', description: 'How responses should be structured.', required: false, placeholder: 'e.g. Short paragraph, then a numbered action list' },
    { key: 'tone', label: 'Tone', description: 'Communication style.', required: false, placeholder: 'e.g. empathetic and professional' },
  ],
  assemble(inputs) {
    const s = [];
    if (inputs.role) s.push({ label: 'Role', text: `You are ${inputs.role}.` });
    if (inputs.task) s.push({ label: 'Task', text: `Your task is to ${inputs.task}.` });
    if (inputs.constraints) s.push({ label: 'Rules', text: `Follow these rules at all times:\n${inputs.constraints}` });
    if (inputs.output_format) s.push({ label: 'Output Format', text: `Format your response as:\n${inputs.output_format}` });
    if (inputs.tone) s.push({ label: 'Tone', text: `Tone: ${inputs.tone}` });
    return s;
  },
};
