import type { ContextPattern } from '../types';
import { systemPromptPattern } from './system-prompt';
import { ragPattern } from './rag';
import { memoryPattern } from './memory';
import { fewShotDynamicPattern } from './few-shot-dynamic';
import { toolUsePattern } from './tool-use';
import { multiAgentPattern } from './multi-agent';

export const contextPatterns: ContextPattern[] = [
  systemPromptPattern,
  ragPattern,
  memoryPattern,
  fewShotDynamicPattern,
  toolUsePattern,
  multiAgentPattern,
];

export {
  systemPromptPattern,
  ragPattern,
  memoryPattern,
  fewShotDynamicPattern,
  toolUsePattern,
  multiAgentPattern,
};
