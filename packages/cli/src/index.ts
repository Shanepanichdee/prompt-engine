#!/usr/bin/env node
import { cancel, intro, isCancel, outro, select, text } from '@clack/prompts';
import { build, frameworks, getLocale, type LocaleCode, type Framework } from '@prompt-engine/core';

const LOCALE_CODES: LocaleCode[] = ['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar'];

type CliArgs = {
  lang?: LocaleCode;
  json: boolean;
  framework?: string;
  fields: Record<string, string>;
  noInteractive: boolean;
};

export const parseArgs = (argv: string[]): CliArgs => {
  let lang: LocaleCode | undefined;
  let json = false;
  let framework: string | undefined;
  let noInteractive = false;
  const fields: Record<string, string> = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--json') {
      json = true;
      continue;
    }

    if (arg === '--no-interactive') {
      noInteractive = true;
      continue;
    }

    if (arg === '--lang') {
      const next = argv[i + 1] as LocaleCode | undefined;
      if (next && LOCALE_CODES.includes(next)) {
        lang = next;
        i += 1;
      }
      continue;
    }

    if (arg === '--framework') {
      const next = argv[i + 1];
      if (next) {
        framework = next;
        i += 1;
      }
      continue;
    }

    if (arg === '--field') {
      const next = argv[i + 1];
      if (next && next.includes('=')) {
        const eq = next.indexOf('=');
        const key = next.slice(0, eq).trim();
        const value = next.slice(eq + 1).trim();
        if (key) {
          fields[key] = value;
        }
        i += 1;
      }
      continue;
    }
  }

  return { lang, json, framework, fields, noInteractive };
};

const toSelectOptions = <T extends { id: string; name: string; description: string }>(items: T[]) =>
  items.map((item) => ({
    value: item.id,
    label: item.name,
    hint: item.description,
  }));

const promptRequiredField = async (label: string, description: string): Promise<string> => {
  while (true) {
    const value = await text({
      message: `${label} *`,
      placeholder: description,
    });

    if (isCancel(value)) {
      cancel('Prompt generation cancelled.');
      process.exit(0);
    }

    const normalized = String(value).trim();
    if (normalized.length > 0) {
      return normalized;
    }
  }
};

const promptOptionalField = async (label: string, description: string): Promise<string> => {
  const value = await text({
    message: label,
    placeholder: description,
  });

  if (isCancel(value)) {
    cancel('Prompt generation cancelled.');
    process.exit(0);
  }

  return String(value).trim();
};

const pickLocale = async (preset?: LocaleCode): Promise<LocaleCode> => {
  if (preset && LOCALE_CODES.includes(preset)) {
    return preset;
  }

  const selected = await select({
    message: 'Select output language',
    options: LOCALE_CODES.map((code) => {
      const locale = getLocale(code);
      return { value: code, label: `${locale.langLabel} (${code})` };
    }),
  });

  if (isCancel(selected)) {
    cancel('Prompt generation cancelled.');
    process.exit(0);
  }

  return selected as LocaleCode;
};

const pickFramework = async (): Promise<Framework> => {
  const selected = await select({
    message: 'Select framework',
    options: toSelectOptions(frameworks),
  });

  if (isCancel(selected)) {
    cancel('Prompt generation cancelled.');
    process.exit(0);
  }

  const framework = frameworks.find((item) => item.id === selected);
  if (!framework) {
    throw new Error('Unknown framework selected');
  }

  return framework;
};

const promptFields = async (framework: Framework): Promise<Record<string, string>> => {
  const inputs: Record<string, string> = {};

  for (const field of framework.fields) {
    if (field.required) {
      inputs[field.key] = await promptRequiredField(field.label, field.description);
    } else {
      inputs[field.key] = await promptOptionalField(field.label, field.description);
    }
  }

  return inputs;
};

const pickFrameworkById = (id?: string): Framework | undefined =>
  frameworks.find((item) => item.id === id);

export const run = async (argv: string[]): Promise<void> => {
  const args = parseArgs(argv);

  const canRunNonInteractive =
    args.noInteractive &&
    Boolean(args.lang) &&
    Boolean(args.framework) &&
    Object.keys(args.fields).length > 0;

  if (canRunNonInteractive) {
    const framework = pickFrameworkById(args.framework);
    if (!framework || !args.lang) {
      throw new Error('Invalid non-interactive arguments');
    }
    const result = build(framework, args.fields, args.lang);
    if (args.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(result.prompt);
    }
    return;
  }

  intro('Prompt Engine');

  const locale = await pickLocale(args.lang);
  const framework = await pickFramework();
  const inputs = await promptFields(framework);
  const result = build(framework, inputs, locale);

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result.prompt);
  }

  outro(`Done · ${framework.name} · ${locale} · ~${result.tokenEstimate} tokens`);
};

if (require.main === module) {
  run(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
