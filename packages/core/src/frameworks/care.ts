import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const care: Framework = {
  id: 'care',
  name: 'CARE',
  description: 'Context, Action, Result, Example',
  fields: [
    field('context', 'Context', 'Relevant context', true),
    field('action', 'Action', 'Requested action', true),
    field('result', 'Result', 'Expected result', true),
    field('example', 'Example', 'Optional example output', false),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Context', 'context', i.context ?? '', t),
      section('Action', 'action', i.action ?? '', t),
      section('Result', 'result', i.result ?? '', t),
      section('Example', 'example', i.example ?? '', t),
    ]),
};
