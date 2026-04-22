import { NextResponse } from "next/server";

type ContactPayload = {
  fullName?: string;
  eventType?: string;
  eventDate?: string;
  budget?: string;
  phone?: string;
  email?: string;
  message?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const fullName = body.fullName?.trim() ?? "";
    const eventType = body.eventType?.trim() ?? "";
    const eventDate = body.eventDate?.trim() ?? "";
    const budget = body.budget?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!fullName || !phone || !email || !eventType || !budget) {
      return NextResponse.json(
        { message: "Uzupelnij wymagane pola formularza." },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Podaj poprawny adres e-mail." },
        { status: 400 }
      );
    }

    // Placeholder for email/CRM integration.
    console.info("[quote-form] New message", {
      fullName,
      eventType,
      eventDate,
      budget,
      phone,
      email,
      message,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Nie udalo sie przetworzyc formularza." },
      { status: 500 }
    );
  }
}
