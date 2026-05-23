type ProCheckInput = {
  subscriptionStatus: string | null | undefined
  dayPassExpiry: Date | null | undefined
}

export function isPro(user: ProCheckInput): boolean {
  if (user.subscriptionStatus === 'active') return true
  if (user.dayPassExpiry && user.dayPassExpiry > new Date()) return true
  return false
}
