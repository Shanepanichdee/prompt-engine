import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { DAILY_LIMIT } from '@/lib/subscription'

export async function POST() {
  const session = await auth()

  // Anonymous users: client handles localStorage tracking
  if (!session?.user?.id) {
    return NextResponse.json({ allowed: true, remaining: null, anonymous: true })
  }

  // Pro users: unlimited
  if (session.user.isPro) {
    return NextResponse.json({ allowed: true, remaining: null })
  }

  // Logged-in free users: check DB counter
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { freeUsageCount: true, freeUsageDate: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)

  const isNewDay = !user.freeUsageDate || user.freeUsageDate < todayStart
  const currentCount = isNewDay ? 0 : user.freeUsageCount

  if (currentCount >= DAILY_LIMIT) {
    return NextResponse.json({ allowed: false, remaining: 0 })
  }

  // Atomic update with optimistic lock — only succeeds if count is still < DAILY_LIMIT
  const updated = await db.user.updateMany({
    where: {
      id: session.user.id,
      ...(isNewDay ? {} : { freeUsageCount: { lt: DAILY_LIMIT } }),
    },
    data: isNewDay
      ? { freeUsageCount: 1, freeUsageDate: new Date() }
      : { freeUsageCount: { increment: 1 } },
  })

  if (updated.count === 0) {
    // Race condition: another concurrent request hit the limit first
    return NextResponse.json({ allowed: false, remaining: 0 })
  }

  const newCount = isNewDay ? 1 : currentCount + 1
  return NextResponse.json({ allowed: true, remaining: DAILY_LIMIT - newCount })
}
