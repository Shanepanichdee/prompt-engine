import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const broke: Framework = {
  id: 'broke',
  name: 'BROKE',
  description: 'Background, Role, Objectives, Key Results, Evolve',
  fields: [
    field('background', 'Background', 'Problem background', true),
    field('role', 'Role', 'Role to assume', true),
    field('objectives', 'Objectives', 'Key objectives', true),
    field('keyResults', 'Key Results', 'How success is measured', false),
    field('evolve', 'Evolve', 'How to improve over iterations', false),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Background', 'background', i.background ?? '', t),
      section('Role', 'role', i.role ?? '', t),
      section('Objectives', 'objectives', i.objectives ?? '', t),
      section('Key Results', 'keyResults', i.keyResults ?? '', t),
      section('Evolve', 'evolve', i.evolve ?? '', t),
    ]),
};
