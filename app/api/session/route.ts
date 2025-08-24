import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const COOKIE_NAME = '__session'
const MAX_AGE = 60 * 60 * 24 * 5 // 5 días

function setSessionCookie(res: NextResponse, value: string) {
  res.cookies.set({
    name: COOKIE_NAME,
    value,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
}

function getBaseOrigin(): string {
  const raw = (process.env.APP_ORIGIN ?? '').trim() || 'http://localhost:3001'
  try {
    return new URL(raw).origin
  } catch {
    return 'http://localhost:3001'
  }
}

function buildSafeRedirect(pathOrUrl?: string): string {
  const base = getBaseOrigin()
  try {
    return new URL(pathOrUrl || '/', base).toString()
  } catch {
    return new URL('/', base).toString()
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    const next = searchParams.get('next') || '/apps'

    if (!token) return NextResponse.redirect(buildSafeRedirect('/apps'))

    await adminAuth.verifyIdToken(token)
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn: MAX_AGE * 1000 })

    const res = NextResponse.redirect(buildSafeRedirect(next))
    setSessionCookie(res, sessionCookie)
    return res
  } catch {
    return NextResponse.json({ error: 'invalid token' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const idToken = typeof body.idToken === 'string' ? body.idToken : ''
    const next = typeof body.next === 'string' ? body.next : '/apps'

    if (!idToken) return NextResponse.json({ error: 'missing token' }, { status: 400 })

    await adminAuth.verifyIdToken(idToken)
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: MAX_AGE * 1000,
    })

    const res = NextResponse.redirect(buildSafeRedirect(next), { status: 303 })
    setSessionCookie(res, sessionCookie)
    return res
  } catch {
    return NextResponse.json({ error: 'invalid token' }, { status: 401 })
  }
}
