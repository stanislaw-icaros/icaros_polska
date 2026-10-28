"use client";

/**
 * Rdzeń landingu /health: jedna wartość "horyzont" (0 = sala, 1 = lot) steruje
 * całą stroną. Napędza ją scroll, a od sekcji "Weź ster" także palec albo mysz.
 *
 * Jak to liczymy: po stronie rozsiane są znaczniki <Znacznik wartosc={...} />.
 * W pętli rAF szukamy dwóch znaczników, między którymi jest środek ekranu,
 * i interpolujemy. Dzięki temu wartości nie zależą od wysokości sekcji.
 *
 * Tło jest jedno dla całej strony: dwie klatki z filmu ICAROS PROMO, które
 * przenikają się przy przesuwaniu suwaka, a na nich film przewijany klatka po
 * klatce. Film jest dodatkiem: gdy się nie wczyta, zostają klatki i strona
 * wygląda tak samo, tylko bez ruchu pośredniego.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

type KontekstScena = {
  horyzont: MotionValue<number>;
  /** Czy widok ustawił przycisk (wtedy scroll go chwilowo nie nadpisuje). */
  recznie: boolean;
  ustawRecznie: (wartosc: boolean) => void;
};

const Scena = createContext<KontekstScena | null>(null);

export function useScena() {
  const kontekst = useContext(Scena);
  if (!kontekst) throw new Error("useScena poza <ScenaProvider>");
  return kontekst;
}

/** Znacznik wartości horyzontu w miejscu, w którym stoi w drzewie. */
export function Znacznik({ wartosc }: { wartosc: number }) {
  return <div aria-hidden data-horyzont={wartosc} className="h-0 w-0" />;
}

/** Czy jesteśmy na wąskim ekranie. Osobna para funkcji, bo useSyncExternalStore
 *  wymaga stabilnych referencji. */
const ZAPYTANIE = "(max-width: 860px)";
const czyMalyEkran = () => window.matchMedia(ZAPYTANIE).matches;
function sluchajSzerokosci(odswiez: () => void) {
  const lista = window.matchMedia(ZAPYTANIE);
  lista.addEventListener("change", odswiez);
  return () => lista.removeEventListener("change", odswiez);
}

function wygladz(t: number) {
  // Łagodne wejście i wyjście, żeby przejścia między sekcjami nie szarpały.
  return t * t * (3 - 2 * t);
}

/**
 * Wygaszenie krawędzi marginesu w kadrze mobilnym.
 *
 * Kadr na telefon ma wpieczony margines w kolorze tła u góry i u dołu: dzięki
 * niemu `object-cover` pokazuje więcej sceny, zamiast przycinać ją do wąskiego
 * paska. Margines zajmuje zawsze 16,5 procent wysokości ekranu, bo przy każdej
 * proporcji telefonu to wysokość decyduje o skali. Styk marginesu ze zdjęciem
 * widać jednak jako kreskę, więc przykrywamy go miękkim przejściem.
 */
const WYGASZENIE_KADRU =
  "linear-gradient(to bottom, #07070a 0%, #07070a 17%, rgba(7,7,10,0) 31%, rgba(7,7,10,0) 69%, #07070a 83%, #07070a 100%)"; // taste-skill-ignore: wygaszenie styku kadru, nie wypełnienie

