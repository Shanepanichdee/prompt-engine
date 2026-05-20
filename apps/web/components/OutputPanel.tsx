'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { frameworks, type PromptResult } from '@prompt-engine/core'

function autoTitle(result: PromptResult): string {
  const fw = frameworks.find((f) => f.id === result.framework)
  if (!fw) return ''
  const parts = fw.fields
    .filter((f) => f.required)
    .slice(0, 2)
    .map((f) => result.fields[f.key])
    .filter(Boolean)
  return parts.join(' — ')
}

function toMarkdown(result: PromptResult): string {
  return result.sections
    .map((s) => `## ${s.label}\n\n${s.text}`)
    .join('\n\n')
}

function downloadTxt(prompt: string, frameworkId: string) {
  const blob = new Blob([prompt], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `prompt-${frameworkId}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

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
  const [title, setTitle] = useState('')
  const [aiCopied, setAiCopied] = useState(false)

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
          title: title.trim() || autoTitle(result) || undefined,
        }),
      })
      if (res.ok) {
        const data = (await res.json()) as { slug: string }
        setShareSlug(data.slug)
        setTitle('')
      }
    } finally {
      setSaving(false)
    }
  }

  async function openInAI(url: string) {
    await navigator.clipboard.writeText(result.prompt)
    window.open(url, '_blank')
    setAiCopied(true)
    setTimeout(() => setAiCopied(false), 3000)
  }

  const shareUrl =
    shareSlug && typeof window !== 'undefined'
      ? `${window.location.origin}/p/${shareSlug}`
      : null

  const canSave = session && result.prompt.length > 0
  const hasOutput = result.prompt.length > 0

  return (
    <section className="panel output-panel">
      <div className="output-header-row">
        <h2>Output</h2>
        <div className="output-actions">
          <button type="button" className="copy-btn" onClick={onCopy}>
            Copy
          </button>
          {canSave && (
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

      {hasOutput && (
        <div className="export-row">
          <button
            type="button"
            className="export-btn"
            onClick={() => navigator.clipboard.writeText(toMarkdown(result))}
          >
            Copy as Markdown
          </button>
          <button
            type="button"
            className="export-btn"
            onClick={() => downloadTxt(result.prompt, result.framework)}
          >
            Download .txt
          </button>
        </div>
      )}

      {hasOutput && (
        <div className="ai-row">
          <span className="ai-row-label">Send to:</span>
          <button
            type="button"
            className="ai-btn"
            onClick={() => openInAI('https://claude.ai/new')}
          >
            Claude ↗
          </button>
          <button
            type="button"
            className="ai-btn"
            onClick={() => openInAI('https://chat.openai.com/')}
          >
            ChatGPT ↗
          </button>
          {aiCopied && (
            <span className="ai-copied-toast">Copied! Paste in the chat.</span>
          )}
        </div>
      )}

      {canSave && (
        <input
          type="text"
          className="title-input"
          placeholder="Title (optional) — leave blank to auto-generate"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
        />
      )}

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
