'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { build, frameworks, getLocale, type Field, type LocaleCode } from '@prompt-engine/core'
import { FieldsForm } from '@/components/FieldsForm'
import { CompareOutputPanel } from '@/components/CompareOutputPanel'

const LOCALES: LocaleCode[] = ['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar']

const DEFAULT_IDS = [frameworks[0]?.id ?? 'rtf', frameworks[1]?.id ?? 'crispe']

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_IDS)
  const [values, setValues] = useState<Record<string, string>>({})
  const [locale, setLocale] = useState<LocaleCode>('en')

  const toggleFramework = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((x) => x !== id) : prev
      }
      return [...prev, id]
    })
  }

  const selectedFrameworks = useMemo(
    () => frameworks.filter((f) => selectedIds.includes(f.id)),
    [selectedIds]
  )

  const unionFields = useMemo((): Field[] => {
    const seen = new Set<string>()
    const result: Field[] = []
    for (const fw of selectedFrameworks) {
      for (const field of fw.fields) {
        if (!seen.has(field.key)) {
          seen.add(field.key)
          result.push(field)
        }
      }
    }
    return result
  }, [selectedFrameworks])

  const results = useMemo(
    () => selectedFrameworks.map((fw) => ({ fw, result: build(fw, values, locale) })),
    [selectedFrameworks, values, locale]
  )

  const handleFieldChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <main className="page">
      <div className="page-nav">
        <Link href="/" className="auth-link">← Builder</Link>
      </div>
      <h1 className="history-heading">Compare Frameworks</h1>
      <p className="muted-text compare-sub">Same inputs, different frameworks — see how each structures your prompt.</p>

      <label className="select-label compare-locale">
        Language
        <select
          className="language-select"
          value={locale}
          onChange={(e) => setLocale(e.target.value as LocaleCode)}
        >
          {LOCALES.map((code) => {
            const def = getLocale(code)
            return (
              <option key={code} value={code}>
                {def.langLabel} ({code})
              </option>
            )
          })}
        </select>
      </label>

      <div className="compare-framework-picker">
        <p className="compare-picker-label">Select frameworks to compare (click to toggle):</p>
        <div className="compare-pills">
          {frameworks.map((fw) => (
            <button
              key={fw.id}
              type="button"
              className={`compare-pill${selectedIds.includes(fw.id) ? ' compare-pill-active' : ''}`}
              onClick={() => toggleFramework(fw.id)}
            >
              {fw.name}
            </button>
          ))}
        </div>
      </div>

      <div className="compare-body">
        <div className="compare-inputs-section">
          <h2 className="compare-section-title">Inputs</h2>
          <FieldsForm fields={unionFields} values={values} onChange={handleFieldChange} />
        </div>

        <div className="compare-outputs-section">
          <h2 className="compare-section-title">
            Outputs ({selectedFrameworks.length} framework{selectedFrameworks.length !== 1 ? 's' : ''})
          </h2>
          <div className="compare-grid">
            {results.map(({ fw, result }) => (
              <CompareOutputPanel
                key={fw.id}
                result={result}
                frameworkName={fw.name}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
