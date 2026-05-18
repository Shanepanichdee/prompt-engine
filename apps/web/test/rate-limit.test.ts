import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkRateLimit, _resetForTesting } from '../lib/rate-limit'

describe('checkRateLimit()', () => {
  beforeEach(() => _resetForTesting())

  it('allows requests under the limit', () => {
    expect(checkRateLimit('key-a', 3, 60_000)).toBe(true)
    expect(checkRateLimit('key-a', 3, 60_000)).toBe(true)
    expect(checkRateLimit('key-a', 3, 60_000)).toBe(true)
  })

  it('blocks when limit is exceeded', () => {
    checkRateLimit('key-b', 2, 60_000)
    checkRateLimit('key-b', 2, 60_000)
    expect(checkRateLimit('key-b', 2, 60_000)).toBe(false)
  })

  it('allows again after window expires', () => {
    vi.useFakeTimers()
    checkRateLimit('key-c', 1, 1_000)
    expect(checkRateLimit('key-c', 1, 1_000)).toBe(false)
    vi.advanceTimersByTime(1_001)
    expect(checkRateLimit('key-c', 1, 1_000)).toBe(true)
    vi.useRealTimers()
  })

  it('tracks different keys independently', () => {
    checkRateLimit('key-d', 1, 60_000)
    expect(checkRateLimit('key-d', 1, 60_000)).toBe(false)
    expect(checkRateLimit('key-e', 1, 60_000)).toBe(true)
  })
})
