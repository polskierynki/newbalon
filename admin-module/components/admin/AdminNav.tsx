'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import { supabaseBrowser } from '../../lib/supabase-client'

const navLinks = [
  { href: '/admin/home', label: 'STRONA GLOWNA' },
  { href: '/admin/services', label: 'OFERTA' },
  { href: '/admin/gallery', label: 'REALIZACJE' },
  { href: '/admin/about', label: 'O NAS' },
  { href: '/admin/contact', label: 'KONTAKT' },
  { href: '/admin/quote-form', label: 'FORMULARZ WYCENY' },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await supabaseBrowser.auth.signOut()
      router.push('/admin/login')
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <nav className="flex h-full w-full flex-col bg-slate-800 text-white md:w-[240px]">
      <div className="border-b border-slate-700 px-4 py-4 md:px-5">
        <p className="text-lg font-semibold">Panel admina</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-700 px-3 py-3 md:flex-1 md:flex-col md:border-b-0 md:px-4 md:py-5">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-indigo-500 text-white' : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      <div className="border-t border-slate-700 p-3 md:p-4">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSigningOut ? 'Wylogowywanie...' : 'Wyloguj'}
        </button>
      </div>
    </nav>
  )
}
