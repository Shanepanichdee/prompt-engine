import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { SharedPromptView } from '@/components/SharedPromptView'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prompt = await db.savedPrompt.findUnique({
    where: { slug },
    select: { title: true, promptText: true },
  })
  if (!prompt) return { title: 'Prompt not found' }
  const title = prompt.title ?? prompt.promptText.slice(0, 60)
  return {
    title: `${title} — Prompt Engine`,
    description: prompt.promptText.slice(0, 160),
  }
}

export default async function SharedPromptPage({ params }: Props) {
  const { slug } = await params
  const prompt = await db.savedPrompt.findUnique({
    where: { slug },
    select: {
      frameworkId: true,
      locale: true,
      promptText: true,
      inputs: true,
      title: true,
      createdAt: true,
    },
  })

  if (!prompt) notFound()

  return <SharedPromptView prompt={prompt} />
}