export function ScenaProvider({ children }: { children: ReactNode }) {
  const horyzont = useMotionValue(0);
  const [recznie, ustawRecznieStan] = useState(false);
  const recznieRef = useRef(false);
  const scrollPrzyChwycie = useRef(0);

  // Zapamiętujemy, gdzie strona stała przy kliknięciu: po przewinięciu kawałka
  // sterowanie wraca do scrolla.
  const ustawRecznie = useCallback((wartosc: boolean) => {
    if (wartosc) scrollPrzyChwycie.current = window.scrollY;
    recznieRef.current = wartosc;
    ustawRecznieStan(wartosc);
  }, []);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const gotowyRef = useRef(false);
  const mniejRuchu = useReducedMotion();


  const gotowe = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    gotowyRef.current = true;
    // Safari na iOS nie pozwala przewijać filmu, który nigdy nie ruszył.
    void video
      .play()
      .then(() => video.pause())
      .catch(() => {
        /* zostają klatki pod spodem */
      });
  }, []);

  useEffect(() => {
    const odpal = () => gotowe();
    const opcje = { once: true, passive: true } as const;
    window.addEventListener("pointerdown", odpal, opcje);
    window.addEventListener("touchstart", odpal, opcje);
    return () => {
      window.removeEventListener("pointerdown", odpal);
      window.removeEventListener("touchstart", odpal);
    };
  }, [gotowe]);

  // Jedna pętla na całą stronę: cel ze scrolla, dojście do celu, przewinięcie filmu.
  useEffect(() => {
    let klatka = 0;
    let zywy = true;
    let znaczniki: HTMLElement[] = [];
    let doPrzeliczenia = true;

    const odswiez = () => {
      doPrzeliczenia = true;
    };

    const celZeScrolla = () => {
      if (doPrzeliczenia) {
        znaczniki = Array.from(
          document.querySelectorAll<HTMLElement>("[data-horyzont]")
        );
        doPrzeliczenia = false;
      }
      if (znaczniki.length === 0) return 0;

      const ognisko = window.scrollY + window.innerHeight / 2;
      const punkty = znaczniki.map((element) => {
        const prostokat = element.getBoundingClientRect();
        return {
          y: prostokat.top + window.scrollY,
          v: Number(element.dataset.horyzont ?? 0),
        };
      });

      if (ognisko <= punkty[0].y) return punkty[0].v;
      for (let i = 0; i < punkty.length - 1; i += 1) {
        const a = punkty[i];
        const b = punkty[i + 1];
        if (ognisko >= a.y && ognisko <= b.y) {
          const rozpietosc = b.y - a.y;
          const t = rozpietosc <= 0 ? 1 : (ognisko - a.y) / rozpietosc;
          return a.v + (b.v - a.v) * wygladz(t);
        }
      }
      return punkty[punkty.length - 1].v;
    };

    const krok = () => {
      if (!zywy) return;

      // Przycisk ustawia widok, ale pierwsze przewinięcie odbiera sterowanie.
      // Wcześniej scena trzymała wybór przez całą sekcję i przez dwa ekrany
      // scrollowania nic się nie działo, co wyglądało na zacięcie.
      if (recznieRef.current) {
        if (Math.abs(window.scrollY - scrollPrzyChwycie.current) > 60) {
          ustawRecznie(false);
        }
      }

      if (!recznieRef.current) {
        const cel = celZeScrolla();
        const teraz = horyzont.get();
        const roznica = cel - teraz;
        if (Math.abs(roznica) < 0.002) {
          if (teraz !== cel) horyzont.set(cel);
        } else {
          horyzont.set(teraz + roznica * 0.18);
        }
      }

      const video = videoRef.current;
      if (video && video.readyState >= 2 && video.duration > 0) {
        if (!gotowyRef.current) gotowe();
        // Strefa martwa i margines od końca pliku. Bez nich każdy drobny ruch
        // myszą przy dole strony wywoływał kolejne przewinięcia, a przewijanie
        // na samą ostatnią klatkę potrafi mignąć czernią.
        const koniec = Math.max(0, video.duration - 0.08);
        const cel = Math.min(koniec, horyzont.get() * video.duration);
        if (Math.abs(video.currentTime - cel) > 0.045) {
          video.currentTime = cel;
        }
      }

      klatka = requestAnimationFrame(krok);
    };

    klatka = requestAnimationFrame(krok);
    window.addEventListener("resize", odswiez);
    const obserwator = new MutationObserver(odswiez);
    obserwator.observe(document.body, { childList: true, subtree: true });

    return () => {
      zywy = false;
      cancelAnimationFrame(klatka);
      window.removeEventListener("resize", odswiez);
      obserwator.disconnect();
    };
  }, [gotowe, horyzont, ustawRecznie]);

  // Ciemne tło dokumentu na czas tej strony: inaczej przy odbiciu scrolla
  // i przed pierwszym malowaniem spod spodu wychodzi biel z globals.css.
  useEffect(() => {
    const korzen = document.documentElement;
    const cialo = document.body;
    const poprzednieKorzen = korzen.style.backgroundColor;
    const poprzednieCialo = cialo.style.backgroundColor;
    // Tło musi usiąść na <html>, a <body> trzeba przy tym zdjąć. Tło <body>
    // maluje się jako zwykłe tło elementu, czyli NAD warstwami o ujemnym
    // z-index, i zasłoniłoby całą scenę.
    const poprzedniSchemat = korzen.style.colorScheme;
    korzen.style.backgroundColor = "#07070a";
    cialo.style.backgroundColor = "transparent";
    // Bez tego paski przewijania i kontrolki systemowe zostają jasne.
    korzen.style.colorScheme = "dark";
    return () => {
      korzen.style.backgroundColor = poprzednieKorzen;
      cialo.style.backgroundColor = poprzednieCialo;
      korzen.style.colorScheme = poprzedniSchemat;
    };
  }, []);

  // Którą wersję pliku podać, liczymy przy renderze. Na serwerze nie ma żadnej:
  // film dochodzi dopiero po stronie przeglądarki, a pod spodem i tak leżą klatki.
  const malyEkran = useSyncExternalStore(sluchajSzerokosci, czyMalyEkran, () => false);
  const zrodlo = mniejRuchu
    ? null
    : malyEkran
      ? "/health/horyzont-m.mp4"
      : "/health/horyzont.mp4";

  return (
    <Scena.Provider value={{ horyzont, recznie, ustawRecznie }}>
      <Tlo
        videoRef={videoRef}
        zrodlo={zrodlo}
        gotowe={gotowe}
        horyzont={horyzont}
        malyEkran={malyEkran}
      />
      {children}
    </Scena.Provider>
  );
}

