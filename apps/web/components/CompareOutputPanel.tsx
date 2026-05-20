'use client'

import type { PromptResult } from '@prompt-engine/core'

type Props = {
  result: PromptResult
  frameworkName: string
}

export function CompareOutputPanel({ result, frameworkName }: Props) {
  return (
    <div className="compare-panel">
      <div className="compare-panel-header">
        <span className="compare-framework-name">{frameworkName}</span>
        <span className="compare-token-count">{result.tokenEstimate} tokens</span>
        {result.prompt.length > 0 && (
          <button
            type="button"
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(result.prompt)}
          >
            Copy
          </button>
        )}
      </div>
      <textarea
        className="prompt-output compare-output"
        readOnly
        value={result.prompt}
        rows={14}
      />
    </div>
  )
}
