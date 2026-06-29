"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, Sparkles, Trophy, TrendingUp, Users, ShieldCheck } from "lucide-react";
import ROICalculator from "@/components/ROICalculator";

const arguments_ = [
  {
    icon: Award,
    title: "Skuteczność potwierdzona nauką",
    text: "Ponad 9 badań klinicznych nad terapią VR. Realne wyniki - wzrost siły mięśni głębokich, lepsza równowaga, niższy poziom bólu. To argument, który przekonuje pacjenta i NFZ-owego audytora.",
  },
  {
    icon: Sparkles,
    title: "Innowacja, która robi wrażenie",
    text: "Rehabilitacja w wirtualnej rzeczywistości z grywalizacją robi wrażenie na pacjentach. Chętniej wracają na kolejne sesje i polecają placówkę znajomym, bo ćwiczenia wreszcie są przyjemnością, a nie obowiązkiem.",
  },
  {
    icon: Trophy,
    title: "Wyróżnik na tle konkurencji",
    text: "Niewiele placówek w Polsce ma ICAROS. To technologia, która buduje nowoczesny wizerunek i daje realną przewagę w walce o pacjenta.",
  },
  {
    icon: TrendingUp,
    title: "Nowe źródło przychodów",
    text: "Dodatkowa, komercyjna usługa w cenniku. Przy rozsądnym obłożeniu sprzęt zwraca się w kilka miesięcy i dalej zarabia - szczegóły policzysz w kalkulatorze poniżej.",
  },
  {
    icon: Users,
    title: "Większa przepustowość",
    text: "Intuicyjna aplikacja prowadzi pacjenta przez ćwiczenia, a jeden terapeuta nadzoruje wielu użytkowników naraz. Więcej sesji bez dodatkowych etatów.",
  },
  {
    icon: ShieldCheck,
    title: "Niemiecka jakość",
    text: "Made in Germany. ICAROS Health i Guardian to certyfikowane wyroby medyczne klasy I (MDR). Sprzęt zaprojektowany do codziennej, intensywnej pracy w placówce.",
  },
];

export default function Komercjalizacja() {
  return (
    <div className="relative overflow-x-hidden text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 45% at 82% 6%, rgba(255,102,0,0.16), transparent 66%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      {/* Hero */}
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
                Biznes &middot; Komercjalizacja
              </span>
            </div>
            <h1 className="mt-4 text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              Dlaczego ICAROS to dobra inwestycja
            </h1>
            <p className="mt-5 max-w-[620px] text-[16px] leading-[1.7] text-white/65">
              Skuteczność, innowacja i konkretny zwrot z inwestycji. Zebraliśmy argumenty,
              które przemawiają za wprowadzeniem ICAROS do oferty Twojej placówki - i kalkulator,
              w którym policzysz to dla siebie.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Argumenty */}
      <section className="relative z-10 px-6 pb-8 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
            {arguments_.map((arg, i) => {
              const Icon = arg.icon;
              return (
                <motion.div
                  key={arg.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                  className="bg-[#0a0a0a] p-8 lg:p-9"
                >
                  <div className="flex h-11 w-11 items-center justify-center border border-white/12 bg-white/[0.04]">
                    <Icon className="h-[20px] w-[20px] text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 text-[17px] font-bold tracking-[-0.02em] text-white">
                    {arg.title}
                  </h3>
                  <p className="mt-2.5 text-[13.5px] leading-[1.7] text-white/55">{arg.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kalkulator ROI (na jasnej karcie dla czytelności) */}
      <section id="roi" className="relative z-10 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
              Kalkulator ROI
            </p>
            <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.03em]">
              Oblicz zwrot z inwestycji
            </h2>
            <p className="mt-5 text-[15px] leading-[1.8] text-white/55">
              Wybierz urządzenie, dostosuj parametry do swojej placówki i&nbsp;sprawdź, jak szybko
              ICAROS zacznie na siebie zarabiać.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-surface p-6 sm:p-10 lg:p-14"
          >
            <ROICalculator />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 flex flex-col items-start justify-between gap-5 border border-white/[0.08] bg-white/[0.02] p-7 sm:flex-row sm:items-center sm:p-8"
          >
            <div>
              <p className="text-[15px] font-semibold text-white">Wolisz rozłożyć koszt na raty?</p>
              <p className="mt-1.5 max-w-md text-[13.5px] leading-[1.7] text-white/55">
                Sprawdź opcje leasingu - w tym współpracę z EFL - na stronie Finansowanie.
              </p>
            </div>
            <Link
              href="/finansowanie"
              className="inline-flex shrink-0 items-center gap-2 border border-white/15 px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/[0.06]"
            >
              Zobacz finansowanie
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
