import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { HistoryList } from '@/components/HistoryList'

export default async function HistoryPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/api/auth/signin')

  const prompts = await db.savedPrompt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      slug: true,
      frameworkId: true,
      locale: true,
      title: true,
      promptText: true,
      inputs: true,
      createdAt: true,
    },
  })

  return <HistoryList prompts={prompts} />
}
