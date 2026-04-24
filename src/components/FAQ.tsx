"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    question: "Czym dokładnie jest ICAROS i jak działa?",
    answer:
      "ICAROS to ekosystem certyfikowanych urządzeń treningowych, które łączą rehabilitację z grywalizacją i wirtualną rzeczywistością. Pacjent wykonuje precyzyjne ćwiczenia na sprzęcie, sterując środowiskiem VR ruchami ciała. System mierzy postępy, dostosowuje trudność i generuje raporty — wszystko w sposób angażujący i motywujący.",
  },
  {
    question: "Ile kosztuje system ICAROS i czy to się opłaca?",
    answer:
      "ICAROS Circle (kompletny ekosystem trzech urządzeń: Health, Guardian i Cloud) to inwestycja rzędu 49 900 € netto. Przy zaledwie 15 użytkownikach dziennie i stawce 25 € za sesję, system zwraca się w niecałe 5 miesięcy i generuje ponad 55 000 € zysku w pierwszym roku. Dostępny jest również leasing od 799 € miesięcznie. Chętnie przygotujemy kalkulację dopasowaną do Twojej placówki.",
  },
  {
    question: "Czy potrzebuję specjalistycznego personelu do obsługi?",
    answer:
      "Nie. System ICAROS jest zaprojektowany jako Plug & Play i wymaga minimalnego nadzoru. Intuicyjna aplikacja prowadzi pacjenta przez ćwiczenia, a terapeuta może monitorować wielu użytkowników jednocześnie. To oznacza większą przepustowość pacjentów bez dodatkowych etatów.",
  },
  {
    question: "Czy ICAROS jest certyfikowanym wyrobem medycznym?",
    answer:
      "Tak. ICAROS Health i ICAROS Guardian są certyfikowanymi wyrobami medycznymi klasy I. Sprzęt jest produkowany w Niemczech i spełnia europejskie standardy jakości i bezpieczeństwa.",
  },
  {
    question: "Dla jakich pacjentów i wskazań jest ICAROS?",
    answer:
      "ICAROS wspiera szeroki zakres wskazań: bóle kręgosłupa (LBPS), rehabilitację neurologiczną (np. po udarze), trening równowagi i koordynacji, prewencję upadków u seniorów, trening kognitywno-motoryczny oraz rehabilitację pooperacyjną. System pozwala dopasować ćwiczenia do indywidualnych potrzeb każdego pacjenta.",
  },
  {
    question: "Jak wygląda wdrożenie i ile trwa instalacja?",
    answer:
      "Wdrożenie jest proste i szybkie. Sprzęt jest dostarczany gotowy do pracy — wystarczy podłączyć, skonfigurować oprogramowanie i przeszkolić personel. Cały proces zajmuje zazwyczaj jeden dzień roboczy. Zapewniamy pełne wsparcie techniczne i szkolenie.",
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
];

function FAQItem({
  question,
  answer,
  index,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-foreground/[0.05] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-6 py-7 text-left group"
      >
        <div className="flex items-start gap-5">
          <span
            className="text-[12px] font-bold pt-1 shrink-0 tabular-nums bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[15px] font-medium text-foreground group-hover:text-foreground/70 transition-colors duration-500 leading-[1.5]">
            {question}
          </span>
        </div>
        <span className="shrink-0 mt-1">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              className="w-4 h-4 text-foreground/20"
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
            <p className="pb-7 pl-[44px] text-[14px] text-foreground/70 leading-[1.8] max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="faq" ref={ref} className="py-28 lg:py-40 bg-surface">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4"
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-foreground/55">
              FAQ
            </p>
            <h2 className="mt-5 text-[clamp(1.6rem,3vw,2.4rem)] font-bold tracking-[-0.03em] text-foreground leading-[1.1]">
              Często zadawane pytania
            </h2>
            <p className="mt-5 text-[14px] text-foreground/70 leading-[1.8]">
              Odpowiedzi na najczęstsze pytania dotyczące technologii ICAROS, wdrożenia
              i&nbsp;współpracy. Nie znalazłeś odpowiedzi?
            </p>
            <a
              href="#kontakt"
              className="group inline-flex items-center gap-3 mt-6 text-[13px] font-semibold text-foreground/70 hover:text-foreground transition-colors duration-500 tracking-[0.02em]"
            >
              Skontaktuj się z nami
              <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="lg:col-span-8"
          >
            <div className="bg-white border border-foreground/[0.06] p-6 lg:p-10">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
