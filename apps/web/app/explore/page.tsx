import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { ExploreList } from '@/components/ExploreList'

export const metadata: Metadata = {
  title: 'Explore — Prompt Engine',
  description: 'Browse public prompts from the community.',
}

export default async function ExplorePage() {
  const prompts = await db.savedPrompt.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      slug: true,
      frameworkId: true,
      locale: true,
      title: true,
      promptText: true,
      createdAt: true,
      user: { select: { name: true } },
    },
  })

  return <ExploreList prompts={prompts} />
}
