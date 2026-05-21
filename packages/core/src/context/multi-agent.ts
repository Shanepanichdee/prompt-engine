import type { ContextPattern } from '../types';

export const multiAgentPattern: ContextPattern = {
  id: 'multi-agent',
  name: 'Multi-Agent Handoff',
  description: "Define one agent's role in a pipeline — what it receives, its task, and what it passes downstream.",
  layer: 'Orchestration',
  fields: [
    { key: 'agent_role', label: 'Agent Role', description: "This agent's specific role in the pipeline.", required: true, placeholder: 'e.g. the Writer agent' },
    { key: 'receives', label: 'Receives From Upstream', description: 'What the previous agent passes to this one.', required: false, placeholder: 'e.g. A structured research brief with key findings and sources' },
    { key: 'task', label: 'Task', description: 'What this agent should produce.', required: true, placeholder: 'e.g. Write a 500-word first draft based on the research brief' },
    { key: 'sends', label: 'Sends To Downstream', description: 'What this agent passes to the next one.', required: false, placeholder: 'e.g. Completed draft with section headers and citations' },
    { key: 'output_format', label: 'Output Format', description: "How to structure this agent's output.", required: false, placeholder: 'e.g. Markdown article with H2 section headers' },
  ],
  assemble(inputs) {
    const s = [];
    if (inputs.agent_role) s.push({ label: 'Agent Role', text: `You are ${inputs.agent_role} in a multi-agent pipeline.` });
    if (inputs.receives) s.push({ label: 'Input From Upstream', text: `You receive the following from the previous agent:\n${inputs.receives}` });
    s.push({ label: 'Upstream Input Placeholder', text: '--- UPSTREAM OUTPUT ---\n{{UPSTREAM_OUTPUT}}\n--- END ---' });
    if (inputs.task) s.push({ label: 'Your Task', text: inputs.task });
    if (inputs.sends) s.push({ label: 'Output To Downstream', text: `Pass the following to the next agent:\n${inputs.sends}` });
    if (inputs.output_format) s.push({ label: 'Output Format', text: inputs.output_format });
    return s;
  },
};
