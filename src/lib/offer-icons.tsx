import type { LucideIcon } from 'lucide-react'
import {
  BadgeCheck,
  Balloon,
  Brush,
  Cake,
  CakeSlice,
  CalendarDays,
  CalendarHeart,
  Candy,
  Clock3,
  Camera,
  Crown,
  FerrisWheel,
  Flower2,
  Gem,
  GlassWater,
  Gift,
  Handshake,
  Heart,
  IceCreamBowl,
  Image as ImageIcon,
  Lightbulb,
  Megaphone,
  Mic2,
  MoonStar,
  Music2,
  Palette,
  PaintBucket,
  PartyPopper,
  Popcorn,
  Ribbon,
  Rocket,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Sun,
  Trophy,
  UserRoundCheck,
  Users,
  WandSparkles,
  Wine,
} from 'lucide-react'

export type OfferIconName =
  | 'sparkles'
  | 'party-popper'
  | 'gift'
  | 'cake'
  | 'flower'
  | 'heart'
  | 'gem'
  | 'crown'
  | 'palette'
  | 'camera'
  | 'calendar-heart'
  | 'wand-sparkles'
  | 'badge-check'
  | 'handshake'
  | 'star'
  | 'balloon'
  | 'music'
  | 'mic'
  | 'glass'
  | 'wine'
  | 'cake-slice'
  | 'ribbon'
  | 'smile'
  | 'sun'
  | 'moon-star'
  | 'shield-check'
  | 'trophy'
  | 'rocket'
  | 'ferris-wheel'
  | 'ice-cream'
  | 'calendar-days'
  | 'clock'
  | 'lightbulb'
  | 'brush'
  | 'paint-bucket'
  | 'users'
  | 'user-check'
  | 'megaphone'
  | 'image'
  | 'candy'
  | 'popcorn'

const offerIconMap: Record<OfferIconName, LucideIcon> = {
  sparkles: Sparkles,
  'party-popper': PartyPopper,
  gift: Gift,
  cake: Cake,
  flower: Flower2,
  heart: Heart,
  gem: Gem,
  crown: Crown,
  palette: Palette,
  camera: Camera,
  'calendar-heart': CalendarHeart,
  'wand-sparkles': WandSparkles,
  'badge-check': BadgeCheck,
  handshake: Handshake,
  star: Star,
  balloon: Balloon,
  music: Music2,
  mic: Mic2,
  glass: GlassWater,
  wine: Wine,
  'cake-slice': CakeSlice,
  ribbon: Ribbon,
  smile: Smile,
  sun: Sun,
  'moon-star': MoonStar,
  'shield-check': ShieldCheck,
  trophy: Trophy,
  rocket: Rocket,
  'ferris-wheel': FerrisWheel,
  'ice-cream': IceCreamBowl,
  'calendar-days': CalendarDays,
  clock: Clock3,
  lightbulb: Lightbulb,
  brush: Brush,
  'paint-bucket': PaintBucket,
  users: Users,
  'user-check': UserRoundCheck,
  megaphone: Megaphone,
  image: ImageIcon,
  candy: Candy,
  popcorn: Popcorn,
}

export const OFFER_ICON_OPTIONS: Array<{ value: OfferIconName; label: string; Icon: LucideIcon }> = [
  { value: 'sparkles', label: 'Blask', Icon: Sparkles },
  { value: 'party-popper', label: 'Impreza', Icon: PartyPopper },
  { value: 'gift', label: 'Prezent', Icon: Gift },
  { value: 'cake', label: 'Tort', Icon: Cake },
  { value: 'flower', label: 'Kwiaty', Icon: Flower2 },
  { value: 'heart', label: 'Serce', Icon: Heart },
  { value: 'gem', label: 'Premium', Icon: Gem },
  { value: 'crown', label: 'Korona', Icon: Crown },
  { value: 'palette', label: 'Kolory', Icon: Palette },
  { value: 'camera', label: 'Foto', Icon: Camera },
  { value: 'calendar-heart', label: 'Okazje', Icon: CalendarHeart },
  { value: 'wand-sparkles', label: 'Stylizacja', Icon: WandSparkles },
  { value: 'badge-check', label: 'Jakosc', Icon: BadgeCheck },
  { value: 'handshake', label: 'Wspolpraca', Icon: Handshake },
  { value: 'star', label: 'Polecane', Icon: Star },
  { value: 'balloon', label: 'Balon', Icon: Balloon },
  { value: 'music', label: 'Muzyka', Icon: Music2 },
  { value: 'mic', label: 'Mikrofon', Icon: Mic2 },
  { value: 'glass', label: 'Szklanka', Icon: GlassWater },
  { value: 'wine', label: 'Toast', Icon: Wine },
  { value: 'cake-slice', label: 'Porcja tortu', Icon: CakeSlice },
  { value: 'ribbon', label: 'Wstega', Icon: Ribbon },
  { value: 'smile', label: 'Usmiech', Icon: Smile },
  { value: 'sun', label: 'Slonce', Icon: Sun },
  { value: 'moon-star', label: 'Wieczor', Icon: MoonStar },
  { value: 'shield-check', label: 'Pewnosc', Icon: ShieldCheck },
  { value: 'trophy', label: 'Top', Icon: Trophy },
  { value: 'rocket', label: 'Efekt wow', Icon: Rocket },
  { value: 'ferris-wheel', label: 'Zabawa', Icon: FerrisWheel },
  { value: 'ice-cream', label: 'Lody', Icon: IceCreamBowl },
  { value: 'calendar-days', label: 'Plan', Icon: CalendarDays },
  { value: 'clock', label: 'Na czas', Icon: Clock3 },
  { value: 'lightbulb', label: 'Pomysl', Icon: Lightbulb },
  { value: 'brush', label: 'Design', Icon: Brush },
  { value: 'paint-bucket', label: 'Kolor', Icon: PaintBucket },
  { value: 'users', label: 'Dla gosci', Icon: Users },
  { value: 'user-check', label: 'Opieka', Icon: UserRoundCheck },
  { value: 'megaphone', label: 'Event', Icon: Megaphone },
  { value: 'image', label: 'Galeria', Icon: ImageIcon },
  { value: 'candy', label: 'Slodko', Icon: Candy },
  { value: 'popcorn', label: 'Kino', Icon: Popcorn },
]

export function normalizeOfferIconName(value: string | null | undefined): OfferIconName {
  if (!value) return 'sparkles'
  const normalized = value.trim().toLowerCase() as OfferIconName
  return normalized in offerIconMap ? normalized : 'sparkles'
}

export function getOfferIcon(value: string | null | undefined): LucideIcon {
  return offerIconMap[normalizeOfferIconName(value)]
}
