/**
 * Plik .ics dołączany do potwierdzenia rezerwacji.
 *
 * Dzięki niemu klient dodaje rozmowę do swojego kalendarza jednym kliknięciem,
 * niezależnie od tego, czy używa Google, Outlooka czy kalendarza na telefonie.
 */

function znacznikCzasu(data: Date): string {
  return `${data.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
}

function escape(tekst: string): string {
  return tekst
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Standard iCalendar wymaga linii nie dłuższych niż 75 oktetów. */
function zawin(linia: string): string {
  const bajty = Buffer.from(linia, "utf8");
  if (bajty.length <= 75) return linia;

  const czesci: string[] = [];
  let pozycja = 0;
  let limit = 75;

  while (pozycja < bajty.length) {
    let dlugosc = Math.min(limit, bajty.length - pozycja);
    // Nie przecinamy znaku wielobajtowego w środku.
    while (dlugosc > 1 && (bajty[pozycja + dlugosc] & 0b1100_0000) === 0b1000_0000) {
      dlugosc -= 1;
    }
    czesci.push(bajty.subarray(pozycja, pozycja + dlugosc).toString("utf8"));
    pozycja += dlugosc;
    limit = 74; // kolejne linie zaczynają się od spacji
  }

  return czesci.join("\r\n ");
}

export type DaneIcs = {
  identyfikator: string;
  start: Date;
  koniec: Date;
  tytul: string;
  opis: string;
  miejsce: string;
  organizator: { nazwa: string; email: string };
  anulowane?: boolean;
  wersja?: number;
};

export function zbudujIcs(dane: DaneIcs): string {
  const linie = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ICAROS Polska//Kalendarz rozmow//PL",
    "CALSCALE:GREGORIAN",
    `METHOD:${dane.anulowane ? "CANCEL" : "PUBLISH"}`,
    "BEGIN:VEVENT",
    `UID:${dane.identyfikator}`,
    `SEQUENCE:${dane.wersja ?? 0}`,
    `DTSTAMP:${znacznikCzasu(new Date())}`,
    `DTSTART:${znacznikCzasu(dane.start)}`,
    `DTEND:${znacznikCzasu(dane.koniec)}`,
    `SUMMARY:${escape(dane.tytul)}`,
    `DESCRIPTION:${escape(dane.opis)}`,
    `LOCATION:${escape(dane.miejsce)}`,
    `ORGANIZER;CN=${escape(dane.organizator.nazwa)}:mailto:${dane.organizator.email}`,
    `STATUS:${dane.anulowane ? "CANCELLED" : "CONFIRMED"}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escape(dane.tytul)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${linie.map(zawin).join("\r\n")}\r\n`;
}
