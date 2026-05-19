import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const costar: Framework = {
  id: 'costar',
  name: 'CO-STAR',
  description: 'Context, Objective, Style, Tone, Audience, Response',
  fields: [
    field('context', 'Context', 'Background and constraints', true),
    field('objective', 'Objective', 'Expected outcome', true),
    field('style', 'Style', 'Writing or response style', false),
    field('tone', 'Tone', 'Desired tone', false),
    field('audience', 'Audience', 'Target audience', false),
    field('response', 'Response', 'Preferred response format', true),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Context', 'context', i.context ?? '', t),
      section('Objective', 'objective', i.objective ?? '', t),
      section('Style', 'style', i.style ?? '', t),
      section('Tone', 'tone', i.tone ?? '', t),
      section('Audience', 'audience', i.audience ?? '', t),
      section('Response', 'response', i.response ?? '', t),
    ]),
};
