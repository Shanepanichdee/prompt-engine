export type LocaleCode =
  | 'en'
  | 'th'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt'
  | 'ar';

export interface LocaleStrings {
  connectors: Record<string, string>;
  respondIn: string;
  langLabel: string;
}

export interface Field {
  key: string;
  label: string;
  description: string;
  required: boolean;
  placeholder?: string;
}

export interface PromptSection {
  label: string;
  text: string;
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  fields: Field[];
  assemble: (inputs: Record<string, string>, t: LocaleStrings) => PromptSection[];
}

export interface PromptResult {
  prompt: string;
  sections: PromptSection[];
  framework: string;
  locale: LocaleCode;
  fields: Record<string, string>;
  tokenEstimate: number;
  warnings: string[];
}
