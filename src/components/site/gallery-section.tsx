"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const fallbackPhotos = [
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

type GalleryPhoto = {
  src: string;
  caption?: string;
  captionStatus?: "pending" | "approved" | "rejected";
};

export function GallerySection({ photos = [] }: { photos?: GalleryPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const galleryPhotos = photos.length
    ? photos.map((photo) => ({
        src: photo.src,
        alt: photo.caption || "Zdjecie realizacji",
        caption: photo.caption,
        captionStatus: photo.captionStatus ?? "approved",
      }))
    : fallbackPhotos.map((photo) => ({
        src: photo.src,
        alt: photo.alt,
        caption: "",
        captionStatus: "approved" as const,
      }));
  const marqueePhotos = [...galleryPhotos, ...galleryPhotos];
  const activePhoto = lightboxIndex !== null ? galleryPhotos[lightboxIndex] : null;

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setIsGridOpen(false);
  }, []);
  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + galleryPhotos.length) % galleryPhotos.length;
    });
  }, [galleryPhotos.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % galleryPhotos.length;
    });
  }, [galleryPhotos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isGridOpen) {
          setIsGridOpen(false);
          return;
        }
        closeLightbox();
      }
      if (!isGridOpen && e.key === "ArrowLeft") goToPrev();
      if (!isGridOpen && e.key === "ArrowRight") goToNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxIndex, isGridOpen, closeLightbox, goToPrev, goToNext]);

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
                onClick={() => setLightboxIndex(i % galleryPhotos.length)}
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
                {photo.caption && photo.captionStatus !== "rejected" ? (
                  <div className="pointer-events-none absolute right-3 bottom-3 left-3">
                    {photo.captionStatus === "pending" ? (
                      <span className="mb-1 inline-block text-[10px] font-bold tracking-[0.2em] text-white/85 uppercase [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]">
                        Nowe
                      </span>
                    ) : null}
                    <p className="line-clamp-2 font-script text-[26px] leading-[1.05] text-white md:text-[30px] [text-shadow:0_1px_0_rgba(0,0,0,0.55),0_3px_0_rgba(0,0,0,0.45),0_10px_18px_rgba(0,0,0,0.65)]">
                      {photo.caption}
                    </p>
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Centered Instagram card — stationary */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <a
            href="https://www.instagram.com/obalon_lodz"
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
      {activePhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            type="button"
            aria-label="Zamknij"
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/45 text-white shadow-[0_10px_24px_rgba(0,0,0,0.45)] backdrop-blur-sm transition hover:bg-black/65"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Otworz galerie"
            onClick={(event) => {
              event.stopPropagation();
              setIsGridOpen(true);
            }}
            className="group absolute top-5 right-19 z-[70] flex h-11 w-11 items-center justify-end overflow-hidden rounded-full border border-white/35 bg-black/35 px-3 text-white shadow-[0_8px_22px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:w-44 hover:bg-black/60"
          >
            <span className="mr-2 max-w-0 overflow-hidden whitespace-nowrap text-[10px] font-semibold tracking-[0.14em] uppercase opacity-0 transition-all duration-300 group-hover:max-w-32 group-hover:opacity-100">
              Galeria zdjec
            </span>
            <Images className="h-4 w-4 shrink-0" />
          </button>
          <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-full w-full">
              <Image
                src={activePhoto.src.replace("w=800", "w=1600")}
                alt={activePhoto.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />

              {activePhoto.caption && activePhoto.captionStatus !== "rejected" ? (
                <div className="pointer-events-none absolute right-4 bottom-4 left-4">
                  {activePhoto.captionStatus === "pending" ? (
                    <span className="mb-1 inline-block text-[10px] font-bold tracking-[0.2em] text-white/85 uppercase [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]">
                      Nowe
                    </span>
                  ) : null}
                  <p className="line-clamp-3 font-script text-[30px] leading-[1.05] text-white md:text-[38px] [text-shadow:0_1px_0_rgba(0,0,0,0.55),0_3px_0_rgba(0,0,0,0.45),0_12px_22px_rgba(0,0,0,0.7)]">
                    {activePhoto.caption}
                  </p>
                </div>
              ) : null}

              <button
                type="button"
                aria-label="Poprzednie zdjęcie"
                onClick={goToPrev}
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/35"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Następne zdjęcie"
                onClick={goToNext}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/35"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="absolute right-5 bottom-5 rounded-full bg-black/35 px-4 py-1.5 text-center text-[11px] tracking-[0.14em] text-white/85 uppercase backdrop-blur-sm">
              {(lightboxIndex ?? 0) + 1} / {galleryPhotos.length}
            </div>

            {isGridOpen ? (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
                onClick={() => setIsGridOpen(false)}
              >
                <div
                  className="w-full max-w-4xl rounded-2xl border border-white/20 bg-black/70 p-4 shadow-2xl md:p-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold tracking-[0.14em] text-white/90 uppercase">
                      Galeria
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsGridOpen(false)}
                      className="rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-white uppercase hover:bg-white/20"
                    >
                      Zamknij
                    </button>
                  </div>
                  <div className="grid max-h-[62vh] grid-cols-2 gap-2 overflow-auto pr-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {galleryPhotos.map((photo, idx) => (
                      <button
                        key={`${photo.src}-grid-${idx}`}
                        type="button"
                        aria-label={`Otworz zdjecie ${idx + 1}`}
                        onClick={() => {
                          setLightboxIndex(idx);
                          setIsGridOpen(false);
                        }}
                        className={`relative aspect-[3/4] overflow-hidden rounded-lg border transition ${
                          idx === lightboxIndex
                            ? "border-primary shadow-[0_0_0_1px_rgba(219,124,168,0.65)]"
                            : "border-white/30 hover:border-white/60"
                        }`}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

