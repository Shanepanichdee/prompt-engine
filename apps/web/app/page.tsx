'use client';

import { useMemo, useState } from 'react';
import { build, frameworks, getLocale, type LocaleCode } from '@prompt-engine/core';
import { FieldsForm } from '../components/FieldsForm';
import { FrameworkPicker } from '../components/FrameworkPicker';
import { OutputPanel } from '../components/OutputPanel';
import { FRAMEWORK_DETAILS } from '../components/frameworkDetails';

const LOCALES: LocaleCode[] = ['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar'];

export default function Page() {
  const [locale, setLocale] = useState<LocaleCode>('en');
  const [frameworkId, setFrameworkId] = useState<string>(frameworks[0]?.id ?? 'rtf');
  const [values, setValues] = useState<Record<string, string>>({});
  const [devMode, setDevMode] = useState<boolean>(false);
  const [compactMode, setCompactMode] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const selectedFramework = useMemo(
    () => frameworks.find((item) => item.id === frameworkId) ?? frameworks[0],
    [frameworkId]
  );

  const result = useMemo(() => {
    if (!selectedFramework) {
      return null;
    }
    return build(selectedFramework, values, locale);
  }, [selectedFramework, values, locale]);

  const filledCount = useMemo(() => {
    if (!selectedFramework) {
      return 0;
    }
    return selectedFramework.fields.filter((field) => (values[field.key] ?? '').trim().length > 0).length;
  }, [selectedFramework, values]);

  const handleFrameworkSelect = (id: string) => {
    setFrameworkId(id);
    setValues({});
  };

  const handleFieldChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleUseSample = (id: string, sampleInputs: Record<string, string>) => {
    setFrameworkId(id);
    setValues(sampleInputs);
  };

  const handleCopy = async () => {
    if (!result) {
      return;
    }
    await navigator.clipboard.writeText(result.prompt);
  };

  if (!selectedFramework || !result) {
    return <main className="page">No framework available.</main>;
  }

  return (
    <main className={`page ${compactMode ? 'compact' : ''} ${darkMode ? 'dark' : ''}`}>
      <header className="topbar">
        <div>
          <div className="brand-row">
            <img src="/logo-original.png" alt="datashane.com logo" className="brand-logo" />
          </div>
          <p className="brand-undertext">datashane.com</p>
          <p className="kicker">Prompt Engineering Studio</p>
          <h1>Prompt Engine</h1>
          <p className="subtitle">Build structured prompts with framework guidance, multilingual connectors, and copy-ready output.</p>
          <p className="credit">Created by <a href="https://datashane.com" target="_blank" rel="noreferrer">datashane.com</a></p>
        </div>
        <div className="mode-controls">
          <label className="dev-toggle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(event) => setDarkMode(event.target.checked)}
            />
            Dark Mode
          </label>
          <label className="dev-toggle">
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(event) => setCompactMode(event.target.checked)}
            />
            Compact Mode
          </label>
          <label className="dev-toggle">
            <input
              type="checkbox"
              checked={devMode}
              onChange={(event) => setDevMode(event.target.checked)}
            />
            Dev Mode
          </label>
        </div>
      </header>

      <div className="layout">
        <section className="panel builder-panel">
          <h2>Builder</h2>

          <label className="select-label">
            Language
            <select
              className="language-select"
              value={locale}
              onChange={(event) => setLocale(event.target.value as LocaleCode)}
            >
              {LOCALES.map((code) => {
                const localeDef = getLocale(code);
                return (
                  <option key={code} value={code}>
                    {localeDef.langLabel} ({code})
                  </option>
                );
              })}
            </select>
          </label>

          <h3 className="section-title">Frameworks</h3>
          <FrameworkPicker
            frameworks={frameworks}
            selectedId={selectedFramework.id}
            details={FRAMEWORK_DETAILS}
            onSelect={handleFrameworkSelect}
            onUseSample={handleUseSample}
          />

          <h3 className="section-title">Inputs</h3>
          <FieldsForm fields={selectedFramework.fields} values={values} onChange={handleFieldChange} />
        </section>

        <OutputPanel
          result={result}
          frameworkName={selectedFramework.name}
          filledCount={filledCount}
          totalFields={selectedFramework.fields.length}
          devMode={devMode}
          onCopy={handleCopy}
        />
      </div>
    </main>
  );
}
