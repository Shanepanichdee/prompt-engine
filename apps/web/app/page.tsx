'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { build, frameworks, getLocale, type LocaleCode, type PromptResult } from '@prompt-engine/core'
import { FieldsForm } from '../components/FieldsForm'
import { FrameworkPicker } from '../components/FrameworkPicker'
import { OutputPanel } from '../components/OutputPanel'
import { TopBar } from '../components/TopBar'
import { FRAMEWORK_DETAILS } from '../components/frameworkDetails'
import { DAILY_LIMIT, FREE_FRAMEWORK_IDS, isFreeFramework } from '../lib/subscription'

const LOCALES: LocaleCode[] = ['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar']

export default function Page() {
  const { data: session } = useSession()
  const [locale, setLocale] = useState<LocaleCode>('en')
  const [frameworkId, setFrameworkId] = useState<string>(frameworks[0]?.id ?? 'rtf')
  const [values, setValues] = useState<Record<string, string>>({})
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [generatedResult, setGeneratedResult] = useState<PromptResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLimitHit, setIsLimitHit] = useState(false)
  const [usageRemaining, setUsageRemaining] = useState<number | null>(null)
  const [showLockedNudge, setShowLockedNudge] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fw = params.get('framework')
    const loc = params.get('locale')
    const matchedFramework = fw ? frameworks.find((f) => f.id === fw) : null
    if (matchedFramework) {
      // Gate: only load Pro frameworks from URL if they are free.
      // Since session isn't known at mount time, default to the first free framework for
      // locked ones. Pro users can manually select after session loads (within 1-2 renders).
      const frameworkToLoad = isFreeFramework(matchedFramework.id)
        ? matchedFramework
        : frameworks.find((f) => isFreeFramework(f.id)) ?? matchedFramework
      setFrameworkId(frameworkToLoad.id)
      const loaded: Record<string, string> = {}
      for (const field of frameworkToLoad.fields) {
        const val = params.get(field.key)
        if (val) loaded[field.key] = val
      }
      if (Object.keys(loaded).length > 0) setValues(loaded)
    }
    if (loc && LOCALES.includes(loc as LocaleCode)) {
      setLocale(loc as LocaleCode)
    }
  }, [])

  const selectedFramework = useMemo(
    () => frameworks.find((item) => item.id === frameworkId) ?? frameworks[0],
    [frameworkId]
  )

  const isPro = session?.user?.isPro ?? false

  const filledCount = useMemo(() => {
    if (!selectedFramework) return 0
    return selectedFramework.fields.filter((field) => (values[field.key] ?? '').trim().length > 0).length
  }, [selectedFramework, values])

  const handleFrameworkSelect = (id: string) => {
    if (!isPro && !isFreeFramework(id)) {
      setShowLockedNudge(true)
      return
    }
    setShowLockedNudge(false)
    setFrameworkId(id)
    setValues({})
    setGeneratedResult(null)
  }

  const handleFieldChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleUseSample = (id: string, sampleInputs: Record<string, string>) => {
    if (!isPro && !isFreeFramework(id)) {
      setShowLockedNudge(true)
      return
    }
    setShowLockedNudge(false)
    setFrameworkId(id)
    setValues(sampleInputs)
    setGeneratedResult(null)
  }

  const handleCopy = async () => {
    if (!generatedResult) return
    await navigator.clipboard.writeText(generatedResult.prompt)
  }

  const handleGenerate = async () => {
    if (!selectedFramework || isGenerating) return

    setIsGenerating(true)
    try {
      if (!session) {
        // Anonymous: localStorage tracking
        const today = new Date().toDateString()
        const raw = localStorage.getItem('pe_usage')
        const stored = raw
          ? (JSON.parse(raw) as { date: string; count: number })
          : { date: '', count: 0 }
        const count = stored.date === today ? stored.count : 0
        if (count >= DAILY_LIMIT) {
          setIsLimitHit(true)
          return
        }
        localStorage.setItem('pe_usage', JSON.stringify({ date: today, count: count + 1 }))
        setUsageRemaining(DAILY_LIMIT - count - 1)
      } else if (!isPro) {
        // Logged-in free user: server check
        const res = await fetch('/api/generate', { method: 'POST' })
        if (!res.ok) {
          // Server error — don't generate, don't trip the limit flag
          return
        }
        const data = (await res.json()) as { allowed: boolean; remaining: number | null }
        if (!data.allowed) {
          setIsLimitHit(true)
          return
        }
        setUsageRemaining(data.remaining)
      }
      // Pro users: skip all checks

      const result = build(selectedFramework, values, locale)
      setGeneratedResult(result)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!selectedFramework) {
    return <main className="page">No framework available.</main>
  }

  return (
    <main className={`page${darkMode ? ' dark' : ''}`}>
      <TopBar darkMode={darkMode} onDarkMode={setDarkMode} />

      <div className="tagline-strip">
        <p className="tagline-eyebrow">Prompt Engineering Platform</p>
        <h1 className="tagline-headline">Engineer AI Prompts That Deliver Results</h1>
        <p className="tagline-sub">Apply industry-tested frameworks to structure your prompts with precision — 14 methodologies, 10 languages, professional-grade output.</p>
        <Link href={`/frameworks${locale !== 'en' ? `?locale=${locale}` : ''}`} className="guide-hero-cta">Explore all 14 frameworks →</Link>
      </div>

      <div className="layout">
        <section className="panel builder-panel">
          <label className="select-label">
            Language
            <div className="language-select-wrap">
              <svg className="language-globe-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25"/>
                <path d="M8 1.5C8 1.5 6 4 6 8s2 6.5 2 6.5M8 1.5C8 1.5 10 4 10 8s-2 6.5-2 6.5M1.5 8h13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              </svg>
              <select
                className="language-select"
                value={locale}
                onChange={(event) => setLocale(event.target.value as LocaleCode)}
              >
              {LOCALES.map((code) => {
                const localeDef = getLocale(code)
                return (
                  <option key={code} value={code}>
                    {localeDef.langLabel} ({code})
                  </option>
                )
              })}
            </select>
            </div>
          </label>

          <h3 className="section-title">Frameworks</h3>
          <FrameworkPicker
            frameworks={frameworks}
            selectedId={selectedFramework.id}
            details={FRAMEWORK_DETAILS}
            freeFrameworkIds={FREE_FRAMEWORK_IDS}
            isPro={isPro}
            onSelect={handleFrameworkSelect}
            onUseSample={handleUseSample}
          />

          {showLockedNudge && (
            <div className="locked-framework-nudge">
              This framework is Pro only. <a href="/pricing">Upgrade to unlock all 14 →</a>
            </div>
          )}

          <div className="section-title-row">
            <h3 className="section-title">Inputs</h3>
            {filledCount > 0 && (
              <button type="button" className="clear-btn" onClick={() => setValues({})}>
                Clear all
              </button>
            )}
          </div>
          <FieldsForm fields={selectedFramework.fields} values={values} onChange={handleFieldChange} />

          {isLimitHit ? (
            <div className="limit-hit-wall">
              <p className="limit-hit-msg">Daily limit reached — 5/5 free generates used.</p>
              <a href="/pricing" className="generate-btn generate-btn-upgrade">
                Upgrade to Pro for unlimited →
              </a>
            </div>
          ) : (
            <button
              type="button"
              className="generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating || filledCount === 0}
            >
              {isGenerating ? 'Generating…' : 'Generate Prompt →'}
            </button>
          )}

          {usageRemaining !== null && !isLimitHit && (
            <p className="usage-counter">
              {usageRemaining} of {DAILY_LIMIT} free generates remaining today ·{' '}
              <a href="/pricing">Go Pro for unlimited</a>
            </p>
          )}
        </section>

        <OutputPanel
          result={generatedResult}
          frameworkName={selectedFramework.name}
          filledCount={filledCount}
          totalFields={selectedFramework.fields.length}
          onCopy={handleCopy}
        />
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
