'use client'

import { useState } from 'react'


type OfferSettingsManagerProps = {
  initialEyebrow: string
  initialTitle: string
}

export function OfferSettingsManager({ initialEyebrow, initialTitle }: OfferSettingsManagerProps) {
  const [eyebrow, setEyebrow] = useState(initialEyebrow)
  const [title, setTitle] = useState(initialTitle)
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
            { key: 'services_eyebrow', value: eyebrow },
            { key: 'services_title', value: title },
          ],
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
      }
      showToast('success', 'Zapisano!')
    } catch {
      showToast('error', 'Nie udało się zapisać nagłówka oferty.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-base font-semibold text-slate-800">Nagłówek sekcji OFERTA</h2>
      <p className="mb-3 text-sm text-slate-500">Edycja tekstów nad kartami usług.</p>

      {toast ? (
        <div
          className={`mb-3 rounded-md px-3 py-2 text-sm font-medium ${
            toast.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <div className="grid gap-3">
        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-600">Nadtytuł (np. CO OFERUJEMY)</span>
          <input
            value={eyebrow}
            onChange={(event) => setEyebrow(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-600">Tytuł (np. Nasze usługi)</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => void save()}
        disabled={isSaving}
        className="mt-3 rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? 'Zapisywanie...' : 'Zapisz nagłówek oferty'}
      </button>
    </section>
  )
}
