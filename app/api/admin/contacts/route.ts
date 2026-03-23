import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import sql from '@/lib/db'

export async function GET() {
  const ok = await getSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await sql`
    SELECT id, name, email, phone, service, message, status, created_at
    FROM contacts
    ORDER BY created_at DESC
  `
  return NextResponse.json(rows)
}

export async function PATCH(req: NextRequest) {
  const ok = await getSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, status } = await req.json()
  if (!['new', 'read', 'replied'].includes(status)) {
    return NextResponse.json({ error: 'Status inválido.' }, { status: 400 })
  }

  await sql`UPDATE contacts SET status = ${status} WHERE id = ${id}`
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const ok = await getSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await sql`DELETE FROM contacts WHERE id = ${id}`
  return NextResponse.json({ success: true })
}
