"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type QA = { question: string; answer: ReactNode };
type Category = { label: string; items: QA[] };
type Audience = "patient" | "business";

/** Pytania wspólne dla obu stref, o samą technologię i terapię. */
const technologyPatient: Category = {
  label: "Technologia i terapia",
  items: [
    {
      question: "Czym dokładnie jest ICAROS i jak działa?",
      answer:
        "ICAROS to urządzenia treningowe, na których ćwiczysz, sterując grą ruchami całego ciała. Zakładasz gogle albo patrzysz na ekran, przechylasz tułów lub przenosisz ciężar ciała, a w wirtualnym świecie lecisz, omijasz przeszkody i zbierasz punkty. W tym samym czasie wzmacniasz mięśnie głębokie, równowagę i koordynację. System mierzy postępy, więc widzisz, że idziesz do przodu.",
    },
    {
      question: "Komu pomaga trening na ICAROS?",
      answer:
        "Osobom po udarze i z chorobami neurologicznymi, po urazach i operacjach kręgosłupa lub kończyn, przy przewlekłym bólu pleców, a także seniorom, którzy chcą utrzymać równowagę i zmniejszyć ryzyko upadków. Ćwiczenia da się dopasować do bardzo różnego poziomu sprawności.",
    },
    {
      question: "Czy ICAROS jest certyfikowanym wyrobem medycznym?",
      answer:
        "ICAROS Health i ICAROS Guardian są certyfikowanymi wyrobami medycznymi klasy I i spełniają wymagania MDR. ICAROS Cloud oraz ICAROS I.S.T. Board to rozwiązania treningowe oparte o ekosystem ICAROS (w tym aplikację) i nie są wyrobami medycznymi w rozumieniu MDR, o ile dokumentacja producenta dla danej wersji produktu nie stanowi inaczej.",
    },
    {
      question: "Czy to bezpieczne, jeśli mam ograniczoną sprawność?",
      answer:
        "Tak. Urządzenia mają stabilną konstrukcję, podpórki i asekurację, a czułość sterowania da się ustawić tak, że wystarczy niewielki ruch. ICAROS I.S.T. Board pozwala ćwiczyć całkowicie na siedząco, bez wstawania. Trening prowadzi terapeuta w placówce.",
    },
  ],
};

/** Strefa pacjenta: praktyka, czyli gdzie i jak wygląda trening. */
const practicePatient: Category = {
  label: "Terapia w praktyce",
  items: [
    {
      question: "Gdzie mogę skorzystać z terapii na urządzeniach ICAROS?",
      answer: (
        <>
          Lista placówek z urządzeniami ICAROS w Polsce cały czas się wydłuża. Wszystkie
          aktualne miejsca zobaczysz na{" "}
          <Link
            href="/mapa"
            className="font-semibold text-foreground underline decoration-brand-orange/60 underline-offset-4 transition-colors hover:decoration-brand-orange"
          >
            mapie lokalizacji
          </Link>
          . Zajrzyj tam co jakiś czas, bo regularnie dochodzą nowe gabinety i kliniki. Jeśli
          w Twojej okolicy nikogo jeszcze nie ma, napisz do nas i podpowiemy, gdzie
          najbliżej możesz spróbować.
        </>
      ),
    },
    {
      question: "Jak wygląda pojedyncza sesja i ile trwa?",
      answer:
        "Terapeuta ustawia urządzenie pod Twój wzrost i możliwości, aplikacja kalibruje zakres ruchu, a potem po prostu grasz. Zwykle zaczyna się od krótkich sesji, około 5 minut, i wydłuża je w miarę postępów. Po treningu w profilu zapisuje się czas, wynik i spalone kalorie, więc widać różnicę między kolejnymi wizytami.",
    },
    {
      question: "Czy muszę znać się na grach albo wirtualnej rzeczywistości?",
      answer:
        "Nie. Sterowanie odbywa się ruchem ciała, nie ma pada ani klawiatury. Terapeuta włącza ćwiczenie i tłumaczy zasady w kilka chwil. Gogli VR też nie trzeba zakładać, część treningów prowadzi się patrząc na ekran.",
    },
    {
      question: "Czy trening na ICAROS zastępuje klasyczną rehabilitację?",
      answer:
        "Nie zastępuje, tylko ją uzupełnia. Badania nad ICAROS opisują trening jako dodatek do standardowej terapii, który zwiększa motywację i pozwala ćwiczyć dłużej. O tym, jak połączyć go z resztą planu, decyduje Twój fizjoterapeuta lub lekarz.",
    },
  ],
};

