import { frameworks } from '@prompt-engine/core'

const VALID_LOCALES = new Set(['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ar'])
const VALID_FRAMEWORK_IDS = new Set(frameworks.map((f) => f.id))

export type ValidationResult = { ok: true } | { ok: false; error: string }

export function validateSavePromptBody(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Body must be an object' }
  }

  const b = body as Record<string, unknown>

  if (!VALID_FRAMEWORK_IDS.has(b['frameworkId'] as string)) {
    return { ok: false, error: 'Invalid frameworkId' }
  }

  if (!VALID_LOCALES.has(b['locale'] as string)) {
    return { ok: false, error: 'Invalid locale' }
  }

  if (
    typeof b['promptText'] !== 'string' ||
    b['promptText'].length === 0 ||
    b['promptText'].length > 8000
  ) {
    return { ok: false, error: 'promptText must be 1–8000 chars' }
  }

  if (!b['inputs'] || typeof b['inputs'] !== 'object' || Array.isArray(b['inputs'])) {
    return { ok: false, error: 'inputs must be an object' }
  }

  for (const val of Object.values(b['inputs'] as Record<string, unknown>)) {
    if (typeof val !== 'string' || val.length > 2000) {
      return { ok: false, error: 'Each input value must be ≤ 2000 chars' }
    }
  }

  if (b['title'] !== undefined) {
    if (typeof b['title'] !== 'string' || b['title'].length > 100) {
      return { ok: false, error: 'title must be a string ≤ 100 chars' }
    }
  }

  return { ok: true }
}
