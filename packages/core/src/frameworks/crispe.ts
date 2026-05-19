import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const crispe: Framework = {
  id: 'crispe',
  name: 'CRISPE',
  description: 'Capacity, Role, Insight, Statement, Personality, Experiment',
  fields: [
    field('capacity', 'Capacity', 'Capability or expertise level to assume', true),
    field('role', 'Role', 'Specific role to play', true),
    field('insight', 'Insight', 'Relevant context or insight', false),
    field('statement', 'Statement', 'Core task statement', true),
    field('personality', 'Personality', 'Style or personality constraints', false),
    field('experiment', 'Experiment', 'How to iterate or test outputs', false),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Capacity', 'capacity', i.capacity ?? '', t),
      section('Role', 'role', i.role ?? '', t),
      section('Insight', 'insight', i.insight ?? '', t),
      section('Statement', 'statement', i.statement ?? '', t),
      section('Personality', 'personality', i.personality ?? '', t),
      section('Experiment', 'experiment', i.experiment ?? '', t),
    ]),
};
