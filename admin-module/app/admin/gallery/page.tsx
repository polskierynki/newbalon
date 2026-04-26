import { GalleryManager } from '../../../components/admin/GalleryManager'
import { defaultGalleryImages } from '../../../lib/default-data'
import { createSupabaseServerClient } from '../../../lib/supabase-server'

export default async function GalleryPage() {
  const supabase = await createSupabaseServerClient()
  let { data: images } = await supabase.from('gallery').select('*').order('position')

  if (!images || images.length === 0) {
    await supabase.from('gallery').insert(defaultGalleryImages)
    const seeded = await supabase.from('gallery').select('*').order('position')
    images = seeded.data ?? []
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">REALIZACJE</h1>
      <GalleryManager initialImages={images ?? []} />
    </div>
  )
}
