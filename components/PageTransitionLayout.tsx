'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Loader from './Loader'

export default function PageTransitionLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 500) // tiempo mínimo del loader
    return () => clearTimeout(timeout)
  }, [pathname])

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={loading ? 'pointer-events-none opacity-50 transition-opacity duration-300' : ''}
      >
        {children}
      </div>
    </>
  )
}
