'use client'

import { useRef, useMemo, useState } from 'react'

import type { Service } from '../../lib/types'
import { supabaseBrowser } from '../../lib/supabase-client'
import { OFFER_ICON_OPTIONS, getOfferIcon, normalizeOfferIconName } from '../../../src/lib/offer-icons'

type ServiceWithPhotos = Service & { photos: string[] }

type ServicesManagerProps = {
  initialServices: Service[]
  initialServicePhotos: string[][]
}

export function ServicesManager({ initialServices, initialServicePhotos }: ServicesManagerProps) {
  const [services, setServices] = useState<ServiceWithPhotos[]>(() => {
    const sorted = [...initialServices].sort((a, b) => a.position - b.position)
    return sorted.map((s, index) => ({
      ...s,
      long_description: s.long_description ?? '',
      photos: initialServicePhotos[index] ?? [],
    }))
  })
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)
  const [savingServiceId, setSavingServiceId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const orderedServices = useMemo(
    () => [...services].sort((a, b) => a.position - b.position),
    [services]
  )

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 2500)
  }

  const updateService = (id: string, patch: Partial<ServiceWithPhotos>) => {
    setServices((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const moveService = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= orderedServices.length) return
    const next = [...orderedServices]
    const current = next[index]
    next[index] = next[targetIndex]
    next[targetIndex] = current
    setServices(next.map((item, idx) => ({ ...item, position: idx })))
  }

  const addService = () => {
    const nextPosition = services.length
    setServices((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        icon: 'sparkles',
        title: '',
        description: '',
        long_description: '',
        position: nextPosition,
        photos: [],
      },
    ])
  }

  const removeService = (id: string) => {
    setServices((prev) =>
      prev.filter((item) => item.id !== id).map((item, idx) => ({ ...item, position: idx }))
    )
  }

  const removePhoto = (serviceId: string, photoUrl: string) => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === serviceId
          ? { ...item, photos: item.photos.filter((p) => p !== photoUrl) }
          : item
      )
    )
  }

  const uploadPhoto = async (serviceId: string, file: File) => {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`
    const path = `services/${safeName}`

    setUploadingFor(serviceId)
    try {
      const { data, error } = await supabaseBrowser.storage
        .from('service-images')
        .upload(path, file, { upsert: false })
      if (error) throw error

      const { data: { publicUrl } } = supabaseBrowser.storage
        .from('service-images')
        .getPublicUrl(data.path)

      setServices((prev) =>
        prev.map((item) =>
          item.id === serviceId
            ? { ...item, photos: [...item.photos, publicUrl] }
            : item
        )
      )
    } catch (err) {
      console.error('[ServicesManager] uploadPhoto error:', err)
      showToast('error', 'Błąd przesyłania zdjęcia.')
    } finally {
      setUploadingFor(null)
      const ref = fileInputRefs.current[serviceId]
      if (ref) ref.value = ''
    }
  }

  const saveChanges = async (serviceId?: string) => {
    try {
      setSavingServiceId(serviceId ?? 'all')

      const payload = orderedServices.map((item, i) => ({
        title: item.title,
        description: item.description,
        long_description: item.long_description ?? '',
        icon: normalizeOfferIconName(item.icon),
        position: i,
        photos: item.photos,
      }))

      const res = await fetch('/api/admin/services', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
      }

      showToast('success', serviceId ? 'Usluga zapisana!' : 'Zapisano!')
    } catch (err) {
      console.error('[ServicesManager] saveChanges error:', err)
      showToast('error', 'Nie udało się zapisać usług.')
    } finally {
      setSavingServiceId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addService}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Dodaj usługę
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

      <div className="space-y-4">
        {orderedServices.map((service, index) => (
          <div key={service.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[220px_1fr]">
              <label className="space-y-1">
                <span className="text-xs font-medium text-slate-600">Ikona</span>
                <div className="rounded-md border border-slate-200 p-2">
                  <div className="grid grid-cols-6 gap-2">
                    {OFFER_ICON_OPTIONS.map(({ value, Icon, label }) => {
                      const isActive = normalizeOfferIconName(service.icon) === value
                      return (
                        <button
                          key={value}
                          type="button"
                          title={label}
                          aria-label={label}
                          onClick={() => updateService(service.id, { icon: value })}
                          className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
                            isActive
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    {(() => {
                      const Icon = getOfferIcon(service.icon)
                      return <Icon className="h-4 w-4 text-indigo-600" />
                    })()}
                    <span>Wybrana ikona</span>
                  </div>
                </div>
              </label>

              <div className="grid gap-3">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Tytuł</span>
                  <input
                    value={service.title}
                    onChange={(e) => updateService(service.id, { title: e.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Opis (skrócony — widoczny na karcie)</span>
                  <textarea
                    rows={3}
                    value={service.description}
                    onChange={(e) => updateService(service.id, { description: e.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">
                    Rozszerzony opis{' '}
                    <span className="font-normal text-slate-400">(wyświetlany w pop-upie po kliknięciu „Dowiedz się więcej")</span>
                  </span>
                  <textarea
                    rows={5}
                    placeholder="Opisz szczegółowo tę usługę — klient przeczyta to w pop-upie…"
                    value={service.long_description ?? ''}
                    onChange={(e) => updateService(service.id, { long_description: e.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </label>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-600">
                    Zdjęcia ({service.photos.length})
                  </span>

                  {service.photos.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {service.photos.map((url) => (
                        <div key={url} className="group relative">
                          <img
                            src={url}
                            alt=""
                            className="h-20 w-full rounded-md border border-slate-200 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(service.id, url)}
                            className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:flex"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      ref={(el) => {
                        fileInputRefs.current[service.id] = el
                      }}
                      disabled={uploadingFor === service.id}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files ?? [])
                        for (const file of files) {
                          await uploadPhoto(service.id, file)
                        }
                      }}
                    />
                    {uploadingFor === service.id ? (
                      <span>Przesyłanie...</span>
                    ) : (
                      <span>+ Dodaj zdjęcia</span>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveService(index, 'up')}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === orderedServices.length - 1}
                onClick={() => moveService(index, 'down')}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeService(service.id)}
                className="ml-auto rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
              >
                Usuń
              </button>
              <button
                type="button"
                onClick={() => void saveChanges(service.id)}
                disabled={savingServiceId !== null}
                className="rounded-md bg-indigo-500 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingServiceId === service.id ? 'Zapisywanie...' : 'Zapisz usluge'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
