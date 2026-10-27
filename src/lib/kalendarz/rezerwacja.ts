import {
  DLUGOSC_ROZMOWY_MIN,
  PRZYPOMNIENIE_MIN_PRZED,
  handlowiec,
  opisZrodla,
} from "./config";
import { etykietaPelna } from "./czas";
import { utworzRozmowe, zaktualizujRozmowe } from "./google";
import { zbudujBilet } from "./podpis";
import { sprawdzTermin, wybierzOsobe, wyczyscPamiec } from "./terminy";
import { rozpoznajLeada, zapiszRozmowe } from "@/lib/pipedrive/rozmowa";
import { ALWAYS_NOTIFY_EMAILS } from "@/lib/pipedrive/client";
import {
  wyslijPotwierdzenieRozmowy,
  wyslijPowiadomienieOrozmowie,
  wyslijPrzypomnienieOrozmowie,
} from "@/lib/email/rozmowa";
import { SITE_URL } from "@/lib/email/unsubscribe";

/**
 * Cała rezerwacja w jednym miejscu.
 *
 * Kolejność ma znaczenie: najpierw jeszcze raz sprawdzamy termin w Google,
 * potem pytamy Pipedrive, czy ten lead ma już opiekuna, dopiero na końcu
 * zapisujemy wydarzenie i rozsyłamy wiadomości. Gdy zawiedzie Pipedrive albo
 * poczta, rezerwacja i tak zostaje w kalendarzu, a błąd idzie do logów.
 */

export const SCIEZKA_KALENDARZA = "/kalendarz";
export const SCIEZKA_ODWOLANIA = "/kalendarz/odwolaj";

export type Zgloszenie = {
  start: string;
  osoba?: string;
  imie: string;
  telefon: string;
  email?: string;
  firma?: string;
  temat?: string;
  zrodlo?: string;
  strona?: string;
  zgodaMarketingowa?: boolean;
  utm?: Record<string, string | undefined>;
};

export type WynikRezerwacji =
  | {
      status: "ok";
      start: string;
      osoba: { imie: string; pelneImie: string };
      dlugoscMin: number;
      linkOdwolania?: string;
    }
  | { status: "zajety" }
  | { status: "blad"; komunikat: string };

const WZOR_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Numer w postaci znośnej dla człowieka i dla Pipedrive. */
export function normalizujTelefon(wejscie: string): string | null {
  const oczyszczony = wejscie.replace(/[\s()-]/g, "");
  if (!/^\+?\d{9,15}$/.test(oczyszczony)) return null;
  if (/^\d{9}$/.test(oczyszczony)) return `+48${oczyszczony}`;
  if (/^48\d{9}$/.test(oczyszczony)) return `+${oczyszczony}`;
  if (/^0048\d{9}$/.test(oczyszczony)) return `+${oczyszczony.slice(2)}`;
  return oczyszczony;
}

function linkOdwolania(bilet: {
  osoba: string;
  idWydarzenia: string;
  start: Date;
  dealId?: number;
}): string | undefined {
  const zapytanie = zbudujBilet({
    o: bilet.osoba,
    w: bilet.idWydarzenia,
    s: bilet.start.getTime(),
    d: bilet.dealId,
  });
  if (!zapytanie) return undefined;
  return `${SITE_URL}${SCIEZKA_ODWOLANIA}?${zapytanie}`;
}

