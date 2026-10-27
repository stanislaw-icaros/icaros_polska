import { Resend } from "resend";
import { escapeHtml, imieZNazwy, kopertaHtml, POMARANCZOWY, type Wiersz } from "./szablon";
import { etykietaGodziny, etykietaPelna } from "@/lib/kalendarz/czas";
import { zbudujIcs } from "@/lib/kalendarz/ics";
import type { Handlowiec } from "@/lib/kalendarz/config";

/**
 * Wiadomości wokół umówionej rozmowy: potwierdzenie dla klienta z plikiem .ics,
 * powiadomienie dla handlowców i przypomnienie w dniu rozmowy.
 *
 * Treści są prowadzone bezosobowo („zadzwonimy”, „potwierdzamy”), żeby nie
 * mieszać form Ty i Państwo między strefą pacjenta i strefą biznesową.
 */

const ADRES_KONTAKTOWY = "kontakt@icaros.com.pl";

function klient(): Resend | null {
  const klucz = process.env.RESEND_API_KEY?.trim();
  return klucz ? new Resend(klucz) : null;
}

function nadawca(): string | null {
  return process.env.RESEND_FROM?.trim() || null;
}

export type DaneMailaRozmowy = {
  imie: string;
  telefon: string;
  email?: string;
  firma?: string;
  temat?: string;
  start: Date;
  koniec: Date;
  handlowiec: Handlowiec;
  dlugoscMin: number;
  zrodlo?: string;
  linkOdwolania?: string;
  linkKalendarza?: string;
  idWydarzenia?: string;
};

function wierszeTerminu(dane: DaneMailaRozmowy): Wiersz[] {
  const wiersze: Wiersz[] = [
    { etykieta: "Termin", wartosc: etykietaPelna(dane.start), mocny: true },
    { etykieta: "Numer", wartosc: dane.telefon },
    { etykieta: "Rozmawia", wartosc: dane.handlowiec.pelneImie },
    { etykieta: "Czas rozmowy", wartosc: `${dane.dlugoscMin} minut` },
  ];
  if (dane.temat?.trim()) {
    wiersze.push({ etykieta: "Temat", wartosc: dane.temat.trim() });
  }
  return wiersze;
}

