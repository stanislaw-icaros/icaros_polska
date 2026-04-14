"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Sparkles, TrendingUp, FlaskConical, Zap } from "lucide-react";
import type { ReactNode } from "react";

const values: { number: string; title: string; description: string; icon: ReactNode }[] = [
  {
    number: "01",
    title: "Innowacja terapeutyczna",
    description:
      "Połączenie grywalizacji, VR i precyzyjnego sprzętu treningowego tworzy zupełnie nową jakość rehabilitacji. Pacjenci ćwiczą z większą motywacją i osiągają lepsze rezultaty.",
    icon: <Sparkles size={22} strokeWidth={1.4} />,
  },
  {
    number: "02",
    title: "Efektywność biznesowa",
    description:
      "Szybki zwrot z inwestycji, wysoka przepustowość pacjentów i minimalne wymagania personalne. System projektowany z myślą o rentowności Twojej placówki.",
    icon: <TrendingUp size={22} strokeWidth={1.4} />,
  },
  {
    number: "03",
    title: "Wyniki potwierdzone naukowo",
    description:
      "Ponad 9 badań klinicznych przeprowadzonych z wiodącymi uniwersytetami. Udowodniona skuteczność w poprawie siły, równowagi, koordynacji i funkcji poznawczych.",
    icon: <FlaskConical size={22} strokeWidth={1.4} />,
  },
  {
    number: "04",
    title: "Plug & Play",
    description:
      "Kompletne rozwiązanie gotowe do pracy od pierwszego dnia. Sprzęt, oprogramowanie, gogle VR i wsparcie techniczne — wszystko w jednym pakiecie.",
    icon: <Zap size={22} strokeWidth={1.4} />,
  },
];

const stats = [
  { value: "9+", label: "Badań\nklinicznych" },
  { value: "VR", label: "Grywalizacja\ni terapia" },
  { value: "DE", label: "Made in\nGermany" },
];

export default function ValueProposition() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="rozwiazania" ref={ref} className="py-28 lg:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1 relative aspect-[4/5] lg:aspect-auto lg:h-full min-h-[400px] lg:min-h-[540px] overflow-hidden group"
          >
            <Image
              src="/ICAROS-17_0051.webp"
              alt="ICAROS w użyciu — pacjent podczas sesji terapeutycznej VR"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-foreground/30">
              Dlaczego ICAROS
            </p>
            <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.03em] text-foreground leading-[1.1]">
              Technologia, która zmienia sposób prowadzenia rehabilitacji
            </h2>
            <p className="mt-6 text-[15px] text-foreground/40 leading-[1.8]">
              ICAROS to nie kolejny sprzęt. To kompleksowy ekosystem treningowy,
              który podnosi jakość terapii, zwiększa zaangażowanie pacjentów
              i&nbsp;buduje przewagę konkurencyjną Twojej placówki.
            </p>

            <div className="mt-10 w-full h-px bg-foreground/[0.06]" />

            <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.value}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isVisible ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[22px] font-bold text-foreground tracking-tight"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-[10px] sm:text-[11px] text-foreground/25 mt-1 tracking-[0.06em] sm:tracking-[0.1em] uppercase font-medium leading-tight whitespace-pre-line">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-20 lg:mt-28 grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-foreground/[0.06]">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group relative p-10 lg:p-14 border-r border-b border-foreground/[0.06] cursor-default hover:bg-foreground transition-all duration-500"
            >
              <div className="flex items-start justify-between">
                <span className="text-[12px] font-medium tracking-[0.15em] text-foreground/30 group-hover:text-white/30 transition-colors duration-500">
                  {value.number}
                </span>
                <div className="text-foreground/20 group-hover:text-white/60 transition-colors duration-500">
                  {value.icon}
                </div>
              </div>
              <h3 className="mt-5 text-[20px] font-semibold text-foreground tracking-[-0.01em] group-hover:text-white transition-colors duration-500">
                {value.title}
              </h3>
              <p className="mt-4 text-[14px] text-foreground/40 leading-[1.8] group-hover:text-white/50 transition-colors duration-500">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
