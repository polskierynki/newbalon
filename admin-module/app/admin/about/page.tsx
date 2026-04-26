import { AboutManager } from '../../../components/admin/AboutManager'
import { createSupabaseServerClient } from '../../../lib/supabase-server'

type AboutIcon = 'sparkles' | 'gem' | 'heart' | 'clock' | 'user-check' | 'star'
type AboutItem = {
  id: string
  title: string
  description: string
  icon: AboutIcon
}

const defaultItems: AboutItem[] = [
  {
    id: 'about-1',
    title: 'Kreatywnosc',
    description: 'Tworzymy unikalne dekoracje dopasowane do Twoich potrzeb i marzen.',
    icon: 'sparkles',
  },
  {
    id: 'about-2',
    title: 'Jakosc',
    description: 'Korzystamy z najlepszych materialow, aby efekt zachwycal na kazdym kroku.',
    icon: 'gem',
  },
  {
    id: 'about-3',
    title: 'Doswiadczenie',
    description: 'Mamy doswiadczenie w dekoracji setek imprez - od kameralnych po duze eventy.',
    icon: 'heart',
  },
  {
    id: 'about-4',
    title: 'Terminowosc',
    description: 'Dotrzymujemy ustalen i dbamy o kazdy detal na czas.',
    icon: 'clock',
  },
  {
    id: 'about-5',
    title: 'Indywidualne podejscie',
    description: 'Kazdy projekt traktujemy indywidualnie, z pelnym zaangazowaniem.',
    icon: 'user-check',
  },
]

export default async function AboutPage() {
  const supabase = await createSupabaseServerClient()
  const { data: rows } = await supabase
    .from('content')
    .select('key, value')
    .in('key', ['why_us_eyebrow', 'why_us_title', 'why_us_items'])

  const map = Object.fromEntries((rows ?? []).map((row) => [row.key, row.value])) as Record<string, string>

  let items: AboutItem[] = defaultItems
  if (map.why_us_items) {
    try {
      const parsed = JSON.parse(map.why_us_items)
      if (Array.isArray(parsed) && parsed.length > 0) {
        items = parsed as AboutItem[]
      }
    } catch {}
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">O NAS</h1>
      <AboutManager
        initialEyebrow={map.why_us_eyebrow ?? 'DLACZEGO MY?'}
        initialTitle={map.why_us_title ?? 'Z nami Twoja impreza bedzie wyjatkowa!'}
        initialItems={items}
      />
    </div>
  )
}
