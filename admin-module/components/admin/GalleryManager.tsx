'use client'

import { useMemo, useState } from 'react'

import type { GalleryImage } from '../../lib/types'
import { supabaseBrowser } from '../../lib/supabase-client'
import { ImageUploader } from './ImageUploader'

type GalleryManagerProps = {
  initialImages: GalleryImage[]
}

type CaptionStatus = 'pending' | 'approved' | 'rejected'

const captionPrefixes: Record<CaptionStatus, string> = {
  pending: '[PENDING] ',
  approved: '[APPROVED] ',
  rejected: '[REJECTED] ',
}

function decodeCaption(rawCaption: string) {
  if (rawCaption.startsWith(captionPrefixes.approved)) {
    return { status: 'approved' as const, text: rawCaption.replace(captionPrefixes.approved, '') }
  }
  if (rawCaption.startsWith(captionPrefixes.rejected)) {
    return { status: 'rejected' as const, text: rawCaption.replace(captionPrefixes.rejected, '') }
  }
  if (rawCaption.startsWith(captionPrefixes.pending)) {
    return { status: 'pending' as const, text: rawCaption.replace(captionPrefixes.pending, '') }
  }
  return { status: 'approved' as const, text: rawCaption }
}

function encodeCaption(status: CaptionStatus, text: string) {
  return `${captionPrefixes[status]}${text.trim()}`
}

function getStoragePathFromPublicUrl(url: string) {
  const marker = '/storage/v1/object/public/gallery/'
  const index = url.indexOf(marker)
  if (index === -1) return ''
  return decodeURIComponent(url.slice(index + marker.length))
}

