"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";
import { getOfferIcon } from "@/lib/offer-icons";

export type ServiceModalData = {
  title: string;
  description: string;
  longDescription: string;
  popupText?: string;
  icon: string;
  image: string;
};

type ServiceModalProps = {
  service: ServiceModalData | null;
  onClose: () => void;
};

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!service) return;
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [service, handleEsc]);

  if (!service) return null;

  const ServiceIcon = getOfferIcon(service.icon);

  // Zamiana :check: na zielony ptaszek Lucide
  function renderRichText(text: string) {
    const parts = text.split(/(:check:)/g);
    return parts.map((part, i) => {
      if (part === ':check:') {
        // Importujemy BadgeCheck z lucide-react
        // Używamy inline SVG z Tailwindem
        return (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline h-5 w-5 text-emerald-500 align-text-bottom mx-1"
          >
            <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        );
      }
      return part;
    });
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={service.title}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-[#fcf9f8] shadow-[0_24px_80px_rgba(0,0,0,0.30)] sm:rounded-[28px]">
        {/* Uchwyt mobilny */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[#d5c4b8]" />
        </div>

        {/* Zamknij */}
        <button
          onClick={onClose}
          aria-label="Zamknij"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#7a6e66] shadow-md backdrop-blur-sm transition-colors hover:bg-primary hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Zdjęcie */}
          <div className="relative h-56 w-full flex-shrink-0 md:h-auto md:w-[42%]">
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover"
              priority
            />
            {/* Gradient na dole (mobile) / z prawej (desktop) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#fcf9f8]/60" />

            {/* Ikona + eyebrow na zdjęciu (mobile) */}
            <div className="absolute bottom-0 left-0 p-5 md:hidden">
              <div className="flex items-end gap-3">
                <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/25">
                  <ServiceIcon className="h-4 w-4" />
                </span>
                <div>
                  <span className="mb-0.5 block text-[10px] font-bold tracking-[0.18em] text-white/60 uppercase">
                    Dekoracje premium
                  </span>
                  <h2 className="font-serif text-[22px] font-normal leading-tight text-white">
                    {service.title}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Treść */}
          <div className="flex flex-1 flex-col justify-between px-6 pb-8 pt-6 md:px-8 md:pb-10 md:pt-8">
            {/* Nagłówek (desktop only) */}
            <div className="hidden md:block">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                  <ServiceIcon className="h-5 w-5" />
                </span>
                <div>
                  <span className="block text-[10px] font-bold tracking-[0.18em] text-primary/70 uppercase">
                    Dekoracje premium
                  </span>
                  <h2 className="font-serif text-[26px] font-normal leading-tight text-dark">
                    {service.title}
                  </h2>
                </div>
              </div>
              <div className="mb-5 h-px w-12 bg-gold/60" />
            </div>

            {/* Krótki opis */}
            <p className="mb-4 text-[15px] font-medium leading-relaxed text-dark/80">
              {service.description}
            </p>


            {/* Długi opis z obsługą :check: */}
            {service.longDescription ? (
              <div className="mb-6">
                <p className="whitespace-pre-line text-[14px] leading-[1.8] text-[#7a6e66]">
                  {renderRichText(service.longDescription)}
                </p>
              </div>
            ) : null}

            {/* Osobny tekst popupu */}
            {service.popupText && (
              <div className="mb-6">
                <p className="whitespace-pre-line text-[14px] font-semibold text-primary">
                  {service.popupText}
                </p>
              </div>
            )}

            {/* Separator dekoracyjny */}
            <div className="mb-6 h-px w-full bg-[#e7dac7]" />

            {/* CTA */}
            <a
              href="#kontakt"
              onClick={onClose}
              className="group/cta inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-[12px] font-bold tracking-[0.18em] text-white uppercase shadow-[0_4px_20px_rgba(219,124,168,0.35)] transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_6px_28px_rgba(219,124,168,0.5)]"
            >
              ZAPYTAJ O WYCENE
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
