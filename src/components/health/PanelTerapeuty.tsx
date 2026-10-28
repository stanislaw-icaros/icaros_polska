"use client";

/**
 * Widok sesji w aplikacji ICAROS, zbudowany na stronie zamiast zdjęcia tabletu
 * z filmu. Tamto zdjęcie było zrobione pod kątem, na jasnym blacie, i psuło
 * cały ciemny układ; tutaj panel jest ostry przy każdej rozdzielczości i trzyma
 * paletę strony.
 *
 * Liczby są te same, które producent pokazuje w swoich materiałach. To widok
 * przykładowy, nie dane konkretnego pacjenta, i tak jest podpisany.
 */

const DZIS = [
  { etykieta: "Kalorie", wartosc: "65", jednostka: "kcal" },
  { etykieta: "Czas", wartosc: "12:30", jednostka: "min" },
  { etykieta: "Cel tygodnia", wartosc: "75", jednostka: "%" },
];

const TRENINGI = [
  { nazwa: "Core, poziom łatwy", czas: "8:21", kalorie: "46 kcal", wynik: 75 },
  { nazwa: "Test sprawności", czas: "8:21", kalorie: "46 kcal", wynik: 75 },
];

/** Tydzień aktywności. Wartości w procentach najwyższego słupka. */
const TYDZIEN = [
  { dzien: "Pn", udzial: 62 },
  { dzien: "Wt", udzial: 88 },
  { dzien: "Śr", udzial: 34 },
  { dzien: "Cz", udzial: 71 },
  { dzien: "Pt", udzial: 96 },
  { dzien: "So", udzial: 48 },
  { dzien: "Nd", udzial: 22 },
];

export default function PanelTerapeuty() {
  return (
    <figure className="m-0">
      <div
        data-ui
        className="flex w-full animate-[fade-up_0.45s_ease-out] flex-col gap-4 rounded-lg border border-white/8 bg-[#111420] p-5 sm:aspect-[16/10] sm:gap-4 sm:p-6"
      >
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] font-semibold text-h-ink">Dziś</p>
          <p className="text-[12px] text-h-ink-soft">Profil pacjenta</p>
        </div>

        <dl className="grid grid-cols-3 gap-2 sm:gap-3">
          {DZIS.map((pozycja) => (
            <div
              key={pozycja.etykieta}
              className="rounded-md bg-[#171b28] px-3 py-3 sm:px-4 sm:py-4"
            >
              <dt className="text-[12px] leading-tight text-h-ink-soft">
                {pozycja.etykieta}
              </dt>
              <dd className="mt-1 text-[clamp(1.1rem,2.2vw,1.7rem)] font-semibold leading-none tracking-[-0.02em] text-h-ink [font-variant-numeric:tabular-nums]">
                {pozycja.wartosc}
                <span className="ml-1 text-[12px] font-normal text-h-ink-soft">
                  {pozycja.jednostka}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-3">
          <div className="rounded-md bg-[#171b28] p-3 sm:col-span-3 sm:p-4">
            <p className="text-[12px] text-h-ink-soft">
              Ostatnie treningi
            </p>
            <ul className="mt-2 space-y-2 sm:mt-3 sm:space-y-3">
              {TRENINGI.map((trening) => (
                <li key={trening.nazwa}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-[13px] text-h-ink">
                      {trening.nazwa}
                    </span>
                    <span className="shrink-0 text-[13px] text-h-ink-soft [font-variant-numeric:tabular-nums]">
                      {trening.czas} · {trening.kalorie}
                    </span>
                  </div>
                  <div className="mt-1.5 h-[4px] w-full rounded-full bg-[#232838]">
                    <div
                      className="h-full rounded-full bg-h-accent"
                      style={{ width: `${trening.wynik}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-h-[8rem] flex-col rounded-md bg-[#171b28] p-3 sm:col-span-2 sm:min-h-0 sm:p-4">
            <p className="text-[12px] text-h-ink-soft">Aktywność</p>
            <div className="mt-2 flex min-h-0 flex-1 items-end gap-1.5 sm:mt-3 sm:gap-2">
              {TYDZIEN.map((dzien) => (
                <div key={dzien.dzien} className="flex h-full flex-1 flex-col justify-end">
                  <div
                    className="w-full rounded-sm bg-h-accent/70"
                    style={{ height: `${dzien.udzial}%` }}
                  />
                  <span className="mt-1.5 text-center text-[12px] text-h-ink-soft">
                    {dzien.dzien}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <dl className="flex items-baseline">
          <div>
            <dt className="text-[12px] text-h-ink-soft">Kalorie łącznie</dt>
            <dd className="text-[clamp(0.95rem,1.6vw,1.25rem)] font-semibold text-h-ink [font-variant-numeric:tabular-nums]">
              15 157
            </dd>
          </div>

        </dl>
      </div>

      <figcaption className="mt-3 text-[13px] leading-[1.45] text-h-ink-soft">
        Widok sesji w aplikacji ICAROS. Przykładowe dane z materiałów producenta.
      </figcaption>
    </figure>
  );
}
