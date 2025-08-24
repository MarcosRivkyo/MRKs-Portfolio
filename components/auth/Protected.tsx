// components/auth/Protected.tsx
'use client'
import * as React from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from './AuthProvider'

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname() || '/'
  const search = useSearchParams()

  const next = React.useMemo(() => {
    const qs = search?.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }, [pathname, search])

  React.useEffect(() => {
    if (loading) return
    if (user) return

    // debounce corto para evitar carreras justo al hidratar
    const t = setTimeout(() => {
      if (!user) {
        router.replace(`/login?next=${encodeURIComponent(next)}`)
      }
    }, 150)
    return () => clearTimeout(t)
  }, [loading, user, next, router])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">Cargando…</div>
      </div>
    )
  }
  if (!user) return null
  return <>{children}</>
}
