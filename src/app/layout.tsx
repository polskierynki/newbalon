import type { Metadata } from "next";
import {
  Dancing_Script,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "o!balon - Wyjatkowe dekoracje balonowe",
  description: "Dekoracje i oprawa balonowa na imprezy w calej Polsce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} ${dancingScript.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full overflow-x-hidden bg-cream font-sans text-dark antialiased">
        {children}
      </body>
    </html>
  );
}
