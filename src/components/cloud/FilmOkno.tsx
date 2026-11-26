"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SESJA } from "@/lib/cloud/tresc";

/**
 * Film z treningu. Na stronie leży tylko zdjęcie: plik wideo zaczyna się
 * pobierać dopiero po kliknięciu, więc nie obciąża pierwszego wejścia.
 */
export default function FilmOkno() {
  const [gra, ustawGra] = useState(false);
  const wideo = useRef<HTMLVideoElement>(null);

  return (
    <div className="cl-film">
      {gra ? (
        <video
          ref={wideo}
          src={SESJA.film.src}
          poster={SESJA.film.poster}
          controls
          autoPlay
          playsInline
          preload="auto"
          aria-label="Film: trening na platformie ICAROS Cloud"
        />
      ) : (
        <>
          <Image
            src={SESJA.film.poster}
            alt="Kobieta ćwiczy na platformie ICAROS Cloud, na telewizorze obok widać grę"
            width={1560}
            height={1080}
            sizes="(max-width: 900px) 100vw, 56vw"
          />
          <button
            type="button"
            className="cl-film__start"
            aria-label={`${SESJA.film.przycisk}, ${SESJA.film.dlugosc}`}
            onClick={() => ustawGra(true)}
          >
            <span className="cl-film__znak" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.5 1.8v12.4a.6.6 0 0 0 .92.5l9.6-6.2a.6.6 0 0 0 0-1L4.42 1.3a.6.6 0 0 0-.92.5Z" />
              </svg>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
