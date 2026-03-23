import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    const [row] = await sql`
      INSERT INTO contacts (name, email, phone, service, message)
      VALUES (${name}, ${email}, ${phone ?? null}, ${service ?? null}, ${message})
      RETURNING id, created_at
    `

    return NextResponse.json({ success: true, id: row.id }, { status: 201 })
  } catch (err) {
    console.error('[contact-api]', err)
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
