"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const studyResults = [
  {
    device: "ICAROS Health",
    results: [
      { metric: "+25.8%", label: "Poprawa funkcjonalności mięśniowej" },
      { metric: "2x", label: "Stymulacja mięśni vs zwykły plank" },
      { metric: "+30%", label: "Więcej spalonych kalorii" },
      { metric: "↓", label: "Redukcja częstości bólów pleców" },
    ],
  },
  {
    device: "ICAROS Guardian",
    results: [
      { metric: "↑↑", label: "Istotna poprawa siły nóg" },
      { metric: "↑", label: "Widoczna poprawa mobilności" },
      { metric: "↑", label: "Szybkość chodu u seniorów" },
      { metric: "↑", label: "Funkcje poznawcze i dual-task" },
    ],
  },
  {
    device: "ICAROS Cloud",
    results: [
      { metric: "+15.85%", label: "Wzrost siły core po 5 tygodniach" },
      { metric: "+5%", label: "Wyższy metabolizm energetyczny" },
      { metric: "+7%", label: "Koncentracja mleczanów" },
      { metric: "↑↑", label: "Motywacja i chęć do treningu" },
    ],
  },
];

export default function Studies() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="badania" ref={ref} className="py-28 lg:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-foreground/30">
            Badania naukowe
          </p>
          <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.03em] text-foreground leading-[1.1]">
            Skuteczność potwierdzona naukowo
          </h2>
          <p className="mt-5 text-[16px] text-foreground/40 leading-[1.8]">
            Ponad 9 badań klinicznych przeprowadzonych we współpracy z&nbsp;czołowymi
            europejskimi uniwersytetami. Realne wyniki, nie obietnice.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-0 border border-foreground/[0.06]">
          {studyResults.map((study, i) => (
            <motion.div
              key={study.device}
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.15 + i * 0.12,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group p-8 lg:p-12 hover:bg-foreground hover:text-white transition-all duration-500 ${i < studyResults.length - 1 ? "border-b lg:border-b-0 lg:border-r border-foreground/[0.06]" : ""}`}
            >
              <h3 className="text-[20px] font-bold text-foreground tracking-[-0.01em] mb-8 group-hover:text-white transition-colors duration-500">
                {study.device}
              </h3>

              <div className="space-y-0">
                {study.results.map((result, j) => (
                  <motion.div
                    key={result.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      delay: 0.3 + i * 0.12 + j * 0.06,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-start gap-5 py-4 border-b border-foreground/[0.04] last:border-b-0 group-hover:border-white/[0.08] transition-colors duration-500"
                  >
                    <motion.span
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={isVisible ? { scale: 1, opacity: 1 } : {}}
                      transition={{
                        delay: 0.4 + i * 0.12 + j * 0.08,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="text-[16px] font-bold text-foreground min-w-[56px] shrink-0 tracking-tight group-hover:text-white transition-colors duration-500"
                    >
                      {result.metric}
                    </motion.span>
                    <span className="text-[13px] text-foreground/35 leading-[1.5] pt-0.5 group-hover:text-white/50 transition-colors duration-500">
                      {result.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 max-w-3xl mx-auto text-center"
        >
          <blockquote className="relative">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isVisible ? { scaleX: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-8 h-[1px] bg-foreground/10 mx-auto mb-8 origin-left"
            />
            <p className="text-[17px] lg:text-[19px] text-foreground/50 italic leading-[1.8] font-light">
              &ldquo;Unikalne urządzenie, które aktywuje głębokie grupy mięśniowe oraz stymuluje i&nbsp;przyspiesza koordynację.&rdquo;
            </p>
            <footer className="mt-6">
              <p className="text-[13px] font-semibold text-foreground tracking-[-0.01em]">Simone Girardi</p>
              <p className="text-[12px] text-foreground/25 mt-1">
                Specjalista ds. ruchu i sportu, Neuroorthopaedic Movement Therapy
              </p>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
