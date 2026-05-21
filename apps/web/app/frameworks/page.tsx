'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { frameworks } from '@prompt-engine/core'
import { FRAMEWORK_GUIDE } from '@/components/frameworkGuide'

export default function FrameworksPage() {
  const [search, setSearch] = useState('')

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
        <Link href="/" className="auth-link">← Builder</Link>
      </div>

      <div className="guide-hero">
        <p className="tagline-eyebrow">Reference Guide</p>
        <h1 className="guide-title">14 Prompt Engineering Frameworks</h1>
        <p className="guide-subtitle">
          Understand which framework fits your task — pros, cons, and when to use each methodology.
        </p>
      </div>

      <div className="guide-search-row">
        <input
          type="search"
          className="guide-search"
          placeholder="Search frameworks…"
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
                <Link href={`/?framework=${fw.id}`} className="guide-try-link">
                  Try it →
                </Link>
              </div>

              {guide && (
                <>
                  <div className="guide-pros-cons">
                    <div className="guide-pros">
                      <p className="guide-list-label">Strengths</p>
                      <ul>
                        {guide.pros.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                    <div className="guide-cons">
                      <p className="guide-list-label">Limitations</p>
                      <ul>
                        {guide.cons.map((c) => <li key={c}>{c}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="guide-tags">
                    <div className="guide-tag guide-tag-best">
                      <span className="guide-tag-label">Best for</span>
                      <span>{guide.bestFor}</span>
                    </div>
                    <div className="guide-tag guide-tag-avoid">
                      <span className="guide-tag-label">Avoid when</span>
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
