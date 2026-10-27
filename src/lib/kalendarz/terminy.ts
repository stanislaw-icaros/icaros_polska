import {
  DLUGOSC_ROZMOWY_MIN,
  HANDLOWCY,
  HORYZONT_DNI,
  KROK_MIN,
  LIMIT_ROZMOW_NA_DZIEN,
  MIN_WYPRZEDZENIE_H,
  NAJWCZESNIEJ_OD_JUTRA,
  ODSTEP_MIN,
  STREFA,
  type Handlowiec,
  type KluczHandlowca,
} from "./config";
import { czesci, dodajDni, etykietaDnia, etykietaKrotka, zDatyIGodziny } from "./czas";
import { jestWolne } from "./swieta";
import { BladGoogle, pobierzWpisy, type WpisKalendarza } from "./google";

/**
 * Wyliczanie wolnych terminów.
 *
 * Klient widzi sumę dostępności obu handlowców: termin jest wolny, jeśli pasuje
 * choć jednej osobie. Kalendarz, którego nie udało się odczytać, traktujemy jak
 * niedostępny, żeby nigdy nie zaproponować godziny, której nie sprawdziliśmy.
 */

export type Termin = {
  /** Początek rozmowy w UTC. */
  start: string;
  /** Kto jest wtedy wolny. */
  osoby: KluczHandlowca[];
};

export type Dzien = {
  data: string;
  etykieta: string;
  etykietaKrotka: string;
  terminy: Termin[];
};

export type Dostepnosc = {
  dni: Dzien[];
  handlowcy: { klucz: KluczHandlowca; imie: string; rola: string }[];
  dlugoscMin: number;
  strefa: string;
  /** Problemy warte zalogowania, np. niepodłączony kalendarz. */
  ostrzezenia: string[];
  /** Liczba rozmów umówionych przez stronę w horyzoncie, na osobę. */
  obciazenie: Record<string, number>;
  /** Kiedy ostatnia umówiona rozmowa danej osoby, do rozstrzygania remisów. */
  ostatniaRozmowa: Record<string, number>;
};

type Przedzial = { od: number; do: number };

export type Zajetosc = {
  osoba: Handlowiec;
  przedzialy: Przedzial[];
  rozmowyWDniu: Map<string, number>;
  rozmowyRazem: number;
  ostatniaRozmowa: number;
};

function naPrzedzialy(wpisy: WpisKalendarza[]): Przedzial[] {
  const odstep = ODSTEP_MIN * 60_000;
  return wpisy
    .filter((wpis) => wpis.blokuje)
    .map((wpis) => ({
      od: wpis.start.getTime() - (wpis.calodniowy ? 0 : odstep),
      do: wpis.koniec.getTime() + (wpis.calodniowy ? 0 : odstep),
    }))
    .sort((a, b) => a.od - b.od);
}

function kolidauje(przedzialy: Przedzial[], od: number, do_: number): boolean {
  for (const przedzial of przedzialy) {
    if (przedzial.od >= do_) return false;
    if (przedzial.do > od) return true;
  }
  return false;
}

/** Najwcześniejsza chwila, na którą wolno się zapisać. */
export function najwczesniejszyStart(teraz = new Date()): Date {
  const zWyprzedzeniem = new Date(teraz.getTime() + MIN_WYPRZEDZENIE_H * 3_600_000);
  if (!NAJWCZESNIEJ_OD_JUTRA) return zWyprzedzeniem;

  const dzis = czesci(teraz);
  const jutro = zDatyIGodziny(dodajDni(dzis.data, 1), "00:00");
  return jutro > zWyprzedzeniem ? jutro : zWyprzedzeniem;
}

async function zbierzZajetosc(
  od: Date,
  do_: Date,
  ostrzezenia: string[]
): Promise<Zajetosc[]> {
  const wyniki = await Promise.all(
    HANDLOWCY.map(async (osoba): Promise<Zajetosc | null> => {
      try {
        const wpisy = await pobierzWpisy(
          osoba,
          new Date(od.getTime() - 86_400_000),
          new Date(do_.getTime() + 86_400_000)
        );

        const rozmowyWDniu = new Map<string, number>();
        let rozmowyRazem = 0;
        let ostatniaRozmowa = 0;

        for (const wpis of wpisy) {
          if (!wpis.nasza) continue;
          const dzien = czesci(wpis.start).data;
          rozmowyWDniu.set(dzien, (rozmowyWDniu.get(dzien) || 0) + 1);
          rozmowyRazem += 1;
          ostatniaRozmowa = Math.max(ostatniaRozmowa, wpis.start.getTime());
        }

        return {
          osoba,
          przedzialy: naPrzedzialy(wpisy),
          rozmowyWDniu,
          rozmowyRazem,
          ostatniaRozmowa,
        };
      } catch (blad) {
        const opis =
          blad instanceof BladGoogle
            ? blad.message
            : `Nie udało się odczytać kalendarza ${osoba.imie}.`;
        ostrzezenia.push(opis);
        console.error(`[kalendarz] ${opis}`);
        return null;
      }
    })
  );

  return wyniki.filter((wynik): wynik is Zajetosc => wynik !== null);
}

