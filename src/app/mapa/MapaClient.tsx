"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import LegalLinks from "@/components/LegalLinks";
import { DISCLAIMER_MEDICAL_DEVICES } from "@/lib/legal";

// Leaflet sięga do `window`, więc mapę ładujemy wyłącznie po stronie klienta.
const MapExperience = dynamic(() => import("./MapExperience"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[440px] items-center justify-center border border-white/[0.08] bg-white/[0.02] text-[13px] text-white/40 sm:h-[520px] lg:h-[640px]">
      Wczytywanie mapy…
    </div>
  ),
});

export default function MapaClient() {
  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-x-hidden bg-foreground text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 58% 48% at 80% 12%, rgba(255,102,0,0.16), transparent 68%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      <header className="relative z-10 px-6 pt-4 sm:px-10 sm:pt-8 lg:px-16">
        <Image
          src="/icaros-logo.webp"
          alt="ICAROS Polska"
          width={1000}
          height={135}
          priority
          className="h-[19px] w-auto sm:h-[21px]"
        />
      </header>

      <section className="relative z-10 flex-1 px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[680px]"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-[2px] w-7"
                style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                Mapa wdrożeń
              </span>
            </div>
            <h1 className="mt-4 text-[clamp(1.9rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              Gdzie działa ICAROS w Polsce
            </h1>
            <p className="mt-4 max-w-[560px] text-[15px] leading-[1.7] text-white/65">
              Placówki w całej Polsce, w których pracują urządzenia ICAROS. Część z nich jest
              dostępna publicznie - możesz umówić pokaz i przetestować sprzęt na żywo. Najedź na
              pinezkę lub wybierz placówkę z listy, aby poznać szczegóły.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-10"
          >
            <MapExperience />
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-6 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <LegalLinks
            className="flex flex-wrap items-center gap-5"
            linkClassName="text-[11px] text-white/40 transition-colors hover:text-white/80"
          />
          <p className="text-[11px] text-white/30">
            © {new Date().getFullYear()} ICAROS Polska - oficjalny dystrybutor ICAROS w Polsce.
          </p>
        </div>
        <p className="mx-auto mt-3 max-w-[1180px] text-[11px] leading-[1.7] text-white/25">
          {DISCLAIMER_MEDICAL_DEVICES}
        </p>
      </footer>
    </main>
  );
}
