'use client'

import { useState, useMemo } from 'react'
import { contextPatterns, buildContext } from '@prompt-engine/core'
import { FieldsForm } from '../../components/FieldsForm'
import { ContextPatternPicker } from '../../components/ContextPatternPicker'
import { TopBar } from '../../components/TopBar'
import { CONTEXT_PATTERN_DETAILS } from '../../components/contextPatternDetails'

export default function ContextPage() {
  const [patternId, setPatternId] = useState<string>(contextPatterns[0]?.id ?? 'system-prompt')
  const [values, setValues] = useState<Record<string, string>>({})
  const [darkMode, setDarkMode] = useState(false)
  const [copied, setCopied] = useState(false)

  const selectedPattern = useMemo(
    () => contextPatterns.find((p) => p.id === patternId) ?? contextPatterns[0],
    [patternId]
  )

  const result = useMemo(() => {
    if (!selectedPattern) return null
    return buildContext(selectedPattern, values)
  }, [selectedPattern, values])

  const filledCount = useMemo(() => {
    if (!selectedPattern) return 0
    return selectedPattern.fields.filter((f) => (values[f.key] ?? '').trim().length > 0).length
  }, [selectedPattern, values])

  const handlePatternSelect = (id: string) => {
    setPatternId(id)
    setValues({})
  }

  const handleFieldChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleUseSample = (id: string, sampleInputs: Record<string, string>) => {
    setPatternId(id)
    setValues(sampleInputs)
  }

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!selectedPattern || !result) {
    return <main className="page">No context pattern available.</main>
  }

  return (
    <main className={`page${darkMode ? ' dark' : ''}`}>
      <TopBar darkMode={darkMode} onDarkMode={setDarkMode} />

      <div className="tagline-strip">
        <p className="tagline-eyebrow">Context Engineering</p>
        <h1 className="tagline-headline">Design Your AI Context Window</h1>
        <p className="tagline-sub">
          Structure the full context that drives your AI system — system prompts, RAG injection, memory management, and multi-agent handoffs.
        </p>
      </div>

      <div className="layout">
        <section className="panel builder-panel">
          <h3 className="section-title">Patterns</h3>
          <ContextPatternPicker
            patterns={contextPatterns}
            selectedId={selectedPattern.id}
            details={CONTEXT_PATTERN_DETAILS}
            onSelect={handlePatternSelect}
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
          <FieldsForm fields={selectedPattern.fields} values={values} onChange={handleFieldChange} />
        </section>

        <section className="panel output-panel">
          <div className="output-header-row">
            <h2>Context Template</h2>
            <button type="button" className="copy-btn" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea className="prompt-output" readOnly value={result.prompt} rows={16} />
          <div className="output-footer">
            {result.tokenEstimate} tokens · {selectedPattern.name} · {filledCount}/{selectedPattern.fields.length} fields filled
          </div>
        </section>
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
  )
}
