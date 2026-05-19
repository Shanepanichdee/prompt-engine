import { getLocale } from './locales';
import { estimateTokens } from './tokens';
import type { Framework, LocaleCode, PromptResult, PromptSection } from './types';
import { validateInputs } from './validate';

export function build(
  framework: Framework,
  inputs: Record<string, string>,
  locale: LocaleCode = 'en'
): PromptResult {
  const { warnings } = validateInputs(framework, inputs);
  const t = getLocale(locale);

  const sections = framework.assemble(inputs, t);
  const finalSections: PromptSection[] = [...sections];

  if (locale !== 'en' && t.respondIn.trim().length > 0) {
    finalSections.push({ label: 'Language Instruction', text: t.respondIn });
  }

  const body = finalSections.map((s) => s.text).join('\n');
  const prompt = body.trim();

  return {
    prompt,
    sections: finalSections,
    framework: framework.id,
    locale,
    fields: { ...inputs },
    tokenEstimate: estimateTokens(prompt),
    warnings,
  };
}
