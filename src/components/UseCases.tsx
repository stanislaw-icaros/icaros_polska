"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";

const useCases = [
  {
    number: "01",
    title: "Kliniki rehabilitacyjne",
    description:
      "Zwiększ skuteczność terapii i wyróżnij swoją placówkę technologią przyszłości. ICAROS wspiera rehabilitację neurologiczną i ortopedyczną na każdym etapie.",
    image: "/Icaros-24_0544.webp",
    imageAlt: "Terapeuta z pacjentką podczas rehabilitacji na ICAROS Health",
  },
  {
    number: "02",
    title: "Centra senioralne",
    description:
      "Prewencja upadków i poprawa mobilności osób starszych. ICAROS Guardian zapewnia bezpieczny trening równowagi z minimalnym nadzorem personelu.",
    image: "/senior_6.webp",
    imageAlt: "Dwie seniorki ćwiczące wspólnie na ICAROS Guardian",
  },
  {
    number: "03",
    title: "Obiekty premium i wellness",
    description:
      "Wyróżnij swoją ofertę innowacyjną technologią treningową. ICAROS to element, który przyciąga uwagę, buduje wizerunek i generuje dodatkowe przychody.",
    image: "/0.webp",
    imageAlt: "ICAROS Guardian w ekskluzywnym wnętrzu z widokiem na jezioro",
  },
  {
    number: "04",
    title: "Centra sportowe i trenerskie",
    description:
      "Trening fitness i przygotowanie motoryczne w formie angażujących exergames. ICAROS Cloud wzmacnia core, nogi i górę ciała, poprawia koordynację oraz równowagę — w klubach fitness, na zajęciach grupowych i w treningu sportowców.",
    image: "/Icaros-24_0428.webp",
    imageAlt: "Sportsmenka trenująca na platformie ICAROS Cloud",
  },
];

export default function UseCases() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="zastosowania" ref={ref} className="py-28 lg:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-foreground/55">
            Zastosowania
          </p>
          <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.03em] text-foreground leading-[1.1]">
            Dla kogo jest ICAROS?
          </h2>
          <p className="mt-5 text-[16px] text-foreground/70 leading-[1.8]">
            Nasze rozwiązania wspierają placówki, które stawiają na nowoczesną
            rehabilitację, jakość usług i&nbsp;przewagę konkurencyjną.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-0 border border-foreground/[0.06]">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.1 + i * 0.1,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden hover:bg-foreground/[0.015] transition-colors duration-700 ${
                i < 2 ? "border-b border-foreground/[0.06]" : ""
              } ${
                i % 2 === 0 ? "lg:border-r border-foreground/[0.06]" : ""
              }`}
            >
              <div className="relative h-48 lg:h-52 overflow-hidden">
                <Image
                  src={useCase.image}
                  alt={useCase.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
              </div>

              <div className="p-8 lg:p-10 pt-4 lg:pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className="text-[11px] font-bold tracking-[0.2em] bg-clip-text text-transparent"
                      style={{ backgroundImage: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                    >
                      {useCase.number}
                    </span>
                    <h3 className="mt-3 text-[20px] font-semibold text-foreground tracking-[-0.01em]">
                      {useCase.title}
                    </h3>
                  </div>
                  <svg
                    className="w-5 h-5 text-foreground/10 group-hover:text-foreground/30 transition-colors duration-500 mt-6 shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>

                <p className="mt-4 text-[14px] text-foreground/50 leading-[1.8]">
                  {useCase.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
