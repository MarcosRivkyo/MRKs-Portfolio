'use client'
import * as React from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { auth } from '@/lib/firebaseClient'
import { signInWithEmailAndPassword } from 'firebase/auth'

function LoginInner() {
  const params = useSearchParams()

  // Sanea ?next -> solo rutas internas a /apps
  const rawNext = params.get('next')
  const next = React.useMemo(() => {
    const fallback = '/apps'
    if (!rawNext) return fallback
    if (rawNext.startsWith('/apps')) return rawNext
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const url = new URL(rawNext, origin || 'http://localhost')
      if (origin && url.origin === origin && url.pathname.startsWith('/apps')) {
        return url.pathname + url.search + url.hash
      }
    } catch {}
    return fallback
  }, [rawNext])

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPwd, setShowPwd] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const eTrim = email.trim()
    if (!eTrim || !password) {
      setError('Rellena email y contraseña')
      return
    }

    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, eTrim, password)
      await cred.user.getIdToken(true)
      // Navegación dura -> el Protected ya no te echará atrás
      window.location.assign(
        ((): string => {
          const raw = new URLSearchParams(window.location.search).get('next')
          if (raw && raw.startsWith('/apps')) return raw
          return '/apps'
        })()
      )
    } catch (err: any) {
      const code = err?.code || err?.message || ''
      let msg = 'Error al iniciar sesión'
      if (code.includes('invalid-credential') || code.includes('wrong-password'))
        msg = 'Credenciales incorrectas'
      else if (code.includes('user-not-found')) msg = 'Usuario no encontrado'
      else if (code.includes('too-many-requests')) msg = 'Demasiados intentos, espera un momento'
      else if (code.includes('network-request-failed')) msg = 'Problema de red. Revisa tu conexión'
      setError(msg)
      console.error('[login] signin ERROR:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="mb-1 text-2xl font-semibold">Acceso</h1>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Autentícate para entrar en la app.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-16 text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {showPwd ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto px-4 py-8">
          <div className="text-gray-600 dark:text-gray-300">Cargando…</div>
        </main>
      }
    >
      <LoginInner />
    </Suspense>
  )
}
