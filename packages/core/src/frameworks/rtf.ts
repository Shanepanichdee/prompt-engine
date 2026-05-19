import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const rtf: Framework = {
  id: 'rtf',
  name: 'RTCF',
  description: 'Role, Target, Context, Format',
  fields: [
    field('role', 'Role', 'Role to assume', true),
    field('target', 'Target', 'Primary objective or target outcome to achieve', true),
    field(
      'context',
      'Context',
      'Audience and usage context (e.g., who it is for, target group, approximate amount/length/scale)',
      true
    ),
    field('format', 'Format', 'Output format', true),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Role', 'role', i.role ?? '', t),
      section('Target', 'task', i.target ?? i.task ?? '', t),
      section('Context', 'context', i.context ?? '', t),
      section('Format', 'format', i.format ?? '', t),
    ]),
};