export function GalleryManager({ initialImages }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(
    [...initialImages].sort((a, b) => a.position - b.position)
  )
  const [newlyUploadedIds, setNewlyUploadedIds] = useState<string[]>([])
  const [draftCaptions, setDraftCaptions] = useState<Record<string, string>>({})
  const [dirtyCaptionIds, setDirtyCaptionIds] = useState<string[]>([])
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  const orderedImages = useMemo(
    () => [...images].sort((a, b) => a.position - b.position),
    [images]
  )

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 1800)
  }

  const persistPositions = async (nextImages: GalleryImage[]) => {
    await Promise.all(
      nextImages.map((image, idx) =>
        supabaseBrowser.from('gallery').update({ position: idx }).eq('id', image.id)
      )
    )
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    try {
      setIsBusy(true)
      const next = [...orderedImages]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= next.length) return

      const current = next[index]
      next[index] = next[targetIndex]
      next[targetIndex] = current

      const rePositioned = next.map((item, idx) => ({ ...item, position: idx }))
      setImages(rePositioned)
      await persistPositions(rePositioned)
      showToast('success', 'Zapisano!')
    } catch {
      showToast('error', 'Nie udało się zmienić kolejności.')
    } finally {
      setIsBusy(false)
    }
  }

  const handleCaptionSave = async (id: string, caption: string) => {
    try {
      const nextStatus: CaptionStatus = newlyUploadedIds.includes(id) ? 'pending' : 'approved'
      const normalizedCaption = encodeCaption(nextStatus, caption)
      const { error } = await supabaseBrowser
        .from('gallery')
        .update({ caption: normalizedCaption })
        .eq('id', id)
      if (error) throw error
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, caption: normalizedCaption } : img))
      )
      setDraftCaptions((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      setDirtyCaptionIds((prev) => prev.filter((itemId) => itemId !== id))
      showToast('success', 'Zapisano!')
    } catch {
      showToast('error', 'Nie udało się zapisać opisu.')
    }
  }

  const handleCaptionDraftChange = (id: string, value: string, original: string) => {
    setDraftCaptions((prev) => ({ ...prev, [id]: value }))

    const isDirty = value !== original
    setDirtyCaptionIds((prev) => {
      if (isDirty && !prev.includes(id)) return [...prev, id]
      if (!isDirty && prev.includes(id)) return prev.filter((itemId) => itemId !== id)
      return prev
    })
  }

  const handleCaptionCancel = (id: string) => {
    setDraftCaptions((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setDirtyCaptionIds((prev) => prev.filter((itemId) => itemId !== id))
  }

  const handleCaptionModeration = async (id: string, status: CaptionStatus) => {
    const current = images.find((item) => item.id === id)
    if (!current) return

    try {
      const decoded = decodeCaption(current.caption)
      const nextCaption = encodeCaption(status, decoded.text)
      const { error } = await supabaseBrowser
        .from('gallery')
        .update({ caption: nextCaption })
        .eq('id', id)
      if (error) throw error

      setImages((prev) => prev.map((item) => (item.id === id ? { ...item, caption: nextCaption } : item)))
      setNewlyUploadedIds((prev) => prev.filter((itemId) => itemId !== id))
      showToast('success', status === 'approved' ? 'Podpis zaakceptowany.' : 'Podpis odrzucony.')
    } catch {
      showToast('error', 'Nie udało się zmienić statusu podpisu.')
    }
  }

  const handleDelete = async (image: GalleryImage) => {
    const shouldDelete = window.confirm('Czy na pewno usunąć?')
    if (!shouldDelete) return

    try {
      setIsBusy(true)
      const storagePath = getStoragePathFromPublicUrl(image.url)
      if (storagePath) {
        const { error: storageError } = await supabaseBrowser.storage
          .from('gallery')
          .remove([storagePath])
        if (storageError) throw storageError
      }

      const { error } = await supabaseBrowser.from('gallery').delete().eq('id', image.id)
      if (error) throw error

      setImages((prev) => prev.filter((item) => item.id !== image.id))
      setNewlyUploadedIds((prev) => prev.filter((itemId) => itemId !== image.id))
      setDraftCaptions((prev) => {
        const next = { ...prev }
        delete next[image.id]
        return next
      })
      setDirtyCaptionIds((prev) => prev.filter((itemId) => itemId !== image.id))
      showToast('success', 'Zapisano!')
    } catch {
      showToast('error', 'Nie udało się usunąć zdjęcia.')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <ImageUploader
        onUpload={(image) => {
          setImages((prev) => [...prev, image])
          setNewlyUploadedIds((prev) => [...prev, image.id])
        }}
      />

      {toast ? (
        <div
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            toast.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {orderedImages.map((image, index) => (
          <div key={image.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            {(() => {
              const parsedCaption = decodeCaption(image.caption)
              return (
                <span
                  className={`mb-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    parsedCaption.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : parsedCaption.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {parsedCaption.status === 'approved'
                    ? 'Zaakceptowany'
                    : parsedCaption.status === 'rejected'
                      ? 'Odrzucony'
                      : 'Oczekuje na akceptacje'}
                </span>
              )
            })()}

            <img
              src={image.url}
              alt={image.caption || 'Zdjęcie z galerii'}
              className="h-[200px] w-full rounded-lg object-cover"
            />

            <div className="mt-3 space-y-2">
              {(() => {
                const parsedCaption = decodeCaption(image.caption)
                const captionValue = draftCaptions[image.id] ?? parsedCaption.text
                const showEditActions = dirtyCaptionIds.includes(image.id)
                return (
                  <div className="space-y-2">
                    <input
                      value={captionValue}
                      placeholder="Podpis zdjęcia"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                      onChange={(event) =>
                        handleCaptionDraftChange(image.id, event.target.value, parsedCaption.text)
                      }
                    />

                    {showEditActions ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void handleCaptionSave(image.id, captionValue)}
                          className="rounded-md bg-indigo-500 px-2.5 py-1 text-sm font-medium text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Zapisz
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleCaptionCancel(image.id)}
                          className="rounded-md border border-slate-300 px-2.5 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Anuluj
                        </button>
                      </div>
                    ) : null}
                  </div>
                )
              })()}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isBusy || index === 0}
                  onClick={() => void handleMove(index, 'up')}
                  className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={isBusy || index === orderedImages.length - 1}
                  onClick={() => void handleMove(index, 'down')}
                  className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↓
                </button>
                {newlyUploadedIds.includes(image.id) ? (
                  <>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleCaptionModeration(image.id, 'approved')}
                      className="rounded-md bg-emerald-500 px-2 py-1 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Akceptuj
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleCaptionModeration(image.id, 'rejected')}
                      className="rounded-md bg-amber-500 px-2 py-1 text-sm font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Odrzuc
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => void handleDelete(image)}
                  className="ml-auto rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  X
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
