import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const prompt = await db.savedPrompt.findUnique({ where: { id } })

  if (!prompt) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (prompt.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await db.savedPrompt.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const prompt = await db.savedPrompt.findUnique({ where: { id } })

  if (!prompt) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (prompt.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await req.json()) as { isPublic?: boolean }
  if (typeof body.isPublic !== 'boolean') {
    return NextResponse.json({ error: 'isPublic must be a boolean' }, { status: 400 })
  }

  const updated = await db.savedPrompt.update({
    where: { id },
    data: { isPublic: body.isPublic },
  })

  return NextResponse.json({ id: updated.id, isPublic: updated.isPublic })
}
