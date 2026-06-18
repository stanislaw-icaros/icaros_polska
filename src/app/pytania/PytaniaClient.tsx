"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import LegalLinks from "@/components/LegalLinks";
import { DISCLAIMER_MEDICAL_DEVICES } from "@/lib/legal";

/**
 * Baza wiedzy / FAQ "rozmowowe" - link-only (nieindeksowana, poza nawigacją).
 * Wysyłana po rozmowie. Bazę rozwijamy: dopisuj pytania do odpowiedniej kategorii
 * (lub dodaj nową kategorię do tablicy `categories`).
 */
type QA = { question: string; answer: string };
type Category = { label: string; intro?: string; items: QA[] };

const categories: Category[] = [
  {
    label: "Technologia i zastosowanie",
    items: [
      {
        question: "Czym dokładnie jest ICAROS i jak działa?",
        answer:
          "ICAROS to ekosystem certyfikowanych urządzeń treningowych, które łączą rehabilitację z grywalizacją i wirtualną rzeczywistością. Pacjent wykonuje precyzyjne ćwiczenia na sprzęcie, sterując środowiskiem VR ruchami ciała. System mierzy postępy, dostosowuje trudność i generuje raporty - wszystko w sposób angażujący i motywujący.",
      },
      {
        question: "Dla jakich pacjentów i wskazań jest ICAROS?",
        answer:
          "ICAROS wspiera szeroki zakres wskazań: bóle kręgosłupa (LBPS), rehabilitację neurologiczną (np. po udarze), trening równowagi i koordynacji, prewencję upadków u seniorów, trening kognitywno-motoryczny oraz rehabilitację pooperacyjną. System pozwala dopasować ćwiczenia do indywidualnych potrzeb każdego pacjenta.",
      },
      {
        question: "Czy ICAROS jest certyfikowanym wyrobem medycznym?",
        answer:
          "ICAROS Health i ICAROS Guardian są certyfikowanymi wyrobami medycznymi klasy I i spełniają wymagania MDR. ICAROS Cloud oraz ICAROS I.S.T. Board to rozwiązania treningowe oparte o ekosystem ICAROS (w tym aplikację) - nie są wyrobami medycznymi w rozumieniu MDR, o ile dokumentacja producenta dla danej wersji produktu nie stanowi inaczej.",
      },
    ],
  },
  {
    label: "Wdrożenie i obsługa",
    items: [
      {
        question: "Czy potrzebuję specjalistycznego personelu do obsługi?",
        answer:
          "Nie. System ICAROS jest zaprojektowany jako Plug & Play i wymaga minimalnego nadzoru. Intuicyjna aplikacja prowadzi pacjenta przez ćwiczenia, a terapeuta może monitorować wielu użytkowników jednocześnie. To oznacza większą przepustowość pacjentów bez dodatkowych etatów.",
      },
      {
        question: "Jak wygląda wdrożenie i ile trwa instalacja?",
        answer:
          "Wdrożenie jest proste i szybkie. Sprzęt jest dostarczany gotowy do pracy - wystarczy podłączyć, skonfigurować oprogramowanie i przeszkolić personel. Cały proces zajmuje zazwyczaj jeden dzień roboczy. Zapewniamy pełne wsparcie techniczne i szkolenie.",
      },
      {
        question: "Czy mogę zobaczyć ICAROS w akcji przed zakupem?",
        answer:
          "Oczywiście. Oferujemy prezentacje online na żywo, a także możliwość umówienia wizyty demonstracyjnej. Skontaktuj się z nami, aby umówić termin prezentacji dopasowanej do potrzeb Twojej placówki.",
      },
      {
        question: "Jakie wsparcie otrzymuję po zakupie?",
        answer:
          "Zapewniamy pełne wsparcie posprzedażowe: szkolenie personelu, wsparcie techniczne, aktualizacje oprogramowania oraz dostęp do nowych exergames i materiałów szkoleniowych. Jako oficjalny dystrybutor w Polsce jesteśmy Twoim lokalnym partnerem na każdym etapie.",
      },
    ],
  },
  {
    label: "Inwestycja i finansowanie",
    items: [
      {
        question: "Ile kosztuje system ICAROS i czy to się opłaca?",
        answer:
          "ICAROS Circle (kompletny ekosystem czterech urządzeń: Health, I.S.T. Board, Guardian i Cloud) to inwestycja rzędu 49 900 € netto. Przy zaledwie 15 użytkownikach dziennie i stawce 25 € za sesję, system zwraca się w niecałe 5 miesięcy i generuje ponad 55 000 € zysku w pierwszym roku. Leasing szacunkowo od ok. 340 € do ok. 1 134 € netto miesięcznie (48 rat, 10% wpłaty wstępnej, 1% wykupu - kurs przeliczeniowy jak w kalkulatorze, ok. 4,25 PLN/EUR). To wyłącznie orientacyjne wyliczenie; chętnie przygotujemy kalkulację dopasowaną do Twojej placówki.",
      },
    ],
  },
];

