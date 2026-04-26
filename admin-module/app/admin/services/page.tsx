import { ServicesManager } from '../../../components/admin/ServicesManager'
import { OfferSettingsManager } from '../../../components/admin/OfferSettingsManager'
import { defaultServicePhotos, defaultServices } from '../../../lib/default-data'
import { createSupabaseServerClient } from '../../../lib/supabase-server'

export default async function ServicesPage() {
  const supabase = await createSupabaseServerClient()
  let { data: services } = await supabase.from('services').select('*').order('position')

  if (!services || services.length === 0) {
    await supabase.from('services').insert(defaultServices)
    const seeded = await supabase.from('services').select('*').order('position')
    services = seeded.data ?? []
  }

  let { data: servicePhotosRows } = await supabase
    .from('content')
    .select('key, value')
    .like('key', 'service_photos_%')
    .order('key')

  if (!servicePhotosRows || servicePhotosRows.length === 0) {
    await Promise.all(
      defaultServicePhotos.map((url, index) =>
        supabase.from('content').upsert({
          key: `service_photos_${index + 1}`,
          value: JSON.stringify([url]),
          updated_at: new Date().toISOString(),
        })
      )
    )

    const seededPhotos = await supabase
      .from('content')
      .select('key, value')
      .like('key', 'service_photos_%')
      .order('key')
    servicePhotosRows = seededPhotos.data ?? []
  }

  const servicePhotos: string[][] = (servicePhotosRows ?? [])
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((row) => {
      try {
        const parsed = JSON.parse(row.value)
        return Array.isArray(parsed) ? (parsed as string[]) : [row.value]
      } catch {
        return row.value ? [row.value] : []
      }
    })

  const { data: offerContentRows } = await supabase
    .from('content')
    .select('key, value')
    .in('key', ['services_eyebrow', 'services_title'])

  const offerMap = Object.fromEntries((offerContentRows ?? []).map((row) => [row.key, row.value])) as Record<
    string,
    string
  >

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">OFERTA</h1>
      <OfferSettingsManager
        initialEyebrow={offerMap.services_eyebrow ?? 'CO OFERUJEMY'}
        initialTitle={offerMap.services_title ?? 'Nasze usługi'}
      />
      <ServicesManager initialServices={services ?? []} initialServicePhotos={servicePhotos} />
    </div>
  )
}