"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar, Heart, Star } from "lucide-react";

const features = [
  {
    title: "Najwyzsza\njakosc",
    icon: (
      <svg
        className="h-5 w-5 text-primary sm:h-6 sm:w-6 md:h-7 md:w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 14.5c-2.8 0-5-2.5-5-5.5S5.2 3.5 8 3.5s5 2.5 5 5.5S10.8 14.5 8 14.5z" />
        <path d="M7 14.5l-1 2h4l-1-2" />
        <path d="M8 16.5v6" />
        <path d="M16 12.5c-2.2 0-4-2-4-4.5S13.8 3.5 16 3.5s4 2 4 4.5S18.2 12.5 16 12.5z" />
        <path d="M15 12.5l-1 2h4l-1-2" />
        <path d="M16 14.5v4" />
      </svg>
    ),
  },
  {
    title: "Terminowosc\ni niezawodnosc",
    icon: (
      <Calendar className="h-5 w-5 text-primary sm:h-6 sm:w-6 md:h-7 md:w-7" strokeWidth={1.5} />
    ),
  },
  {
    title: "Indywidualne\npodejscie",
    icon: <Star className="h-5 w-5 text-primary sm:h-6 sm:w-6 md:h-7 md:w-7" strokeWidth={1.5} />,
  },
  {
    title: "Pasja i dbalosc\no detale",
    icon: <Heart className="h-5 w-5 text-primary sm:h-6 sm:w-6 md:h-7 md:w-7" strokeWidth={1.5} />,
  },
];

const DEFAULT_BG =
  "https://images.pexels.com/photos/10577008/pexels-photo-10577008.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";

type HeroSlide = {
  id: string;
  url: string;
  alt: string;
};

type HeroSectionProps = {
  heroTitle?: string;
  heroSubtitle?: string;
  aboutText?: string;
  slides?: HeroSlide[];
};

export function HeroSection({
  heroTitle = "Tworzymy wyjatkowe chwile",
  heroSubtitle = "Dekoracje, ktore zachwycaja i zostaja w pamieci.",
  aboutText = "Zadbamy o kazdy detal Twojej imprezy!",
  slides = [],
}: HeroSectionProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = slides.length > 0 ? slides.map((s) => s.url) : [DEFAULT_BG];

  // autoplay
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [images.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="relative flex min-h-[90vh] items-center overflow-hidden pt-10 pb-20 md:pt-20 md:pb-28"
    >
      {/* Slider backgrounds */}
      {images.map((url, i) => (
        <div
          key={url}
          ref={i === currentIndex ? bgRef : undefined}
          className={`absolute inset-0 -top-[15%] -bottom-[15%] bg-cover bg-center will-change-transform transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${url}')` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/85 to-black/40 md:via-cream/70" />

      {/* Dot indicators */}
      {images.length > 1 ? (
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === currentIndex ? "bg-primary w-5" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      ) : null}

      <div className="floating absolute top-[15%] right-8 z-10 hidden lg:right-32 md:block">
        <span className="neon-text block font-script text-[70px] leading-[0.9] lg:text-[100px]">
          Let&apos;s <br />
          <span className="ml-16">Party</span>
        </span>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-[1400px] px-6 sm:px-12 md:px-16 lg:px-24">
        <div className="mt-8 max-w-full md:mt-0 md:max-w-xl lg:max-w-2xl">
          <div className="mb-6 h-0.5 w-12 bg-gold" />

          <h1 className="mb-4 font-serif text-[40px] leading-[1.1] text-dark sm:text-5xl md:mb-6 lg:text-[68px] lg:leading-[1.1]">
            {heroTitle}
          </h1>
          <p className="mb-2 text-[16px] font-medium text-[#555] sm:text-[18px]">{heroSubtitle}</p>
          <p className="mb-8 text-[16px] font-medium text-[#555] sm:mb-10 sm:text-[18px]">{aboutText}</p>
          <a
            href="#oferta"
            className="group mb-4 inline-flex w-full transform items-center justify-center rounded-full bg-primary px-8 py-4 text-[13px] font-bold tracking-widest text-white uppercase shadow-md transition-all hover:-translate-y-1 hover:bg-primary-hover hover:shadow-lg sm:w-auto"
          >
            ZOBACZ OFERTE
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          <div className="mt-8 grid grid-cols-4 gap-2 sm:mt-12 sm:gap-4 md:mt-16 md:gap-6 lg:mt-20">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center md:items-start md:text-left"
              >
                <div className="mb-2 rounded-full bg-white/70 p-1.5 shadow-sm backdrop-blur-md sm:p-2 md:mb-3 md:p-3 lg:mb-4">
                  {feature.icon}
                </div>
                <span className="text-[9px] leading-[1.2] font-semibold tracking-wide text-dark uppercase sm:text-[10px] md:text-[12px] md:leading-tight lg:text-[13px]">
                  {feature.title.split("\\n").map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
