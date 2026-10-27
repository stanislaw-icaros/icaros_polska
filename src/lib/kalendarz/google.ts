import { STREFA, type Handlowiec } from "./config";
import { zLokalnego } from "./czas";
import { pobierzToken } from "./tokeny";

/**
 * Rozmowa z Google Calendar po zwykłym REST, bez biblioteki googleapis.
 *
 * Czytamy wyłącznie kalendarz główny danej osoby („primary”), więc wspólne
 * kalendarze firmowe nie zabierają terminów. Zajętość bierzemy z listy wydarzeń,
 * a nie z freeBusy, bo tylko tak widzimy, które wpisy są oznaczone jako wolne
 * i które rozmowy umówił już nasz kalendarz.
 */

const AUTORYZACJA_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_URL = "https://www.googleapis.com/calendar/v3";

/** Edycja wydarzeń wystarcza do czytania zajętości i zapisywania rozmów. */
export const ZAKRESY = [
  "https://www.googleapis.com/auth/calendar.events",
  "openid",
  "email",
].join(" ");

/** Znacznik odróżniający rozmowy umówione przez stronę od reszty kalendarza. */
export const ZNACZNIK = "icarosRozmowa";

export class BladGoogle extends Error {
  constructor(
    message: string,
    readonly osoba?: string,
    readonly wymagaPonownegoPodlaczenia = false
  ) {
    super(message);
    this.name = "BladGoogle";
  }
}

function daneAplikacji() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new BladGoogle("Brak GOOGLE_CLIENT_ID lub GOOGLE_CLIENT_SECRET.");
  }
  return { clientId, clientSecret };
}

export function adresPrzekierowania(baza: string): string {
  return `${baza.replace(/\/+$/, "")}/api/kalendarz/polacz/callback`;
}

/** Adres zgody Google dla jednej osoby. */
export function adresAutoryzacji(options: {
  baza: string;
  stan: string;
  podpowiedzKonta?: string;
}): string {
  const { clientId } = daneAplikacji();
  const parametry = new URLSearchParams({
    client_id: clientId,
    redirect_uri: adresPrzekierowania(options.baza),
    response_type: "code",
    scope: ZAKRESY,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state: options.stan,
  });
  if (options.podpowiedzKonta) parametry.set("login_hint", options.podpowiedzKonta);
  return `${AUTORYZACJA_URL}?${parametry.toString()}`;
}

type OdpowiedzTokenu = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  id_token?: string;
  error?: string;
  error_description?: string;
};

function emailZTokenuId(idToken?: string): string | undefined {
  if (!idToken) return undefined;
  const czesc = idToken.split(".")[1];
  if (!czesc) return undefined;
  try {
    const json = Buffer.from(czesc.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
      "utf8"
    );
    return (JSON.parse(json) as { email?: string }).email;
  } catch {
    return undefined;
  }
}

/** Wymienia kod z przekierowania na token odświeżania. */
export async function wymienKod(options: {
  kod: string;
  baza: string;
}): Promise<{ tokenOdswiezania: string; email?: string }> {
  const { clientId, clientSecret } = daneAplikacji();
  const odpowiedz = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: options.kod,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: adresPrzekierowania(options.baza),
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });

  const dane = (await odpowiedz.json()) as OdpowiedzTokenu;
  if (!odpowiedz.ok || !dane.refresh_token) {
    throw new BladGoogle(
      dane.error_description ||
        dane.error ||
        "Google nie zwrócił tokenu odświeżania. Odłącz aplikację w ustawieniach konta i spróbuj jeszcze raz."
    );
  }

  return { tokenOdswiezania: dane.refresh_token, email: emailZTokenuId(dane.id_token) };
}

const pamiecTokenow = new Map<string, { token: string; wygasa: number }>();

