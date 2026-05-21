'use client'

import { useState } from 'react'
import type { ContextPattern } from '@prompt-engine/core'
import type { ContextPatternDetail } from './contextPatternDetails'

type Props = {
  patterns: ContextPattern[]
  selectedId: string
  details: Record<string, ContextPatternDetail>
  onSelect: (id: string) => void
  onUseSample: (id: string, sampleInputs: Record<string, string>) => void
}

export function ContextPatternPicker({ patterns, selectedId, details, onSelect, onUseSample }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="framework-grid">
      {patterns.map((pattern) => {
        const active = pattern.id === selectedId
        const detail = details[pattern.id]
        const expanded = openId === pattern.id
        const layerClass = `layer-badge layer-badge-${pattern.layer.toLowerCase()}`

        return (
          <div key={pattern.id} className={`framework-card-wrap ${active ? 'active' : ''}`}>
            <button
              type="button"
              className={`framework-card ${active ? 'active' : ''}`}
              onClick={() => onSelect(pattern.id)}
            >
              <div className="framework-name">
                {pattern.name}
                <span className={layerClass}>{pattern.layer}</span>
                {detail && (
                  <span className={`use-type-badge use-type-${detail.type}`}>
                    {detail.type === 'direct' ? '✓ No code needed' : '{ } Requires code'}
                  </span>
                )}
              </div>
              <div className="framework-description">{pattern.description}</div>
            </button>
            <button
              type="button"
              className="framework-more"
              onClick={() => setOpenId(expanded ? null : pattern.id)}
            >
              {expanded ? 'Hide details' : 'More details'}
            </button>
            {expanded && detail && (
              <div className="framework-detail-box">
                <div><strong>What it is:</strong> {detail.whatItIs}</div>
                <div><strong>When to use:</strong> {detail.whenToUse}</div>
                <div><strong>Sample:</strong> {detail.sample}</div>
                <div className="where-to-use-box">
                  <strong>{detail.type === 'direct' ? '📋 Where to paste the output:' : '⚙️ How to deploy in code:'}</strong>
                  <p>{detail.whereToUse}</p>
                </div>
                <div className="framework-detail-actions">
                  <button
                    type="button"
                    className="framework-detail-btn"
                    onClick={() => onUseSample(pattern.id, detail.sampleInputs)}
                  >
                    Try sample
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
