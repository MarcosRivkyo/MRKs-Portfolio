// components/auth/AuthProvider.tsx
'use client'
import * as React from 'react'
import { auth } from '@/lib/firebaseClient'
import { onIdTokenChanged, User } from 'firebase/auth'

type AuthCtx = { user: User | null; loading: boolean }
const Ctx = React.createContext<AuthCtx>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let first = true
    // Espera a que Firebase “prepare” el estado inicial si existe esta API
    const ready = (auth as any).authStateReady?.() ?? Promise.resolve()
    ready.finally(() => {
      const unsub = onIdTokenChanged(auth, (u) => {
        setUser(u ?? null)
        if (first) {
          first = false
          setLoading(false)
        }
      })
      // Limpieza
      return () => unsub()
    })
  }, [])

  return <Ctx.Provider value={{ user, loading }}>{children}</Ctx.Provider>
}

export function useAuth() {
  return React.useContext(Ctx)
}
