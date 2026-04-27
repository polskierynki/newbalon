"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getOfferIcon, normalizeOfferIconName } from "@/lib/offer-icons";
import { ServiceModal, type ServiceModalData } from "./service-modal";

const fallbackCards = [
  {
    title: "Scianki balonowe",
    description:
      "Efektowne scianki z balonow dopasowane do charakteru Twojej imprezy.",
    longDescription: "",
    icon: "party-popper",
    image:
      "https://images.pexels.com/photos/1172849/pexels-photo-1172849.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    title: "Scianki dekoracyjne",
    description:
      "Eleganckie scianki i tla idealne na zdjecia oraz wyjatkowe aranzacje przestrzeni.",
    longDescription: "",
    icon: "sparkles",
    image:
      "https://images.pexels.com/photos/1543627/pexels-photo-1543627.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    title: "Balony z helem",
    description:
      "Balony z helem na kazda okazje. Bukiety, kompozycje i balony personalizowane.",
    longDescription: "",
    icon: "gift",
    image:
      "https://images.pexels.com/photos/3419692/pexels-photo-3419692.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    title: "Dekoracje imprezowe",
    description:
      "Kompleksowe dekoracje imprez okolicznosciowych - urodziny, chrzciny, komunie i inne.",
    longDescription: "",
    icon: "wand-sparkles",
    image:
      "https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
];

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  icon: string;
  position: number;
};

type OfferSectionProps = {
  services?: ServiceItem[];
  serviceImages?: string[];
  sectionEyebrow?: string;
  sectionTitle?: string;
};

function getLeadText(text: string) {
  const normalized = text.trim();
  if (!normalized) return "";

  const firstSentence = normalized
    .split(/[.!?]/)
    .map((part) => part.trim())
    .find((part) => part.length > 0);

  const lead = firstSentence ?? normalized;
  if (lead.length <= 78) return lead;
  return `${lead.slice(0, 75).trimEnd()}...`;
}

export function OfferSection({
  services = [],
  serviceImages = [],
  sectionEyebrow = "CO OFERUJEMY",
  sectionTitle = "Nasze uslugi",
}: OfferSectionProps) {
  const [activeModal, setActiveModal] = useState<ServiceModalData | null>(null);

  const cards = services.length
    ? services.map((service, index) => ({
        title: service.title,
        description: service.description,
        longDescription: service.long_description ?? "",
        icon: normalizeOfferIconName(service.icon),
        image: serviceImages[index] || fallbackCards[index % fallbackCards.length].image,
        signatureDetail: service.signature_detail ?? '',
        gotowaGirlanda1: service.gotowa_girlanda_1 ?? '',
        gotowaGirlanda2: service.gotowa_girlanda_2 ?? '',
        popupText: service.popup_text ?? '',
      }))
    : fallbackCards;

  return (
    <section id="oferta" className="relative overflow-hidden bg-beige py-20 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-gold/10 blur-2xl" />
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-12 text-center md:mb-16">
          <span className="mb-3 block text-[11px] font-bold tracking-[0.2em] text-primary uppercase md:text-[12px]">
            {sectionEyebrow}
          </span>
          <h2 className="px-2 font-serif text-3xl text-dark md:text-4xl lg:text-[42px]">
            {sectionTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#6d645d] md:text-[15px]">
            Luksusowe detale, dopracowane kompozycje i dekoracje, ktore buduja klimat wydarzenia od pierwszego spojrzenia.
          </p>
          <div className="mx-auto mt-6 h-[2px] w-10 bg-gold opacity-80 md:w-16" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-4">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className="reveal group h-full cursor-pointer rounded-[18px] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-beige active:translate-y-0.5"
              style={{ transitionDelay: `${index * 100}ms` }}
              role="button"
              tabIndex={0}
              aria-label={`Pokaz szczegoly uslugi: ${card.title}`}
              onClick={() => setActiveModal(card)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveModal(card);
                }
              }}
            >
              {/* === ZDJĘCIE z tytułem wewnątrz === */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-500 group-hover:shadow-[0_16px_45px_rgba(0,0,0,0.2)]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                {/* Gradient — ciemny dół */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />


                {/* Tytuł + ikona na dole zdjęcia */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {(() => {
                    const ServiceIcon = getOfferIcon(card.icon);
                    return (
                      <div className="flex items-end gap-3">
                        <span className="mb-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/25 transition-colors duration-300 group-hover:bg-primary/70">
                          <ServiceIcon className="h-4 w-4" />
                        </span>
                        <div>
                          <span className="mb-1 block text-[10px] font-bold tracking-[0.18em] text-white/60 uppercase">
                            Dekoracje premium
                          </span>
                          <h3 className="font-serif text-[22px] font-normal leading-tight text-white">
                            {card.title}
                          </h3>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* === OPIS + CTA pod zdjęciem — otwarta przestrzeń, zero boxów === */}
              <div className="mt-4 flex flex-1 flex-col px-1">
                <div className="mb-5 flex-1 pr-1">
                  {card.signatureDetail && (
                    <>
                      <span className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-primary/70 uppercase">
                        Signature detail
                      </span>
                      <p className="font-serif text-[19px] leading-[1.45] text-[#5f5149] md:text-[21px]">
                        {card.signatureDetail}
                      </p>
                    </>
                  )}
                  {card.gotowaGirlanda1 && (
                    <p className="mt-2 text-[13px] leading-[1.75] text-[#8a7d75]">
                      {card.gotowaGirlanda1}
                    </p>
                  )}
                  {card.gotowaGirlanda2 && (
                    <p className="mt-2 text-[13px] leading-[1.75] text-[#8a7d75]">
                      {card.gotowaGirlanda2}
                    </p>
                  )}
                  <p className="mt-3 min-h-[70px] text-[13px] leading-[1.75] text-[#8a7d75]">
                    {card.description}
                  </p>
                </div>

                <span className="mt-auto inline-flex w-fit whitespace-nowrap items-center gap-2 border-b border-primary/35 pb-1 text-[10px] font-bold tracking-[0.14em] text-primary uppercase transition-all group-hover:border-primary group-hover:text-primary-hover sm:text-[11px] sm:tracking-[0.18em]">
                  DOWIEDZ SIE WIECEJ
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ServiceModal service={activeModal} onClose={() => setActiveModal(null)} />
    </section>
  );
}
