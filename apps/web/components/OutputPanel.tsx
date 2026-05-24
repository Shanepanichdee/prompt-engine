'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  result: PromptResult | null
  frameworkName: string
  filledCount: number
  totalFields: number
  onCopy: () => void
}

export function OutputPanel({
  result,
  frameworkName,
  filledCount,
  totalFields,
  onCopy,
}: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [devMode, setDevMode] = useState(false)
  const [shareSlug, setShareSlug] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [aiCopied, setAiCopied] = useState(false)

  const handleSave = async () => {
    if (!result) return
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
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  async function openInAI(url: string) {
    if (!result) return
    await navigator.clipboard.writeText(result.prompt)
    window.open(url, '_blank')
    setAiCopied(true)
    setTimeout(() => setAiCopied(false), 3000)
  }

  const shareUrl =
    shareSlug && typeof window !== 'undefined'
      ? `${window.location.origin}/p/${shareSlug}`
      : null

  const hasOutput = !!result && result.prompt.length > 0
  const canSave = !!session?.user?.isPro && hasOutput
  const showUpgradeNudge = !!session && !session.user.isPro && hasOutput
  const showSignIn = !session && hasOutput

  return (
    <section className="panel output-panel">
      <div className="output-header-row">
        <h2>Output</h2>
        <div className="output-actions">
          {hasOutput && (
            <button type="button" className="copy-btn" onClick={onCopy}>
              Copy
            </button>
          )}
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
          {showUpgradeNudge && (
            <a href="/pricing" className="save-upgrade-nudge">
              Pro to save ↗
            </a>
          )}
          {showSignIn && (
            <a href="/api/auth/signin" className="save-upgrade-nudge">
              Sign in to save
            </a>
          )}
        </div>
      </div>

      {hasOutput ? (
        <textarea className="prompt-output" readOnly value={result!.prompt} rows={16} />
      ) : (
        <div className="output-placeholder">
          <div className="output-placeholder-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="14" fill="#D4EEEE"/>
              <path d="M15 24h18M15 18h18M15 30h12" stroke="#008080" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="36" cy="30" r="5" fill="#008080"/>
              <path d="M34.5 30l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="output-placeholder-title">Your prompt will appear here</p>
          <p className="output-placeholder-sub">Follow these steps to generate your first prompt</p>
          <ol className="output-placeholder-steps">
            <li>Choose a framework from the left</li>
            <li>Fill in the input fields</li>
            <li>Click <strong>Generate Prompt</strong></li>
          </ol>
        </div>
      )}

      {hasOutput && (
        <div className="export-row">
          <button
            type="button"
            className="export-btn"
            onClick={() => navigator.clipboard.writeText(toMarkdown(result!))}
          >
            Copy as Markdown
          </button>
          <button
            type="button"
            className="export-btn"
            onClick={() => downloadTxt(result!.prompt, result!.framework)}
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
          <button
            type="button"
            className="ai-btn"
            onClick={() => openInAI('https://gemini.google.com/')}
          >
            Gemini ↗
          </button>
          <button
            type="button"
            className="ai-btn"
            onClick={() => openInAI('https://copilot.microsoft.com/')}
          >
            Copilot ↗
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

      {hasOutput && (
        <div className="output-footer">
          {result!.tokenEstimate} tokens · {frameworkName} · {result!.locale} · {filledCount}/
          {totalFields} fields filled
        </div>
      )}

      <button
        type="button"
        className={`dev-toggle-btn${devMode ? ' dev-toggle-btn-active' : ''}`}
        onClick={() => setDevMode((v) => !v)}
      >
        {devMode ? 'Hide dev' : 'Dev'}
      </button>

      {devMode && result && (
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
      )}
    </section>
  )
}
