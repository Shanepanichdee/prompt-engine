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

export interface GuideStrings {
  strengths: string;
  limitations: string;
  bestFor: string;
  avoidWhen: string;
  tryIt: string;
  refGuide: string;
  searchPlaceholder: string;
  backToBuilder: string;
}

export interface LocaleStrings {
  connectors: Record<string, string>;
  respondIn: string;
  langLabel: string;
  guide: GuideStrings;
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

export interface ContextPattern {
  id: string;
  name: string;
  description: string;
  layer: 'System' | 'Retrieval' | 'Memory' | 'Examples' | 'Tools' | 'Orchestration';
  fields: Field[];
  assemble(inputs: Record<string, string>): PromptSection[];
}

export interface ContextResult {
  prompt: string;
  sections: PromptSection[];
  pattern: string;
  tokenEstimate: number;
}
