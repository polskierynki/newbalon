import { HeroManager } from '../../../components/admin/HeroManager'
import { createSupabaseServerClient } from '../../../lib/supabase-server'

type HeroSlide = {
  id: string
  url: string
  alt: string
}

export default async function HomeAdminPage() {
  const supabase = await createSupabaseServerClient()

  const { data: rows } = await supabase
    .from('content')
    .select('key, value')
    .in('key', ['hero_title', 'hero_subtitle', 'about_text', 'hero_slides'])

  const map = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value])) as Record<string, string>

  let slides: HeroSlide[] = []
  if (map.hero_slides) {
    try {
      const parsed = JSON.parse(map.hero_slides)
      if (Array.isArray(parsed)) slides = parsed as HeroSlide[]
    } catch {}
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">STRONA GŁÓWNA</h1>
      <HeroManager
        initialSlides={slides}
        initialTitle={map.hero_title ?? ''}
        initialSubtitle={map.hero_subtitle ?? ''}
        initialAboutText={map.about_text ?? ''}
      />
    </div>
  )
}
