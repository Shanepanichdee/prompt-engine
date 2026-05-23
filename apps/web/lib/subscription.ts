export type ProCheckInput = {
  subscriptionStatus: string | null | undefined
  dayPassExpiry: Date | null | undefined
}

export function isPro(user: ProCheckInput): boolean {
  if (user.subscriptionStatus === 'active') return true
  if (user.dayPassExpiry && user.dayPassExpiry > new Date()) return true
  return false
}

export const FREE_FRAMEWORK_IDS = ['rtf', 'costar', 'risen', 'ape'] as const
export type FreeFrameworkId = (typeof FREE_FRAMEWORK_IDS)[number]

export function isFreeFramework(id: string): boolean {
  return (FREE_FRAMEWORK_IDS as readonly string[]).includes(id)
}
