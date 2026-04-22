import { ArrowRight } from "lucide-react";
import Image from "next/image";

const cards = [
  {
    title: "Scianki balonowe",
    description:
      "Efektowne scianki z balonow dopasowane do charakteru Twojej imprezy.",
    image:
      "https://images.pexels.com/photos/68525/pexels-photo-68525.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    title: "Scianki dekoracyjne",
    description:
      "Eleganckie scianki i tla idealne na zdjecia oraz wyjatkowe aranzacje przestrzeni.",
    image:
      "https://images.pexels.com/photos/1543627/pexels-photo-1543627.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    title: "Balony z helem",
    description:
      "Balony z helem na kazda okazje. Bukiety, kompozycje i balony personalizowane.",
    image:
      "https://images.pexels.com/photos/3419692/pexels-photo-3419692.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    title: "Dekoracje imprezowe",
    description:
      "Kompleksowe dekoracje imprez okolicznosciowych - urodziny, chrzciny, komunie i inne.",
    image:
      "https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
];

export function OfferSection() {
  return (
    <section id="oferta" className="bg-beige py-20 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-12 text-center md:mb-20">
          <span className="mb-3 block text-[11px] font-bold tracking-[0.2em] text-primary uppercase md:text-[12px]">
            CO OFERUJEMY
          </span>
          <h2 className="px-2 font-serif text-3xl text-dark md:text-4xl lg:text-[42px]">
            Kompleksowa oprawa Twojej imprezy
          </h2>
          <div className="mx-auto mt-6 h-[2px] w-10 bg-gold opacity-80 md:mt-8 md:w-16" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className="reveal group cursor-pointer"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl shadow-sm">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
              </div>
              <div className="px-2 md:px-0">
                <h3 className="mb-2 text-xl font-semibold text-dark">{card.title}</h3>
                <p className="mb-4 text-[15px] leading-relaxed text-[#666]">{card.description}</p>
                <a
                  href="#"
                  className="inline-flex items-center text-[12px] font-bold tracking-widest text-primary uppercase transition-colors group-hover:text-primary-hover"
                >
                  DOWIEDZ SIE WIECEJ <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
