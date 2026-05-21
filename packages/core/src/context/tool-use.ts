import type { ContextPattern } from '../types';

const DEFAULT_REASONING = `Thought: <your reasoning>\nAction: <tool name>\nAction Input: <input to the tool>\nObservation: <result from the tool>\n[repeat Thought/Action/Action Input/Observation as needed]\nFinal Answer: <your final answer>`;

export const toolUsePattern: ContextPattern = {
  id: 'tool-use',
  name: 'Tool Use',
  description: 'Structure the context for models that call tools — defines available tools and the reasoning loop.',
  layer: 'Tools',
  fields: [
    { key: 'role', label: 'Role', description: 'What the model is.', required: true, placeholder: 'e.g. a research agent' },
    { key: 'tools', label: 'Available Tools', description: 'List each tool with its signature and description.', required: true, placeholder: 'e.g. web_search(query: str) → str\ncalculator(expression: str) → float' },
    { key: 'reasoning_format', label: 'Reasoning Format', description: 'Override the default Thought/Action/Observation loop if needed.', required: false, placeholder: 'Leave blank to use default ReAct format' },
    { key: 'constraints', label: 'Constraints', description: 'Rules for tool usage.', required: false, placeholder: 'e.g. Always verify numbers with the calculator before citing them' },
  ],
  assemble(inputs) {
    const s = [];
    if (inputs.role) s.push({ label: 'Role', text: `You are ${inputs.role}.` });
    if (inputs.tools) s.push({ label: 'Available Tools', text: `You have access to the following tools:\n${inputs.tools}` });
    const reasoning = inputs.reasoning_format?.trim() || DEFAULT_REASONING;
    s.push({ label: 'Reasoning Format', text: reasoning });
    if (inputs.constraints) s.push({ label: 'Constraints', text: inputs.constraints });
    return s;
  },
};
