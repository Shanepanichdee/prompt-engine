const windows = new Map<string, number[]>()

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const prev = windows.get(key) ?? []
  const recent = prev.filter((t) => now - t < windowMs)
  if (recent.length >= limit) return false
  recent.push(now)
  windows.set(key, recent)
  return true
}

export function _resetForTesting(): void {
  windows.clear()
}
