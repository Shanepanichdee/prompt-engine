import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const ape: Framework = {
  id: 'ape',
  name: 'APE',
  description: 'Action, Purpose, Expectation',
  fields: [
    field('action', 'Action', 'What action should be performed', true),
    field('purpose', 'Purpose', 'Why the action is needed', true),
    field('expectation', 'Expectation', 'Expected result', true),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Action', 'action', i.action ?? '', t),
      section('Purpose', 'purpose', i.purpose ?? '', t),
      section('Expectation', 'expectation', i.expectation ?? '', t),
    ]),
};
