import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const CLI_PATH = new URL('../dist/index.js', import.meta.url).pathname;

const runCli = (args: string[]): string =>
  execFileSync('node', [CLI_PATH, ...args], { encoding: 'utf-8' });

describe('cli non-interactive', () => {
  it('emits JSON with --json, --framework, and --field flags', () => {
    const output = runCli([
      '--no-interactive',
      '--json',
      '--lang',
      'en',
      '--framework',
      'rtf',
      '--field',
      'role=a product manager',
      '--field',
      'context=for startup founders, about 6 bullets',
      '--field',
      'task=outline MVP scope',
      '--field',
      'format=bullet points',
    ]);

    const result = JSON.parse(output);
    expect(result.framework).toBe('rtf');
    expect(result.locale).toBe('en');
    expect(result.prompt).toContain('Your task is to');
    expect(result.fields.role).toBe('a product manager');
  });

  it('supports thai locale and appends thai respond instruction', () => {
    const output = runCli([
      '--no-interactive',
      '--json',
      '--lang',
      'th',
      '--framework',
      'rtf',
      '--field',
      'role=นักวิเคราะห์ข้อมูล',
      '--field',
      'context=สำหรับผู้จัดการภูมิภาค ประมาณ 5 ข้อ',
      '--field',
      'task=สรุปข้อมูลการขาย',
      '--field',
      'format=หัวข้อย่อย',
    ]);

    const result = JSON.parse(output);
    expect(result.locale).toBe('th');
    expect(result.prompt).toContain('กรุณาตอบเป็นภาษาไทย');
  });

  it('returns required-field warning when required value is empty', () => {
    const output = runCli([
      '--no-interactive',
      '--json',
      '--lang',
      'en',
      '--framework',
      'rtf',
      '--field',
      'role=',
      '--field',
      'context=for release managers, short summary',
      '--field',
      'task=write release summary',
      '--field',
      'format=bulleted list',
    ]);

    const result = JSON.parse(output);
    expect(result.warnings.some((w: string) => w.includes('Missing required field: Role'))).toBe(true);
  });
});
