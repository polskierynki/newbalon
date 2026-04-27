import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
// @ts-ignore
import { GMAIL_APP_PASSWORD } from "process";

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

    // Wysyłka e-maila przez Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "obalonlodz@gmail.com", // Twój adres Gmail
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'obalonlodz@gmail.com',
      to: 'obalonlodz@gmail.com', // Możesz zmienić na inny adres docelowy
      subject: `Nowa wiadomość z formularza kontaktowego od ${fullName}`,
      text: `Imię i nazwisko: ${fullName}\nEmail: ${email}\nTelefon: ${phone}\nTyp wydarzenia: ${eventType}\nData wydarzenia: ${eventDate}\nBudżet: ${budget}\nWiadomość: ${message}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Błąd wysyłki e-maila:", err);
      return NextResponse.json(
        { message: "Nie udało się wysłać e-maila. Spróbuj ponownie później." },
        { status: 500 }
      );
    }
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
