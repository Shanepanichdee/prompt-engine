import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

const DAILY_LIMIT = 5

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
  todayStart.setHours(0, 0, 0, 0)

  const isNewDay = !user.freeUsageDate || user.freeUsageDate < todayStart
  const currentCount = isNewDay ? 0 : user.freeUsageCount

  if (currentCount >= DAILY_LIMIT) {
    return NextResponse.json({ allowed: false, remaining: 0 })
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      freeUsageCount: currentCount + 1,
      freeUsageDate: isNewDay ? new Date() : undefined,
    },
  })

  return NextResponse.json({ allowed: true, remaining: DAILY_LIMIT - currentCount - 1 })
}
