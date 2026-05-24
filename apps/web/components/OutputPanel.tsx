'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { frameworks, type PromptResult } from '@prompt-engine/core'

function ClaudeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="5.5" rx="2.2" ry="4.5" fill="#D97706" transform="rotate(0 12 12)"/>
      <ellipse cx="12" cy="5.5" rx="2.2" ry="4.5" fill="#D97706" transform="rotate(120 12 12)"/>
      <ellipse cx="12" cy="5.5" rx="2.2" ry="4.5" fill="#D97706" transform="rotate(240 12 12)"/>
    </svg>
  )
}

function ChatGPTIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#10A37F" aria-hidden="true">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.894zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  )
}

function GeminiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C9 9 2 12 2 12C2 12 9 15 12 22C15 15 22 12 22 12C22 12 15 9 12 2Z" fill="#4285F4"/>
    </svg>
  )
}

function CopilotIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0078D4" aria-hidden="true">
      <path d="M18.36 5.64A9 9 0 1 1 18.36 18.36L15.89 15.89A5.5 5.5 0 1 0 15.89 8.11Z"/>
    </svg>
  )
}

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
          <button type="button" className="ai-btn" onClick={() => openInAI('https://claude.ai/new')}>
            <ClaudeIcon />
            <span>Claude</span>
          </button>
          <button type="button" className="ai-btn" onClick={() => openInAI('https://chat.openai.com/')}>
            <ChatGPTIcon />
            <span>ChatGPT</span>
          </button>
          <button type="button" className="ai-btn" onClick={() => openInAI('https://gemini.google.com/')}>
            <GeminiIcon />
            <span>Gemini</span>
          </button>
          <button type="button" className="ai-btn" onClick={() => openInAI('https://copilot.microsoft.com/')}>
            <CopilotIcon />
            <span>Copilot</span>
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