/** Strefa biznes: technologia, wdrożenie i inwestycja. */
const technologyBusiness: Category = {
  label: "Technologia i terapia",
  items: [
    {
      question: "Czym dokładnie jest ICAROS i jak działa?",
      answer:
        "ICAROS to ekosystem certyfikowanych urządzeń treningowych, które łączą rehabilitację z grywalizacją i wirtualną rzeczywistością. Pacjent wykonuje precyzyjne ćwiczenia na sprzęcie, sterując środowiskiem VR ruchami ciała. System mierzy postępy, dostosowuje trudność i generuje raporty, wszystko w sposób angażujący i motywujący.",
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
    {
      question: "Czy ICAROS dostarcza gotowe plany treningów i sesji terapeutycznych?",
      answer:
        "W aplikacji ICAROS dostępnych jest kilka gotowych playlist. W wersji z goglami VR (ICAROS Health) program NEXT prowadzi pacjenta poziom po poziomie, podobnie jak program CORE, a tryb Evolve łączy oba i dodaje opcję własną (niestandardową). W urządzeniach ICAROS Guardian, Cloud i I.S.T. Board aplikacja mobilna ICAROS App zawiera zestaw treningów i gier, pozwala tworzyć własne playlisty ćwiczeń oraz korzystać z sugerowanych - można ją bezpłatnie przetestować (Google Play i App Store). Nie oferujemy obecnie rozbudowanych, gotowych planów sesji terapeutycznych. To personel medyczny ma najlepsze kwalifikacje, by opracować plan dopasowany do poziomu sprawności i ograniczeń konkretnego pacjenta - dlatego zachęcamy terapeutów do samodzielnego zapoznania się ze sprzętem i oprogramowaniem. Dobrą praktyką jest rozpoczynanie od krótkich, ok. 5-minutowych sesji i stopniowe wydłużanie ich w miarę postępów.",
    },
  ],
};

const deploymentBusiness: Category = {
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
        "Oczywiście. Oferujemy prezentacje online na żywo, a także możliwość umówienia wizyty demonstracyjnej. Część placówek z ICAROS znajdziesz też na naszej mapie lokalizacji. Skontaktuj się z nami, aby umówić termin prezentacji dopasowanej do potrzeb Twojej placówki.",
    },
    {
      question: "Jakie wsparcie otrzymuję po zakupie?",
      answer:
        "Zapewniamy pełne wsparcie posprzedażowe: szkolenie personelu, wsparcie techniczne, aktualizacje oprogramowania oraz dostęp do nowych exergames i materiałów szkoleniowych. Jako oficjalny dystrybutor w Polsce jesteśmy Twoim lokalnym partnerem na każdym etapie.",
    },
  ],
};

const investmentBusiness: Category = {
  label: "Inwestycja i finansowanie",
  items: [
    {
      question: "Ile kosztuje system ICAROS i czy to się opłaca?",
      answer:
        "ICAROS Circle (kompletny ekosystem czterech urządzeń: Health, I.S.T. Board, Guardian i Cloud) to inwestycja rzędu 49 900 € netto. Przy zaledwie 15 użytkownikach dziennie i stawce 25 € za sesję, system zwraca się w niecałe 5 miesięcy i generuje ponad 55 000 € zysku w pierwszym roku. Leasing szacunkowo od ok. 340 € do ok. 1 134 € netto miesięcznie (48 rat, 10% wpłaty wstępnej, 1% wykupu, kurs ok. 4,25 PLN/EUR). To wyłącznie orientacyjne wyliczenie; szczegóły policzysz w kalkulatorze ROI, a my chętnie przygotujemy kalkulację dopasowaną do Twojej placówki.",
    },
    {
      question: "Ile kosztują terapie wykorzystujące system ICAROS?",
      answer:
        "To zależy od lokalizacji i polityki cenowej placówki - ostateczną cenę dla pacjenta ustalasz samodzielnie. Sprawdzoną w praktyce regułą jest stawka około 1,50 € za minutę ćwiczeń na urządzeniu, czyli mniej więcej 20 € za 15-minutową sesję. W dużych miastach (np. w centrum Monachium) bywa to 4-5 € za minutę, a w mniejszych miejscowościach około 1 € za minutę. Dla polskich realiów stawka ok. 1,50 € za minutę jest rozsądna i odpowiada cenom stosowanym na całym świecie.",
    },
  ],
};

