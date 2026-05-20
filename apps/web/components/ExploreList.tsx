'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

type PublicPrompt = {
  slug: string
  frameworkId: string
  locale: string
  title: string | null
  promptText: string
  createdAt: Date
  user: { name: string | null }
}

export function ExploreList({ prompts }: { prompts: PublicPrompt[] }) {
  const [search, setSearch] = useState('')
  const [filterFramework, setFilterFramework] = useState('')

  const frameworks = useMemo(
    () => Array.from(new Set(prompts.map((p) => p.frameworkId))).sort(),
    [prompts]
  )

  const visible = useMemo(() => {
    const q = search.toLowerCase().trim()
    return prompts.filter((p) => {
      const matchesFramework = !filterFramework || p.frameworkId === filterFramework
      const matchesSearch =
        !q ||
        (p.title ?? '').toLowerCase().includes(q) ||
        p.promptText.toLowerCase().includes(q)
      return matchesFramework && matchesSearch
    })
  }, [prompts, search, filterFramework])

  if (prompts.length === 0) {
    return (
      <main className="page">
        <div className="page-nav">
          <Link href="/" className="auth-link">← Builder</Link>
        </div>
        <h1 className="history-heading">Explore</h1>
        <p className="muted-text">No public prompts yet. Save a prompt and make it public from History.</p>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-nav">
        <Link href="/" className="auth-link">← Builder</Link>
      </div>
      <h1 className="history-heading">Explore</h1>
      <p className="muted-text explore-sub">Community prompts — browse, copy, or load in Builder.</p>

      <div className="history-filters">
        <input
          type="search"
          className="history-search"
          placeholder="Search prompts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="history-filter-select"
          value={filterFramework}
          onChange={(e) => setFilterFramework(e.target.value)}
        >
          <option value="">All frameworks</option>
          {frameworks.map((fw) => (
            <option key={fw} value={fw}>{fw}</option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="muted-text">No prompts match your search.</p>
      ) : (
        <div className="history-list">
          {visible.map((p) => (
            <div key={p.slug} className="history-item">
              <div className="history-meta">
                <span className="badge">{p.frameworkId}</span>
                <span className="badge">{p.locale}</span>
                <span className="history-date">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
                {p.user.name && (
                  <span className="explore-author">{p.user.name}</span>
                )}
              </div>
              <p className="history-title">
                {p.title ?? p.promptText.slice(0, 60)}
                {!p.title && p.promptText.length > 60 ? '…' : ''}
              </p>
              <div className="history-actions">
                <Link href={`/p/${p.slug}`} className="auth-link">
                  View
                </Link>
                <button
                  type="button"
                  className="history-btn"
                  onClick={() => navigator.clipboard.writeText(p.promptText)}
                >
                  Copy prompt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
