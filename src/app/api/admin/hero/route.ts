import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

type HeroSlide = {
  id: string;
  url: string;
  alt: string;
};

type HeroPayload = {
  slides: HeroSlide[];
  title: string;
  subtitle: string;
  aboutText: string;
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

  const { data: { session } } = await client.auth.getSession();
  return session?.user ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: HeroPayload = await req.json();
    const { slides, title, subtitle, aboutText } = body;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(url, serviceKey);

    const upserts = [
      { key: "hero_title", value: title ?? "" },
      { key: "hero_subtitle", value: subtitle ?? "" },
      { key: "about_text", value: aboutText ?? "" },
      { key: "hero_slides", value: JSON.stringify(slides ?? []) },
    ];

    await Promise.all(
      upserts.map((row) =>
        supabase.from("content").upsert({ ...row, updated_at: new Date().toISOString() })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/hero] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(url, serviceKey);

    const { data } = await supabase
      .from("content")
      .select("key, value")
      .in("key", ["hero_title", "hero_subtitle", "about_text", "hero_slides"]);

    const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
    return NextResponse.json(map);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
