import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'

  if (!checkRateLimit(`shared:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { slug } = await params
  const prompt = await db.savedPrompt.findUnique({
    where: { slug },
    select: {
      frameworkId: true,
      locale: true,
      inputs: true,
      promptText: true,
      title: true,
      createdAt: true,
    },
  })

  if (!prompt) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(prompt)
}
