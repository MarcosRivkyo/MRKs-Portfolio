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

// Devuelve un origin válido (sin usar .replace); usa fallback si la env no existe
function getBaseOrigin(): string {
  const raw =
    typeof process.env.APP_ORIGIN === 'string' && process.env.APP_ORIGIN.trim()
      ? process.env.APP_ORIGIN.trim()
      : 'http://localhost:3001'
  try {
    const u = new URL(raw)
    return u.origin
  } catch {
    const u = new URL('http://localhost:3001')
    return u.origin
  }
}

// Construye una URL absoluta segura a partir de un path
function buildSafeRedirect(pathOrUrl?: string): string {
  const base = getBaseOrigin()
  if (typeof pathOrUrl === 'string') {
    try {
      // si viene una URL absoluta del mismo origin, úsala
      const u = new URL(pathOrUrl, base)
      return u.toString()
    } catch {
      // cae al base si es inválida
    }
  }
  return new URL('/', base).toString()
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    const next = searchParams.get('next') || '/apps' // por defecto llévalo a /apps

    if (!token) {
      return NextResponse.redirect(buildSafeRedirect('/apps'))
    }

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
    const body = await req.json().catch(() => ({}) as Record<string, unknown>)
    const idToken = typeof body['idToken'] === 'string' ? (body['idToken'] as string) : ''
    const next = typeof body['next'] === 'string' ? (body['next'] as string) : '/apps'

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
