"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ROICalculator from "./ROICalculator";

export default function BusinessCase() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="efektywnosc" ref={ref} className="py-28 lg:py-40 bg-surface relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 0%, rgba(0,0,0,0.02) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-foreground/30">
            Kalkulator ROI
          </p>
          <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.03em] text-foreground leading-[1.1]">
            Oblicz zwrot z inwestycji
          </h2>
          <p className="mt-5 text-[15px] text-foreground/35 leading-[1.8]">
            Wybierz urządzenie, dostosuj parametry do swojej placówki
            i&nbsp;sprawdź, jak szybko ICAROS zacznie na siebie zarabiać.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8 }}
        >
          <ROICalculator />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="#kontakt"
            className="group inline-flex items-center gap-3 text-[13px] font-semibold text-foreground/40 hover:text-foreground transition-colors duration-500 tracking-[0.02em]"
          >
            Porozmawiaj z nami o kalkulacji dla Twojej placówki
            <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
