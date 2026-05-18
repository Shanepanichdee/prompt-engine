import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { validateSavePromptBody } from '@/lib/validate-prompt'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!checkRateLimit(`prompts:${session.user.id}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body: unknown = await req.json()
  const validation = validateSavePromptBody(body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const b = body as {
    frameworkId: string
    locale: string
    inputs: Record<string, string>
    promptText: string
    title?: string
  }

  const slug = randomBytes(4).toString('hex')

  const prompt = await db.savedPrompt.create({
    data: {
      slug,
      userId: session.user.id,
      frameworkId: b.frameworkId,
      locale: b.locale,
      inputs: b.inputs,
      promptText: b.promptText,
      title: b.title ?? null,
    },
  })

  return NextResponse.json({ id: prompt.id, slug: prompt.slug })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
      createdAt: true,
    },
  })

  return NextResponse.json({ prompts })
}
