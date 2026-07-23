"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import LegalLinks from "@/components/LegalLinks";
import { DISCLAIMER_MEDICAL_DEVICES } from "@/lib/legal";
import { useSpamGuard } from "@/hooks/useSpamGuard";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VIDEO_ID = "XSf0H6LhRLo";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-[2px] w-7"
        style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }}
      />
      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
        {children}
      </span>
    </div>
  );
}

type Product = {
  name: string;
  category: string;
  description: string;
  application: string;
  target: string;
  award?: string;
  image: string;
  imageAlt: string;
};

const products: Product[] = [
  {
    name: "ICAROS Health",
    category: "Rehabilitacja · wyrób medyczny klasy I",
    description:
      "Urządzenie do rehabilitacji ortopedycznej i neurologicznej. Pacjent ćwiczy w pozycji leżącej, a konstrukcja wspiera i prowadzi ruch - dzięki temu z treningu mięśni głębokich (core) i równowagi mogą korzystać także osoby z ograniczeniami ruchowymi. Każdą sesję dobiera się indywidualnie, obsługa jest prosta. Sprzęt przeznaczony do pracy profesjonalnej - w terapii, fizjoterapii i terapii zajęciowej.",
    application: "Trening core · równowaga · koordynacja · terapia",
    target: "Ośrodki rehabilitacji neuro- i ortopedycznej, medical fitness, hotele medyczne",
    award: "Opisany w The Sunday Times",
    image: "/Icaros-24_0544.webp",
    imageAlt: "Terapeutka asystująca pacjentce podczas sesji na ICAROS Health z goglami VR",
  },
  {
    name: "ICAROS Guardian",
    category: "Trening stabilności i równowagi",
    description:
      "Stanowisko z poręczami i ekranem do treningu równowagi. Dla osób z ograniczeniami trening balansu bywa trudny i ryzykowny - Guardian daje maksymalne bezpieczeństwo (poręcze, niska bariera wejścia) i prostą, opartą na grze formę ćwiczeń. Postępy widać od razu na ekranie. Sprawdza się u seniorów, dzieci, sportowców i pacjentów w rehabilitacji; poprawia koordynację, równowagę i refleks.",
    application: "Trening stabilności i równowagi · koordynacja · terapia",
    target: "Rehabilitacja neuro- i ortopedyczna, domy seniora, medical fitness",
    award: "German Design Award 2024 · FIBO Award 2023",
    image: "/senior_2.webp",
    imageAlt: "Senior ćwiczący na ICAROS Guardian z interaktywną grą na ekranie",
  },
  {
    name: "ICAROS I.S.T. Board",
    category: "Aktywacja i mobilizacja kończyn dolnych",
    description:
      "Lekka platforma sterowana precyzyjnymi ruchami stóp i nóg. Pozwala trenować równowagę, reakcję, koordynację i mobilizację kończyn dolnych - również na siedząco, więc korzystają z niej także osoby, które nie mogą długo stać. Połączona z grami treningowymi w aplikacji ICAROS; gotowa do użycia od razu po podłączeniu.",
    application: "Stabilność i równowaga · koordynacja · balans na siedząco",
    target: "Fizjoterapia i terapia zajęciowa, osoby z ograniczoną zdolnością stania, seniorzy",
    image: "/icaros_ist_hero_1.webp",
    imageAlt: "ICAROS I.S.T. Board - trening stóp i nóg sterowany ruchem",
  },
  {
    name: "ICAROS Cloud",
    category: "Trening całego ciała",
    description:
      "Kompaktowa, lekka platforma na niestabilnym podłożu do treningu całego ciała - w domu, w studiu butikowym lub na zajęciach grupowych. Wzmacnia mięśnie core, nóg i górnej części ciała oraz poprawia koordynację i równowagę. Sterowana ze smartfona lub tabletu; rodzaj „mikro-siłowni”, którą łatwo przenieść i schować.",
    application: "Trening fitness · zajęcia grupowe · balans i stabilność",
    target: "Kluby fitness, dzieci i dorośli, sportowcy zawodowi",
    award: "German Design Award 2021 · UX Design Awards · Vogue",
    image: "/icaros_cloud_7.webp",
    imageAlt: "ICAROS Cloud - kompaktowe urządzenie do cyfrowego treningu całego ciała",
  },
];

