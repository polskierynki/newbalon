import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import type { QuoteFormConfig } from '@/components/site/contact-quote-form'

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

    const body = (await req.json()) as QuoteFormConfig
    const cleaned: QuoteFormConfig = {
      ...body,
      eventOptions: Array.isArray(body.eventOptions) ? body.eventOptions.map((item) => item.trim()).filter(Boolean) : [],
      budgetOptions: Array.isArray(body.budgetOptions) ? body.budgetOptions.map((item) => item.trim()).filter(Boolean) : [],
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { error } = await supabase.from('content').upsert({
      key: 'quote_form_config',
      value: JSON.stringify(cleaned),
      updated_at: new Date().toISOString(),
    })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/admin/quote-form] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}