// app/apps/page.tsx
'use client'

import Protected from '@/components/auth/Protected'
import { APPS } from '@/data/apps'
import AppCard from '@/components/AppCard'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AppsPage() {
  const router = useRouter()

  const logout = async () => {
    try {
      await signOut(auth)
      router.replace('/login')
    } catch (e) {
      console.error(e)
      alert('No se pudo cerrar sesión')
    }
  }

  return (
    <Suspense
      fallback={
        <main className="container mx-auto px-4 py-8">
          <div className="text-gray-600 dark:text-gray-300">Cargando…</div>
        </main>
      }
    >
      <Protected>
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Mis soluciones</h1>
            <button className="btn btn-stop" onClick={logout}>
              Cerrar sesión
            </button>
          </div>

          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Elige una app para continuar. Se abrirá en una pestaña nueva.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {APPS.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </main>
      </Protected>
    </Suspense>
  )
}
