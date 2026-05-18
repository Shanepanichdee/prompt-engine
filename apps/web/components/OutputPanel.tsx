import type { PromptResult } from '@prompt-engine/core';

type Props = {
  result: PromptResult;
  frameworkName: string;
  filledCount: number;
  totalFields: number;
  devMode: boolean;
  onCopy: () => void;
};

export function OutputPanel({
  result,
  frameworkName,
  filledCount,
  totalFields,
  devMode,
  onCopy,
}: Props) {
  return (
    <section className="panel output-panel">
      <div className="output-header-row">
        <h2>Output</h2>
        <button type="button" className="copy-btn" onClick={onCopy}>
          Copy
        </button>
      </div>
      <textarea className="prompt-output" readOnly value={result.prompt} rows={16} />

      <div className="output-footer">
        {result.tokenEstimate} tokens · {frameworkName} · {result.locale} · {filledCount}/{totalFields} fields filled
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
  );
}
