"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

const navItems = [
  { href: "#", label: "STRONA GLOWNA" },
  { href: "#oferta", label: "OFERTA", withChevron: true },
  { href: "#realizacje", label: "REALIZACJE" },
  { href: "#o-nas", label: "O NAS" },
  { href: "#kontakt", label: "KONTAKT" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-beige bg-cream/95 shadow-sm backdrop-blur-md transition-all duration-300">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between md:h-[88px]">
            <div className="flex shrink-0 cursor-pointer items-center">
              <Image
                src="/logo.png"
                alt="o!balon"
                width={360}
                height={132}
                priority
                className="h-16 w-auto md:h-20"
              />
            </div>

            <nav className="hidden items-center space-x-8 lg:flex xl:space-x-10">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center text-[12px] font-medium tracking-widest uppercase transition-colors xl:text-[13px] ${
                    index === 0 ? "text-primary" : "text-dark hover:text-primary"
                  }`}
                >
                  {item.label}
                  {item.withChevron ? (
                    <ChevronDown className="ml-1.5 h-4 w-4" />
                  ) : null}
                </a>
              ))}
            </nav>

            <div className="hidden items-center lg:flex">
              <button className="transform rounded-full bg-primary px-7 py-3 text-[12px] font-bold tracking-widest text-white uppercase shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg">
                ZAPYTAJ O WYCENE
              </button>
            </div>

            <div className="flex items-center lg:hidden">
              <button
                aria-label="Otworz menu mobilne"
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center justify-center p-2 text-dark hover:text-primary"
              >
                <Menu className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed top-0 right-0 z-[70] flex h-full w-[85vw] max-w-[340px] transform flex-col bg-cream shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-beige px-6 md:h-[88px]">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="o!balon"
              width={220}
              height={80}
              className="h-12 w-auto md:h-14"
            />
          </div>
          <button
            aria-label="Zamknij menu mobilne"
            onClick={() => setIsMenuOpen(false)}
            className="-mr-2 p-2 text-dark hover:text-primary"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-full flex-col overflow-y-auto px-6 pt-10 pb-8">
          <nav className="flex flex-col space-y-6">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between text-[14px] font-medium tracking-widest uppercase transition-colors ${
                  index === 0 ? "text-primary" : "text-dark hover:text-primary"
                }`}
              >
                {item.label}
                {item.withChevron ? <ChevronDown className="h-4 w-4" /> : null}
              </a>
            ))}
          </nav>

          <div className="mt-auto w-full border-t border-beige pt-8">
            <button className="w-full rounded-full bg-primary px-6 py-4 text-[13px] font-bold tracking-widest text-white uppercase shadow-md transition-colors hover:bg-primary-hover">
              ZAPYTAJ O WYCENE
            </button>
            <div className="mt-6 flex justify-center space-x-4">
              <a
                href="https://www.facebook.com/baloonart"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark shadow-sm transition-all hover:bg-primary hover:text-white"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.78-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/baloonart"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark shadow-sm transition-all hover:bg-primary hover:text-white"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
