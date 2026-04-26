'use client'

import { useMemo, useRef, useState } from 'react'

import type { GalleryImage } from '../../lib/types'
import { supabaseBrowser } from '../../lib/supabase-client'

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error'

type ImageUploaderProps = {
  onUpload: (image: GalleryImage) => void
}

const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxFileSize = 5 * 1024 * 1024

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [state, setState] = useState<UploadState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [progress, setProgress] = useState(0)

  const stateClass = useMemo(() => {
    if (state === 'dragging') return 'border-indigo-500 bg-indigo-50'
    if (state === 'error') return 'border-red-500 bg-red-50'
    if (state === 'success') return 'border-emerald-500 bg-emerald-50'
    return 'border-slate-300 bg-white'
  }, [state])

  const validateFile = (file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      throw new Error('Dozwolone formaty to JPG, PNG i WEBP.')
    }
    if (file.size > maxFileSize) {
      throw new Error('Maksymalny rozmiar pliku to 5 MB.')
    }
  }

  const handleFiles = async (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return

    const files = Array.from(filesList)

    try {
      setErrorMessage('')
      setState('uploading')
      setProgress(0)

      files.forEach(validateFile)

      const { data: maxRows, error: maxError } = await supabaseBrowser
        .from('gallery')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)

      if (maxError) {
        throw maxError
      }

      let currentPosition = maxRows?.[0]?.position ?? -1

      await Promise.all(
        files.map(async (file, index) => {
          const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
          const filePath = fileName

          const { error: uploadError } = await supabaseBrowser.storage
            .from('gallery')
            .upload(filePath, file, { upsert: false })

          if (uploadError) {
            throw uploadError
          }

          const { data: publicUrlData } = supabaseBrowser.storage
            .from('gallery')
            .getPublicUrl(filePath)

          currentPosition += 1

          const { data: inserted, error: insertError } = await supabaseBrowser
            .from('gallery')
            .insert({
              url: publicUrlData.publicUrl,
              caption: '[PENDING] ',
              position: currentPosition,
            })
            .select('*')
            .single()

          if (insertError) {
            throw insertError
          }

          onUpload(inserted)
          setProgress(Math.round(((index + 1) / files.length) * 100))
        })
      )

      setState('success')
      setTimeout(() => {
        setState('idle')
        setProgress(0)
      }, 1200)
    } catch (error) {
      setState('error')
      setErrorMessage(error instanceof Error ? error.message : 'Wystąpił błąd podczas uploadu.')
    }
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 text-center transition ${stateClass}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          if (state !== 'uploading') setState('dragging')
        }}
        onDragLeave={() => {
          if (state !== 'uploading') setState('idle')
        }}
        onDrop={(event) => {
          event.preventDefault()
          if (state !== 'uploading') setState('idle')
          void handleFiles(event.dataTransfer.files)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          onChange={(event) => void handleFiles(event.target.files)}
        />

        {state === 'uploading' ? (
          <div className="flex flex-col items-center gap-2 text-slate-700">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <p className="text-sm font-medium">Wgrywanie... {progress}%</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-700">
              Przeciągnij zdjęcia tutaj lub kliknij, aby wybrać pliki
            </p>
            <p className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP do 5 MB (wiele plików naraz)</p>
          </>
        )}
      </div>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      {state === 'success' ? <p className="text-sm text-emerald-600">Pliki zostały dodane.</p> : null}
    </div>
  )
}
