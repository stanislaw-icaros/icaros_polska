"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";

export default function References() {
  const { ref, isVisible } = useScrollAnimation();
  const [expanded, setExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleClick = () => {
    if (expanded) {
      setLightboxOpen(true);
    } else {
      setExpanded(true);
    }
  };

  return (
    <>
      <section ref={ref} className="py-20 lg:py-28 bg-white border-t border-foreground/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-14"
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
            <button
              onClick={handleClick}
              className="relative w-full overflow-hidden cursor-pointer group"
            >
              <div className={`transition-all duration-700 ${expanded ? "p-0" : "p-4 sm:p-6 lg:p-10"}`}>
                <Image
                  src="/ICAROS_Health_References.webp"
                  alt="Referencje ICAROS — FX Mayr, BGU Murnau, SRH, Hessingpark Clinic, ADELI Medical Center, Nescens, Frankenlandklinik, VAMED Klinik Kipfenberg, VIVAMAYR"
                  width={1920}
                  height={500}
                  className={`w-full h-auto object-contain transition-all duration-700 ${
                    expanded
                      ? "grayscale-0 opacity-100"
                      : "grayscale opacity-60 group-hover:opacity-80 group-hover:grayscale-[0.3]"
                  }`}
                  sizes="(max-width: 1024px) 100vw, 1100px"
                />
              </div>
            </button>

            <p className="mt-5 text-center text-[12px] sm:text-[13px] text-foreground/30">
              Wybrane placówki korzystające z&nbsp;technologii ICAROS w&nbsp;Europie
              <span className="hidden sm:inline"> &middot; </span>
              <br className="sm:hidden" />
              <span className="text-foreground/15">Kliknij, aby powiększyć</span>
            </p>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-pointer"
            onClick={() => {
              setLightboxOpen(false);
              setExpanded(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-[1400px] w-full"
            >
              <Image
                src="/ICAROS_Health_References.webp"
                alt="Referencje ICAROS"
                width={1920}
                height={500}
                className="w-full h-auto object-contain"
                sizes="100vw"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(false);
                  setExpanded(false);
                }}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2 text-[13px]"
              >
                Zamknij
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
