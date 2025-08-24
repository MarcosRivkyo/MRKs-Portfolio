// components/Header.tsx
'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import Image from 'next/image'
import { useAuth } from '@/components/auth/AuthProvider'

// components/Header.tsx (solo el botón)
function HeaderButton() {
  const { user, loading } = useAuth()
  if (loading)
    return <span className="rounded-lg px-3 py-2 text-sm font-semibold opacity-60">Cargando…</span>
  const href = user ? '/apps' : `/login?next=${encodeURIComponent('/apps')}`
  return (
    <Link
      className="bg-primary-600 hover:bg-primary-700 rounded-lg px-3 py-2 text-sm font-semibold text-white"
      href={href}
    >
      Aplicaciones
    </Link>
  )
}

export default function Header() {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) headerClass += ' sticky top-0 z-50'

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Image src="/static/images/logo.png" alt="Logo" width={80} height={80} priority />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>

      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
            >
              {link.title}
            </Link>
          ))}
        </div>

        <HeaderButton />
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}
