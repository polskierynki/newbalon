import type { ReactNode } from 'react'

import { redirect } from 'next/navigation'

import { AdminNav } from '../../components/admin/AdminNav'
import { createSupabaseServerClient } from '../../lib/supabase-server'

type AdminLayoutProps = {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full flex-col md:flex-row">
        <AdminNav />
        <main className="flex-1 bg-slate-900 p-4 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
