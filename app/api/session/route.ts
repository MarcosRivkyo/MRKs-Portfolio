import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebaseAdmin' // tu inicialización admin
import { cookies } from 'next/headers'

const SESSION_MAX_AGE = 60 * 60 * 24 * 5 // 5 días

function buildCookie(value: string, isProd: boolean) {
  // En local: sin Secure; en prod: Secure
  const base = `__session=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`
  return isProd ? `${base}; Secure` : base
}

async function createSessionCookieFromIdToken(idToken: string) {
  return adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE * 1000 })
}

export async function POST(req: NextRequest) {
  try {
    const authz = req.headers.get('authorization') || ''
    const fromHeader = authz.startsWith('Bearer ') ? authz.slice(7) : ''
    const body = await req.json().catch(() => ({}))
    const idToken = body.idToken || fromHeader
    if (!idToken) return NextResponse.json({ error: 'missing token' }, { status: 400 })

    const sessionCookie = await createSessionCookieFromIdToken(idToken)
    const res = NextResponse.json({ ok: true })
    res.headers.append(
      'Set-Cookie',
      buildCookie(sessionCookie, process.env.NODE_ENV === 'production')
    )
    return res
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'invalid token' }, { status: 401 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const idToken = searchParams.get('token')
    const next = searchParams.get('next') || '/'
    if (!idToken) return NextResponse.redirect(new URL('/', req.url)) // o a login del portfolio

    const sessionCookie = await createSessionCookieFromIdToken(idToken)
    const res = NextResponse.redirect(next)
    res.headers.append(
      'Set-Cookie',
      buildCookie(sessionCookie, process.env.NODE_ENV === 'production')
    )
    return res
  } catch (e: any) {
    console.error(e)
    // en caso de fallo, llévalo al login del portfolio
    const login = process.env.PORTFOLIO_LOGIN_URL || '/'
    return NextResponse.redirect(login)
  }
}
