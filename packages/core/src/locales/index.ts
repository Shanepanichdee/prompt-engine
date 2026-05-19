import type { LocaleCode, LocaleStrings } from '../types';
import { ar } from './ar';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { ja } from './ja';
import { ko } from './ko';
import { pt } from './pt';
import { th } from './th';
import { zh } from './zh';

const locales: Record<LocaleCode, LocaleStrings> = {
  en,
  th,
  zh,
  ja,
  ko,
  es,
  fr,
  de,
  pt,
  ar,
};

export const getLocale = (code: LocaleCode): LocaleStrings => locales[code] ?? en;

export { locales };
