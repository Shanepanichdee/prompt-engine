import type { Field, LocaleStrings, PromptSection } from '../types';

export const section = (
  label: string,
  connectorKey: string,
  value: string,
  t: LocaleStrings
): PromptSection => {
  const connector = t.connectors[connectorKey];
  if (connector === undefined) {
    console.warn(
      `[prompt-engine] Unknown connector key "${connectorKey}" — falling back to label "${label}". Add it to locales/keys.ts and all locale files.`
    );
  }
  return {
    label,
    text: `${connector ?? label} ${value}`.trim(),
  };
};

export const compactSections = (sections: PromptSection[]): PromptSection[] =>
  sections.filter((s) => s.text.trim().length > 0);

export const field = (
  key: string,
  label: string,
  description: string,
  required: boolean,
  placeholder?: string
): Field => ({ key, label, description, required, placeholder });
