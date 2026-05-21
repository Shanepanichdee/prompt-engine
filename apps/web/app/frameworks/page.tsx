'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { frameworks, getLocale, type LocaleCode } from '@prompt-engine/core'
import { FRAMEWORK_GUIDE } from '@/components/frameworkGuide'

const LOCALES: LocaleCode[] = ['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar']

export default function FrameworksPage() {
  const [search, setSearch] = useState('')
  const [locale, setLocale] = useState<LocaleCode>('en')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const loc = params.get('locale')
    if (loc && LOCALES.includes(loc as LocaleCode)) {
      setLocale(loc as LocaleCode)
    }
  }, [])

  const t = getLocale(locale)

  const visible = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return frameworks
    return frameworks.filter(
      (fw) =>
        fw.name.toLowerCase().includes(q) ||
        fw.description.toLowerCase().includes(q) ||
        (FRAMEWORK_GUIDE[fw.id]?.bestFor ?? '').toLowerCase().includes(q),
    )
  }, [search])

  return (
    <main className="page guide-page">
      <div className="page-nav">
        <Link href={`/${locale !== 'en' ? `?locale=${locale}` : ''}`} className="auth-link">
          {t.guide.backToBuilder}
        </Link>
        <label className="select-label" style={{ marginLeft: 'auto' }}>
          <select
            className="language-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value as LocaleCode)}
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
        </label>
      </div>

      <div className="guide-hero">
        <p className="tagline-eyebrow">{t.guide.refGuide}</p>
        <h1 className="guide-title">14 Prompt Engineering Frameworks</h1>
        <p className="guide-subtitle">
          Understand which framework fits your task — pros, cons, and when to use each methodology.
        </p>
      </div>

      <div className="guide-search-row">
        <input
          type="search"
          className="guide-search"
          placeholder={t.guide.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="guide-count">{visible.length} of {frameworks.length}</span>
      </div>

      <div className="guide-grid">
        {visible.map((fw) => {
          const guide = FRAMEWORK_GUIDE[fw.id]
          return (
            <article key={fw.id} className="guide-card">
              <div className="guide-card-header">
                <div>
                  <h2 className="guide-card-name">{fw.name}</h2>
                  <p className="guide-card-acronym">{fw.description}</p>
                </div>
                <Link
                  href={`/?framework=${fw.id}${locale !== 'en' ? `&locale=${locale}` : ''}`}
                  className="guide-try-link"
                >
                  {t.guide.tryIt}
                </Link>
              </div>

              {guide && (
                <>
                  <div className="guide-pros-cons">
                    <div className="guide-pros">
                      <p className="guide-list-label">{t.guide.strengths}</p>
                      <ul>
                        {guide.pros.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                    <div className="guide-cons">
                      <p className="guide-list-label">{t.guide.limitations}</p>
                      <ul>
                        {guide.cons.map((c) => <li key={c}>{c}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="guide-tags">
                    <div className="guide-tag guide-tag-best">
                      <span className="guide-tag-label">{t.guide.bestFor}</span>
                      <span>{guide.bestFor}</span>
                    </div>
                    <div className="guide-tag guide-tag-avoid">
                      <span className="guide-tag-label">{t.guide.avoidWhen}</span>
                      <span>{guide.avoid}</span>
                    </div>
                  </div>
                </>
              )}
            </article>
          )
        })}
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
