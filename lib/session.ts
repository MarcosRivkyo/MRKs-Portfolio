// lib/session.ts
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminAuth } from '@/lib/firebaseAdmin'

export const runtime = 'nodejs'

export async function requireSession() {
  const c = await cookies()
  const session = c.get('__session')?.value

  const loginUrl = process.env.PORTFOLIO_LOGIN_URL || '/'
  // 👇 Ruta del catálogo en el portfolio (hazla configurable)
  const catalogPath = process.env.CATALOG_PATH || '/apps'

  if (!session) {
    // En lugar de next=APP_ORIGIN, llevamos al catálogo de apps
    redirect(`${loginUrl}?next=${encodeURIComponent(catalogPath)}`)
  }

  try {
    return await adminAuth.verifySessionCookie(session, true)
  } catch {
    redirect(`${loginUrl}?next=${encodeURIComponent(catalogPath)}`)
  }
}
