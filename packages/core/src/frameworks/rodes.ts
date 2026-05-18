import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const rodes: Framework = {
  id: 'rodes',
  name: 'RODES',
  description: 'Role, Objective, Details, Examples, Sense Check',
  fields: [
    field('role', 'Role', 'Role to assume', true),
    field('objective', 'Objective', 'Desired objective', true),
    field('details', 'Details', 'Detailed constraints and context', false),
    field('examples', 'Examples', 'Reference examples', false),
    field('senseCheck', 'Sense Check', 'Validation or self-check instruction', false),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Role', 'role', i.role ?? '', t),
      section('Objective', 'objective', i.objective ?? '', t),
      section('Details', 'details', i.details ?? '', t),
      section('Examples', 'examples', i.examples ?? '', t),
      section('Sense Check', 'senseCheck', i.senseCheck ?? '', t),
    ]),
};
