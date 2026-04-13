"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";

export default function References() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-white border-t border-foreground/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-foreground/30">
            Referencje
          </p>
          <h2 className="mt-5 text-[clamp(1.4rem,3vw,2rem)] font-bold tracking-[-0.03em] text-foreground leading-[1.1]">
            Zaufały nam wiodące kliniki w Europie
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="relative max-w-[1100px] mx-auto"
        >
          <div className="relative w-full overflow-hidden bg-foreground/[0.03] border border-foreground/[0.06] p-8 lg:p-12">
            <Image
              src="/ICAROS_Health_References.webp"
              alt="Referencje ICAROS — FX Mayr, BGU Murnau, SRH, Hessingpark Clinic, ADELI Medical Center, Nescens, Frankenlandklinik, VAMED Klinik Kipfenberg, VIVAMAYR"
              width={1920}
              height={500}
              className="w-full h-auto object-contain grayscale opacity-70 hover:opacity-90 hover:grayscale-0 transition-all duration-700"
              sizes="(max-width: 1024px) 100vw, 1100px"
            />
          </div>

          <p className="mt-6 text-center text-[12px] text-foreground/20">
            Wybrane placówki korzystające z&nbsp;technologii ICAROS w&nbsp;Europie
          </p>
        </motion.div>
      </div>
    </section>
  );
}
