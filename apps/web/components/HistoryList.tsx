'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

type SavedPrompt = {
  id: string
  slug: string
  frameworkId: string
  locale: string
  title: string | null
  promptText: string
  inputs: unknown
  isPublic: boolean
  createdAt: Date
}

function buildBuilderUrl(p: SavedPrompt): string {
  const params = new URLSearchParams()
  params.set('framework', p.frameworkId)
  params.set('locale', p.locale)
  if (p.inputs && typeof p.inputs === 'object') {
    for (const [k, v] of Object.entries(p.inputs as Record<string, string>)) {
      if (v) params.set(k, v)
    }
  }
  return `/?${params.toString()}`
}

export function HistoryList({ prompts: initial }: { prompts: SavedPrompt[] }) {
  const [prompts, setPrompts] = useState(initial)
  const [search, setSearch] = useState('')
  const [filterFramework, setFilterFramework] = useState('')

  const frameworks = useMemo(
    () => Array.from(new Set(initial.map((p) => p.frameworkId))).sort(),
    [initial]
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

  const handleDelete = async (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id))
    await fetch(`/api/prompts/${id}`, { method: 'DELETE' })
  }

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`)
  }

  const handleTogglePublic = async (id: string, currentIsPublic: boolean) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPublic: !currentIsPublic } : p))
    )
    await fetch(`/api/prompts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic: !currentIsPublic }),
    })
  }

  if (prompts.length === 0) {
    return (
      <main className="page">
        <h1 className="history-heading">History</h1>
        <p className="muted-text">No saved prompts yet. Build one and hit Save.</p>
      </main>
    )
  }

  return (
    <main className="page">
      <h1 className="history-heading">History</h1>

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
            <div key={p.id} className="history-item">
              <div className="history-meta">
                <span className="badge">{p.frameworkId}</span>
                <span className="badge">{p.locale}</span>
                <span className="history-date">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="history-title">
                {p.title ?? p.promptText.slice(0, 60)}
                {!p.title && p.promptText.length > 60 ? '…' : ''}
              </p>
              <div className="history-actions">
                <Link href={buildBuilderUrl(p)} className="auth-link">
                  Load in Builder
                </Link>
                <Link href={`/p/${p.slug}`} className="auth-link">
                  View
                </Link>
                <button
                  type="button"
                  className="history-btn"
                  onClick={() => handleCopyLink(p.slug)}
                >
                  Copy link
                </button>
                <button
                  type="button"
                  className={`history-btn ${p.isPublic ? 'public-active' : ''}`}
                  onClick={() => handleTogglePublic(p.id, p.isPublic)}
                >
                  {p.isPublic ? 'Public ✓' : 'Make public'}
                </button>
                <button
                  type="button"
                  className="history-btn danger"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