function opisWydarzenia(options: {
  imie: string;
  telefon: string;
  email?: string;
  firma?: string;
  temat?: string;
  zrodlo: string;
  strona?: string;
  linkDeala?: string;
  linkOdwolania?: string;
}): string {
  return [
    `Rozmowa telefoniczna umówiona przez kalendarz na icaros.com.pl.`,
    "",
    `Dzwonimy do: ${options.imie}`,
    `Numer: ${options.telefon}`,
    options.email ? `Email: ${options.email}` : "",
    options.firma ? `Placówka: ${options.firma}` : "",
    options.temat ? `Temat podany przez klienta: ${options.temat}` : "",
    "",
    `Źródło rezerwacji: ${options.zrodlo}`,
    options.strona ? `Strona: ${options.strona}` : "",
    options.linkDeala ? `Sprawa w Pipedrive: ${options.linkDeala}` : "",
    options.linkOdwolania ? `Link klienta do odwołania: ${options.linkOdwolania}` : "",
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function umowRozmowe(zgloszenie: Zgloszenie): Promise<WynikRezerwacji> {
  const imie = zgloszenie.imie?.trim();
  const telefon = zgloszenie.telefon ? normalizujTelefon(zgloszenie.telefon) : null;
  const email = zgloszenie.email?.trim().toLowerCase() || undefined;
  const start = new Date(zgloszenie.start);

  if (!imie || imie.length < 2) {
    return { status: "blad", komunikat: "Podaj imię i nazwisko." };
  }
  if (!telefon) {
    return { status: "blad", komunikat: "Podaj numer telefonu, na który mamy zadzwonić." };
  }
  if (email && !WZOR_EMAIL.test(email)) {
    return { status: "blad", komunikat: "Adres e-mail wygląda na niepełny." };
  }
  if (Number.isNaN(start.getTime())) {
    return { status: "blad", komunikat: "Wybrany termin jest nieprawidłowy." };
  }

  const { osoby, obciazenie, ostatniaRozmowa } = await sprawdzTermin(start);
  if (osoby.length === 0) return { status: "zajety" };

  const kontekst = await rozpoznajLeada({ email, telefon });
  const wybrany = wybierzOsobe(
    osoby,
    zgloszenie.osoba || kontekst.wlascicielSprawy,
    obciazenie,
    ostatniaRozmowa
  );
  const osoba = wybrany ? handlowiec(wybrany) : undefined;
  if (!osoba) return { status: "zajety" };

  const koniec = new Date(start.getTime() + DLUGOSC_ROZMOWY_MIN * 60_000);
  const zrodlo = opisZrodla(zgloszenie.zrodlo);
  const firma = zgloszenie.firma?.trim() || undefined;
  const temat = zgloszenie.temat?.trim() || undefined;

  const wydarzenie = await utworzRozmowe(osoba, {
    start,
    koniec,
    tytul: `Rozmowa ICAROS: ${imie}${firma ? `, ${firma}` : ""}`,
    opis: opisWydarzenia({ imie, telefon, email, firma, temat, zrodlo, strona: zgloszenie.strona }),
    emailKlienta: email,
    nazwaKlienta: imie,
    wlasciwosci: {
      klientImie: imie,
      klientTelefon: telefon,
      ...(email ? { klientEmail: email } : {}),
      ...(firma ? { klientFirma: firma } : {}),
      ...(temat ? { temat } : {}),
      zrodlo,
    },
  });

  const link = linkOdwolania({
    osoba: osoba.klucz,
    idWydarzenia: wydarzenie.id,
    start,
  });

  // Od tego miejsca rezerwacja jest już faktem. Dalsze kroki mogą się nie udać,
  // ale nie wolno im unieważnić zapisanego terminu.
  let linkDeala: string | undefined;
  let dealId: number | undefined;
  // Powiadomienie o umówionej rozmowie ma dojść zawsze, także wtedy gdy
  // Pipedrive jest nieskonfigurowany albo nie odpowiada. Adresy z Pipedrive
  // tylko dokładamy do tej listy.
  let odbiorcy: string[] = [
    ...new Set([osoba.kontoGoogle, ...ALWAYS_NOTIFY_EMAILS].filter(Boolean)),
  ];

  try {
    const wynik = await zapiszRozmowe({
      kontekst,
      handlowiec: osoba,
      start,
      dlugoscMin: DLUGOSC_ROZMOWY_MIN,
      imie,
      telefon,
      email,
      firma,
      temat,
      zrodlo,
      strona: zgloszenie.strona,
      linkOdwolania: link,
      zgodaMarketingowa: zgloszenie.zgodaMarketingowa,
      utm: zgloszenie.utm,
    });
    linkDeala = wynik.link;
    dealId = wynik.dealId;
    odbiorcy = [...new Set([...wynik.emaileHandlowcow, ...odbiorcy])];
  } catch (blad) {
    console.error(
      "[kalendarz] zapis rezerwacji w Pipedrive nie wyszedl:",
      blad instanceof Error ? blad.message : blad
    );
  }

  // Link w kalendarzu i w mailu musi zawierać identyfikator sprawy, dlatego
  // dopisujemy go po rozmowie z Pipedrive.
  const pelnyLink =
    dealId !== undefined
      ? linkOdwolania({ osoba: osoba.klucz, idWydarzenia: wydarzenie.id, start, dealId })
      : link;

  const daneMaila = {
    imie,
    telefon,
    email,
    firma,
    temat,
    start,
    koniec,
    handlowiec: osoba,
    dlugoscMin: DLUGOSC_ROZMOWY_MIN,
    zrodlo,
    linkOdwolania: pelnyLink,
    linkKalendarza: wydarzenie.link,
    idWydarzenia: wydarzenie.id,
  };

  // Przypomnienie nie czeka na zadanie cron, tylko od razu ląduje w kolejce
  // Resend na kilka minut przed rozmową. Identyfikator trzymamy w wydarzeniu,
  // żeby dało się je skasować razem z odwołanym terminem.
  const kiedyPrzypomniec = new Date(start.getTime() - PRZYPOMNIENIE_MIN_PRZED * 60_000);
  let przypomnienieId: string | undefined;
  if (email && PRZYPOMNIENIE_MIN_PRZED > 0 && kiedyPrzypomniec.getTime() > Date.now()) {
    try {
      przypomnienieId = await wyslijPrzypomnienieOrozmowie({
        ...daneMaila,
        zaplanujNa: kiedyPrzypomniec,
      });
    } catch (blad) {
      console.error(
        "[kalendarz] nie udalo sie zaplanowac przypomnienia:",
        blad instanceof Error ? blad.message : blad
      );
    }
  }

  try {
    await zaktualizujRozmowe(osoba, wydarzenie.id, {
      opis: opisWydarzenia({
        imie,
        telefon,
        email,
        firma,
        temat,
        zrodlo,
        strona: zgloszenie.strona,
        linkDeala,
        linkOdwolania: pelnyLink,
      }),
      wlasciwosci: {
        ...(dealId !== undefined ? { dealId: String(dealId) } : {}),
        ...(pelnyLink ? { linkOdwolania: pelnyLink } : {}),
        ...(przypomnienieId ? { przypomnienieId } : {}),
      },
    });
  } catch (blad) {
    console.error(
      "[kalendarz] uzupelnienie wydarzenia nie wyszlo:",
      blad instanceof Error ? blad.message : blad
    );
  }

  await Promise.allSettled([
    wyslijPotwierdzenieRozmowy(daneMaila),
    wyslijPowiadomienieOrozmowie({ ...daneMaila, odbiorcy, linkDeala }),
  ]).then((wyniki) => {
    for (const wynik of wyniki) {
      if (wynik.status === "rejected") {
        console.error("[kalendarz] wiadomosc o rezerwacji nie poszla:", wynik.reason);
      }
    }
  });

  wyczyscPamiec();
  console.log(
    `[kalendarz] rezerwacja ${etykietaPelna(start)} dla ${imie}, prowadzi ${osoba.imie}, zrodlo ${zrodlo}`
  );

  return {
    status: "ok",
    start: start.toISOString(),
    osoba: { imie: osoba.imie, pelneImie: osoba.pelneImie },
    dlugoscMin: DLUGOSC_ROZMOWY_MIN,
    linkOdwolania: pelnyLink,
  };
}
