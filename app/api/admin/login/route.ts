import { NextRequest, NextResponse } from 'next/server'
import { validateLogin, sessionCookieName } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const sessionId = await validateLogin(password)

    if (!sessionId) {
      return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set(sessionCookieName(), sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })
    return res
  } catch (err) {
    console.error('[admin-login]', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
