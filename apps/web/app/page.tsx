'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { build, frameworks, getLocale, type LocaleCode } from '@prompt-engine/core';
import { FieldsForm } from '../components/FieldsForm';
import { FrameworkPicker } from '../components/FrameworkPicker';
import { OutputPanel } from '../components/OutputPanel';
import { TopBar } from '../components/TopBar';
import { FRAMEWORK_DETAILS } from '../components/frameworkDetails';

const LOCALES: LocaleCode[] = ['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar'];

export default function Page() {
  const [locale, setLocale] = useState<LocaleCode>('en');
  const [frameworkId, setFrameworkId] = useState<string>(frameworks[0]?.id ?? 'rtf');
  const [values, setValues] = useState<Record<string, string>>({});
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fw = params.get('framework');
    const loc = params.get('locale');
    const matchedFramework = fw ? frameworks.find((f) => f.id === fw) : null;
    if (matchedFramework) {
      setFrameworkId(matchedFramework.id);
      const loaded: Record<string, string> = {};
      for (const field of matchedFramework.fields) {
        const val = params.get(field.key);
        if (val) loaded[field.key] = val;
      }
      if (Object.keys(loaded).length > 0) setValues(loaded);
    }
    if (loc && LOCALES.includes(loc as LocaleCode)) {
      setLocale(loc as LocaleCode);
    }
  }, []);

  const selectedFramework = useMemo(
    () => frameworks.find((item) => item.id === frameworkId) ?? frameworks[0],
    [frameworkId]
  );

  const result = useMemo(() => {
    if (!selectedFramework) return null;
    return build(selectedFramework, values, locale);
  }, [selectedFramework, values, locale]);

  const filledCount = useMemo(() => {
    if (!selectedFramework) return 0;
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
    if (!result) return;
    await navigator.clipboard.writeText(result.prompt);
  };

  if (!selectedFramework || !result) {
    return <main className="page">No framework available.</main>;
  }

  return (
    <main className={`page${darkMode ? ' dark' : ''}`}>
      <TopBar darkMode={darkMode} onDarkMode={setDarkMode} />

      <div className="tagline-strip">
        <p className="tagline-eyebrow">Prompt Engineering Platform</p>
        <h1 className="tagline-headline">Engineer AI Prompts That Deliver Results</h1>
        <p className="tagline-sub">Apply industry-tested frameworks to structure your prompts with precision — 14 methodologies, 10 languages, professional-grade output.</p>
        <Link href="/frameworks" className="guide-hero-cta">Explore all 14 frameworks →</Link>
      </div>

      <div className="layout">
        <section className="panel builder-panel">
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

          <div className="section-title-row">
            <h3 className="section-title">Inputs</h3>
            {filledCount > 0 && (
              <button type="button" className="clear-btn" onClick={() => setValues({})}>
                Clear all
              </button>
            )}
          </div>
          <FieldsForm fields={selectedFramework.fields} values={values} onChange={handleFieldChange} />
        </section>

        <OutputPanel
          result={result}
          frameworkName={selectedFramework.name}
          filledCount={filledCount}
          totalFields={selectedFramework.fields.length}
          onCopy={handleCopy}
        />
      </div>

      <footer className="page-footer">
        Created by{' '}
        <a href="https://datashane.com" target="_blank" rel="noreferrer">datashane.com</a>
        {' · '}
        <a href="https://qr-engine.data-shane.com" target="_blank" rel="noreferrer">QR Code Engine</a>
        {' · '}
        <a href="/privacy">Privacy Policy</a>
        {' · '}
        <a href="/terms">Terms of Use</a>
      </footer>
    </main>
  );
}