const categoriesByAudience: Record<Audience, Category[]> = {
  patient: [technologyPatient, practicePatient],
  business: [technologyBusiness, deploymentBusiness, investmentBusiness],
};

function FAQItem({
  question,
  answer,
  number,
  isOpen,
  onToggle,
  dark,
}: {
  question: string;
  answer: ReactNode;
  number: number;
  isOpen: boolean;
  onToggle: () => void;
  dark: boolean;
}) {
  return (
    <div className={`border-b last:border-b-0 ${dark ? "border-white/[0.07]" : "border-foreground/[0.06]"}`}>
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
          <span
            className={`text-[15px] font-medium leading-[1.5] transition-colors duration-500 ${
              dark ? "text-white group-hover:text-white/70" : "text-foreground group-hover:text-foreground/70"
            }`}
          >
            {question}
          </span>
        </div>
        <span className="mt-1 shrink-0">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              className={`h-4 w-4 ${dark ? "text-white/30" : "text-foreground/20"}`}
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
            <p className={`max-w-2xl pb-7 pl-[40px] text-[14px] leading-[1.8] ${dark ? "text-white/70" : "text-foreground/70"}`}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ({
  variant = "light",
  audience = "patient",
}: {
  variant?: "light" | "dark";
  audience?: Audience;
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const { ref, isVisible } = useScrollAnimation();
  const dark = variant === "dark";
  const categories = categoriesByAudience[audience];
  const flatKeys = categories.flatMap((cat, ci) => cat.items.map((_, ii) => `${ci}-${ii}`));

  return (
    <section
      id="faq"
      ref={ref}
      className={`relative overflow-hidden py-28 lg:py-40 ${dark ? "text-white" : "bg-surface"}`}
    >
      {dark && (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 58% 45% at 82% 6%, rgba(255,102,0,0.14), transparent 66%)" }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
              backgroundSize: "84px 84px",
            }}
          />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${dark ? "text-white/55" : "text-foreground/55"}`}>
            FAQ / Pytania
          </p>
          <h1 className={`mt-5 text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.03em] ${dark ? "text-white" : "text-foreground"}`}>
            Pytania i odpowiedzi
          </h1>
          <p className={`mt-5 text-[15px] leading-[1.8] ${dark ? "text-white/60" : "text-foreground/60"}`}>
            {audience === "business" ? (
              <>
                Najczęstsze pytania o&nbsp;technologię ICAROS, terapię, wdrożenie i&nbsp;koszty -
                zebrane w&nbsp;jednym miejscu. Nie znalazłeś odpowiedzi?{" "}
              </>
            ) : (
              <>
                Najczęstsze pytania o&nbsp;trening ICAROS: jak to działa, komu pomaga
                i&nbsp;gdzie możesz spróbować. Nie znalazłeś odpowiedzi?{" "}
              </>
            )}
            <a
              href={audience === "business" ? "#kontakt" : "/kontakt"}
              className={`font-semibold underline underline-offset-4 ${
                dark
                  ? "text-white decoration-white/30 hover:decoration-white"
                  : "text-foreground decoration-foreground/20 hover:decoration-foreground"
              }`}
            >
              Napisz do nas
            </a>
            .
          </p>
        </motion.div>

        <div className="mt-14 space-y-12">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 18 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + ci * 0.08 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-4">
                <h2 className={`text-[13px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-white/40" : "text-foreground/40"}`}>
                  {cat.label}
                </h2>
              </div>
              <div
                className={`px-6 lg:col-span-8 lg:px-9 ${
                  dark ? "border border-white/[0.08] bg-white/[0.02]" : "border border-foreground/[0.06] bg-white"
                }`}
              >
                {cat.items.map((qa, ii) => {
                  const key = `${ci}-${ii}`;
                  return (
                    <FAQItem
                      key={key}
                      dark={dark}
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
      </div>
    </section>
  );
}
