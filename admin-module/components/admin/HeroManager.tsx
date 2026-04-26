'use client'

import { useRef, useState } from 'react'
import { supabaseBrowser } from '../../lib/supabase-client'

type HeroSlide = {
  id: string
  url: string
  alt: string
}

type HeroManagerProps = {
  initialSlides: HeroSlide[]
  initialTitle: string
  initialSubtitle: string
  initialAboutText: string
}

export function HeroManager({
  initialSlides,
  initialTitle,
  initialSubtitle,
  initialAboutText,
}: HeroManagerProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides)
  const [title, setTitle] = useState(initialTitle)
  const [subtitle, setSubtitle] = useState(initialSubtitle)
  const [aboutText, setAboutText] = useState(initialAboutText)
  const [uploading, setUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 2500)
  }

  const uploadFiles = async (files: File[]) => {
    setUploading(true)
    const uploaded: HeroSlide[] = []
    try {
      for (const file of files) {
        const ext = file.name.split('.').pop() ?? 'jpg'
        const name = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`
        const { data, error } = await supabaseBrowser.storage
          .from('hero-images')
          .upload(`slides/${name}`, file, { upsert: false })
        if (error) throw error
        const { data: { publicUrl } } = supabaseBrowser.storage
          .from('hero-images')
          .getPublicUrl(data.path)
        uploaded.push({ id: `slide-${Date.now()}-${Math.random()}`, url: publicUrl, alt: file.name.replace(/\.[^.]+$/, '') })
      }
      setSlides((prev) => [...prev, ...uploaded])
    } catch {
      showToast('error', 'Błąd przesyłania zdjęcia.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeSlide = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id))
  }

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= slides.length) return
    const next = [...slides]
    ;[next[index], next[target]] = [next[target], next[index]]
    setSlides(next)
  }

  const updateAlt = (id: string, value: string) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, alt: value } : s)))
  }

  const save = async () => {
    try {
      setIsSaving(true)
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides, title, subtitle, aboutText }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
      }
      showToast('success', 'Zapisano!')
    } catch (err) {
      console.error('[HeroManager] save error:', err)
      showToast('error', 'Nie udało się zapisać.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Przyciski */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={isSaving}
          className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </button>
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

      {/* Tekst nagłówka */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <h2 className="text-base font-semibold text-slate-800">Teksty w nagłówku</h2>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-slate-600">Główny tytuł</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-slate-600">Podtytuł</span>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-slate-600">Tekst „O nas"</span>
          <textarea
            rows={2}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
          />
        </label>
      </div>

      {/* Slider – zdjęcia */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-slate-800">
          Zdjęcia slidera ({slides.length})
        </h2>
        <p className="text-xs text-slate-500">
          Pierwsze zdjęcie wyświetla się domyślnie. Kolejne automatycznie zmieniają się co kilka sekund.
        </p>

        {slides.length > 0 ? (
          <div className="space-y-3">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-2"
              >
                <img
                  src={slide.url}
                  alt={slide.alt}
                  className="h-16 w-24 flex-shrink-0 rounded-md object-cover"
                />
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <input
                    value={slide.alt}
                    onChange={(e) => updateAlt(slide.id, e.target.value)}
                    placeholder="Opis (alt)"
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 truncate">{slide.url}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveSlide(index, 'up')}
                    className="rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-600 disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === slides.length - 1}
                    onClick={() => moveSlide(index, 'down')}
                    className="rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-600 disabled:opacity-40"
                  >
                    ↓
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeSlide(slide.id)}
                  className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">Brak zdjęć – dodaj pierwsze.</p>
        )}

        {/* Upload */}
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileRef}
            disabled={uploading}
            onChange={(e) => {
              const files = Array.from(e.target.files ?? [])
              if (files.length) void uploadFiles(files)
            }}
          />
          {uploading ? '⏳ Przesyłanie...' : '+ Dodaj zdjęcia do slidera'}
        </label>
      </div>
    </div>
  )
}
