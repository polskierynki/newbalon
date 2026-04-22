import { Clock, Gem, Heart, Sparkles, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Benefit = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

const benefits: Benefit[] = [
  {
    title: "Kreatywnosc",
    description:
      "Tworzymy unikalne dekoracje dopasowane do Twoich potrzeb i marzen.",
    Icon: Sparkles,
  },
  {
    title: "Jakosc",
    description:
      "Korzystamy z najlepszych materialow, aby efekt zachwycal na kazdym kroku.",
    Icon: Gem,
  },
  {
    title: "Doswiadczenie",
    description:
      "Mamy doswiadczenie w dekoracji setek imprez - od kameralnych po duze eventy.",
    Icon: Heart,
  },
  {
    title: "Terminowosc",
    description: "Dotrzymujemy ustalen i dbamy o kazdy detal na czas.",
    Icon: Clock,
  },
  {
    title: "Indywidualne podejscie",
    description:
      "Kazdy projekt traktujemy indywidualnie, z pelnym zaangazowaniem.",
    Icon: UserCheck,
  },
];

export function WhyUsSection() {
  return (
    <section id="o-nas" className="bg-cream py-20 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-16 text-center md:mb-24">
          <span className="mb-3 block text-[11px] font-bold tracking-[0.2em] text-primary uppercase md:text-[12px]">
            DLACZEGO MY?
          </span>
          <h2 className="px-2 font-serif text-3xl text-dark md:text-4xl lg:text-[42px]">
            Z nami Twoja impreza bedzie wyjatkowa!
          </h2>
          <div className="mx-auto mt-6 h-[2px] w-10 bg-gold opacity-80 md:mt-8 md:w-16" />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 text-center md:grid-cols-3 lg:grid-cols-5">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="reveal flex flex-col items-center"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-full border border-primary/40 bg-white shadow-sm transition-colors hover:border-primary">
                <benefit.Icon className="h-7 w-7 text-primary" />
              </div>
              <h4 className="mb-3 text-[15px] font-semibold text-dark">{benefit.title}</h4>
              <p className="max-w-[220px] text-[14px] leading-relaxed text-[#666]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
