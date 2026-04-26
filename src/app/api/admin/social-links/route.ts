import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

type SocialIconName = "facebook" | "instagram" | "tiktok" | "youtube" | "linkedin" | "whatsapp";
type SocialLink = {
  id: string;
  name: string;
  url: string;
  icon: SocialIconName;
};

const iconLabels: Record<SocialIconName, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
};

async function getAuthedUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();
  const client = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {}
      },
    },
  });

  const {
    data: { session },
  } = await client.auth.getSession();
  return session?.user ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { socialLinks?: SocialLink[] };
    const socialLinks = Array.isArray(body.socialLinks) ? body.socialLinks : [];

    const allowedIcons = new Set(["facebook", "instagram", "tiktok", "youtube", "linkedin", "whatsapp"]);

    const cleaned = socialLinks
      .map((item, index) => {
        const rawIcon = typeof item?.icon === "string" ? item.icon.toLowerCase().trim() : "instagram";
        const normalizedIcon = allowedIcons.has(rawIcon) ? rawIcon : "instagram";
        const rawValue = typeof item?.url === "string" ? item.url.trim() : "";
        const normalizedValue =
          normalizedIcon === "whatsapp"
            ? rawValue.startsWith("http://") || rawValue.startsWith("https://")
              ? rawValue
              : `https://wa.me/${rawValue.replace(/\D+/g, "")}`
            : rawValue;

        return {
          id: typeof item?.id === "string" && item.id ? item.id : `social-${index}`,
          name:
            typeof item?.name === "string" && item.name.trim()
              ? item.name.trim()
              : iconLabels[normalizedIcon as SocialIconName],
          url: normalizedValue,
          icon: normalizedIcon,
        };
      });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(url, serviceKey);

    const { error } = await supabase.from("content").upsert({
      key: "social_links",
      value: JSON.stringify(cleaned),
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/social-links] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