function plikIcs(dane: DaneMailaRozmowy, anulowane = false) {
  const tresc = zbudujIcs({
    identyfikator: `${dane.idWydarzenia || dane.start.getTime()}@icaros.com.pl`,
    start: dane.start,
    koniec: dane.koniec,
    tytul: `Rozmowa telefoniczna z ICAROS Polska`,
    opis: [
      `Rozmowa telefoniczna z ${dane.handlowiec.pelneImie} z ICAROS Polska.`,
      `Dzwonimy na numer ${dane.telefon}.`,
      dane.temat?.trim() ? `Temat: ${dane.temat.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    miejsce: `Rozmowa telefoniczna, numer ${dane.telefon}`,
    organizator: { nazwa: "ICAROS Polska", email: ADRES_KONTAKTOWY },
    anulowane,
    wersja: anulowane ? 1 : 0,
  });

  return {
    filename: "rozmowa-icaros.ics",
    content: Buffer.from(tresc, "utf8"),
    contentType: "text/calendar; charset=utf-8; method=PUBLISH",
  };
}

/** Potwierdzenie dla klienta, z plikiem do dodania w kalendarzu. */
export async function wyslijPotwierdzenieRozmowy(dane: DaneMailaRozmowy): Promise<void> {
  const resend = klient();
  const from = nadawca();
  if (!resend || !from || !dane.email) return;

  const html = kopertaHtml({
    podglad: `Dzwonimy ${etykietaPelna(dane.start)} na numer ${dane.telefon}.`,
    tytulStrony: "Umówiona rozmowa z ICAROS Polska",
    naglowek: "Termin rozmowy jest zapisany",
    akapity: [
      `Dziękujemy za wybranie terminu. Zadzwonimy <strong class="strong-text" style="font-weight:600;color:#0a0a0a;">${escapeHtml(
        etykietaPelna(dane.start)
      )}</strong> na podany numer telefonu.`,
      `Rozmowa trwa ${dane.dlugoscMin} minut. To zwykła rozmowa telefoniczna, nie trzeba nic instalować ani nigdzie się logować.`,
    ],
    ramka: { naglowek: "Szczegóły", wiersze: wierszeTerminu(dane) },
    dopiski: [
      "W załączniku jest plik, który dodaje tę rozmowę do kalendarza w telefonie lub w poczcie.",
      dane.linkOdwolania
        ? "Jeśli termin przestanie pasować, można go odwołać jednym kliknięciem i wybrać inny."
        : "",
    ].filter(Boolean),
    linki: dane.linkOdwolania
      ? [{ etykieta: "Odwołaj albo zmień termin", url: dane.linkOdwolania }]
      : undefined,
    stopka: [
      "ICAROS Polska, oficjalny dystrybutor ICAROS w Polsce.",
      `Pytania przed rozmową: <a href="mailto:${ADRES_KONTAKTOWY}" style="color:${POMARANCZOWY};font-weight:600;">${ADRES_KONTAKTOWY}</a>`,
    ],
  });

  await resend.emails.send({
    from,
    to: dane.email,
    subject: `Umówiona rozmowa: ${etykietaPelna(dane.start)}`,
    html,
    replyTo: ADRES_KONTAKTOWY,
    attachments: [plikIcs(dane)],
  });
}

/** Powiadomienie dla handlowców i marketingu. */
export async function wyslijPowiadomienieOrozmowie(
  dane: DaneMailaRozmowy & { odbiorcy: string[]; linkDeala?: string }
): Promise<void> {
  const resend = klient();
  const from = nadawca();
  if (!resend || !from || dane.odbiorcy.length === 0) return;

  const wiersze: Wiersz[] = [
    { etykieta: "Termin", wartosc: etykietaPelna(dane.start), mocny: true },
    { etykieta: "Prowadzi", wartosc: dane.handlowiec.pelneImie },
    { etykieta: "Klient", wartosc: dane.imie },
    { etykieta: "Telefon", wartosc: dane.telefon },
  ];
  if (dane.email) wiersze.push({ etykieta: "Email", wartosc: dane.email });
  if (dane.firma?.trim()) wiersze.push({ etykieta: "Placówka", wartosc: dane.firma.trim() });
  if (dane.temat?.trim()) wiersze.push({ etykieta: "Temat", wartosc: dane.temat.trim() });
  if (dane.zrodlo) wiersze.push({ etykieta: "Źródło rezerwacji", wartosc: dane.zrodlo });

  const linki = [
    dane.linkDeala ? { etykieta: "Otwórz sprawę w Pipedrive", url: dane.linkDeala } : null,
    dane.linkKalendarza
      ? { etykieta: "Pokaż w kalendarzu Google", url: dane.linkKalendarza }
      : null,
  ].filter((link): link is { etykieta: string; url: string } => link !== null);

  const html = kopertaHtml({
    podglad: `${dane.imie}, ${etykietaPelna(dane.start)}, prowadzi ${dane.handlowiec.imie}.`,
    tytulStrony: "Nowa umówiona rozmowa",
    naglowek: `Rozmowę prowadzi ${dane.handlowiec.imie}`,
    akapity: [
      `Klient wybrał termin w kalendarzu na stronie. Rozmowa jest już wpisana w kalendarz Google i w Pipedrive jako zadanie telefoniczne.`,
    ],
    ramka: { naglowek: "Rezerwacja", wiersze },
    linki: linki.length > 0 ? linki : undefined,
    stopka: ["Powiadomienie z kalendarza rozmów na icaros.com.pl."],
  });

  await resend.emails.send({
    from,
    to: dane.odbiorcy,
    subject: `Nowa rozmowa: ${dane.imie}, ${etykietaPelna(dane.start)}`,
    html,
  });
}

/** Przypomnienie wysyłane w dniu rozmowy. */
export async function wyslijPrzypomnienieOrozmowie(dane: DaneMailaRozmowy): Promise<void> {
  const resend = klient();
  const from = nadawca();
  if (!resend || !from || !dane.email) return;

  const html = kopertaHtml({
    podglad: `Dzisiaj o ${etykietaGodziny(dane.start)} dzwonimy na numer ${dane.telefon}.`,
    tytulStrony: "Przypomnienie o rozmowie",
    naglowek: `Dzisiaj o ${etykietaGodziny(dane.start)} dzwonimy`,
    akapity: [
      `Przypominamy o umówionej rozmowie. ${escapeHtml(
        dane.handlowiec.pelneImie
      )} zadzwoni dzisiaj o ${escapeHtml(etykietaGodziny(dane.start))} na numer ${escapeHtml(
        dane.telefon
      )}.`,
      `Rozmowa trwa ${dane.dlugoscMin} minut.`,
    ],
    ramka: { wiersze: wierszeTerminu(dane) },
    dopiski: dane.linkOdwolania
      ? ["Jeśli dzisiejszy termin przestał pasować, można go odwołać i wybrać inny."]
      : undefined,
    linki: dane.linkOdwolania
      ? [{ etykieta: "Odwołaj albo zmień termin", url: dane.linkOdwolania }]
      : undefined,
  });

  await resend.emails.send({
    from,
    to: dane.email,
    subject: `Przypomnienie o rozmowie dzisiaj o ${etykietaGodziny(dane.start)}`,
    html,
    replyTo: ADRES_KONTAKTOWY,
  });
}

/** Informacja dla klienta, że jego rozmowa została odwołana. */
export async function wyslijOdwolanieRozmowy(
  dane: DaneMailaRozmowy & { linkKalendarzaStrony: string }
): Promise<void> {
  const resend = klient();
  const from = nadawca();
  if (!resend || !from || !dane.email) return;

  const html = kopertaHtml({
    podglad: `Termin ${etykietaPelna(dane.start)} został odwołany.`,
    tytulStrony: "Odwołany termin rozmowy",
    naglowek: "Termin został odwołany",
    akapity: [
      `Rozmowa zaplanowana na ${escapeHtml(
        etykietaPelna(dane.start)
      )} jest odwołana i nikt nie będzie dzwonił.`,
      "Nowy termin można wybrać w każdej chwili, lista wolnych godzin jest na stronie.",
    ],
    przycisk: { etykieta: "Wybierz nowy termin", url: dane.linkKalendarzaStrony },
  });

  await resend.emails.send({
    from,
    to: dane.email,
    subject: `Odwołany termin rozmowy, ${etykietaPelna(dane.start)}`,
    html,
    replyTo: ADRES_KONTAKTOWY,
    attachments: [plikIcs(dane, true)],
  });
}

/** Informacja dla administratora po podłączeniu kalendarza przez handlowca. */
export async function wyslijInformacjeOPodlaczeniu(dane: {
  odbiorcy: string[];
  handlowiec: Handlowiec;
  kontoGoogle?: string;
  token?: string;
}): Promise<void> {
  const resend = klient();
  const from = nadawca();
  if (!resend || !from || dane.odbiorcy.length === 0) return;

  const wiersze: Wiersz[] = [
    { etykieta: "Osoba", wartosc: dane.handlowiec.pelneImie, mocny: true },
    { etykieta: "Konto Google", wartosc: dane.kontoGoogle || "nie podano" },
  ];

  const html = kopertaHtml({
    podglad: `Kalendarz ${dane.handlowiec.imie} został podłączony.`,
    tytulStrony: "Kalendarz podłączony",
    naglowek: `Kalendarz ${dane.handlowiec.imie} jest podłączony`,
    akapity: [
      dane.token
        ? "Projekt nie ma trwałego magazynu, dlatego token trzeba raz wkleić do zmiennych środowiskowych. Do tego czasu kalendarz tej osoby nie oddaje terminów."
        : "Token zapisał się automatycznie, nic więcej nie trzeba robić.",
    ],
    ramka: { naglowek: "Podłączenie", wiersze },
    dopiski: dane.token
      ? [
          `Zmienna: <code style="font-family:monospace;">${escapeHtml(
            dane.handlowiec.zmiennaTokenu
          )}</code>`,
          `Wartość: <code style="font-family:monospace;word-break:break-all;">${escapeHtml(
            dane.token
          )}</code>`,
        ]
      : undefined,
  });

  await resend.emails.send({
    from,
    to: dane.odbiorcy,
    subject: `Kalendarz podłączony: ${imieZNazwy(dane.handlowiec.pelneImie)}`,
    html,
  });
}
