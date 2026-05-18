import type { Field } from '@prompt-engine/core';

type Props = {
  fields: Field[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

export function FieldsForm({ fields, values, onChange }: Props) {
  return (
    <div className="fields-list">
      {fields.map((field) => (
        <label key={field.key} className="field-block">
          <div className="field-label-row">
            <span className="field-label">{field.label}</span>
            {field.required ? <span className="field-required">*</span> : null}
          </div>
          <textarea
            className="field-input"
            value={values[field.key] ?? ''}
            placeholder={field.placeholder ?? field.description}
            onChange={(event) => onChange(field.key, event.target.value)}
            rows={3}
          />
          <div className="field-hint">{field.description}</div>
        </label>
      ))}
    </div>
  );
}