/** Tło całej strony: klatka „sala", klatka „lot" i film między nimi. */
function Tlo({
  videoRef,
  zrodlo,
  gotowe,
  horyzont,
  malyEkran,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  zrodlo: string | null;
  gotowe: () => void;
  horyzont: MotionValue<number>;
  malyEkran: boolean;
}) {
  const [filmWidoczny, ustawFilmWidoczny] = useState(false);
  const przyrostek = malyEkran ? "-m" : "";
  // Przejście skupione w środku zakresu: po bokach widać czysto salę albo lot.
  const przenikanie = useTransform(horyzont, [0, 0.34, 0.72, 1], [0, 0, 1, 1]);
  // Odpalenie filmu (próba play/pause) kontra pokazanie go: to dwie różne rzeczy.
  const przewinal = () => ustawFilmWidoczny(true);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-h-void" aria-hidden>
      {/* Klatki rozpięte na cały ekran. Zostają, gdy film się nie wczyta. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/health/poster-sala${przyrostek}.webp)` }}
      />
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/health/poster-lot${przyrostek}.webp)`,
          opacity: przenikanie,
        }}
      />

      {zrodlo ? (
        <video
          ref={videoRef}
          src={zrodlo}
          poster={`/health/poster-sala${przyrostek}.webp`}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onLoadedData={gotowe}
          onCanPlay={gotowe}
          onSeeked={przewinal}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: filmWidoczny ? 1 : 0 }}
        />
      ) : null}

      {/* Styk wpieczonego marginesu ze zdjęciem. Tylko telefon: na większych
          ekranach kadr jest poziomy i marginesu nie ma. */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{ backgroundImage: WYGASZENIE_KADRU }}
      />

      {/* Ziarno: płaska czerń pasuje się na realnych ekranach. */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Lekki welon na całości, żeby biały sprzęt nie wypalał. Gęstość pod
          tekstem dokłada każda sekcja u siebie. */}
      <div className="absolute inset-0 bg-h-void/25" />
    </div>
  );
}