// Płaski indeks, żeby tylko jedno pytanie było otwarte naraz w całej bazie.
const flatKeys = categories.flatMap((cat, ci) => cat.items.map((_, ii) => `${ci}-${ii}`));

function FAQItem({
  question,
  answer,
  number,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  number: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/[0.07] last:border-b-0">
      <button
        onClick={onToggle}
        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
      >
        <div className="flex items-start gap-5">
          <span
            className="shrink-0 pt-1 text-[12px] font-bold tabular-nums bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
          >
            {String(number).padStart(2, "0")}
          </span>
          <span className="text-[15px] font-medium leading-[1.5] text-white transition-colors duration-500 group-hover:text-white/70">
            {question}
          </span>
        </div>
        <span className="mt-1 shrink-0">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              className="h-4 w-4 text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </motion.div>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 pl-[40px] text-[14px] leading-[1.8] text-white/70">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PytaniaClient() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-x-hidden bg-foreground text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 58% 48% at 80% 14%, rgba(255,102,0,0.18), transparent 68%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 50% at 8% 96%, rgba(255,123,31,0.07), transparent 72%)" }}
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
        <div className="mx-auto w-full max-w-[1080px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[640px]"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-[2px] w-7"
                style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                Baza wiedzy
              </span>
            </div>
            <h1 className="mt-4 text-[clamp(1.9rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              Pytania i odpowiedzi
            </h1>
            <p className="mt-4 max-w-[520px] text-[15px] leading-[1.7] text-white/65">
              Najczęstsze pytania o technologię ICAROS, wdrożenie, obsługę i&nbsp;inwestycję -
              zebrane w&nbsp;jednym miejscu. Bazę stale rozwijamy.
            </p>
          </motion.div>

          <div className="mt-12 space-y-12 sm:mt-16">
            {categories.map((cat, ci) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + ci * 0.08 }}
                className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12"
              >
                <div className="lg:col-span-4">
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    {cat.label}
                  </h2>
                </div>
                <div className="border border-white/[0.08] bg-white/[0.02] px-6 lg:col-span-8 lg:px-9">
                  {cat.items.map((qa, ii) => {
                    const key = `${ci}-${ii}`;
                    return (
                      <FAQItem
                        key={key}
                        number={flatKeys.indexOf(key) + 1}
                        question={qa.question}
                        answer={qa.answer}
                        isOpen={openKey === key}
                        onToggle={() => setOpenKey(openKey === key ? null : key)}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 border border-white/[0.08] bg-white/[0.02] p-7 sm:p-9"
          >
            <p className="text-[15px] font-semibold text-white">Nie znalazłeś odpowiedzi?</p>
            <p className="mt-2 max-w-[480px] text-[14px] leading-[1.7] text-white/60">
              Napisz do nas - odpowiemy na każde pytanie i przygotujemy wycenę dopasowaną do
              Twojej placówki.
            </p>
            <a
              href="mailto:kontakt@icaros.com.pl"
              className="mt-5 inline-flex items-center gap-3 px-6 py-3 text-[14px] font-bold text-white shadow-[0_14px_30px_-12px_rgba(255,102,0,0.55)] transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
            >
              Skontaktuj się z nami
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-6 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <LegalLinks
            className="flex flex-wrap items-center gap-5"
            linkClassName="text-[11px] text-white/40 transition-colors hover:text-white/80"
          />
          <p className="text-[11px] text-white/30">
            © {new Date().getFullYear()} ICAROS Polska - oficjalny dystrybutor ICAROS w Polsce.
          </p>
        </div>
        <p className="mx-auto mt-3 max-w-[1080px] text-[11px] leading-[1.7] text-white/25">
          {DISCLAIMER_MEDICAL_DEVICES}
        </p>
      </footer>
    </main>
  );
}
