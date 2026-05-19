import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const structuredOutput: Framework = {
  id: 'structured-output',
  name: 'Structured Output',
  description: 'Task, Output Format, Schema, Constraints',
  fields: [
    field('task', 'Task', 'Task to perform', true),
    field('outputFormat', 'Output Format', 'Output container format (JSON, table, etc.)', true),
    field('schema', 'Schema', 'Expected response schema', true),
    field('constraints', 'Constraints', 'Validation constraints', false),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Task', 'task', i.task ?? '', t),
      section('Output Format', 'outputFormat', i.outputFormat ?? '', t),
      section('Schema', 'schema', i.schema ?? '', t),
      section('Constraints', 'constraints', i.constraints ?? '', t),
    ]),
};
