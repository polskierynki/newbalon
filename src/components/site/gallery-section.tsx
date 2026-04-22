"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const photos = [
  {
    src: "https://images.pexels.com/photos/3950478/pexels-photo-3950478.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Oh Baby - dekoracje balonowe",
  },
  {
    src: "https://images.pexels.com/photos/5760866/pexels-photo-5760866.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Chrzest Swiety - dekoracje balonowe",
  },
  {
    src: "https://images.pexels.com/photos/1561504/pexels-photo-1561504.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Happy Birthday - dekoracje balonowe",
  },
  {
    src: "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "18 urodziny - dekoracje balonowe",
  },
  {
    src: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Slub i wesele - dekoracje balonowe",
  },
  {
    src: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Event firmowy - dekoracje balonowe",
  },
  {
    src: "https://images.pexels.com/photos/4473886/pexels-photo-4473886.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Impreza - dekoracje balonowe",
  },
  {
    src: "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Dekoracje - balony",
  },
];

// Duplicate for seamless loop
const marqueePhotos = [...photos, ...photos];

export function GallerySection() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxSrc, closeLightbox]);

  return (
    <>
      <section
        id="realizacje"
        className="relative overflow-hidden border-y border-primary/20"
        style={{ height: "520px" }}
      >
        {/* Scrolling photo strip */}
        <div className="absolute inset-0 flex items-center">
          <div className="marquee-track flex gap-3 will-change-transform">
            {marqueePhotos.map((photo, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Powiekszenie: ${photo.alt}`}
                onClick={() => setLightboxSrc(photo.src)}
                className="group relative h-[380px] w-[260px] shrink-0 overflow-hidden rounded-2xl shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                  <span className="scale-75 rounded-full bg-white/90 px-5 py-2 text-[11px] font-bold tracking-widest text-dark uppercase opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                    POWIEKSZENIE
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>


        {/* Centered Instagram card — stationary */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <a
            href="https://www.instagram.com/baloonart"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto group relative flex flex-col items-center justify-center overflow-hidden bg-primary px-10 py-10 text-center shadow-2xl transition-opacity duration-300 hover:opacity-95"
            style={{ minWidth: 260, minHeight: 380 }}
          >
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <svg
              className="relative z-10 mb-6 h-12 w-12 text-white transition-transform duration-300 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
            </svg>

            <h3 className="relative z-10 mb-8 font-serif text-2xl leading-tight text-white md:text-3xl">
              Zobacz nasze realizacje
              <br />
              na Instagramie!
            </h3>

            <span className="relative z-10 rounded-full border border-white bg-transparent px-8 py-3.5 text-[12px] font-bold tracking-widest text-white uppercase transition-all duration-300 group-hover:bg-white group-hover:text-primary">
              OBSERWUJ NAS
            </span>
          </a>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxSrc ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            type="button"
            aria-label="Zamknij"
            onClick={closeLightbox}
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc.replace("w=800", "w=1600")}
              alt="Powiekszenie zdjecia"
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

