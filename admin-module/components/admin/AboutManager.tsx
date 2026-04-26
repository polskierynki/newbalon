'use client'

import { useState } from 'react'


type AboutIcon = 'sparkles' | 'gem' | 'heart' | 'clock' | 'user-check' | 'star'

type AboutItem = {
  id: string
  title: string
  description: string
  icon: AboutIcon
}

type AboutManagerProps = {
  initialEyebrow: string
  initialTitle: string
  initialItems: AboutItem[]
}

const iconOptions: Array<{ value: AboutIcon; label: string }> = [
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'gem', label: 'Gem' },
  { value: 'heart', label: 'Heart' },
  { value: 'clock', label: 'Clock' },
  { value: 'user-check', label: 'UserCheck' },
  { value: 'star', label: 'Star' },
]

export function AboutManager({ initialEyebrow, initialTitle, initialItems }: AboutManagerProps) {
  const [eyebrow, setEyebrow] = useState(initialEyebrow)
  const [title, setTitle] = useState(initialTitle)
  const [items, setItems] = useState<AboutItem[]>(initialItems)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 1800)
  }

  const save = async () => {
    try {
      setIsSaving(true)
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: [
            { key: 'why_us_eyebrow', value: eyebrow },
            { key: 'why_us_title', value: title },
            { key: 'why_us_items', value: JSON.stringify(items) },
          ],
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
      }
      showToast('success', 'Zapisano!')
    } catch {
      showToast('error', 'Nie udało się zapisać sekcji O NAS.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {toast ? (
        <div
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            toast.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-base font-semibold text-slate-800">Nagłówek sekcji O NAS</h2>
        <p className="mb-3 text-sm text-slate-500">Edycja tekstów „DLACZEGO MY?” i głównego tytułu.</p>

        <div className="grid gap-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Nadtytuł</span>
            <input
              value={eyebrow}
              onChange={(event) => setEyebrow(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Tytuł</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-base font-semibold text-slate-800">Kafelki „Dlaczego my”</h2>
        <p className="mb-3 text-sm text-slate-500">Ikony, tytuły i opisy elementów w sekcji O NAS.</p>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="rounded-lg border border-slate-200 p-3">
              <div className="grid gap-3 md:grid-cols-[130px_1fr]">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Ikona</span>
                  <select
                    value={item.icon}
                    onChange={(event) => {
                      const next = [...items]
                      next[index] = { ...item, icon: event.target.value as AboutIcon }
                      setItems(next)
                    }}
                    className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-3">
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-600">Tytuł</span>
                    <input
                      value={item.title}
                      onChange={(event) => {
                        const next = [...items]
                        next[index] = { ...item, title: event.target.value }
                        setItems(next)
                      }}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-600">Opis</span>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(event) => {
                        const next = [...items]
                        next[index] = { ...item, description: event.target.value }
                        setItems(next)
                      }}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...items]
                    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
                    setItems(next)
                  }}
                  className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => {
                    const next = [...items]
                    ;[next[index + 1], next[index]] = [next[index], next[index + 1]]
                    setItems(next)
                  }}
                  className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 disabled:opacity-40"
                >
                  ↓
                </button>

                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}
                  className="ml-auto rounded bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setItems((prev) => [
                  ...prev,
                  {
                    id: `about-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    title: '',
                    description: '',
                    icon: 'star',
                  },
                ])
              }}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              + Dodaj kafelek
            </button>

            <button
              type="button"
              onClick={() => void save()}
              disabled={isSaving}
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Zapisywanie...' : 'Zapisz O NAS'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
