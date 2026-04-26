'use client'

import { useState } from 'react'

type SocialIconName = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'whatsapp'

type SocialLink = {
  id: string
  name: string
  url: string
  icon: SocialIconName
}

type SocialLinksManagerProps = {
  initialSocialLinks: SocialLink[]
  title?: string
  description?: string
  hideNameField?: boolean
}

const iconOptions: Array<{ value: SocialIconName; label: string }> = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'whatsapp', label: 'WhatsApp' },
]

export function SocialLinksManager({
  initialSocialLinks,
  title = 'Social media',
  description = 'Edytuj linki i ikony social media widoczne na stronie.',
  hideNameField = false,
}: SocialLinksManagerProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 1800)
  }

  const getIconLabel = (icon: SocialIconName) =>
    iconOptions.find((option) => option.value === icon)?.label ?? 'Social'

  const getValueLabel = (icon: SocialIconName) =>
    icon === 'whatsapp' ? 'Numer telefonu WhatsApp' : 'URL'

  const getValuePlaceholder = (icon: SocialIconName) =>
    icon === 'whatsapp' ? '+48 123 456 789' : 'https://...'

  const save = async () => {
    try {
      setIsSaving(true)
      const res = await fetch('/api/admin/social-links', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialLinks }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
      }

      showToast('success', 'Zapisano!')
    } catch (err) {
      console.error('[SocialLinksManager] save error:', err)
      showToast('error', 'Nie udało się zapisać social media.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      {toast ? (
        <div
          className={`mb-3 rounded-md px-3 py-2 text-sm font-medium ${
            toast.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <div className="space-y-3">
        {socialLinks.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-violet-200 bg-white p-3">
            <div
              className={`grid gap-3 md:items-end ${
                hideNameField ? 'md:grid-cols-[190px_1fr_auto]' : 'md:grid-cols-[190px_1fr_1fr_auto]'
              }`}
            >
              <label className="space-y-1">
                <span className="text-xs font-medium text-slate-600">Ikona</span>
                <select
                  value={item.icon}
                  onChange={(event) => {
                    const next = [...socialLinks]
                    const nextIcon = event.target.value as SocialIconName
                    next[index] = {
                      ...item,
                      icon: nextIcon,
                      name: hideNameField ? getIconLabel(nextIcon) : item.name,
                    }
                    setSocialLinks(next)
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

              {hideNameField ? null : (
                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Nazwa</span>
                  <input
                    value={item.name}
                    onChange={(event) => {
                      const next = [...socialLinks]
                      next[index] = { ...item, name: event.target.value }
                      setSocialLinks(next)
                    }}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                  />
                </label>
              )}

              <label className="space-y-1">
                <span className="text-xs font-medium text-slate-600">{getValueLabel(item.icon)}</span>
                <input
                  value={item.url}
                  onChange={(event) => {
                    const next = [...socialLinks]
                    next[index] = { ...item, url: event.target.value }
                    setSocialLinks(next)
                  }}
                  placeholder={getValuePlaceholder(item.icon)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </label>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...socialLinks]
                    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
                    setSocialLinks(next)
                  }}
                  className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 disabled:opacity-40"
                >
                  ↑
                </button>

                <button
                  type="button"
                  disabled={index === socialLinks.length - 1}
                  onClick={() => {
                    const next = [...socialLinks]
                    ;[next[index + 1], next[index]] = [next[index], next[index + 1]]
                    setSocialLinks(next)
                  }}
                  className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 disabled:opacity-40"
                >
                  ↓
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSocialLinks((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
                  }}
                  className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
                >
                  Usuń
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSocialLinks((prev) => [
                ...prev,
                {
                  id: `social-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                  name: hideNameField ? getIconLabel('instagram') : 'Nowy social',
                  url: '',
                  icon: 'instagram',
                },
              ])
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Dodaj social
          </button>

          <button
            type="button"
            onClick={() => void save()}
            disabled={isSaving}
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz sociale'}
          </button>
        </div>
      </div>
    </div>
  )
}
