'use client'

import { useMemo, useState } from 'react'

import type { ContentRow } from '../../lib/types'

type ContentEditorProps = {
  initialContent: ContentRow[]
}

type FieldConfig = { key: string; label: string; multiline?: boolean }
type SocialIconName = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'whatsapp'
type SocialLink = {
  id: string
  name: string
  url: string
  icon: SocialIconName
}

type SectionConfig = {
  id: string
  title: string
  description: string
  badge: string
  tone: 'sky' | 'amber' | 'emerald'
  fields: FieldConfig[]
}

const sectionsConfig: SectionConfig[] = [
  {
    id: 'contact',
    title: 'Kontakt i pasek gorny',
    description:
      'Te dane sa wyswietlane w gornej belce strony oraz w sekcji kontaktowej.',
    badge: 'Kontakt',
    tone: 'sky',
    fields: [
      { key: 'contact_phone', label: 'Telefon' },
      { key: 'contact_email', label: 'Email' },
      { key: 'contact_address', label: 'Adres' },
    ],
  },
  {
    id: 'services',
    title: 'Sekcja uslug',
    description: 'Tytul widoczny nad kartami oferty na stronie glownej.',
    badge: 'Oferta',
    tone: 'amber',
    fields: [{ key: 'services_title', label: 'Tytul sekcji uslug' }],
  },
  {
    id: 'footer',
    title: 'Stopka',
    description: 'Krotki tekst pokazywany w dolnej czesci strony.',
    badge: 'Stopka',
    tone: 'emerald',
    fields: [{ key: 'footer_text', label: 'Tekst stopki' }],
  },
]

const fieldsConfig = sectionsConfig.flatMap((section) => section.fields)

const socialIconOptions: Array<{ value: SocialIconName; label: string }> = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'whatsapp', label: 'WhatsApp' },
]

const defaultSocialLinks: SocialLink[] = [
  {
    id: 'social-facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/baloonart',
    icon: 'facebook',
  },
  {
    id: 'social-instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/baloonart',
    icon: 'instagram',
  },
]

function renderSocialIcon(icon: SocialIconName, className: string) {
  if (icon === 'facebook') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.78-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12" />
      </svg>
    )
  }

  if (icon === 'instagram') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
      </svg>
    )
  }

  if (icon === 'tiktok') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69A4.83 4.83 0 0 1 16 5.3V15a7 7 0 1 1-7-7c.19 0 .38.01.57.03v3.07a3.9 3.9 0 1 0 3.33 3.86V2h3.06a4.86 4.86 0 0 0 3.63 4.63v3.06Z" />
      </svg>
    )
  }

  if (icon === 'youtube') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.9.58 9.4.58 9.4.58s7.5 0 9.4-.58a3 3 0 0 0 2.1-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
      </svg>
    )
  }

  if (icon === 'linkedin') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.98 3.5C3.33 3.5 2 4.84 2 6.48s1.33 2.98 2.98 2.98a2.98 2.98 0 1 0 0-5.96ZM2.4 21.5h5.16V10.2H2.4v11.3ZM10.5 10.2v11.3h5.15v-6.25c0-1.65.31-3.24 2.36-3.24 2.02 0 2.05 1.89 2.05 3.35v6.14H24v-7.14c0-3.5-.75-6.2-4.84-6.2-1.97 0-3.3 1.08-3.84 2.1h-.05v-1.8H10.5Z" />
      </svg>
    )
  }

  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  )
}

