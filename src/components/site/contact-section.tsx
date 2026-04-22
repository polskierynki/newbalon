import { Mail } from "lucide-react";
import { ContactQuoteForm } from "@/components/site/contact-quote-form";

export function ContactSection() {
  return (
    <section
      id="kontakt"
      className="relative overflow-hidden bg-gradient-to-b from-cream via-beige to-cream py-20 text-dark md:py-32"
    >
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/30 blur-[80px] md:h-96 md:w-96 md:blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/20 blur-[80px] md:h-96 md:w-96 md:blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 md:gap-20">
          <div>
            <span className="mb-2 block text-center text-xs font-bold tracking-wider text-primary uppercase md:mb-4 md:text-sm lg:text-left">
              Zrobmy to!
            </span>
            <h2 className="mb-6 text-center font-serif text-4xl leading-tight font-bold md:mb-8 md:text-6xl lg:text-left">
              Stworzmy razem cos {" "}
              <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                pieknego!
              </span>
            </h2>
            <p className="mb-10 text-center text-base leading-relaxed text-[#666] md:mb-12 md:text-xl lg:text-left">
              Skorzystaj z formularza ponizej, aby otrzymac darmowa wycene swojej
              dekoracji. Odpowiadamy zazwyczaj w ciagu 24 godzin!
            </p>

            <div className="mx-auto max-w-sm space-y-8 lg:mx-0">
              <div className="group flex cursor-pointer items-center gap-4 md:gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-white text-primary transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white md:h-16 md:w-16 md:rounded-2xl">
                  <Mail className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <p className="mb-0.5 text-xs tracking-wider text-[#888] uppercase md:mb-1 md:text-sm">
                    NAPISZ WIADOMOSC
                  </p>
                  <p className="break-all text-lg font-bold transition-colors group-hover:text-primary md:text-2xl">
                    obalonlodz@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4 md:mt-16 lg:justify-start">
              <a
                href="https://www.facebook.com/baloonart"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-white transition-all duration-300 hover:scale-110 hover:bg-primary hover:shadow-lg md:h-14 md:w-14"
              >
                <svg className="h-5 w-5 text-[#666] transition-colors group-hover:text-white md:h-6 md:w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.12 22 17 22 12z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/baloonart"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-white transition-all duration-300 hover:scale-110 hover:bg-primary hover:shadow-lg md:h-14 md:w-14"
              >
                <svg className="h-5 w-5 text-[#666] transition-colors group-hover:text-white md:h-6 md:w-6" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3.5" fill="currentColor" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
              </a>

            </div>
          </div>

          <div className="isolate overflow-visible rounded-[3rem] border border-primary/15 bg-white/90 p-8 shadow-[0_20px_60px_rgba(219,124,168,0.14)] backdrop-blur-sm md:p-10">
            <h3 className="relative z-10 mb-8 font-serif text-3xl font-bold text-dark">Formularz Wyceny</h3>
            <ContactQuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
