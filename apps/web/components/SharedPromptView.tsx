'use client'

type SharedPrompt = {
  frameworkId: string
  locale: string
  promptText: string
  inputs: unknown
  title: string | null
  createdAt: Date
}

function buildBuilderUrl(prompt: SharedPrompt): string {
  const params = new URLSearchParams()
  params.set('framework', prompt.frameworkId)
  params.set('locale', prompt.locale)
  if (prompt.inputs && typeof prompt.inputs === 'object') {
    for (const [k, v] of Object.entries(prompt.inputs as Record<string, string>)) {
      if (v) params.set(k, v)
    }
  }
  return `/?${params.toString()}`
}

export function SharedPromptView({ prompt }: { prompt: SharedPrompt }) {
  const displayTitle = prompt.title ?? prompt.promptText.slice(0, 60)

  return (
    <main className="page">
      <div className="shared-header">
        <h1 className="shared-title">{displayTitle}</h1>
        <div className="shared-meta">
          <span className="badge">{prompt.frameworkId}</span>
          <span className="badge">{prompt.locale}</span>
          <span className="shared-date">
            {new Date(prompt.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <textarea
        className="prompt-output shared-output"
        readOnly
        value={prompt.promptText}
        rows={16}
      />

      <div className="shared-actions">
        <button
          type="button"
          className="copy-btn"
          onClick={() => navigator.clipboard.writeText(prompt.promptText)}
        >
          Copy prompt
        </button>
        <button
          type="button"
          className="auth-btn"
          onClick={() => { window.location.href = buildBuilderUrl(prompt) }}
        >
          Open in Builder
        </button>
      </div>
    </main>
  )
}