export function ContentEditor({ initialContent }: ContentEditorProps) {
  const initialForm = useMemo(() => {
    const map = new Map(initialContent.map((item) => [item.key, item.value]))
    return fieldsConfig.reduce<Record<string, string>>((acc, field) => {
      acc[field.key] = map.get(field.key) ?? ''
      return acc
    }, {})
  }, [initialContent])

  const initialSocialLinks = useMemo<SocialLink[]>(() => {
    const map = new Map(initialContent.map((item) => [item.key, item.value]))
    const raw = map.get('social_links')
    if (!raw) return defaultSocialLinks

    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return defaultSocialLinks

      const normalized = parsed
        .map((item, index) => {
          const icon = socialIconOptions.some((iconItem) => iconItem.value === item?.icon)
            ? (item.icon as SocialIconName)
            : 'instagram'

          return {
            id: typeof item?.id === 'string' && item.id ? item.id : `social-${index}`,
            name: typeof item?.name === 'string' && item.name ? item.name : 'Social',
            url: typeof item?.url === 'string' ? item.url : '',
            icon,
          }
        })
        .filter((item) => item.url || item.name)

      return normalized.length > 0 ? normalized : defaultSocialLinks
    } catch {
      return defaultSocialLinks
    }
  }, [initialContent])

  const [form, setForm] = useState<Record<string, string>>(initialForm)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const sectionToneClasses: Record<SectionConfig['tone'], { ring: string; badge: string }> = {
    sky: {
      ring: 'border-sky-200 bg-sky-50/60',
      badge: 'bg-sky-100 text-sky-700',
    },
    amber: {
      ring: 'border-amber-200 bg-amber-50/60',
      badge: 'bg-amber-100 text-amber-700',
    },
    emerald: {
      ring: 'border-emerald-200 bg-emerald-50/60',
      badge: 'bg-emerald-100 text-emerald-700',
    },
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 1800)
  }

  const handleSaveAll = async () => {
    try {
      setIsSaving(true)
      const rows = [
        ...fieldsConfig.map((field) => ({
          key: field.key,
          value: form[field.key] ?? '',
        })),
        {
          key: 'social_links',
          value: JSON.stringify(socialLinks),
        },
      ]
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
      }
      showToast('success', 'Zapisano!')
    } catch {
      showToast('error', 'Wystąpił błąd podczas zapisu.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
        <p className="font-semibold">Podpowiedz</p>
        <p>
          Sekcja Naglowek/Slider jest edytowana osobno w zakladce "Naglowek". Tutaj zarzadzasz
          tylko tresciami kontaktu, oferty i stopki.
        </p>
      </div>

      {toast ? (
        <div
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            toast.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <div className="space-y-4">
        {sectionsConfig.map((section) => (
          <section
            key={section.id}
            className={`rounded-xl border p-4 shadow-sm ${sectionToneClasses[section.tone].ring}`}
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${sectionToneClasses[section.tone].badge}`}
              >
                {section.badge}
              </span>
              <h2 className="text-base font-semibold text-slate-800">{section.title}</h2>
            </div>

            <div className="mb-3">
              <p className="text-sm text-slate-500">{section.description}</p>
            </div>

            <div className="grid gap-4">
              {section.fields.map((field) => (
                <label key={field.key} className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">{field.label}</span>

                  {field.multiline ? (
                    <textarea
                      rows={4}
                      value={form[field.key] ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          [field.key]: event.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <input
                      value={form[field.key] ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          [field.key]: event.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
              Sociale
            </span>
            <h2 className="text-base font-semibold text-slate-800">Linki social media i ikony</h2>
          </div>

          <p className="mb-3 text-sm text-slate-500">
            Te ustawienia steruja ikonami i linkami social media w top barze, menu oraz sekcji
            kontaktowej.
          </p>

          <div className="space-y-3">
            {socialLinks.map((item, index) => (
              <div key={item.id} className="rounded-lg border border-violet-200 bg-white p-3">
                <div className="grid gap-3 md:grid-cols-[90px_1fr_1fr_auto] md:items-end">
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-600">Ikona</span>
                    <select
                      value={item.icon}
                      onChange={(event) => {
                        const next = [...socialLinks]
                        next[index] = { ...item, icon: event.target.value as SocialIconName }
                        setSocialLinks(next)
                      }}
                      className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                    >
                      {socialIconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

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

                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-600">URL</span>
                    <input
                      value={item.url}
                      onChange={(event) => {
                        const next = [...socialLinks]
                        next[index] = { ...item, url: event.target.value }
                        setSocialLinks(next)
                      }}
                      placeholder="https://..."
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  </label>

                  <div className="flex items-center justify-end gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700">
                      {renderSocialIcon(item.icon, 'h-4 w-4')}
                    </span>

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
                      Usun
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                setSocialLinks((prev) => [
                  ...prev,
                  {
                    id: `social-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    name: 'Nowy social',
                    url: '',
                    icon: 'instagram',
                  },
                ])
              }}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              + Dodaj social
            </button>
          </div>
        </section>
      </div>

      <div className="sticky bottom-4 z-10 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">Zmiany nie zapisuja sie automatycznie.</p>
          <button
            type="button"
            onClick={() => void handleSaveAll()}
            disabled={isSaving}
            className="rounded-md bg-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz wszystko'}
          </button>
        </div>
      </div>
    </div>
  )
}
