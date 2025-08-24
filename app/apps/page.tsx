import { Suspense } from 'react'
import Protected from '@/components/auth/Protected'
import AppsClient from './AppsClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto px-4 py-8">
          <div className="text-gray-600 dark:text-gray-300">Cargando…</div>
        </main>
      }
    >
      <Protected>
        <AppsClient />
      </Protected>
    </Suspense>
  )
}
