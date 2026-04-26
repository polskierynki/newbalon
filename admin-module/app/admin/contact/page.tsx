import { ContactManager } from '../../../components/admin/ContactManager'
import { SocialLinksManager } from '../../../components/admin/SocialLinksManager'
import { createSupabaseServerClient } from '../../../lib/supabase-server'

type SocialIconName = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'whatsapp'
type SocialLink = {
  id: string
  name: string
  url: string
  icon: SocialIconName
}

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

export default async function ContactPage() {
  const supabase = await createSupabaseServerClient()
  const { data: rows } = await supabase
    .from('content')
    .select('key, value')
    .in('key', ['contact_phone', 'contact_email', 'contact_address', 'social_links'])

  const map = Object.fromEntries((rows ?? []).map((row) => [row.key, row.value])) as Record<string, string>

  let socialLinks: SocialLink[] = defaultSocialLinks
  if (map.social_links) {
    try {
      const parsed = JSON.parse(map.social_links)
      if (Array.isArray(parsed) && parsed.length > 0) {
        socialLinks = parsed as SocialLink[]
      }
    } catch {}
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">KONTAKT</h1>
      <ContactManager
        initialPhone={map.contact_phone ?? '+48 123 456 789'}
        initialEmail={map.contact_email ?? 'obalonlodz@gmail.com'}
        initialAddress={map.contact_address ?? 'Dzialamy na terenie calej Polski'}
      />
      <SocialLinksManager
        initialSocialLinks={socialLinks}
        title="Sociale w kontakcie"
        description="Te ikony są widoczne w top barze, menu oraz sekcji kontaktowej. Dla WhatsApp wpisujesz sam numer telefonu."
        hideNameField
      />
    </div>
  )
}
