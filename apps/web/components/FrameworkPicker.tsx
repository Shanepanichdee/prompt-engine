import { useState } from 'react';
import type { Framework } from '@prompt-engine/core';
import type { FrameworkDetail } from './frameworkDetails';

type Props = {
  frameworks: Framework[];
  selectedId: string;
  details: Record<string, FrameworkDetail>;
  onSelect: (id: string) => void;
  onUseSample: (frameworkId: string, sampleInputs: Record<string, string>) => void;
};

export function FrameworkPicker({
  frameworks,
  selectedId,
  details,
  onSelect,
  onUseSample,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="framework-grid">
      {frameworks.map((framework) => {
        const active = framework.id === selectedId;
        const detail = details[framework.id];
        const expanded = openId === framework.id;

        return (
          <div key={framework.id} className={`framework-card-wrap ${active ? 'active' : ''}`}>
            <button
              key={framework.id}
              type="button"
              className={`framework-card ${active ? 'active' : ''}`}
              onClick={() => onSelect(framework.id)}
              title={framework.description}
            >
              <div className="framework-name">{framework.name}</div>
              <div className="framework-description">{framework.description}</div>
            </button>
            <button
              type="button"
              className="framework-more"
              onClick={() => setOpenId(expanded ? null : framework.id)}
            >
              {expanded ? 'Hide details' : 'More details'}
            </button>
            {expanded && detail ? (
              <div className="framework-detail-box">
                <div><strong>What it is:</strong> {detail.whatItIs}</div>
                <div><strong>When to use:</strong> {detail.whenToUse}</div>
                <div><strong>Sample:</strong> {detail.sample}</div>
                <div className="framework-detail-actions">
                  <button
                    type="button"
                    className="framework-detail-btn"
                    onClick={() => onUseSample(framework.id, detail.sampleInputs)}
                  >
                    Try sample
                  </button>
                  <button
                    type="button"
                    className="framework-detail-btn"
                    onClick={async () => {
                      await navigator.clipboard.writeText(detail.sample);
                    }}
                  >
                    Copy sample
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
