'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import type { PromptResult } from '@prompt-engine/core'

type Props = {
  result: PromptResult
  frameworkName: string
  filledCount: number
  totalFields: number
  devMode: boolean
  onCopy: () => void
}

export function OutputPanel({
  result,
  frameworkName,
  filledCount,
  totalFields,
  devMode,
  onCopy,
}: Props) {
  const { data: session } = useSession()
  const [shareSlug, setShareSlug] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setShareSlug(null)
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frameworkId: result.framework,
          locale: result.locale,
          inputs: result.fields,
          promptText: result.prompt,
        }),
      })
      if (res.ok) {
        const data = (await res.json()) as { slug: string }
        setShareSlug(data.slug)
      }
    } finally {
      setSaving(false)
    }
  }

  const shareUrl =
    shareSlug && typeof window !== 'undefined'
      ? `${window.location.origin}/p/${shareSlug}`
      : null

  return (
    <section className="panel output-panel">
      <div className="output-header-row">
        <h2>Output</h2>
        <div className="output-actions">
          <button type="button" className="copy-btn" onClick={onCopy}>
            Copy
          </button>
          {session && result.prompt.length > 0 && (
            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>
      </div>

      <textarea className="prompt-output" readOnly value={result.prompt} rows={16} />

      {shareUrl && (
        <div className="share-row">
          <span className="share-label">Saved:</span>
          <a href={shareUrl} className="share-link" target="_blank" rel="noreferrer">
            {shareUrl}
          </a>
          <button
            type="button"
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(shareUrl)}
          >
            Copy link
          </button>
        </div>
      )}

      <div className="output-footer">
        {result.tokenEstimate} tokens · {frameworkName} · {result.locale} · {filledCount}/
        {totalFields} fields filled
      </div>

      {devMode ? (
        <div className="dev-box">
          <h3>Sections</h3>
          <div className="sections-list">
            {result.sections.map((section) => (
              <div key={`${section.label}-${section.text}`} className="section-item">
                [{section.label}] {section.text}
              </div>
            ))}
          </div>
          <details>
            <summary>PromptResult JSON</summary>
            <pre className="json-view">{JSON.stringify(result, null, 2)}</pre>
          </details>
        </div>
      ) : null}
    </section>
  )
}
