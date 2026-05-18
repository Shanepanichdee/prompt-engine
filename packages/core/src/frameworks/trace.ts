import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const trace: Framework = {
  id: 'trace',
  name: 'TRACE',
  description: 'Task, Role, Audience, Create, Expectation',
  fields: [
    field('task', 'Task', 'Task objective', true),
    field('role', 'Role', 'Role to assume', true),
    field('audience', 'Audience', 'Intended audience', false),
    field('create', 'Create', 'Artifact to create', true),
    field('expectation', 'Expectation', 'Expected quality or constraints', false),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Task', 'task', i.task ?? '', t),
      section('Role', 'role', i.role ?? '', t),
      section('Audience', 'audience', i.audience ?? '', t),
      section('Create', 'create', i.create ?? '', t),
      section('Expectation', 'expectation', i.expectation ?? '', t),
    ]),
};