const pillars = [
  {
    title: "Sprzęt treningowy",
    body: "Opatentowane, certyfikowane urządzenia - od wspomaganej terapii w pozycji leżącej po intensywny trening całego ciała. To one są fizyczną częścią systemu.",
  },
  {
    title: "Technologia cyfrowa",
    body: "Aplikacja, czujniki ruchu i gogle VR. Sterowanie odbywa się z tabletu lub smartfona, a postępy są mierzone na żywo i zapisywane.",
  },
  {
    title: "Gry treningowe (exergames)",
    body: "Autorskie oprogramowanie ICAROS na VR i urządzenia mobilne. Ćwiczenie zamienia się w grę - to ona prowadzi przez trening cardio, równowagi, koordynacji i funkcji poznawczych.",
  },
];

const awards = [
  { name: "German Design Award", detail: "2021 i 2024" },
  { name: "ISPO Award", detail: "Gold Winner 2018" },
  { name: "red dot award", detail: "Winner 2018" },
  { name: "FIBO Innovation & Trend Award", detail: "Winner 2023" },
  { name: "UX Design Awards", detail: "Product 2022" },
  { name: "Wyrób medyczny klasy I", detail: "ICAROS Health" },
  { name: "The Sunday Times", detail: "o systemie ICAROS" },
  { name: "Vogue", detail: "„Exercise of the Future”" },
];

const studyStats = [
  { value: "+25,8%", label: "Poprawa funkcji mięśniowych", sub: "ICAROS Health" },
  { value: "+30%", label: "Wyższe spalanie kalorii", sub: "vs. klasyczny klęk podparty" },
  { value: "×2", label: "Stymulacja mięśni", sub: "względem zwykłego planku" },
  { value: "+15,85%", label: "Wzrost siły core", sub: "ICAROS Cloud, po 5 tygodniach" },
];

const quotes = [
  {
    text: "Unikalny system, który aktywuje głębokie grupy mięśniowe oraz stymuluje i przyspiesza koordynację.",
    author: "Simone Girardi",
    role: "Specjalista nauk o ruchu i sporcie, terapia neuroortopedyczna",
  },
  {
    text: "Tę motywację przez zabawę w procesie terapii uważam za niezwykle wartościową i nastawioną na przyszłość.",
    author: "Univ. Prof. Dr. Peter A. Winkler",
    role: "Neurochirurg, prof. emeritus, badania nad neurorehabilitacją",
  },
  {
    text: "ICAROS to wysoce skuteczny sprzęt treningowy do poprawy stabilności, koordynacji i równowagi.",
    author: "Domenico Gurzi",
    role: "Kierownik Działu Biomechaniki, IBS Health",
  },
];

const references = [
  { name: "Palazzo Fiuggi", place: "Wellness Medical Retreat · Włochy" },
  { name: "Sonne Mellau", place: "Feel Good Hotel · Austria" },
  { name: "TUI Mein Schiff 1 & 2", place: "sea chefs Cruises Worldwide" },
  { name: "Sportresort Hohe Salve", place: "Hopfgarten · Austria" },
];

const DAYS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
const HOURS = [
  "7:00–9:00",
  "9:00–11:00",
  "11:00–13:00",
  "13:00–15:00",
  "15:00–17:00",
  "17:00–19:00",
  "19:00–21:00",
];

