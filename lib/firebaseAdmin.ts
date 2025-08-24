import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

function normalizeKey(k?: string): string {
  const s = typeof k === 'string' ? k : ''
  return s.includes('\\n') ? s.replace(/\\n/g, '\n') : s
}

function readServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (raw) {
    const obj = JSON.parse(raw) as {
      project_id?: string
      client_email?: string
      private_key?: string
    }
    return {
      projectId: obj.project_id || process.env.FIREBASE_PROJECT_ID || '',
      clientEmail: obj.client_email || process.env.FIREBASE_CLIENT_EMAIL || '',
      privateKey: normalizeKey(obj.private_key || process.env.FIREBASE_PRIVATE_KEY),
    }
  }
  const projectId = process.env.FIREBASE_PROJECT_ID || ''
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || ''
  const privateKey = normalizeKey(process.env.FIREBASE_PRIVATE_KEY)

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('FIREBASE_ADMIN: variables incompletas')
  }
  return { projectId, clientEmail, privateKey }
}

const app = getApps()[0] ?? initializeApp({ credential: cert(readServiceAccount() as any) })
export const adminAuth = getAuth(app)
