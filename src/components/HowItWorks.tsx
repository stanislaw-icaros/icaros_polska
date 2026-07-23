"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { PersonStanding, Gamepad2, LineChart, ShieldCheck, HeartPulse, Sparkles, Brain } from "lucide-react";
import type { ReactNode } from "react";

const steps: { number: string; title: string; description: string; icon: ReactNode }[] = [
  {
    number: "01",
    title: "Wsiadasz bezpiecznie",
    description:
      "Stabilna konstrukcja z podparciem sprawia, że nie musisz być w pełni sprawny. Urządzenie dopasowuje się do Ciebie, także po udarze, po urazie czy w starszym wieku.",
    icon: <PersonStanding size={22} strokeWidth={1.4} />,
  },
  {
    number: "02",
    title: "Grasz i latasz w wirtualnym świecie",
    description:
      "Ruchami całego ciała sterujesz grą. Zamiast liczyć nużące powtórzenia, przeżywasz grę i naturalnie zapominasz o wysiłku. To terapia, która wciąga.",
    icon: <Gamepad2 size={22} strokeWidth={1.4} />,
  },
  {
    number: "03",
    title: "Ćwiczysz to, co naprawdę ważne",
    description:
      "W tle wzmacniasz mięśnie głębokie, równowagę, koordynację i funkcje poznawcze. Postępy widać od razu na ekranie, więc czujesz, że idziesz do przodu.",
    icon: <LineChart size={22} strokeWidth={1.4} />,
  },
];

const benefits: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "Więcej motywacji",
    description:
      "Gra angażuje bardziej niż klasyczne ćwiczenia, więc łatwiej wytrwać w regularnej terapii.",
    icon: <Sparkles size={20} strokeWidth={1.4} />,
  },
  {
    title: "Bezpieczeństwo",
    description:
      "Stabilna konstrukcja i prosta obsługa pozwalają ćwiczyć pewnie, przy minimalnym nadzorze.",
    icon: <ShieldCheck size={20} strokeWidth={1.4} />,
  },
  {
    title: "Mniej myślisz o bólu",
    description:
      "Wirtualny świat odwraca uwagę od dyskomfortu, co potwierdzają badania nad terapią w VR.",
    icon: <HeartPulse size={20} strokeWidth={1.4} />,
  },
  {
    title: "Ćwiczysz ciało i umysł",
    description:
      "Trening łączy ruch z zadaniami poznawczymi, wspierając pamięć, uwagę i koordynację.",
    icon: <Brain size={20} strokeWidth={1.4} />,
  },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="jak-to-dziala" ref={ref} className="bg-white py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Intro */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="order-1"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground/55">
              Jak to działa
            </p>
            <h1 className="mt-5 text-[clamp(1.9rem,4.2vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] text-foreground">
              Rehabilitacja, która wciąga jak gra
            </h1>
            <p className="mt-6 text-[16px] leading-[1.85] text-foreground/70">
              ICAROS zamienia ćwiczenia w grę. Zakładasz gogle albo patrzysz na ekran,
              a grą sterujesz ruchami całego ciała. W tym samym czasie wzmacniasz mięśnie,
              równowagę i koordynację, prawie nie odczuwając, że to trening. Efekt? Więcej
              radości z terapii i lepsze, mierzalne wyniki.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 relative aspect-[4/3] overflow-hidden lg:h-full lg:min-h-[440px]"
          >
            <Image
              src="/ICAROS-17_0051.webp"
              alt="Pacjent podczas sesji terapeutycznej ICAROS w wirtualnej rzeczywistości"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </div>

        {/* Kroki */}
        <div className="mt-20 grid grid-cols-1 gap-0 border-l border-t border-foreground/[0.06] md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group relative border-b border-r border-foreground/[0.06] p-10 lg:p-12 transition-colors duration-500 hover:bg-foreground"
            >
              <div className="flex items-start justify-between">
                <span
                  className="bg-clip-text text-[12px] font-bold tracking-[0.15em] text-transparent transition-colors duration-500 group-hover:text-white/40"
                  style={{ backgroundImage: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                >
                  {step.number}
                </span>
                <div className="text-foreground/20 transition-colors duration-500 group-hover:text-white/60">
                  {step.icon}
                </div>
              </div>
              <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.01em] text-foreground transition-colors duration-500 group-hover:text-white">
                {step.title}
              </h3>
              <p className="mt-4 text-[14px] leading-[1.8] text-foreground/70 transition-colors duration-500 group-hover:text-white/80">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dlaczego to działa u pacjentów */}
        <div className="mt-24 lg:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground/40">
              Dlaczego to pomaga
            </p>
            <h2 className="mt-5 text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
              Terapia, do której chce się wracać
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-5 border border-foreground/[0.08] bg-surface p-7"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center text-brand-orange">
                  {b.icon}
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-foreground/60">{b.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA do badań i urządzeń */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/produkty"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity duration-300 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
            >
              Zobacz urządzenia
            </Link>
            <Link
              href="/efektywnosc"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-semibold text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:decoration-foreground/60"
            >
              Efekty potwierdzone badaniami
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