export default function PoznajSystem() {
  const searchParams = useSearchParams();

  const utm = useMemo(
    () => ({
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
    }),
    [searchParams]
  );

  const [email, setEmail] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [hours, setHours] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { spamFields, getSpamSignals } = useSpamGuard();

  function toggle(list: string[], value: string, setter: (next: string[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  async function handlePreferenceSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setErrorMessage("Podaj prawidłowy adres e-mail.");
      return;
    }
    if (days.length === 0 && hours.length === 0 && !note.trim()) {
      setErrorMessage("Zaznacz preferowane dni lub godziny - albo opisz je w polu poniżej.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...getSpamSignals(), email: cleanEmail, days, hours, note: note.trim(), utm }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Nie udało się wysłać preferencji.");
      }
      setSuccessMessage("Dziękujemy - zanotowaliśmy preferowany termin. Sebastian odezwie się w dogodnym dla Ciebie czasie.");
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Wystąpił błąd podczas wysyłki.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative overflow-x-hidden bg-foreground text-white">
      {/* Tło: poświaty + siatka */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 60% 45% at 78% 8%, rgba(255,102,0,0.18), transparent 66%)" }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 pt-5 sm:px-10 sm:pt-8 lg:px-16">
          <Image
            src="/icaros-logo.webp"
            alt="ICAROS Polska"
            width={1000}
            height={135}
            priority
            className="h-[19px] w-auto sm:h-[21px]"
          />
        </header>

        {/* HERO */}
        <section className="px-6 pb-10 pt-10 sm:px-10 sm:pb-16 sm:pt-16 lg:px-16 lg:pt-20">
          <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[55fr_45fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <Eyebrow>Dziękujemy za zgłoszenie</Eyebrow>
              <h1 className="mt-5 text-[clamp(2rem,5.6vw,4rem)] font-bold leading-[1.02] tracking-[-0.04em]">
                Zanim zadzwonimy -
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(120deg,#ffffff 30%,#ff7b1f 100%)" }}
                >
                  poznaj system ICAROS
                </span>
              </h1>
              <p className="mt-6 max-w-[520px] text-[15px] leading-[1.75] text-white/65 sm:text-[17px]">
                ICAROS to producent innowacyjnych rozwiązań, które zyskują uznanie
                w Polsce w branży rehabilitacji, fizjoterapii i ochrony zdrowia.
                Poniżej znajdziesz krótki przegląd - żeby rozmowa z naszym dyrektorem
                krajowym była od razu konkretna.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#film"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-[14.5px] font-bold text-white shadow-[0_14px_30px_-12px_rgba(255,102,0,0.55)] transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                >
                  Zobacz 90-sekundowy film
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>
                <a
                  href="#katalog"
                  className="inline-flex items-center gap-2 border border-white/15 px-6 py-3.5 text-[14.5px] font-semibold text-white/85 transition-colors hover:border-white/40 hover:text-white"
                >
                  Pobierz katalog
                </a>
              </div>

              <p className="mt-7 text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                Made in Germany · od 2015 · Monachium
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT }}
              className="relative"
            >
              <div
                className="pointer-events-none absolute -inset-10 -z-10 blur-3xl"
                style={{ background: "radial-gradient(ellipse 60% 60% at 50% 45%, rgba(255,102,0,0.35), transparent 75%)" }}
              />
              <div className="relative overflow-hidden border border-white/10 shadow-[0_44px_90px_-30px_rgba(0,0,0,0.85)]">
                <Image
                  src="/hero-icaros.webp"
                  alt="System ICAROS w użyciu"
                  width={1200}
                  height={1400}
                  priority
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="border-y border-white/[0.06] px-6 py-8 sm:px-10 lg:px-16">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center sm:justify-between">
            {[
              { k: "100+", v: "klinik w Europie" },
              { k: "9", v: "badań klinicznych" },
              { k: "red dot · ISPO", v: "German Design Award" },
              { k: "Sunday Times · Vogue", v: "o ICAROS w mediach" },
            ].map((item) => (
              <div key={item.k} className="flex flex-col">
                <span className="text-[18px] font-bold tracking-tight text-white sm:text-[20px]">
                  {item.k}
                </span>
                <span className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/45">
                  {item.v}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* INTRO / CO TO JEST */}
        <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1180px]">
            <Reveal className="max-w-3xl">
              <Eyebrow>Czym jest ICAROS</Eyebrow>
              <h2 className="mt-5 text-[clamp(1.7rem,4vw,2.7rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                System złożony z trzech elementów
              </h2>
              <p className="mt-5 text-[16px] leading-[1.85] text-white/70">
                ICAROS to niemiecki producent z Monachium, działający od 2015 roku;
                ICAROS Polska jest jego oficjalnym dystrybutorem w kraju. Urządzenia
                ICAROS pracują w ośrodkach terapeutycznych, klinikach rehabilitacji
                oraz obiektach wellness w całej Europie. Sam system zawsze tworzą trzy
                współpracujące ze sobą elementy:
              </p>
            </Reveal>

            <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-3">
              {pillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 0.08} className="bg-foreground p-7 lg:p-9">
                  <span
                    className="text-[13px] font-bold tracking-tight"
                    style={{ color: "#ff7b1f" }}
                  >
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-[18px] font-bold tracking-[-0.01em]">{pillar.title}</h3>
                  <p className="mt-2.5 text-[14px] leading-[1.75] text-white/65">{pillar.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1} className="mt-8 max-w-3xl">
              <p className="text-[15px] leading-[1.85] text-white/70">
                W praktyce wygląda to tak: pacjent lub klient ćwiczy na jednym z
                urządzeń, a aplikacja ICAROS prowadzi go przez gry treningowe i mierzy
                postępy. Terapeuta lub trener może układać indywidualne plany i
                sprawdzać wyniki testów koordynacji, równowagi i stabilności. Część
                ćwiczeń odbywa się w goglach VR - z realnymi panoramami gór (Engadyna,
                Berchtesgaden, Dolomity) odwzorowanymi we współpracy z 3D Reality Maps.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-8">
              <p className="text-[13px] leading-[1.8] text-white/45">
                Urządzenia ICAROS są badane we współpracy z uczelniami: Niemiecki
                Uniwersytet Sportowy w Kolonii · Politechnika Monachijska · Szpital
                Uniwersytecki w Heidelbergu.
              </p>
            </Reveal>
          </div>
        </section>

        {/* FILM */}
        <section id="film" className="scroll-mt-10 px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
          <div className="mx-auto max-w-[1080px]">
            <Reveal className="mb-10 text-center">
              <Eyebrow>Krótki film</Eyebrow>
              <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold leading-[1.12] tracking-[-0.03em]">
                Jak trening ICAROS wygląda w praktyce
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.8] text-white/60">
                Przygotowaliśmy krótki film, który pokazuje, jak w praktyce wygląda
                ćwiczenie na urządzeniach ICAROS - zanim zobaczysz sprzęt na żywo.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="border border-white/10 bg-black/40 p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] sm:p-3">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&color=white`}
                    title="ICAROS - innowacyjna rehabilitacja i trening VR"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PRODUKTY */}
        <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1180px]">
            <Reveal className="max-w-3xl">
              <Eyebrow>Urządzenia ICAROS</Eyebrow>
              <h2 className="mt-5 text-[clamp(1.7rem,4vw,2.7rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                Pięć urządzeń - każde do innego celu
              </h2>
              <p className="mt-5 text-[16px] leading-[1.85] text-white/70">
                Urządzenia różnią się przeznaczeniem i poziomem zaawansowania - od
                wspomaganego treningu w pozycji leżącej dla osób z dużymi
                ograniczeniami, po intensywny trening całego ciała i fitness w VR. Trzy
                z nich (Health, Guardian i Cloud) można połączyć w tzw. ICAROS Circle -
                komplet pokrywający całą ścieżkę: od pierwszej aktywacji, przez trening
                równowagi na stojąco, aż po pełny trening po rehabilitacji. Poniżej
                opisujemy każde z osobna.
              </p>
            </Reveal>

            <div className="mt-14 space-y-0">
              {products.map((product, i) => (
                <Reveal key={product.name} delay={0.05}>
                  <div className="group grid grid-cols-1 border-t border-white/[0.07] lg:grid-cols-2 [&:last-child]:border-b">
                    <div
                      className={`relative aspect-[16/11] overflow-hidden lg:aspect-auto lg:min-h-[420px] ${
                        i % 2 === 1 ? "lg:order-2" : ""
                      }`}
                    >
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    </div>

                    <div
                      className={`flex flex-col justify-center p-8 lg:p-14 ${
                        i % 2 === 1 ? "lg:order-1" : ""
                      }`}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                        {product.category}
                      </span>
                      <h3 className="mt-3 text-[clamp(1.4rem,3vw,2rem)] font-bold tracking-[-0.02em]">
                        {product.name}
                      </h3>
                      <p className="mt-5 text-[14.5px] leading-[1.8] text-white/75">
                        {product.description}
                      </p>
                      <div className="mt-6 grid gap-5 border-t border-white/[0.07] pt-5 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                            Zastosowanie
                          </p>
                          <p className="mt-1.5 text-[13.5px] leading-[1.7] text-white/70">
                            {product.application}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                            Dla kogo
                          </p>
                          <p className="mt-1.5 text-[13.5px] leading-[1.7] text-white/70">
                            {product.target}
                          </p>
                        </div>
                      </div>
                      {product.award ? (
                        <p className="mt-5 flex items-center gap-2 text-[12px] text-white/45">
                          <svg className="h-3.5 w-3.5 shrink-0 text-brand-orange" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z" />
                          </svg>
                          {product.award}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* BADANIA / DOWODY */}
        <section className="border-t border-white/[0.06] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1180px]">
            <Reveal className="max-w-3xl">
              <Eyebrow>Potwierdzone badaniami</Eyebrow>
              <h2 className="mt-5 text-[clamp(1.7rem,4vw,2.7rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                Skuteczność zweryfikowana naukowo
              </h2>
              <p className="mt-5 text-[16px] leading-[1.85] text-white/70">
                Urządzenia ICAROS zostały przebadane we współpracy z czołowymi
                uczelniami sportowymi i medycznymi. Oto wybrane wyniki.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
              {studyStats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.06} className="bg-foreground p-6 lg:p-8">
                  <div
                    className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold leading-none tracking-[-0.03em]"
                    style={{ color: "#ff7b1f" }}
                  >
                    {stat.value}
                  </div>
                  <p className="mt-3 text-[13.5px] font-semibold leading-[1.4] text-white">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-[12px] text-white/45">{stat.sub}</p>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {quotes.map((quote, i) => (
                <Reveal key={quote.author} delay={i * 0.08}>
                  <figure className="flex h-full flex-col border border-white/[0.08] bg-white/[0.02] p-7">
                    <span className="text-[34px] leading-none text-brand-orange/70">&ldquo;</span>
                    <blockquote className="mt-2 flex-1 text-[14.5px] leading-[1.7] text-white/80">
                      {quote.text}
                    </blockquote>
                    <figcaption className="mt-5 border-t border-white/[0.07] pt-4">
                      <p className="text-[13px] font-semibold text-white">{quote.author}</p>
                      <p className="mt-0.5 text-[12px] leading-[1.5] text-white/45">{quote.role}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* NAGRODY / CERTYFIKATY / MEDIA */}
        <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1180px]">
            <Reveal className="max-w-3xl">
              <Eyebrow>Nagrody, certyfikaty i media</Eyebrow>
              <h2 className="mt-5 text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold leading-[1.12] tracking-[-0.03em]">
                Wyróżnienia, na które warto zwrócić uwagę
              </h2>
              <p className="mt-5 text-[16px] leading-[1.85] text-white/70">
                Urządzenia ICAROS są certyfikowane (ICAROS Health to wyrób medyczny
                klasy I) i wielokrotnie nagradzane za projekt oraz innowacyjność. O
                systemie pisały też media branżowe i lifestyle’owe.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-4">
              {awards.map((award, i) => (
                <Reveal key={award.name} delay={i * 0.05} className="bg-foreground p-6">
                  <p className="text-[14.5px] font-bold leading-[1.3] tracking-tight text-white">
                    {award.name}
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-[1.5] text-white/45">{award.detail}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* REFERENCJE */}
        <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1180px]">
            <Reveal>
              <Eyebrow>Zaufali nam</Eyebrow>
              <h2 className="mt-5 max-w-2xl text-[clamp(1.5rem,3.4vw,2.2rem)] font-bold leading-[1.12] tracking-[-0.03em]">
                Kliniki, hotele medyczne i obiekty premium w całej Europie
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {references.map((ref, i) => (
                <Reveal key={ref.name} delay={i * 0.06} className="bg-foreground p-6">
                  <p className="text-[15px] font-bold tracking-tight text-white">{ref.name}</p>
                  <p className="mt-1 text-[12.5px] leading-[1.5] text-white/45">{ref.place}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PROGRAM TESTÓW 14 DNI */}
        <section className="px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
          <div className="mx-auto max-w-[1180px]">
            <Reveal>
              <div className="relative overflow-hidden border border-brand-orange/25 p-8 sm:p-12 lg:p-16">
                <div
                  className="pointer-events-none absolute inset-0 -z-10"
                  style={{ background: "radial-gradient(ellipse 50% 80% at 85% 50%, rgba(255,102,0,0.16), transparent 70%)" }}
                />
                <Eyebrow>Program testów</Eyebrow>
                <h2 className="mt-5 max-w-3xl text-[clamp(1.7rem,4vw,2.8rem)] font-bold leading-[1.08] tracking-[-0.03em]">
                  14 dni testów ICAROS w Twoim gabinecie
                </h2>
                <p className="mt-5 max-w-2xl text-[16px] leading-[1.85] text-white/75">
                  Udostępniamy zestaw na 14-dniowe testy bezpośrednio w placówce.
                  Jedynym kosztem jest logistyka - a przy ewentualnej decyzji
                  zakupowej odliczamy ten koszt od kwoty transakcji.
                </p>
                <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                  {[
                    { k: "14 dni", v: "testów w gabinecie" },
                    { k: "Tylko logistyka", v: "żadnych opłat za sprzęt" },
                    { k: "Zwrot kosztu", v: "przy decyzji zakupowej" },
                  ].map((item) => (
                    <div key={item.k}>
                      <p className="text-[18px] font-bold tracking-tight text-white">{item.k}</p>
                      <p className="mt-0.5 text-[12px] uppercase tracking-[0.12em] text-white/45">
                        {item.v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* KONFIGURACJE / SEBASTIAN (bez ceny) */}
        <section className="border-t border-white/[0.06] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Reveal>
              <Eyebrow>Konfiguracja i wycena</Eyebrow>
              <h2 className="mt-5 text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold leading-[1.12] tracking-[-0.03em]">
                Każda placówka jest inna - dlatego konfiguracji jest wiele
              </h2>
              <p className="mt-5 text-[16px] leading-[1.85] text-white/70">
                System można złożyć na wiele sposobów - od pojedynczego urządzenia po
                pełny ICAROS Circle. Wspólnie dobierzemy konfigurację odpowiadającą
                Twoim potrzebom i specyfice pracy. Szczegóły oraz indywidualną wycenę
                przekaże <span className="text-white">Sebastian - dyrektor krajowy ICAROS Polska</span>,
                podczas rozmowy.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="border border-white/[0.08] bg-white/[0.02] p-7 lg:p-9">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center text-[20px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                  >
                    SW
                  </div>
                  <div>
                    <p className="text-[16px] font-bold tracking-tight text-white">Sebastian Wilk</p>
                    <p className="text-[12.5px] text-white/50">Dyrektor krajowy ICAROS Polska</p>
                  </div>
                </div>
                <p className="mt-6 text-[14.5px] leading-[1.8] text-white/70">
                  Sebastian zadzwoni, odpowie na pytania i bez zobowiązań pomoże ocenić,
                  jak ICAROS sprawdziłby się akurat u Ciebie - łącznie z doborem
                  konfiguracji i programem testów.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* KATALOG */}
        <section id="katalog" className="scroll-mt-10 px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
          <div className="mx-auto max-w-[1180px]">
            <Reveal>
              <div className="grid items-center gap-8 border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-12">
                <div>
                  <Eyebrow>Katalog produktowy 2026</Eyebrow>
                  <h2 className="mt-5 text-[clamp(1.5rem,3.4vw,2.2rem)] font-bold leading-[1.12] tracking-[-0.03em]">
                    Pełny katalog ICAROS do pobrania
                  </h2>
                  <p className="mt-4 max-w-xl text-[15px] leading-[1.8] text-white/65">
                    Wszystkie urządzenia, dane techniczne i zastosowania w jednym
                    dokumencie PDF. Polska wersja katalogu jest w przygotowaniu -
                    na razie udostępniamy wersję angielską.
                  </p>
                </div>
                <a
                  href="/ICAROS-katalog-produktowy-2026.pdf"
                  download
                  className="inline-flex shrink-0 items-center justify-center gap-2.5 px-8 py-4 text-[15px] font-bold text-white shadow-[0_14px_30px_-12px_rgba(255,102,0,0.55)] transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13m0 0l-4-4m4 4l4-4M5 21h14" />
                  </svg>
                  Pobierz katalog (PDF)
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* MINI-FORMULARZ: PREFEROWANY KONTAKT */}
        <section className="px-6 pb-24 sm:px-10 lg:px-16 lg:pb-32">
          <div className="mx-auto max-w-[760px]">
            <Reveal>
              <div className="border border-white/[0.08] bg-white/[0.03] p-7 sm:p-10">
                <Eyebrow>Kiedy się kontaktować</Eyebrow>
                <h2 className="mt-5 text-[clamp(1.5rem,3.4vw,2.1rem)] font-bold leading-[1.12] tracking-[-0.03em]">
                  Wskaż dogodny termin rozmowy
                </h2>
                <p className="mt-4 text-[14.5px] leading-[1.8] text-white/65">
                  Jeśli nie podałeś nam jeszcze dni ani godzin, w których najlepiej
                  zadzwonić - zaznacz je tutaj. Dopiszemy je do Twojego zgłoszenia.
                </p>

                {successMessage ? (
                  <div className="mt-8 flex items-start gap-3 border border-brand-orange/25 bg-brand-orange/[0.06] p-5">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <p className="text-[14.5px] leading-[1.7] text-white/85">{successMessage}</p>
                  </div>
                ) : (
                  <form onSubmit={handlePreferenceSubmit} noValidate className="mt-8 space-y-6">
                    {spamFields}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                        Twój adres e-mail
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="np. gabinet@twojaplacowka.pl"
                        autoComplete="email"
                        className="mt-2.5 w-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-orange"
                        required
                      />
                      <p className="mt-1.5 text-[12px] text-white/35">
                        Podaj ten sam adres, który wpisałeś w formularzu.
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                        Preferowane dni
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {DAYS.map((day) => {
                          const active = days.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggle(days, day, setDays)}
                              aria-pressed={active}
                              className={`border px-4 py-2.5 text-[13.5px] transition-all ${
                                active
                                  ? "border-brand-orange bg-brand-orange/[0.1] text-white"
                                  : "border-white/12 text-white/65 hover:border-white/35"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                        Preferowane godziny
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {HOURS.map((hour) => {
                          const active = hours.includes(hour);
                          return (
                            <button
                              key={hour}
                              type="button"
                              onClick={() => toggle(hours, hour, setHours)}
                              aria-pressed={active}
                              className={`border px-4 py-2.5 text-[13.5px] transition-all ${
                                active
                                  ? "border-brand-orange bg-brand-orange/[0.1] text-white"
                                  : "border-white/12 text-white/65 hover:border-white/35"
                              }`}
                            >
                              {hour}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                        Nic z powyższych albo coś innego? (opcjonalnie)
                      </p>
                      <textarea
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        rows={3}
                        placeholder="Jeśli żaden z terminów nie pasuje, opisz tutaj, kiedy najlepiej się odezwać - np. które dni i godziny w tygodniu są dla Ciebie dogodne."
                        className="mt-3 w-full resize-none border border-white/12 bg-white/[0.02] px-4 py-3 text-[14px] leading-[1.7] text-white placeholder:text-white/35 transition-colors focus:border-brand-orange focus:outline-none"
                      />
                    </div>

                    {errorMessage ? (
                      <p className="text-[13px] text-red-400">{errorMessage}</p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_30px_-12px_rgba(255,102,0,0.55)] transition-opacity hover:opacity-90 disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                    >
                      {isSubmitting ? "Wysyłanie..." : "Zapisz preferowany termin →"}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/[0.06] px-6 py-8 sm:px-10 lg:px-16">
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
      </div>
    </main>
  );
}