async function tokenDostepu(osoba: Handlowiec): Promise<string> {
  const zapamietany = pamiecTokenow.get(osoba.klucz);
  if (zapamietany && zapamietany.wygasa > Date.now() + 60_000) return zapamietany.token;

  const tokenOdswiezania = await pobierzToken(osoba);
  if (!tokenOdswiezania) {
    throw new BladGoogle(
      `Kalendarz ${osoba.imie} nie jest podłączony.`,
      osoba.klucz,
      true
    );
  }

  const { clientId, clientSecret } = daneAplikacji();
  const odpowiedz = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokenOdswiezania,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  const dane = (await odpowiedz.json()) as OdpowiedzTokenu;
  if (!odpowiedz.ok || !dane.access_token) {
    pamiecTokenow.delete(osoba.klucz);
    throw new BladGoogle(
      `Google odrzucił token ${osoba.imie}: ${dane.error_description || dane.error || "nieznany błąd"}`,
      osoba.klucz,
      dane.error === "invalid_grant"
    );
  }

  const token = dane.access_token;
  pamiecTokenow.set(osoba.klucz, {
    token,
    wygasa: Date.now() + (dane.expires_in ?? 3600) * 1000,
  });
  return token;
}

async function zapytanie<T>(
  osoba: Handlowiec,
  sciezka: string,
  opcje: RequestInit = {},
  poNieudanymTokenie = false
): Promise<T> {
  const token = await tokenDostepu(osoba);
  const odpowiedz = await fetch(`${API_URL}${sciezka}`, {
    ...opcje,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(opcje.headers || {}),
    },
    cache: "no-store",
  });

  if (odpowiedz.status === 401) {
    pamiecTokenow.delete(osoba.klucz);
    // Token dostępu mógł wygasnąć między sprawdzeniem terminu a zapisem.
    // Jedno podejście z nowym tokenem, zanim uznamy, że Google nie wpuszcza:
    // inaczej pojedyncze 401 przewraca całą rezerwację.
    if (!poNieudanymTokenie) {
      console.warn(`[kalendarz] token ${osoba.imie} odrzucony, biore nowy i probuje raz jeszcze`);
      return zapytanie<T>(osoba, sciezka, opcje, true);
    }
    throw new BladGoogle(`Google odrzucił dostęp do kalendarza ${osoba.imie}.`, osoba.klucz, true);
  }

  const tekst = await odpowiedz.text();
  if (!odpowiedz.ok) {
    throw new BladGoogle(
      `Google Calendar ${odpowiedz.status} dla ${osoba.imie}: ${tekst.slice(0, 300)}`,
      osoba.klucz
    );
  }

  return (tekst ? JSON.parse(tekst) : {}) as T;
}

type WydarzenieGoogle = {
  id?: string;
  status?: string;
  summary?: string;
  transparency?: string;
  eventType?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  attendees?: { self?: boolean; responseStatus?: string }[];
  extendedProperties?: { private?: Record<string, string> };
};

export type WpisKalendarza = {
  id: string;
  start: Date;
  koniec: Date;
  calodniowy: boolean;
  /** Czy wpis zabiera termin (jest oznaczony jako zajęty i nie został odrzucony). */
  blokuje: boolean;
  /** Czy to rozmowa umówiona przez nasz kalendarz. */
  nasza: boolean;
  tytul?: string;
  wlasciwosci: Record<string, string>;
};

/** Typy wpisów, które nigdy nie zabierają terminu. */
const TYPY_NIEBLOKUJACE = new Set(["workingLocation", "birthday", "fromGmail"]);

function naDate(pole: { dateTime?: string; date?: string } | undefined): Date | null {
  if (!pole) return null;
  if (pole.dateTime) return new Date(pole.dateTime);
  if (pole.date) {
    const [rok, miesiac, dzien] = pole.date.split("-").map(Number);
    return zLokalnego(rok, miesiac, dzien, 0, 0);
  }
  return null;
}

