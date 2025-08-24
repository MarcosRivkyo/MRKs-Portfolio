'use client'
import * as React from 'react'
import { AppItem } from '@/data/apps'
import { useAuth } from '@/components/auth/AuthProvider'
import { getIdToken } from 'firebase/auth'

// Icono simple de documento
function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14c0 1.105.895 2 2 2h10a2 2 0 0 0 2-2V9l-5-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12h8M8 15h8M8 18h5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function AppCard({ app }: { app: AppItem }) {
  const { user } = useAuth()
  const [opening, setOpening] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)

  const openApp = async () => {
    setErr(null)
    if (!user) {
      setErr('No autenticado.')
      return
    }
    try {
      setOpening(true)
      const idToken = await getIdToken(user, true)
      const sessionURL = `${app.url.replace(/\/+$/, '')}/api/session?token=${encodeURIComponent(idToken)}&next=${encodeURIComponent(app.url)}`

      // ✅ Abre en nueva pestaña, cookie se setea en 1ª parte y redirige a la app
      window.open(sessionURL, '_blank', 'noopener,noreferrer')
    } catch (e: any) {
      console.error(e)
      setErr(e?.message || 'No se pudo abrir la app.')
    } finally {
      setOpening(false)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openApp}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openApp()}
      className="flex cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200">
          <DocumentIcon width={22} height={22} />
        </div>
        <div className="flex-1">
          <div className="font-semibold">{app.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{app.description}</div>
        </div>
        {app.badge && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {app.badge}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            openApp()
          }}
          disabled={opening}
          className="btn"
          title={`Abrir ${app.name}`}
        >
          {opening ? 'Abriendo…' : 'Abrir en pestaña nueva'}
        </button>
        {err && <span className="text-xs text-red-500">{err}</span>}
      </div>
    </div>
  )
}
