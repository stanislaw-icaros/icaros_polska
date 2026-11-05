"use client";

/**
 * Budowa urządzenia, sterowana scrollem.
 *
 * Sekcja jest wyższa od ekranu i przyklejona, więc przewijanie nie przesuwa
 * treści, tylko prowadzi kamerę. Każde ujęcie pokazuje inny element i tylko ten
 * element jest oświetlony: reszta kadru gaśnie, a od opisu biegnie do niego
 * cienka linia zakończona obrączką. Przy następnym elemencie poprzedni wraca
 * do cienia.
 *
 * Kadr ma tę samą proporcję co zdjęcia, dlatego współrzędne ogniska z
 * `tresc.ts` trafiają dokładnie tam, gdzie leży opisywana część.
 *
 * Przy ograniczonym ruchu zostaje pierwszy kadr z jego podświetleniem i zwykła
 * lista opisów: treść jest ta sama, znika tylko jazda kamery.
 */

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Akapit, Naglowek, STYK_DOL, STYK_GORA, Wejscie } from "./czesci";
import { Znacznik } from "./Scena";
import { budowa } from "@/lib/health/tresc";

/** Proporcja wygenerowanych ujęć. Kadr trzyma ją co do piksela. */
const KADR = { w: 1800, h: 1005 };

/** Przyciemnienie pod kolumną tekstu, żeby opis dało się czytać na zdjęciu. */
const PRZYCIEMNIENIE_POD_TEKSTEM =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(7,7,10,0.94)_0%,rgba(7,7,10,0.55)_38%,transparent_64%)]"; // taste-skill-ignore: scrim nad zdjęciem

const OSTATNI = budowa.length - 1;

/** Środek, w którym dane ujęcie jest w pełni widoczne. */
const srodek = (indeks: number) => indeks / OSTATNI;

