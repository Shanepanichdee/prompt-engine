import type { Framework } from './types';

export const validateInputs = (
  framework: Framework,
  inputs: Record<string, string>
): { warnings: string[] } => {
  const warnings: string[] = [];

  for (const f of framework.fields) {
    const value = (inputs[f.key] ?? '').trim();
    if (f.required && value.length === 0) {
      warnings.push(`Missing required field: ${f.label}`);
    }
  }

  return { warnings };
};
