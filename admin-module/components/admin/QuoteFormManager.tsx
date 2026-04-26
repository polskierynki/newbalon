'use client'

import { useState } from 'react'

import type { QuoteFormConfig } from '../../../src/components/site/contact-quote-form'

type QuoteFormManagerProps = {
  initialConfig: QuoteFormConfig
}

export function QuoteFormManager({ initialConfig }: QuoteFormManagerProps) {
  const [config, setConfig] = useState<QuoteFormConfig>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 1800)
  }

  const updateOption = (key: 'eventOptions' | 'budgetOptions', index: number, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [key]: prev[key].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }))
  }

  const addOption = (key: 'eventOptions' | 'budgetOptions') => {
    setConfig((prev) => ({
      ...prev,
      [key]: [...prev[key], ''],
    }))
  }

  const removeOption = (key: 'eventOptions' | 'budgetOptions', index: number) => {
    setConfig((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const save = async () => {
    try {
      setIsSaving(true)
      const cleaned = {
        ...config,
        eventOptions: config.eventOptions.map((item) => item.trim()).filter(Boolean),
        budgetOptions: config.budgetOptions.map((item) => item.trim()).filter(Boolean),
      }

      const res = await fetch('/api/admin/quote-form', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleaned),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
      }

      setConfig(cleaned)
      showToast('success', 'Zapisano!')
    } catch (err) {
      console.error('[QuoteFormManager] save error:', err)
      showToast('error', 'Nie udało się zapisać formularza.')
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
        <h2 className="mb-2 text-base font-semibold text-slate-800">Pola tekstowe formularza</h2>
        <p className="mb-3 text-sm text-slate-500">Edytuj placeholdery, opisy i tekst przycisku.</p>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Imię i nazwisko</span>
            <input value={config.fullNamePlaceholder} onChange={(e) => setConfig((prev) => ({ ...prev, fullNamePlaceholder: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Telefon</span>
            <input value={config.phonePlaceholder} onChange={(e) => setConfig((prev) => ({ ...prev, phonePlaceholder: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Email</span>
            <input value={config.emailPlaceholder} onChange={(e) => setConfig((prev) => ({ ...prev, emailPlaceholder: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Placeholder rodzaju imprezy</span>
            <input value={config.eventPlaceholder} onChange={(e) => setConfig((prev) => ({ ...prev, eventPlaceholder: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Placeholder budżetu</span>
            <input value={config.budgetPlaceholder} onChange={(e) => setConfig((prev) => ({ ...prev, budgetPlaceholder: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Tekst przycisku</span>
            <input value={config.submitLabel} onChange={(e) => setConfig((prev) => ({ ...prev, submitLabel: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none" />
          </label>
        </div>

        <label className="mt-3 block space-y-1">
          <span className="text-xs font-medium text-slate-600">Placeholder wiadomości</span>
          <textarea rows={3} value={config.messagePlaceholder} onChange={(e) => setConfig((prev) => ({ ...prev, messagePlaceholder: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none" />
        </label>

        <label className="mt-3 block space-y-1">
          <span className="text-xs font-medium text-slate-600">Komunikat po wysłaniu</span>
          <textarea rows={2} value={config.successMessage} onChange={(e) => setConfig((prev) => ({ ...prev, successMessage: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none" />
        </label>

        <button type="button" onClick={() => void save()} disabled={isSaving} className="mt-4 rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">
          {isSaving ? 'Zapisywanie...' : 'Zapisz'}
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-base font-semibold text-slate-800">Opcje rodzaju imprezy</h2>
        <div className="space-y-2">
          {config.eventOptions.map((option, index) => (
            <div key={`event-${index}`} className="flex gap-2">
              <input value={option} onChange={(e) => updateOption('eventOptions', index, e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none" />
              <button type="button" onClick={() => removeOption('eventOptions', index)} className="rounded bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600">Usuń</button>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={() => addOption('eventOptions')} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">+ Dodaj opcję</button>
            <button type="button" onClick={() => void save()} disabled={isSaving} className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">
              {isSaving ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-base font-semibold text-slate-800">Opcje budżetu</h2>
        <div className="space-y-2">
          {config.budgetOptions.map((option, index) => (
            <div key={`budget-${index}`} className="flex gap-2">
              <input value={option} onChange={(e) => updateOption('budgetOptions', index, e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none" />
              <button type="button" onClick={() => removeOption('budgetOptions', index)} className="rounded bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600">Usuń</button>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={() => addOption('budgetOptions')} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">+ Dodaj opcję</button>
            <button type="button" onClick={() => void save()} disabled={isSaving} className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">
              {isSaving ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}