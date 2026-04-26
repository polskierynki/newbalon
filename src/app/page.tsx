import { Footer } from "@/components/site/footer";
import { GallerySection } from "@/components/site/gallery-section";
import { Header } from "@/components/site/header";
import { HeroSection } from "@/components/site/hero-section";
import { ContactSection } from "@/components/site/contact-section";
import { defaultQuoteFormConfig, type QuoteFormConfig } from "@/components/site/contact-quote-form";
import { OfferSection } from "@/components/site/offer-section";
import { RevealObserver } from "@/components/site/reveal-observer";
import { TopBar } from "@/components/site/top-bar";
import { WhyUsSection } from "@/components/site/why-us-section";
import type { SiteSocialLink } from "@/components/site/social-icon";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type ContentMap = Record<string, string>;
type AboutIcon = "sparkles" | "gem" | "heart" | "clock" | "user-check" | "star";
type AboutItem = {
  id: string;
  title: string;
  description: string;
  icon: AboutIcon;
};

function getCaptionStatus(rawCaption: string): "pending" | "approved" | "rejected" {
  if (rawCaption.startsWith("[PENDING] ")) return "pending";
  if (rawCaption.startsWith("[REJECTED] ")) return "rejected";
  return "approved";
}

function stripCaptionPrefix(rawCaption: string) {
  return rawCaption
    .replace(/^\[PENDING\]\s*/, "")
    .replace(/^\[APPROVED\]\s*/, "")
    .replace(/^\[REJECTED\]\s*/, "");
}

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  const [contentResult, servicesResult, galleryResult] = await Promise.all([
    supabase.from("content").select("*").order("key"),
    supabase.from("services").select("*").order("position"),
    supabase.from("gallery").select("*").order("position"),
  ]);

  const contentMap: ContentMap = (contentResult.data ?? []).reduce<ContentMap>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  const services = servicesResult.data ?? [];
  const serviceImages = Array.from({ length: Math.max(services.length, 4) }).map((_, index) => {
    const raw = contentMap[`service_photos_${index + 1}`];
    if (!raw) return contentMap[`service_photo_${index + 1}`] ?? "";
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? (parsed[0] as string) : "";
    } catch {
      return raw;
    }
  });

  type HeroSlide = { id: string; url: string; alt: string };
  let heroSlides: HeroSlide[] = [];
  if (contentMap.hero_slides) {
    try {
      const parsed = JSON.parse(contentMap.hero_slides);
      if (Array.isArray(parsed)) heroSlides = parsed as HeroSlide[];
    } catch {}
  }

  const defaultSocialLinks: SiteSocialLink[] = [
    {
      id: "social-facebook",
      name: "Facebook",
      url: "https://www.facebook.com/baloonart",
      icon: "facebook",
    },
    {
      id: "social-instagram",
      name: "Instagram",
      url: "https://www.instagram.com/baloonart",
      icon: "instagram",
    },
  ];

  const allowedIcons = new Set(["facebook", "instagram", "tiktok", "youtube", "linkedin", "whatsapp"]);
  let socialLinks: SiteSocialLink[] = defaultSocialLinks;
  if (contentMap.social_links) {
    try {
      const parsed = JSON.parse(contentMap.social_links);
      if (Array.isArray(parsed)) {
        const normalized = parsed
          .map((item, index) => ({
            id: typeof item?.id === "string" && item.id ? item.id : `social-${index}`,
            name: typeof item?.name === "string" && item.name ? item.name : "Social",
            url: typeof item?.url === "string" ? item.url : "",
            icon: allowedIcons.has(String(item?.icon).toLowerCase())
              ? String(item?.icon).toLowerCase()
              : "instagram",
          }));

        if (normalized.length > 0) {
          socialLinks = normalized as SiteSocialLink[];
        }
      }
    } catch {}
  }

  const defaultAboutItems: AboutItem[] = [
    {
      id: "about-1",
      title: "Kreatywnosc",
      description: "Tworzymy unikalne dekoracje dopasowane do Twoich potrzeb i marzen.",
      icon: "sparkles",
    },
    {
      id: "about-2",
      title: "Jakosc",
      description: "Korzystamy z najlepszych materialow, aby efekt zachwycal na kazdym kroku.",
      icon: "gem",
    },
    {
      id: "about-3",
      title: "Doswiadczenie",
      description: "Mamy doswiadczenie w dekoracji setek imprez - od kameralnych po duze eventy.",
      icon: "heart",
    },
    {
      id: "about-4",
      title: "Terminowosc",
      description: "Dotrzymujemy ustalen i dbamy o kazdy detal na czas.",
      icon: "clock",
    },
    {
      id: "about-5",
      title: "Indywidualne podejscie",
      description: "Kazdy projekt traktujemy indywidualnie, z pelnym zaangazowaniem.",
      icon: "user-check",
    },
  ];

  let aboutItems: AboutItem[] = defaultAboutItems;
  if (contentMap.why_us_items) {
    try {
      const parsed = JSON.parse(contentMap.why_us_items);
      if (Array.isArray(parsed) && parsed.length > 0) {
        aboutItems = parsed as AboutItem[];
      }
    } catch {}
  }

  let quoteFormConfig: QuoteFormConfig = defaultQuoteFormConfig;
  if (contentMap.quote_form_config) {
    try {
      const parsed = JSON.parse(contentMap.quote_form_config);
      quoteFormConfig = {
        ...defaultQuoteFormConfig,
        ...parsed,
        eventOptions: Array.isArray(parsed?.eventOptions)
          ? parsed.eventOptions
          : defaultQuoteFormConfig.eventOptions,
        budgetOptions: Array.isArray(parsed?.budgetOptions)
          ? parsed.budgetOptions
          : defaultQuoteFormConfig.budgetOptions,
      };
    } catch {}
  }

  const gallery = (galleryResult.data ?? []).map((item) => ({
    src: item.url,
    caption: stripCaptionPrefix(item.caption ?? ""),
    captionStatus: getCaptionStatus(item.caption ?? ""),
  }));

  return (
    <>
      <RevealObserver />
      <TopBar
        phone={contentMap.contact_phone}
        address={contentMap.contact_address}
        socialLinks={socialLinks}
      />
      <Header socialLinks={socialLinks} />
      <main>
        <HeroSection
          heroTitle={contentMap.hero_title}
          heroSubtitle={contentMap.hero_subtitle}
          aboutText={contentMap.about_text}
          slides={heroSlides}
        />
        <OfferSection
          services={services}
          serviceImages={serviceImages}
          sectionEyebrow={contentMap.services_eyebrow}
          sectionTitle={contentMap.services_title}
        />
        
        <WhyUsSection
          eyebrow={contentMap.why_us_eyebrow}
          title={contentMap.why_us_title}
          items={aboutItems}
        />
        <GallerySection photos={gallery} />
        <ContactSection
          email={contentMap.contact_email}
          socialLinks={socialLinks}
          quoteFormConfig={quoteFormConfig}
        />
      </main>
      <Footer footerText={contentMap.footer_text} />
    </>
  );
}
