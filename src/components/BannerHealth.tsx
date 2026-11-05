"use client";

/**
 * Przejście na stronę ICAROS Health.
 *
 * Strona /health opisuje jedno urządzenie od środka: przebieg sesji, trasy
 * w wirtualnej rzeczywistości, film z treningu i badania. Nie ma tam niczego
 * o prowadzeniu placówki, więc stoi też w strefie pacjenta, jako duży kafel,
 * a nie odnośnik w akapicie.
 */

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function BannerHealth() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden bg-[#07070a]"
        >
          <Image
            src="/health/poster-lot.webp"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1340px"
            className="object-cover object-center opacity-45"
          />
          {/* Przyciemnienie pod tekstem, żeby dało się go czytać na zdjęciu. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(7,7,10,0.94) 0%, rgba(7,7,10,0.78) 45%, rgba(7,7,10,0.35) 100%)",
            }}
          />

          <div className="relative z-10 flex flex-col gap-8 px-7 py-14 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-20 lg:pl-16 lg:pr-14">
            <div className="max-w-[46ch]">
              <h2 className="text-[clamp(1.6rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white">
                Zobacz, jak wygląda trening na ICAROS Health
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-white/75">
                Osobna strona o jednym urządzeniu: przebieg sesji krok po kroku, trasy
                i gry w wirtualnej rzeczywistości, film z treningu oraz wyniki badań.
              </p>
            </div>

            <Link
              href="/health"
              className="group inline-flex min-h-[56px] shrink-0 items-center justify-center gap-3 px-9 text-[15px] font-semibold tracking-[0.01em] text-white transition-opacity duration-300 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
            >
              Zobacz ICAROS Health
              <ArrowRight
                className="h-[18px] w-[18px] transition-transform duration-500 group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
