import { estimateTokens } from './tokens';
import type { ContextPattern, ContextResult } from './types';

export function buildContext(
  pattern: ContextPattern,
  inputs: Record<string, string>
): ContextResult {
  const sections = pattern.assemble(inputs);
  const prompt = sections.map((s) => s.text).join('\n');
  return {
    prompt: prompt.trim(),
    sections,
    pattern: pattern.id,
    tokenEstimate: estimateTokens(prompt),
  };
}
