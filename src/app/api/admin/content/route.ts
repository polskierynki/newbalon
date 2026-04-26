import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

type ContentRow = {
  key: string
  value: string
}

async function getAuthedUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null

  const cookieStore = await cookies()
  const client = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {}
      },
    },
  })

  const { data: { session } } = await client.auth.getSession()
  return session?.user ?? null
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized — zaloguj się ponownie' }, { status: 401 })

    const body = (await req.json()) as { rows?: ContentRow[] }
    const rows = Array.isArray(body?.rows) ? body.rows : []

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Brak danych do zapisania' }, { status: 400 })
    }

    // Walidacja — tylko string key i value
    for (const row of rows) {
      if (typeof row.key !== 'string' || typeof row.value !== 'string') {
        return NextResponse.json({ error: 'Nieprawidłowy format danych' }, { status: 400 })
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.from('content').upsert(
      rows.map((row) => ({ key: row.key, value: row.value, updated_at: new Date().toISOString() }))
    )

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/admin/content] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
