import { describe, expect, it, vi } from 'vitest';
import { build, estimateTokens, frameworks, getLocale, locales } from '../src';
import { section } from '../src/frameworks/utils';
import { CONNECTOR_KEYS } from '../src/locales/keys';

const requiredInputsFor = (frameworkId: string): Record<string, string> => {
  const framework = frameworks.find((f) => f.id === frameworkId);
  if (!framework) {
    return {};
  }
  const values: Record<string, string> = {};
  for (const field of framework.fields) {
    values[field.key] = field.required ? `${field.label} value` : '';
  }
  return values;
};

describe('build()', () => {
  for (const framework of frameworks) {
    it(`builds prompt result for ${framework.id}`, () => {
      const result = build(framework, requiredInputsFor(framework.id), 'en');
      expect(result.framework).toBe(framework.id);
      expect(result.locale).toBe('en');
      expect(result.prompt.length).toBeGreaterThan(0);
      expect(result.sections.length).toBeGreaterThan(0);
      expect(result.tokenEstimate).toBeGreaterThan(0);
    });
  }

  it('adds language instruction for non-english locales', () => {
    const framework = frameworks.find((f) => f.id === 'rtf');
    expect(framework).toBeTruthy();
    const result = build(framework!, { role: 'a teacher', task: 'explain gravity', format: 'bullet points' }, 'th');
    expect(result.sections[result.sections.length - 1]?.text).toBe(getLocale('th').respondIn);
    expect(result.prompt).toContain(getLocale('th').respondIn);
  });

  it('generates warnings for missing required fields', () => {
    const framework = frameworks.find((f) => f.id === 'rtf');
    expect(framework).toBeTruthy();
    const result = build(framework!, { role: '', task: '', format: '' }, 'en');
    expect(result.warnings.some((w) => w.includes('Missing required field'))).toBe(true);
  });

  it('does NOT warn when optional fields are empty', () => {
    const framework = frameworks.find((f) => f.id === 'crispe');
    expect(framework).toBeTruthy();
    // crispe has optional fields: insight, personality, experiment
    const result = build(
      framework!,
      { capacity: 'senior engineer', role: 'reviewer', insight: '', statement: 'review this code', personality: '', experiment: '' },
      'en'
    );
    expect(result.warnings.every((w) => !w.includes('Optional field left empty'))).toBe(true);
  });
});

describe('section() util', () => {
  it('warns to console when an unknown connector key is used', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const t = getLocale('en');
    section('MyLabel', 'nonExistentKey', 'some value', t);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('nonExistentKey'));
    warnSpy.mockRestore();
  });
});

describe('estimateTokens()', () => {
  it('estimates Latin text at ~1 token per 4 chars', () => {
    // 'hello' = 5 chars → ceil(5 * 0.25) = ceil(1.25) = 2
    expect(estimateTokens('hello')).toBe(2);
  });

  it('estimates CJK characters at 1 token each', () => {
    // 4 Chinese chars → 4 tokens
    expect(estimateTokens('你好世界')).toBe(4);
  });

  it('estimates Thai characters at 1 token each', () => {
    // 'สวัส' = 4 Thai chars → 4 tokens
    expect(estimateTokens('สวัส')).toBe(4);
  });

  it('estimates Arabic characters at 1 token each', () => {
    // 'مرحب' = 4 Arabic chars → 4 tokens
    expect(estimateTokens('مرحب')).toBe(4);
  });

  it('handles mixed Latin + CJK text', () => {
    // 'hi' (2 Latin = 0.5) + '你好' (2 CJK = 2) → ceil(2.5) = 3
    expect(estimateTokens('hi你好')).toBe(3);
  });
});

describe('locales', () => {
  it('contains all 10 locales', () => {
    expect(Object.keys(locales)).toEqual(['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar']);
  });

  for (const [localeCode, locale] of Object.entries(locales)) {
    it(`${localeCode} includes all connector keys`, () => {
      for (const key of CONNECTOR_KEYS) {
        expect(locale.connectors[key]).toBeTypeOf('string');
        expect(locale.connectors[key].trim().length).toBeGreaterThan(0);
      }
    });
  }
});
