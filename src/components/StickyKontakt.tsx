"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { trackBookingClick } from "@/lib/analytics/track";
import { CEL_KONTAKTU, CEL_PACJENTA } from "@/lib/kontakt";

/**
 * Pasek z głównym krokiem, który jedzie ze stroną.
 *
 * Każda strefa ma swój krok. W biznesie to umówienie rozmowy, więc pasek
 * prowadzi do kalendarza w zakładce kontaktu. U pacjenta to zobaczenie, jak
 * wygląda trening, więc pasek prowadzi na landing `/health`; do kalendarza
 * pacjent trafia sam, przez zakładkę kontaktu.
 *
 * Wcześniej do kontaktu prowadził przycisk w nawigacji i cały panel
 * z formularzem pod każdą podstroną. Zostało jedno miejsce i jeden przycisk:
 * pasek u dołu, prowadzący wprost do kalendarza w zakładce kontaktu.
 *
 * Pasek nie wita odwiedzającego od razu, tylko wjeżdża po zjechaniu z pierwszego
 * ekranu, i nie pokazuje się tam, gdzie kalendarz już stoi na stronie.
 */

/** Po ilu pikselach przewinięcia pasek wjeżdża. */
const PROG = 420;

const TRESC = {
  patient: {
    naglowek: "Nie wiesz, jak wygląda trening?",
    podpis: "Przebieg sesji, trasy w wirtualnej rzeczywistości i film z treningu.",
    przycisk: "Zobacz ICAROS Health",
    cel: CEL_PACJENTA,
    /** Strona, na której pasek jest zbędny, bo prowadzi dokładnie tam. */
    swojaStrona: CEL_PACJENTA,
  },
  business: {
    naglowek: "Gotowy na nowoczesną rehabilitację?",
    podpis: "15 minut rozmowy telefonicznej, termin wybierasz sam.",
    przycisk: "Umów rozmowę",
    cel: CEL_KONTAKTU,
    swojaStrona: "/kontakt-partner",
  },
} as const;

export default function StickyKontakt({
  wariant = "business",
}: {
  wariant?: "patient" | "business";
}) {
  const pathname = usePathname();
  const [przewiniety, ustawPrzewiniety] = useState(false);
  const mniejRuchu = useReducedMotion();
  const tresc = TRESC[wariant];

  useEffect(() => {
    const sprawdz = () => ustawPrzewiniety(window.scrollY > PROG);
    sprawdz();
    window.addEventListener("scroll", sprawdz, { passive: true });
    return () => window.removeEventListener("scroll", sprawdz);
  }, []);

  // W zakładce kontaktu kalendarz stoi już na stronie, więc pasek się nie pokazuje.
  const widoczny = przewiniety && pathname !== tresc.swojaStrona;

  return (
    <AnimatePresence>
      {widoczny ? (
        <motion.div
          initial={{ opacity: 0, y: mniejRuchu ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: mniejRuchu ? 0 : 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/[0.08] bg-[#111114]/95 backdrop-blur-xl"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:px-10">
            <div className="min-w-0">
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-white">
                {tresc.naglowek}
              </p>
              <p className="mt-0.5 hidden text-[13px] text-white/60 sm:block">{tresc.podpis}</p>
            </div>
            <Link
              href={tresc.cel}
              onClick={() => trackBookingClick("pasek")}
              className="group inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2.5 px-7 text-[14px] font-semibold text-white transition-opacity duration-300 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
            >
              {tresc.przycisk}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
