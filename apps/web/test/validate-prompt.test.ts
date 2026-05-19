import { describe, it, expect } from 'vitest'
import { validateSavePromptBody } from '../lib/validate-prompt'

const valid = {
  frameworkId: 'rtf',
  locale: 'en',
  inputs: { role: 'teacher', task: 'explain AI', format: 'bullets' },
  promptText: 'You are a teacher.',
}

describe('validateSavePromptBody()', () => {
  it('accepts a valid body', () => {
    expect(validateSavePromptBody(valid)).toEqual({ ok: true })
  })

  it('rejects null / non-object', () => {
    expect(validateSavePromptBody(null)).toMatchObject({ ok: false })
    expect(validateSavePromptBody('string')).toMatchObject({ ok: false })
  })

  it('rejects unknown frameworkId', () => {
    expect(validateSavePromptBody({ ...valid, frameworkId: 'fake' })).toMatchObject({ ok: false })
  })

  it('rejects invalid locale', () => {
    expect(validateSavePromptBody({ ...valid, locale: 'xx' })).toMatchObject({ ok: false })
  })

  it('rejects empty promptText', () => {
    expect(validateSavePromptBody({ ...valid, promptText: '' })).toMatchObject({ ok: false })
  })

  it('rejects promptText over 8000 chars', () => {
    expect(validateSavePromptBody({ ...valid, promptText: 'x'.repeat(8001) })).toMatchObject({ ok: false })
  })

  it('rejects input value over 2000 chars', () => {
    expect(validateSavePromptBody({ ...valid, inputs: { role: 'x'.repeat(2001) } })).toMatchObject({ ok: false })
  })

  it('rejects title over 100 chars', () => {
    expect(validateSavePromptBody({ ...valid, title: 'x'.repeat(101) })).toMatchObject({ ok: false })
  })

  it('accepts optional title within limit', () => {
    expect(validateSavePromptBody({ ...valid, title: 'My prompt' })).toEqual({ ok: true })
  })
})
