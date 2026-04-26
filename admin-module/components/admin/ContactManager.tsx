'use client'

import { useState } from 'react'


type ContactManagerProps = {
  initialPhone: string
  initialEmail: string
  initialAddress: string
}

export function ContactManager({ initialPhone, initialEmail, initialAddress }: ContactManagerProps) {
  const [phone, setPhone] = useState(initialPhone)
  const [email, setEmail] = useState(initialEmail)
  const [address, setAddress] = useState(initialAddress)
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
            { key: 'contact_phone', value: phone },
            { key: 'contact_email', value: email },
            { key: 'contact_address', value: address },
          ],
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
      }
      showToast('success', 'Zapisano!')
    } catch {
      showToast('error', 'Nie udało się zapisać kontaktu.')
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
        <h2 className="mb-2 text-base font-semibold text-slate-800">Dane kontaktowe</h2>
        <p className="mb-3 text-sm text-slate-500">
          Te pola są używane w top barze i sekcji kontaktowej na stronie.
        </p>

        <div className="grid gap-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Telefon</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Adres / Obszar działania</span>
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
            />
          </label>
        </div>
      </section>

      <button
        type="button"
        onClick={() => void save()}
        disabled={isSaving}
        className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? 'Zapisywanie...' : 'Zapisz kontakt'}
      </button>
    </div>
  )
}
