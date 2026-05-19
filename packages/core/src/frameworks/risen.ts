import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const risen: Framework = {
  id: 'risen',
  name: 'RISEN',
  description: 'Role, Instructions, Steps, End Goal, Narrowing',
  fields: [
    field('role', 'Role', 'Role to assume', true),
    field('instructions', 'Instructions', 'Detailed instructions', true),
    field('steps', 'Steps', 'Step-by-step process', false),
    field('endGoal', 'End Goal', 'Desired final outcome', true),
    field('narrowing', 'Narrowing', 'Limits or exclusions', false),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Role', 'role', i.role ?? '', t),
      section('Instructions', 'instructions', i.instructions ?? '', t),
      section('Steps', 'steps', i.steps ?? '', t),
      section('End Goal', 'endGoal', i.endGoal ?? '', t),
      section('Narrowing', 'narrowing', i.narrowing ?? '', t),
    ]),
};