export default function Budowa() {
  const sekcjaRef = useRef<HTMLElement | null>(null);
  const mniejRuchu = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sekcjaRef,
    offset: ["start start", "end end"],
  });
  // Dwie sprężyny, bo dwie rzeczy mają inne tempo. Miękka prowadzi kamerę,
  // twarda decyduje o tym, które ujęcie jest na wierzchu, więc kadr pasuje
  // do miejsca na stronie praktycznie bez zwłoki.
  //
  // Obie muszą być sprężynami: surowa wartość z useScroll podpięta wprost pod
  // krycie przewracała framer-motion przy montowaniu sekcji
  // („Offsets must be monotonically non-decreasing").
  const postep = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const ostry = useSpring(scrollYProgress, {
    stiffness: 900,
    damping: 60,
    mass: 0.2,
  });

  // Kamera: najpierw najazd, potem lekkie cofnięcie. Stąd wrażenie jazdy.
  const skala = useTransform(postep, [0, 0.55, 1], [1.01, 1.08, 1.03]);

  return (
    <section ref={sekcjaRef} id="budowa" className="relative z-10 h-[300svh] bg-[#0b0c11]">
      <Znacznik wartosc={0.12} />

      <div className="sticky top-0 h-svh overflow-hidden">
        <div aria-hidden className={STYK_GORA} />
        <div aria-hidden className={STYK_DOL} />

        {/* Kadr. Ta sama proporcja co zdjęcia, więc ognisko trafia w element. */}
        <div className="absolute inset-x-0 top-0 bottom-[36%] flex items-end justify-center px-4 lg:inset-0 lg:items-center lg:justify-end lg:pl-[30vw] lg:pr-32">
          <motion.div
            className="relative isolate max-h-full w-full bg-[#0b0c11]"
            style={{
              aspectRatio: `${KADR.w} / ${KADR.h}`,
              ...(mniejRuchu ? {} : { scale: skala }),
            }}
          >
            {budowa.map((ujecie, indeks) => (
              <Ujecie
                key={ujecie.obraz}
                ujecie={ujecie}
                indeks={indeks}
                postep={ostry}
                nieruchomo={!!mniejRuchu}
              />
            ))}
          </motion.div>
        </div>

        <div aria-hidden className={PRZYCIEMNIENIE_POD_TEKSTEM} />

        <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-[clamp(4rem,8vw,6.5rem)] pt-[clamp(5.5rem,10vw,8rem)] sm:px-8 lg:pl-32 lg:pr-32">
          <Wejscie>
            <Naglowek className="max-w-[16ch]">Budowa ICAROS Health</Naglowek>
          </Wejscie>

          {/* Opisy leżą dokładnie jeden na drugim i przenikają się. */}
          <div className="relative min-h-[11rem] max-w-[44ch]">
            {budowa.map((ujecie, indeks) => (
              <Opis
                key={ujecie.nazwa}
                ujecie={ujecie}
                indeks={indeks}
                postep={ostry}
                nieruchomo={!!mniejRuchu}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Jedno ujęcie: kadr przygaszony, na nim wycięte jasne miejsce z opisywanym
 * elementem i linia, która na nie wskazuje.
 */
function Ujecie({
  ujecie,
  indeks,
  postep,
  nieruchomo,
}: {
  ujecie: (typeof budowa)[number];
  indeks: number;
  postep: MotionValue<number>;
  nieruchomo: boolean;
}) {
  const c = srodek(indeks);
  const krycie = useTransform(
    postep,
    [c - 0.155, c - 0.095, c + 0.095, c + 0.155],
    [0, 1, 1, 0]
  );

  const { x, y, rx, ry } = ujecie.ognisko;
  // Światło na elemencie: jasna kopia zdjęcia wycięta owalem w jego miejscu.
  const swiatlo = `radial-gradient(${rx}% ${ry}% at ${x}% ${y}%, #000 58%, rgba(0,0,0,0.45) 80%, transparent 100%)`; // taste-skill-ignore: maska światła na elemencie

  const warstwa = (
    <>
      {/* Reszta urządzenia zostaje w cieniu. Tryb screen zjada czarne tło
          kadru, więc nie widać prostokąta ze zdjęciem, tylko samo urządzenie. */}
      <Image
        src={ujecie.obraz}
        alt={indeks === 0 ? ujecie.obrazAlt : ""}
        fill
        sizes="(max-width: 1024px) 100vw, 66vw"
        priority
        className="object-cover brightness-[0.46] contrast-[1.45] saturate-[0.7]"
      />
      {/* Opisywany element, w pełnym świetle. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ maskImage: swiatlo, WebkitMaskImage: swiatlo }}
      >
        <Image
          src={ujecie.obraz}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
          className="object-cover contrast-[1.45]"
        />
      </div>
      <Wskazanie x={x} y={y} rx={rx} ry={ry} />
    </>
  );

  if (nieruchomo) {
    return indeks === 0 ? (
      <div className="absolute inset-0 mix-blend-screen">{warstwa}</div>
    ) : null;
  }

  return (
    <motion.div
      className="absolute inset-0 mix-blend-screen"
      style={{ opacity: krycie }}
    >
      {warstwa}
    </motion.div>
  );
}

/**
 * Linia wskazująca element, biegnąca od niego w stronę opisu. Obrączki nie ma:
 * element jest już podświetlony, a kółko tylko dokładało kreski.
 * Rysowana w układzie współrzędnych zdjęcia, więc trzyma się elementu przy
 * każdej szerokości ekranu.
 */
function Wskazanie({ x, y, rx, ry }: { x: number; y: number; rx: number; ry: number }) {
  const px = (x / 100) * KADR.w;
  const py = (y / 100) * KADR.h;
  // Linia startuje przy krawędzi jasnego miejsca, nie w jego środku.
  const erx = (rx / 100) * KADR.w * 0.5;
  const ery = (ry / 100) * KADR.h * 0.5;
  // Linia schodzi w stronę opisu, czyli w lewy dolny róg kadru.
  const kat = Math.PI * 0.78;
  const startX = px + Math.cos(kat) * erx;
  const startY = py + Math.sin(kat) * ery;
  const koniecX = Math.max(KADR.w * 0.06, startX - KADR.w * 0.2);
  const koniecY = Math.min(KADR.h * 0.86, startY + KADR.h * 0.2);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${KADR.w} ${KADR.h}`}
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <path
        d={`M ${startX} ${startY} L ${koniecX} ${koniecY} L ${koniecX - KADR.w * 0.035} ${koniecY}`}
        fill="none"
        stroke="rgb(255 102 0 / 0.8)"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Nazwa i opis elementu, wygaszane razem ze swoim ujęciem. */
function Opis({
  ujecie,
  indeks,
  postep,
  nieruchomo,
}: {
  ujecie: (typeof budowa)[number];
  indeks: number;
  postep: MotionValue<number>;
  nieruchomo: boolean;
}) {
  const c = srodek(indeks);
  const krycie = useTransform(
    postep,
    [c - 0.16, c - 0.09, c + 0.09, c + 0.16],
    [0, 1, 1, 0]
  );
  const y = useTransform(postep, [c - 0.14, c, c + 0.14], ["16px", "0px", "-16px"]);

  if (nieruchomo) {
    return (
      <div className="mb-8">
        <h3 className="text-[clamp(1.1rem,1.8vw,1.5rem)] font-semibold tracking-[-0.02em] text-h-accent">
          {ujecie.nazwa}
        </h3>
        <Akapit className="mt-3">{ujecie.opis}</Akapit>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-x-0 top-0"
      style={{ opacity: krycie, y }}
    >
      <h3 className="text-[clamp(1.1rem,1.8vw,1.5rem)] font-semibold tracking-[-0.02em] text-h-accent">
        {ujecie.nazwa}
      </h3>
      <p className="mt-3 max-w-[46ch] text-pretty text-[17px] leading-[1.6] text-h-ink">
        {ujecie.opis}
      </p>
    </motion.div>
  );
}
