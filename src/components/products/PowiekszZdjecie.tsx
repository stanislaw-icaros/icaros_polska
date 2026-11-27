"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  /** `sizes` miniatury, czyli zdjęcia w układzie strony. */
  sizes: string;
  priority?: boolean;
};

/**
 * Zdjęcie produktu, które po kliknięciu otwiera się w dużym rozmiarze.
 *
 * Wypełnia rodzica tak jak `Image` z `fill`, więc wstawia się je w miejsce
 * zwykłego zdjęcia bez zmiany układu. Duży widok to natywny `<dialog>`:
 * zamyka go Esc, kliknięcie obok zdjęcia i przycisk, a fokus wraca na
 * miniaturę. Duże zdjęcie ładuje się dopiero po otwarciu.
 */
export default function PowiekszZdjecie({ src, alt, sizes, priority }: Props) {
  const okno = useRef<HTMLDialogElement>(null);
  const [otwarte, ustawOtwarte] = useState(false);

  function otworz() {
    ustawOtwarte(true);
    okno.current?.showModal();
  }

  function zamknij() {
    okno.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={otworz}
        aria-label={`Powiększ zdjęcie: ${alt}`}
        className="group absolute inset-0 block cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#ff6600]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          sizes={sizes}
          priority={priority}
        />
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors duration-200 group-hover:bg-black/75"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.4 10.4 14 14M7 5.2v3.6M5.2 7h3.6" />
          </svg>
        </span>
      </button>

      <dialog
        ref={okno}
        aria-label={alt}
        onClose={() => ustawOtwarte(false)}
        // Kliknięcie w tło trafia w sam <dialog>, kliknięcie w zdjęcie w jego dziecko.
        onClick={(zdarzenie) => {
          if (zdarzenie.target === zdarzenie.currentTarget) zamknij();
        }}
        className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        {otwarte ? (
          <div className="relative">
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1200}
              sizes="94vw"
              className="block h-auto max-h-[86vh] w-[min(94vw,1280px)] object-contain"
            />
            <button
              type="button"
              onClick={zamknij}
              className="absolute -top-11 right-0 flex min-h-11 items-center gap-2 text-[13px] text-white/75 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Zamknij
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
