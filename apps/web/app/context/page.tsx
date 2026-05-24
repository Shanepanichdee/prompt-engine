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

      <div className="context-howto">
        <div className="howto-step">
          <span className="howto-num">1</span>
          <div className="howto-content">
            <strong>Pick a pattern</strong>
            <p>Choose the context layer that fits your AI system. Start with System Prompt — then add RAG, Memory, or Tools on top.</p>
          </div>
        </div>
        <div className="howto-divider" />
        <div className="howto-step">
          <span className="howto-num">2</span>
          <div className="howto-content">
            <strong>Fill the fields</strong>
            <p>Describe your AI system's role and rules. Not sure what to write? Click <em>Try sample</em> on any pattern to load a real example.</p>
          </div>
        </div>
        <div className="howto-divider" />
        <div className="howto-step">
          <span className="howto-num">3</span>
          <div className="howto-content">
            <strong>Copy &amp; deploy</strong>
            <p>Paste the output as your system prompt. Markers like <code>{'{{CONTEXT}}'}</code> are injection points — replace them in your code with real data at runtime.</p>
          </div>
        </div>
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
          {(() => {
            const detail = CONTEXT_PATTERN_DETAILS[selectedPattern.id]
            if (!detail) return null
            return detail.type === 'direct' ? (
              <div className="output-next-step next-step-direct">
                <strong>Ready to use — no code needed.</strong> Copy this output and paste it as the system prompt / instructions in{' '}
                <strong>ChatGPT Custom Instructions</strong>, a <strong>ChatGPT GPT</strong>, a <strong>Claude Project</strong>, or the <strong>OpenAI Playground System field</strong>.
              </div>
            ) : (
              <div className="output-next-step next-step-code">
                <strong>Requires code to deploy.</strong> The <code>{'{{PLACEHOLDERS}}'}</code> in this template are runtime injection points — your application code replaces them with real data before calling the AI API. Click <em>More details</em> on the pattern for step-by-step deployment instructions.
              </div>
            )
          })()}
          <div className="output-footer">
            {result.tokenEstimate} tokens · {selectedPattern.name} · {filledCount}/{selectedPattern.fields.length} fields filled
          </div>
        </section>
      </div>

      <footer className="page-footer">
        <div className="page-footer-links">
          <a href="https://qr-engine.data-shane.com" target="_blank" rel="noreferrer">QR Code Engine</a>
          <span className="page-footer-dot" />
          <a href="/pricing">Pricing</a>
          <span className="page-footer-dot" />
          <a href="/privacy">Privacy Policy</a>
          <span className="page-footer-dot" />
          <a href="/terms">Terms of Use</a>
        </div>
        <div className="page-footer-brand">
          Built by{' '}
          <a href="https://datashane.com" target="_blank" rel="noreferrer">datashane.com</a>
        </div>
      </footer>
    </main>
  )
}
