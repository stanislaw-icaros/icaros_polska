/**
 * Treści newslettera trzymane w jednym miejscu: korzysta z nich landing
 * /newsletter oraz wąskie sekcje NewsletterStrip rozsiane po serwisie.
 * Dzięki temu obietnica z paska i obietnica ze strony zapisu są identyczne.
 */

export const NEWSLETTER_PATH = "/newsletter";

/** Ta sama treść w ciemnej oprawie strefy Biznes. */
export const NEWSLETTER_PATH_BUSINESS = "/newsletter-partner";

export const NEWSLETTER_EYEBROW = "Newsletter";

export const NEWSLETTER_TITLE = "Lista ICAROS Polska";

export const NEWSLETTER_LEAD =
  "Wysyłamy wiadomość wtedy, kiedy mamy konkretny powód: zaproszenie na targi, termin testów w placówce, nowe urządzenie w ofercie albo świeże wyniki badań. Kilka razy w roku, bez stałego harmonogramu.";

export type NewsletterBenefit = {
  key: "targi" | "testy" | "nowosci" | "badania";
  title: string;
  description: string;
};

/** Co realnie dostaje osoba z listy. Każdy punkt musi mieć pokrycie w tym, co wysyłamy. */
export const NEWSLETTER_BENEFITS: NewsletterBenefit[] = [
  {
    key: "targi",
    title: "Zaproszenia na targi",
    description:
      "Imienne wejściówki i wstęp do stref dla gości na wydarzeniach, na których wystawiamy ICAROS w Polsce. Pula jest ograniczona, dlatego najpierw pytamy osoby z listy.",
  },
  {
    key: "testy",
    title: "Testy urządzeń na miejscu",
    description:
      "Kiedy w danym mieście pojawia się możliwość spróbowania sprzętu w placówce, wysyłamy termin i zasady zapisu. Czasem jest to jeden dzień w jednym ośrodku.",
  },
  {
    key: "nowosci",
    title: "Nowe urządzenia i funkcje",
    description:
      "Co wchodzi do oferty w Polsce, jakie aktualizacje dostaje oprogramowanie i jakie nowe zastosowania w terapii są już dostępne.",
  },
  {
    key: "badania",
    title: "Badania i wyniki",
    description:
      "Nowe publikacje kliniczne i dane z ośrodków pracujących na ICAROS. Krótkie streszczenie i odnośnik do źródła.",
  },
];

/** Domyślna treść paska odsyłającego do zapisu (strefa jasna). */
export const NEWSLETTER_STRIP = {
  eyebrow: NEWSLETTER_EYEBROW,
  title: "Zaproszenia na targi, terminy testów, nowe badania",
  description: "Kilka wiadomości w roku, wyłącznie wtedy, kiedy jest o czym pisać.",
  cta: "Zapisz się na listę",
} as const;

/** Ta sama lista, opisana z perspektywy placówki (strefa Biznes). */
export const NEWSLETTER_STRIP_BUSINESS = {
  ...NEWSLETTER_STRIP,
  title: "Zaproszenia na targi i nowe urządzenia w ofercie",
  description:
    "Imienne wejściówki na wydarzenia, na których wystawiamy ICAROS, i to, co wchodzi do oferty w Polsce.",
} as const;

export const NEWSLETTER_CONSENT_TEXT =
  "Chcę otrzymywać newsletter ICAROS Polska i wyrażam zgodę na przetwarzanie danych w tym celu.";

/** Krótka informacja pod formularzem. Fakty, bez zapewnień o braku spamu. */
export const NEWSLETTER_FOOTNOTE =
  "Każda wiadomość ma odnośnik do wypisania się. Adresu nie udostępniamy innym firmom.";
