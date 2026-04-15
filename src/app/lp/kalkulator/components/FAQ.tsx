"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string | React.ReactNode;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Czym jest ICAROS Circle i co wchodzi w jego skład?",
    answer: (
      <>
        <p>
          ICAROS Circle to kompletny system trzech osobnych urządzeń treningowych i rehabilitacyjnych, działających razem jako jedna spójna ścieżka terapeutyczna. Każde urządzenie obsługuje inny etap rehabilitacji lub treningu — od pierwszych ćwiczeń wspomaganych, aż po samodzielny trening całego ciała.
        </p>
        <p className="mt-3">W skład systemu wchodzą:</p>
        <ul className="mt-2 space-y-3 pl-4">
          <li><strong>ICAROS Health</strong> — urządzenie do treningu w pozycji horyzontalnej (wspomaganej). Przeznaczone dla pacjentów neurologicznych i ortopedycznych, którzy ćwiczą mięśnie core, koordynację i równowagę w pozycji leżącej z pełnym wsparciem ciała. Certyfikowany wyrób medyczny klasy I. W zestawie: komputer, gogle VR.</li>
          <li><strong>ICAROS Guardian</strong> — urządzenie do treningu pionowego z podparciem. Poprawia kontrolę posturalną, równowagę i mobilność w pozycji stojącej. Minimalne wymagania personelu — idealne dla seniorów i pacjentów w średnim etapie rehabilitacji. W zestawie: iPad, Apple TV, ekran.</li>
          <li><strong>ICAROS Cloud</strong> — platforma do swobodnego treningu całego ciała w pozycji pionowej, bez podpórek. Przeznaczona dla pacjentów w końcowej fazie rehabilitacji oraz do treningu wydolnościowego i motorycznego.</li>
        </ul>
        <p className="mt-3">
          Pacjent może przejść przez wszystkie trzy urządzenia w jednej sesji — dostępne formaty to 15, 30 lub 45 minut (po 5, 10 lub 15 minut na każdym urządzeniu).
        </p>
      </>
    ),
  },
  {
    question: "Czy ICAROS Circle to zarejestrowany sprzęt medyczny?",
    answer:
      "Tak. ICAROS Health i Guardian to certyfikowane wyroby medyczne klasy I, zgodne z europejskim rozporządzeniem MDR. ICAROS Cloud to certyfikowany sprzęt do treningu i fitnessu.",
  },
  {
    question: "Czy potrzebuję specjalnych uprawnień, żeby korzystać ze sprzętu?",
    answer:
      "Nie. Obsługa ICAROS nie wymaga dodatkowych certyfikatów. Przy zakupie zapewniamy pełne szkolenie zespołu. Pierwsze sesje pacjentów wymagają asysty terapeuty, kolejne mogą być prowadzone z minimalnym nadzorem.",
  },
  {
    question: "Ile miejsca zajmuje urządzenie?",
    answer:
      "ICAROS Circle zajmuje około 4-5 m² przestrzeni roboczej. Montaż nie wymaga przebudowy lokalu, a urządzenie można przestawiać.",
  },
  {
    question: "Co jeśli moja placówka jest mała?",
    answer:
      "Kalkulacja uwzględnia skalę placówki. Wynik 1-2 sesje dziennie to uczciwy, konserwatywny start. Wiele mniejszych klinik zaczyna od tego poziomu i zwiększa zapełnienie w ciągu 3-6 miesięcy.",
  },
  {
    question: "Jak wygląda finansowanie? Czy muszę płacić całość od razu?",
    answer:
      "Nie. Urządzenie jest dostępne w leasingu operacyjnym. Współpracujemy z PKO Leasing. Możliwe jest też finansowanie ze środków UE lub kredytu inwestycyjnego.",
  },
  {
    question: "Czy kalkulacja jest wiążąca?",
    answer:
      "Nie. To szacunek edukacyjny oparty na Twoich danych i uśrednionych stawkach rynkowych. Rzeczywiste wyniki zależą od ceny sesji, lokalnego rynku i zapełnienia kalendarza.",
  },
  {
    question: "Ile trwa dostawa i instalacja?",
    answer:
      "Od podpisania umowy do uruchomienia urządzenia mija zwykle 4-8 tygodni. Instalacja zajmuje 1 dzień roboczy i nie wymaga przebudowy lokalu.",
  },
];

export default function KalkulatorFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mt-14 sm:mt-16 lg:mt-20 border border-foreground/[0.08] bg-white p-5 sm:p-6 lg:p-10">
      <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-foreground/30">
        FAQ
      </p>
      <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.3rem)] font-bold tracking-[-0.03em] text-foreground">
        Często zadawane pytania
      </h2>

      <div className="mt-8 divide-y divide-foreground/[0.06] border-y border-foreground/[0.06]">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className="py-4">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left flex items-start justify-between gap-4"
              >
                <span className="text-[15px] font-medium text-foreground">{item.question}</span>
                <span className="text-foreground/35 text-[18px] leading-none">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen ? (
                <div className="mt-3 text-[14px] leading-[1.8] text-foreground/55 pr-2 sm:pr-6">{item.answer}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