/**
 * Czysta matematyka terminów: z godzin pracy i zajętości robi listę dni.
 * Bez żadnych zapytań na zewnątrz, dzięki czemu da się to sprawdzić testem.
 */
export function zbudujDni(zajetosci: Zajetosc[], od: Date, teraz: Date): Dzien[] {
  const dni: Dzien[] = [];
  const dlugosc = DLUGOSC_ROZMOWY_MIN * 60_000;
  const dzis = czesci(teraz);

  for (let przesuniecie = 0; przesuniecie <= HORYZONT_DNI; przesuniecie += 1) {
    const data = dodajDni(dzis.data, przesuniecie);
    if (jestWolne(data)) continue;

    const dzienTygodnia = czesci(zDatyIGodziny(data, "12:00")).dzienTygodnia;
    const wTymDniu = new Map<number, KluczHandlowca[]>();

    for (const zajetosc of zajetosci) {
      const okna = zajetosc.osoba.godziny[dzienTygodnia as 1 | 2 | 3 | 4 | 5 | 6 | 7];
      if (!okna?.length) continue;

      if (
        LIMIT_ROZMOW_NA_DZIEN > 0 &&
        (zajetosc.rozmowyWDniu.get(data) || 0) >= LIMIT_ROZMOW_NA_DZIEN
      ) {
        continue;
      }

      for (const [poczatek, koniec] of okna) {
        const oknoOd = zDatyIGodziny(data, poczatek).getTime();
        const oknoDo = zDatyIGodziny(data, koniec).getTime();

        for (let start = oknoOd; start + dlugosc <= oknoDo; start += KROK_MIN * 60_000) {
          if (start < od.getTime()) continue;
          if (kolidauje(zajetosc.przedzialy, start, start + dlugosc)) continue;

          const lista = wTymDniu.get(start);
          if (lista) lista.push(zajetosc.osoba.klucz);
          else wTymDniu.set(start, [zajetosc.osoba.klucz]);
        }
      }
    }

    if (wTymDniu.size === 0) continue;

    const terminy = [...wTymDniu.entries()]
      .sort(([a], [b]) => a - b)
      .map(([start, osoby]) => ({ start: new Date(start).toISOString(), osoby }));

    const poludnie = zDatyIGodziny(data, "12:00");
    dni.push({
      data,
      etykieta: etykietaDnia(poludnie),
      etykietaKrotka: etykietaKrotka(poludnie),
      terminy,
    });
  }

  return dni;
}

/**
 * Puste kalendarze obu handlowców. Służy wyłącznie podglądowi strony przed
 * podłączeniem Google: po ustawieniu KALENDARZ_PRZYKLADOWE_TERMINY=1 kalendarz
 * pokazuje same godziny pracy, bez żadnej rezerwacji. Na produkcji przełącznik
 * jest martwy, żeby nikt nigdy nie zobaczył zmyślonych terminów.
 */
function zajetoscPrzykladowa(): Zajetosc[] {
  return HANDLOWCY.map((osoba) => ({
    osoba,
    przedzialy: [],
    rozmowyWDniu: new Map(),
    rozmowyRazem: 0,
    ostatniaRozmowa: 0,
  }));
}

