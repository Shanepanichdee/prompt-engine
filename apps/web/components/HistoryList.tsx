'use client'

import { useState } from 'react'
import Link from 'next/link'

type SavedPrompt = {
  id: string
  slug: string
  frameworkId: string
  locale: string
  title: string | null
  promptText: string
  createdAt: Date
}

export function HistoryList({ prompts: initial }: { prompts: SavedPrompt[] }) {
  const [prompts, setPrompts] = useState(initial)

  const handleDelete = async (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id))
    await fetch(`/api/prompts/${id}`, { method: 'DELETE' })
  }

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`)
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
      <div className="history-list">
        {prompts.map((p) => (
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
                className="history-btn danger"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
