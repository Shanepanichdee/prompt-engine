import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const autoCot: Framework = {
  id: 'auto-cot',
  name: 'Auto-CoT',
  description: 'Task, Number of Sub-questions, Final Answer Format',
  fields: [
    field('task', 'Task', 'Problem to solve', true),
    field('subQuestions', 'Number of Sub-questions', 'How many decomposition questions to create', false),
    field('finalAnswerFormat', 'Final Answer Format', 'Required format of final answer', true),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Task', 'task', i.task ?? '', t),
      section('Number of Sub-questions', 'subQuestions', i.subQuestions ?? '', t),
      section('Final Answer Format', 'finalAnswerFormat', i.finalAnswerFormat ?? '', t),
    ]),
};
