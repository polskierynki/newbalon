import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { normalizeOfferIconName } from "@/lib/offer-icons";

type ServicePayload = {
  title: string;
  description: string;
  long_description: string;
  icon: string;
  position: number;
  photos: string[];
};

async function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Missing Supabase env vars");

  // service role client – bypasses RLS
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, serviceKey);
}

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
    // 1. Sprawdź czy użytkownik jest zalogowany
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services: ServicePayload[] = await req.json();
    if (!Array.isArray(services)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabase = await getSupabaseAdmin();

    // 2. Usuń wszystkie istniejące usługi
    const { error: deleteError } = await supabase.from("services").delete().not("id", "is", null);
    if (deleteError) throw deleteError;

    // 3. Wstaw nowe
    if (services.length > 0) {
      const payload = services.map((s, i) => ({
        title: s.title,
        description: s.description,
        long_description: s.long_description ?? "",
        icon: normalizeOfferIconName(s.icon),
        position: i,
      }));

      const { error: insertError } = await supabase.from("services").insert(payload);

      if (insertError) {
        // Kolumna long_description może jeszcze nie istnieć (migracja 004 nie uruchomiona)
        // Próbujemy zapisać bez niej, żeby nie blokować działania admina
        const isColumnMissing =
          insertError.code === "42703" ||
          insertError.message?.toLowerCase().includes("long_description");

        if (isColumnMissing) {
          const fallbackPayload = payload.map(({ long_description: _ld, ...rest }) => rest);
          const { error: fallbackError } = await supabase.from("services").insert(fallbackPayload);
          if (fallbackError) throw fallbackError;
        } else {
          throw insertError;
        }
      }
    }

    // 4. Zapisz zdjęcia jako JSON array w content
    const photoCount = Math.max(services.length, 4);
    await Promise.all(
      Array.from({ length: photoCount }).map((_, i) =>
        supabase.from("content").upsert({
          key: `service_photos_${i + 1}`,
          value: JSON.stringify(services[i]?.photos ?? []),
          updated_at: new Date().toISOString(),
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/services] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
