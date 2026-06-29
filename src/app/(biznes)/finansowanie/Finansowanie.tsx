"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Wallet, CalendarClock, Building2 } from "lucide-react";

const options = [
  {
    icon: Wallet,
    title: "Zakup",
    text: "Jednorazowa inwestycja, sprzęt od razu jest Twoją własnością. Najprostsza forma - bez zobowiązań wobec leasingodawcy.",
    points: ["Pełna własność od dnia zakupu", "Brak kosztów finansowania", "Możliwość jednorazowej amortyzacji (zależnie od przepisów)"],
  },
  {
    icon: CalendarClock,
    title: "Leasing",
    text: "Rozłóż koszt na 48 miesięcznych rat. Sprzęt zaczyna zarabiać od pierwszego dnia, a rata jest kosztem uzyskania przychodu.",
    points: ["48 rat, wpłata wstępna 10%, wykup 1% (orientacyjnie)", "Rata jako koszt uzyskania przychodu", "Raty policzysz w kalkulatorze ROI"],
  },
  {
    icon: Building2,
    title: "Leasing przez EFL",
    text: "Pracujemy nad dedykowaną ofertą leasingu z Europejskim Funduszem Leasingowym. Szczegółowe warunki udostępnimy wkrótce.",
    points: ["Warunki w przygotowaniu", "Skontaktuj się - powiadomimy Cię, gdy oferta będzie gotowa"],
    soon: true,
  },
];

export default function Finansowanie() {
  return (
    <div className="relative overflow-x-hidden text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 45% at 82% 6%, rgba(255,102,0,0.14), transparent 66%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      <section className="relative z-10 px-6 pt-32 pb-16 sm:px-10 lg:px-16 lg:pt-40">
        <div className="mx-auto max-w-[1180px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[760px]"
          >
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-7" style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                Biznes &middot; Finansowanie
              </span>
            </div>
            <h1 className="mt-4 text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              Jak sfinansować ICAROS
            </h1>
            <p className="mt-5 max-w-[620px] text-[16px] leading-[1.7] text-white/65">
              Zakup, leasing albo dedykowana oferta partnera. Wybierz model, który najlepiej pasuje
              do finansów Twojej placówki - a my pomożemy dobrać szczegóły.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-8 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.06] lg:grid-cols-3">
            {options.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <motion.div
                  key={opt.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="relative flex flex-col bg-[#0a0a0a] p-8 lg:p-9"
                >
                  {opt.soon && (
                    <span className="absolute right-6 top-6 border border-brand-orange/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-orange">
                      Wkrótce
                    </span>
                  )}
                  <div className="flex h-11 w-11 items-center justify-center border border-white/12 bg-white/[0.04]">
                    <Icon className="h-[20px] w-[20px] text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 text-[18px] font-bold tracking-[-0.02em] text-white">{opt.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-[1.7] text-white/55">{opt.text}</p>
                  <ul className="mt-5 space-y-2.5">
                    {opt.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[13px] leading-[1.6] text-white/70">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "linear-gradient(135deg,#ff6600,#ff7b1f)" }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-6 text-[11.5px] leading-[1.7] text-white/30">
            Podane parametry leasingu (48 rat, 10% wpłaty wstępnej, 1% wykupu, kurs ok. 4,25 PLN/EUR)
            mają charakter orientacyjny. Ostateczna oferta zależy od leasingodawcy i weryfikacji firmy.
          </p>
        </div>
      </section>

      <section className="relative z-10 px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1180px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start justify-between gap-6 border border-white/[0.08] bg-white/[0.02] p-8 sm:flex-row sm:items-center sm:p-10"
          >
            <div>
              <h2 className="text-[20px] font-bold tracking-[-0.02em] text-white">
                Policz, czy ICAROS się zwróci
              </h2>
              <p className="mt-2 max-w-lg text-[14px] leading-[1.7] text-white/60">
                W kalkulatorze ROI porównasz koszt zakupu i leasingu z przychodami z sesji.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/komercjalizacja#roi"
                className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
              >
                Otwórz kalkulator ROI
              </Link>
              <a
                href="#kontakt"
                className="inline-flex items-center gap-2 border border-white/15 px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/[0.06]"
              >
                Zapytaj o finansowanie
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
