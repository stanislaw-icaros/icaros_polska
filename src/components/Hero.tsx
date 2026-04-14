"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center min-h-[100svh] pt-28 pb-16 lg:pt-0 lg:pb-0">
          <div className="lg:col-span-5 flex flex-col justify-center lg:py-32">
            <div className="w-12 h-[1px] bg-foreground/20 mb-10 hidden lg:block" />

            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-foreground/30 mb-5">
              Oficjalny dystrybutor w Polsce
            </p>

            <h1 className="text-[clamp(2.6rem,6.5vw,4.5rem)] leading-[0.92] font-bold tracking-[-0.04em] text-foreground">
              Rehabilitacja
              <br />
              nowej generacji
            </h1>

            <p className="mt-7 text-[15px] lg:text-[16px] text-foreground/45 max-w-[420px] leading-[1.75]">
              Niemiecka technologia łącząca terapię z&nbsp;grywalizacją
              i&nbsp;wirtualną rzeczywistością. Dla placówek, które chcą
              być o&nbsp;krok przed rynkiem.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#kontakt"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-white text-[14px] font-semibold hover:bg-foreground/80 transition-all duration-500 tracking-[0.01em]"
              >
                Umów prezentację
                <svg
                  className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="#rozwiazania"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-foreground text-[14px] font-semibold border border-foreground/10 hover:border-foreground/30 transition-all duration-500 tracking-[0.01em]"
              >
                Poznaj rozwiązania
              </a>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 lg:gap-12">
              {[
                { value: "9+", label: "Badań klinicznych" },
                { value: "DE", label: "Made in Germany" },
                { value: "3", label: "Urządzenia w systemie" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.value}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9 + i * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[22px] font-bold tracking-tight text-foreground"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-[10px] text-foreground/30 mt-1 tracking-[0.08em] sm:tracking-[0.15em] uppercase font-medium leading-tight">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative w-full max-w-[720px] lg:max-w-none overflow-hidden"
            >
              <div className="relative w-full" style={{ paddingBottom: "66%" }}>
                <Image
                  src="/hero-icaros.webp"
                  alt="ICAROS Health — nowoczesna rehabilitacja z wirtualną rzeczywistością"
                  fill
                  priority
                  className="relative z-10 object-cover object-[40%_center] scale-[1.12] transition-transform duration-700 group-hover:scale-[1.16]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>

              <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 z-20 bg-white/90 backdrop-blur-xl px-6 py-4 border border-foreground/[0.06]">
                <div className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-medium">
                  Na zdjęciu
                </div>
                <div className="text-[14px] font-semibold text-foreground mt-1">
                  ICAROS Health
                </div>
                <div className="text-[12px] text-foreground/40 mt-0.5">
                  Trening VR &middot; Rehabilitacja &middot; Core
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-foreground/[0.06]" />
    </section>
  );
}
