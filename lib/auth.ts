import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'
import sql from '@/lib/db'

const SESSION_COOKIE = 'em_session'
const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? 'erick2024'

export async function validateLogin(password: string): Promise<string | null> {
  if (password !== ADMIN_PASS) return null

  const sessionId = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8) // 8 h

  await sql`
    INSERT INTO admin_sessions (id, expires_at)
    VALUES (${sessionId}, ${expiresAt.toISOString()})
  `
  return sessionId
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionId) return false

  const rows = await sql`
    SELECT id FROM admin_sessions
    WHERE id = ${sessionId} AND expires_at > NOW()
  `
  return rows.length > 0
}

export function sessionCookieName() {
  return SESSION_COOKIE
}
