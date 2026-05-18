import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const cot: Framework = {
  id: 'cot',
  name: 'Chain of Thought',
  description: 'Task, Reasoning Style, Output Format',
  fields: [
    field('task', 'Task', 'Problem to solve', true),
    field('reasoningStyle', 'Reasoning Style', 'How to reason through solution', false),
    field('outputFormat', 'Output Format', 'Desired final output format', true),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Task', 'task', i.task ?? '', t),
      section('Reasoning Style', 'reasoningStyle', i.reasoningStyle ?? '', t),
      section('Output Format', 'outputFormat', i.outputFormat ?? '', t),
    ]),
};