/** Pełna dostępność na najbliższe dni. */
export async function policzDostepnosc(teraz = new Date()): Promise<Dostepnosc> {
  const ostrzezenia: string[] = [];
  const od = najwczesniejszyStart(teraz);
  const dzis = czesci(teraz);
  const ostatniDzien = dodajDni(dzis.data, HORYZONT_DNI);
  const do_ = zDatyIGodziny(dodajDni(ostatniDzien, 1), "00:00");

  let zajetosci = await zbierzZajetosc(od, do_, ostrzezenia);

  if (
    zajetosci.length === 0 &&
    process.env.KALENDARZ_PRZYKLADOWE_TERMINY === "1" &&
    process.env.NODE_ENV !== "production"
  ) {
    console.warn("[kalendarz] tryb podgladu: pokazuje same godziny pracy, bez Google");
    zajetosci = zajetoscPrzykladowa();
    ostrzezenia.length = 0;
  }

  return {
    dni: zbudujDni(zajetosci, od, teraz),
    handlowcy: HANDLOWCY.map((osoba) => ({
      klucz: osoba.klucz,
      imie: osoba.imie,
      rola: osoba.rola,
    })),
    dlugoscMin: DLUGOSC_ROZMOWY_MIN,
    strefa: STREFA,
    ostrzezenia,
    obciazenie: Object.fromEntries(
      zajetosci.map((zajetosc) => [zajetosc.osoba.klucz, zajetosc.rozmowyRazem])
    ),
    ostatniaRozmowa: Object.fromEntries(
      zajetosci.map((zajetosc) => [zajetosc.osoba.klucz, zajetosc.ostatniaRozmowa])
    ),
  };
}

/**
 * Sprawdza konkretną godzinę bezpośrednio przed zapisem.
 * Liczymy od nowa, bez pamięci podręcznej, żeby nie zapisać rozmowy
 * na termin zajęty w ostatniej chwili.
 */
export async function sprawdzTermin(
  start: Date,
  teraz = new Date()
): Promise<{ osoby: KluczHandlowca[]; obciazenie: Record<string, number>; ostatniaRozmowa: Record<string, number> }> {
  const dostepnosc = await policzDostepnosc(teraz);
  const szukany = start.toISOString();
  const dzien = dostepnosc.dni.find((wpis) => wpis.data === czesci(start).data);
  const termin = dzien?.terminy.find((wpis) => wpis.start === szukany);

  return {
    osoby: termin?.osoby || [],
    obciazenie: dostepnosc.obciazenie,
    ostatniaRozmowa: dostepnosc.ostatniaRozmowa,
  };
}

/**
 * Wybór osoby do rozmowy. Jeśli klient wskazał kogoś i ta osoba jest wolna,
 * dostaje rozmowę. W pozostałych przypadkach bierze ją ten, kto ma mniej
 * umówionych rozmów, a przy równej liczbie ten, kto dawniej rozmawiał.
 */
export function wybierzOsobe(
  wolni: KluczHandlowca[],
  preferowana: string | undefined,
  obciazenie: Record<string, number>,
  ostatniaRozmowa: Record<string, number>
): KluczHandlowca | null {
  if (wolni.length === 0) return null;
  if (preferowana && wolni.includes(preferowana as KluczHandlowca)) {
    return preferowana as KluczHandlowca;
  }

  return [...wolni].sort((a, b) => {
    const roznica = (obciazenie[a] || 0) - (obciazenie[b] || 0);
    if (roznica !== 0) return roznica;
    const ostatnia = (ostatniaRozmowa[a] || 0) - (ostatniaRozmowa[b] || 0);
    if (ostatnia !== 0) return ostatnia;
    return a.localeCompare(b);
  })[0];
}

/** Rozmowy umówione przez stronę w podanym przedziale, na potrzeby przypomnień. */
export async function pobierzUmowioneRozmowy(od: Date, do_: Date) {
  const wyniki = await Promise.all(
    HANDLOWCY.map(async (osoba) => {
      try {
        const wpisy = await pobierzWpisy(osoba, od, do_);
        return wpisy
          .filter((wpis) => wpis.nasza && wpis.blokuje)
          .map((wpis) => ({ osoba, wpis }));
      } catch (blad) {
        console.error(
          `[kalendarz] przypomnienia, kalendarz ${osoba.imie}:`,
          blad instanceof Error ? blad.message : blad
        );
        return [];
      }
    })
  );

  return wyniki.flat().sort((a, b) => a.wpis.start.getTime() - b.wpis.start.getTime());
}

/** Zapamiętana dostępność, żeby każde wejście na stronę nie pytało Google. */
let pamiec: { wygasa: number; dane: Dostepnosc } | null = null;

export async function dostepnoscZPamieci(): Promise<Dostepnosc> {
  if (pamiec && pamiec.wygasa > Date.now()) return pamiec.dane;
  const dane = await policzDostepnosc();
  pamiec = { wygasa: Date.now() + 45_000, dane };
  return dane;
}

export function wyczyscPamiec(): void {
  pamiec = null;
}

export const _wewnetrzne = { naPrzedzialy, kolidauje };