/** Wydarzenia z kalendarza głównego osoby w podanym przedziale. */
export async function pobierzWpisy(
  osoba: Handlowiec,
  od: Date,
  do_: Date
): Promise<WpisKalendarza[]> {
  const wpisy: WpisKalendarza[] = [];
  let pageToken: string | undefined;

  do {
    const parametry = new URLSearchParams({
      timeMin: od.toISOString(),
      timeMax: do_.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "2500",
      showDeleted: "false",
      fields:
        "nextPageToken,items(id,status,summary,transparency,eventType,start,end,attendees(self,responseStatus),extendedProperties/private)",
    });
    if (pageToken) parametry.set("pageToken", pageToken);

    const dane = await zapytanie<{ items?: WydarzenieGoogle[]; nextPageToken?: string }>(
      osoba,
      `/calendars/primary/events?${parametry.toString()}`
    );

    for (const wydarzenie of dane.items || []) {
      const start = naDate(wydarzenie.start);
      const koniec = naDate(wydarzenie.end);
      if (!wydarzenie.id || !start || !koniec) continue;

      const ja = wydarzenie.attendees?.find((uczestnik) => uczestnik.self);
      const wlasciwosci = wydarzenie.extendedProperties?.private || {};

      wpisy.push({
        id: wydarzenie.id,
        start,
        koniec,
        calodniowy: Boolean(wydarzenie.start?.date),
        blokuje:
          wydarzenie.status !== "cancelled" &&
          wydarzenie.transparency !== "transparent" &&
          !TYPY_NIEBLOKUJACE.has(wydarzenie.eventType || "") &&
          ja?.responseStatus !== "declined",
        nasza: wlasciwosci[ZNACZNIK] === "1",
        tytul: wydarzenie.summary,
        wlasciwosci,
      });
    }

    pageToken = dane.nextPageToken;
  } while (pageToken);

  return wpisy;
}

export type NowaRozmowa = {
  start: Date;
  koniec: Date;
  tytul: string;
  opis: string;
  emailKlienta?: string;
  nazwaKlienta?: string;
  wlasciwosci?: Record<string, string>;
};

/** Zapisuje rozmowę w kalendarzu osoby i zwraca identyfikator wydarzenia. */
export async function utworzRozmowe(
  osoba: Handlowiec,
  rozmowa: NowaRozmowa
): Promise<{ id: string; link?: string }> {
  const dane = await zapytanie<{ id: string; htmlLink?: string }>(
    osoba,
    "/calendars/primary/events?sendUpdates=none",
    {
      method: "POST",
      body: JSON.stringify({
        summary: rozmowa.tytul,
        description: rozmowa.opis,
        start: { dateTime: rozmowa.start.toISOString(), timeZone: STREFA },
        end: { dateTime: rozmowa.koniec.toISOString(), timeZone: STREFA },
        transparency: "opaque",
        visibility: "private",
        attendees: rozmowa.emailKlienta
          ? [
              {
                email: rozmowa.emailKlienta,
                displayName: rozmowa.nazwaKlienta,
                responseStatus: "needsAction",
              },
            ]
          : undefined,
        reminders: {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: 15 },
            { method: "popup", minutes: 60 },
          ],
        },
        extendedProperties: {
          private: { [ZNACZNIK]: "1", ...(rozmowa.wlasciwosci || {}) },
        },
      }),
    }
  );

  return { id: dane.id, link: dane.htmlLink };
}

/** Usuwa rozmowę z kalendarza. Brak wydarzenia traktujemy jak sukces. */
export async function usunRozmowe(osoba: Handlowiec, idWydarzenia: string): Promise<void> {
  try {
    await zapytanie(osoba, `/calendars/primary/events/${encodeURIComponent(idWydarzenia)}?sendUpdates=none`, {
      method: "DELETE",
    });
  } catch (blad) {
    if (blad instanceof BladGoogle && /\b(404|410)\b/.test(blad.message)) return;
    throw blad;
  }
}

/** Dopisuje opis albo prywatne właściwości do istniejącego wydarzenia. */
export async function zaktualizujRozmowe(
  osoba: Handlowiec,
  idWydarzenia: string,
  zmiany: { opis?: string; wlasciwosci?: Record<string, string> }
): Promise<void> {
  const cialo: Record<string, unknown> = {};
  if (zmiany.opis !== undefined) cialo.description = zmiany.opis;
  if (zmiany.wlasciwosci) cialo.extendedProperties = { private: zmiany.wlasciwosci };
  if (Object.keys(cialo).length === 0) return;

  await zapytanie(osoba, `/calendars/primary/events/${encodeURIComponent(idWydarzenia)}`, {
    method: "PATCH",
    body: JSON.stringify(cialo),
  });
}
