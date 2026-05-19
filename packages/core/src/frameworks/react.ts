import type { Framework } from '../types';
import { compactSections, field, section } from './utils';

export const react: Framework = {
  id: 'react',
  name: 'ReAct',
  description: 'Task, Reasoning Steps, Action Format, Observation Format',
  fields: [
    field('task', 'Task', 'Primary task objective', true),
    field('reasoningSteps', 'Reasoning Steps', 'How reasoning should be structured', false),
    field('actionFormat', 'Action Format', 'Format for action steps', true),
    field('observationFormat', 'Observation Format', 'Format for observations', false),
  ],
  assemble: (i, t) =>
    compactSections([
      section('Task', 'task', i.task ?? '', t),
      section('Reasoning Steps', 'reasoningSteps', i.reasoningSteps ?? '', t),
      section('Action Format', 'actionFormat', i.actionFormat ?? '', t),
      section('Observation Format', 'observationFormat', i.observationFormat ?? '', t),
    ]),
};
