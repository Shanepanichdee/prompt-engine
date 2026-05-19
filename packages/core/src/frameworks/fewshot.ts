import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const fewshot: Framework = {
  id: 'fewshot',
  name: 'Few-Shot',
  description: 'Task, Examples, Output Format',
  fields: [
    field('task', 'Task', 'Main task to perform', true),
    field('examples', 'Examples', 'Sample examples (can include multiple)', true),
    field('outputFormat', 'Output Format', 'Output format specification', true),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Task', 'task', i.task ?? '', t),
      section('Examples', 'examples', i.examples ?? '', t),
      section('Output Format', 'outputFormat', i.outputFormat ?? '', t),
    ]),
};
