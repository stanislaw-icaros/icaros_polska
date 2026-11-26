/**
 * Cała treść i wszystkie liczby landingu ICAROS Cloud.
 *
 * Komponenty w `src/components/cloud/` nie trzymają tekstów ani kwot.
 * Zmiana ceny, nagłówka, warunków zwrotu albo listy pytań to jedna edycja tutaj.
 *
 * Wartości z listy `DO_POTWIERDZENIA` są robocze. Zanim strona pójdzie na
 * produkcję, każdą trzeba potwierdzić u Sebastiana albo w ICAROS GmbH.
 */

/**
 * Nagłówek H1. Po pierwszych tygodniach reklam podmieniamy go na nagłówek
 * najlepszej reklamy, dlatego stoi w jednym miejscu.
 */
export const H1 = "ICAROS Cloud do gabinetu i studia treningowego";

export const OPIS_POD_H1 =
  "W pakiecie jest platforma, iPad i aplikacja PRO bez abonamentu. Zamawiasz przez formularz i masz 30 dni na zwrot.";

export const VAT = 0.23;

export const CENY = {
  pakietNetto: 9844,
  pakietBrutto: 12108,
  /** Robocze, do potwierdzenia przez Sebastiana. */
  samCloudNetto: 5600,
  samCloudBrutto: 6888,
  montazNetto: 2000,
  montazZaKm: 2,
} as const;

export type Wariant = "pakiet" | "sam";

export const WARIANTY: Record<Wariant, { nazwa: string; opis: string; netto: number; brutto: number }> = {
  pakiet: {
    nazwa: "Pakiet ICAROS Cloud",
    opis: "Cloud, iPad i aplikacja PRO bez abonamentu",
    netto: CENY.pakietNetto,
    brutto: CENY.pakietBrutto,
  },
  sam: {
    nazwa: "Sam Cloud",
    opis: "Platforma z akcesoriami, bez iPada i aplikacji PRO",
    netto: CENY.samCloudNetto,
    brutto: CENY.samCloudBrutto,
  },
};

/** Kwota z twardą spacją między tysiącami: 9 844 zł. */
export function zl(kwota: number): string {
  const calosc = Math.round(kwota)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${calosc} zł`;
}

export const CTA = "Zamów pakiet";
export const CTA_DRUGIE = "Umów rozmowę";

/** Dane przypięte do rogów pierwszego ekranu. */
export const HERO_DANE = [
  { etykieta: "Zwrot", wartosc: "30 dni od dostawy" },
  { etykieta: "Dostawa", wartosc: "2 do 4 dni roboczych od wpłaty" },
] as const;

export const STEROWANIE = {
  naglowek: "Ruch ciała steruje grą",
  tekst:
    "Tablet leży w uchwycie na platformie, a jego czujniki odczytują każde wychylenie. Platforma nie potrzebuje kabla ani prądu, a obraz z tabletu można przenieść na telewizor.",
  podpowiedzMysz: "Przesuń kursor w lewo i w prawo",
  podpowiedzDotyk: "Przesuń palcem w lewo i w prawo",
  licznik: "Bramki",
} as const;

export const CWICZENIA = {
  naglowek: "148 ćwiczeń i ponad 70 treningów",
  tekst: "Na niestabilnym podłożu ćwiczy się core, równowagę, stabilizację i koordynację.",
  pozycje: [
    {
      nazwa: "Podpór przodem",
      src: "/cloud/cwiczenie-podpor.webp",
      alt: "Kobieta w podporze przodem na platformie ICAROS Cloud, dłonie w uchwytach, tablet w uchwycie przed nią",
      szer: 1600,
      wys: 1600,
    },
    {
      nazwa: "Klęk podparty",
      src: "/cloud/cwiczenie-kleczenie.webp",
      alt: "Kobieta w klęku podpartym na platformie ICAROS Cloud, wyprostowana ręka i przeciwna noga",
      szer: 1800,
      wys: 1344,
    },
    {
      nazwa: "Podpór bokiem",
      src: "/cloud/cwiczenie-bok.webp",
      alt: "Kobieta w podporze bokiem na platformie ICAROS Cloud, ręka i noga uniesione",
      szer: 1800,
      wys: 1344,
    },
    {
      nazwa: "Przysiad z taśmami",
      src: "/cloud/cwiczenie-tasmy.webp",
      alt: "Kobieta w przysiadzie na platformie ICAROS Cloud, ciągnie żółte taśmy oporowe",
      szer: 1600,
      wys: 1600,
    },
    {
      nazwa: "Unoszenie nóg w leżeniu",
      src: "/cloud/cwiczenie-lezenie.webp",
      alt: "Kobieta leży na plecach na platformie ICAROS Cloud z nogami uniesionymi w górę",
      szer: 1800,
      wys: 1344,
    },
    {
      nazwa: "Klęk z taśmami",
      src: "/cloud/cwiczenie-klek-tasmy.webp",
      alt: "Kobieta klęczy na platformie ICAROS Cloud i ciągnie w górę żółte taśmy oporowe",
      szer: 1800,
      wys: 1344,
    },
  ],
  przypis: "To sześć ze 148 ćwiczeń, które są w aplikacji.",
} as const;

export const GRY = {
  naglowek: "Gry i testy w aplikacji",
  tekst:
    "Pacjent albo klient widzi wynik i chce go poprawić na następnej sesji. W trybie rywalizacji może grać naraz do czterech osób. Playlisty układasz pod konkretną osobę, a postęp pokazujesz na raporcie PDF z testów równowagi i koordynacji.",
  lista: [
    { src: "/cloud/gra-ski-2.webp", nazwa: "XR Ski", alt: "Gra XR Ski: narciarz na trasie slalomu, obok kobieta na platformie Cloud" },
    { src: "/cloud/gra-space-2.webp", nazwa: "Space Battle", alt: "Gra Space Battle: statek kosmiczny, obok mężczyzna w klęku na platformie Cloud" },
    { src: "/cloud/gra-predator-2.webp", nazwa: "Predator & Prey", alt: "Gra Predator & Prey: gepard na sawannie, obok kobieta na platformie Cloud" },
    { src: "/cloud/gra-surf-2.webp", nazwa: "Surf", alt: "Gra z surfingiem: surfer na fali, obok kobieta na platformie Cloud" },
  ],
} as const;

export const SESJA = {
  naglowek: "Jak wygląda sesja",
  kroki: [
    {
      tytul: "Rozkładasz",
      tekst: "Platformę wystarczy napompować ręczną pompką z zestawu i włożyć tablet w uchwyt. Niczego nie trzeba skręcać ani podłączać do prądu.",
    },
    {
      tytul: "Wybierasz program",
      tekst: "W aplikacji wybierasz trening, grę albo playlistę ułożoną wcześniej dla tej osoby.",
    },
    {
      tytul: "Pacjent ćwiczy i widzi wynik",
      tekst: "Pacjent wychyleniami ciała steruje tym, co dzieje się na ekranie, a Ty poprawiasz ustawienie i widzisz wynik.",
    },
  ],
  film: {
    src: "/cloud/film-2.mp4",
    poster: "/cloud/film-poster.webp",
    dlugosc: "44 sekundy",
    przycisk: "Odtwórz film z treningu",
  },
} as const;

export const PAKIET = {
  naglowek: "Co jest w pakiecie",
  zdjecie: {
    src: "/cloud/zestaw.webp",
    alt: "Zestaw z góry: platforma ICAROS Cloud, dwie taśmy oporowe, uchwyt na tablet, wąż, pompka, dwa podnóżki i tablet",
  },
  lista: [
    "ICAROS Cloud z pompką, uchwytem na tablet, podnóżkami i taśmami oporowymi",
    "iPad z zainstalowaną aplikacją",
    "ICAROS App PRO bez abonamentu, dożywotnio: 5 urządzeń i 250 użytkowników",
    "Instrukcje i filmy po polsku",
    "Wsparcie telefoniczne",
  ],
  samCloud: "Sam Cloud, czyli platforma z akcesoriami bez iPada i aplikacji PRO",
  dodatkiNaglowek: "Do każdego zamówienia dokładamy",
  dodatki: [
    "Materiały do social mediów gabinetu: 5 grafik, 3 krótkie filmy i tekst do cennika",
    "Wpis na mapie placówek ICAROS w Polsce",
    "Gotowe programy w aplikacji na start",
    "30-minutową rozmowę wdrożeniową online",
  ],
} as const;

export const KALKULATOR = {
  naglowek: "Po ilu sesjach pakiet się zwraca",
  cenaSesji: { etykieta: "Cena jednej sesji", min: 30, max: 250, krok: 5, start: 70 },
  sesjeTydzien: { etykieta: "Sesji w tygodniu", min: 1, max: 40, krok: 1, start: 10 },
  uwaga:
    "Liczymy cenę pakietu podzieloną przez cenę sesji, bez kosztów pracy i lokalu. Gabinety zwolnione z VAT płacą kwotę brutto.",
} as const;

export const BADANIA = {
  naglowek: "Badania na ICAROS Cloud",
  wyniki: [
    {
      liczba: "81%",
      opis: "badanych wolało trening na Cloud od tych samych ćwiczeń bez platformy.",
      wykres: { typ: "osoby", wszystkich: 16, wyroznionych: 13, podpis: "13 z 16 osób" },
      instytucja: "Ruhr-Universität Bochum",
      szczegoly:
        "Plakat konferencyjny ECSS 2022. W badaniu 16 osób trenujących rekreacyjnie wykonało ten sam trening interwałowy na Cloud i bez niego, a obciążenie było podobne.",
    },
    {
      liczba: "+15,85%",
      opis: "dłuższy czas podporu po 5 tygodniach treningu u 9 nastolatek.",
      wykres: { typ: "slupki", przed: 100, po: 115.85, etykietaPrzed: "Przed", etykietaPo: "Po 5 tygodniach" },
      instytucja: "Uniwersytet w Salzburgu",
      szczegoly: "Badanie z 2021 roku. Czas podporu zmierzono u 9 nastolatek przed treningiem i po nim, bez grupy kontrolnej.",
    },
  ],
  wyroznienia: [
    { nazwa: "German Design Award", szczegol: "2021" },
    { nazwa: "Test androidmag.de", szczegol: "2024, ocena bardzo dobra, 82%" },
  ],
} as const;

export const DANE = {
  naglowek: "Dane techniczne",
  wymiary: { dlugosc: "155 cm", szerokosc: "123 cm", wysokosc: "40 cm" },
  tabela: [
    { etykieta: "Waga", wartosc: "12 kg" },
    { etykieta: "Miejsce do ćwiczeń", wartosc: "ok. 1,5 × 2,5 m" },
    { etykieta: "Maks. waga ćwiczącego", wartosc: "110 kg" },
    { etykieta: "Wzrost ćwiczącego", wartosc: "140 do 200 cm" },
    { etykieta: "Zasilanie", wartosc: "nie wymaga" },
    { etykieta: "Sterowanie", wartosc: "czujniki tabletu, Bluetooth" },
    { etykieta: "Obraz na telewizorze", wartosc: "Apple TV albo HDMI" },
    { etykieta: "Materiał", wartosc: "PVC 1 mm, wyściółka EVA 10 mm" },
    { etykieta: "Karton", wartosc: "60 × 80 × 33 cm" },
  ],
} as const;

export const WARUNKI = {
  naglowek: "Kupujesz bez ryzyka, bo masz",
  naglowekAkcent: "30 dni na zwrot",
  tekst:
    "Sprawdzasz Cloud u siebie, z własnymi pacjentami albo klientami. Jeśli nie pasuje do Twojej pracy, odsyłasz go i dostajesz pieniądze z powrotem.",
  kroki: [
    { kiedy: "Dzień 1", co: "Dostajesz zestaw i zaczynasz z nim pracować." },
    { kiedy: "Do dnia 30", co: "Jeśli Cloud Ci nie pasuje, zgłaszasz zwrot mailem." },
    { kiedy: "W 14 dni", co: "Odsyłasz zestaw, a my zwracamy pieniądze w 14 dni od jego otrzymania." },
  ],
  warunkiNaglowek: "Warunki zwrotu",
  warunki: [
    "Na odesłanie zestawu masz 14 dni od zgłoszenia.",
    "Zestaw wraca kompletny, bez przebić i uszkodzeń, z tabletem zresetowanym, w oryginalnym kartonie.",
    "Koszt odesłania jest po Twojej stronie.",
    "Montaż i szkolenie na miejscu, jeśli były zamówione, nie podlegają zwrotowi.",
  ],
  bloki: [
    {
      tytul: "Zamówienie i dostawa",
      punkty: [
        "Całość załatwiasz zdalnie: wypełniasz formularz, dostajesz proformę i płacisz przelewem.",
        "Zestaw wysyłamy z magazynu w Niemczech w 2 do 4 dni roboczych od wpłaty.",
      ],
    },
    {
      tytul: "Licencja aplikacji",
      punkty: [
        "Przez pierwsze 30 dni aplikacja działa w wersji testowej na Twój adres e-mail.",
        "Potem aktywujemy dożywotnią licencję PRO, za którą nie płacisz abonamentu.",
      ],
    },
    {
      tytul: "Montaż i szkolenie na miejscu",
      punkty: [`To płatna opcja: kosztuje ${zl(CENY.montazNetto)} netto i ${CENY.montazZaKm} zł za każdy kilometr dojazdu z Gliwic.`],
    },
  ],
} as const;

export const PYTANIA = {
  naglowek: "Pytania",
  lista: [
    {
      pytanie: "Czy Cloud to wyrób medyczny?",
      odpowiedz:
        "Nie. Cloud to sprzęt treningowy do ćwiczeń core, równowagi, stabilizacji i koordynacji. O tym, jak włączyć go w pracę z pacjentem, decydujesz Ty.",
    },
    {
      pytanie: "Co znaczy „dożywotnio” przy aplikacji PRO?",
      odpowiedz:
        "Za licencję płacisz raz, w cenie pakietu. Obejmuje 5 urządzeń i 250 użytkowników, a opłat miesięcznych ani rocznych nie ma.",
    },
    {
      pytanie: "Nie jestem płatnikiem VAT. Ile zapłacę?",
      odpowiedz: `Zapłacisz ${zl(CENY.pakietBrutto)} brutto. Obie kwoty, netto i brutto, są też na proformie.`,
    },
    {
      pytanie: "Ile miejsca potrzeba?",
      odpowiedz:
        "Platforma ma 155 × 123 cm. Producent podaje ok. 1,5 × 2,5 m wolnej podłogi. Do ćwiczeń z wyprostowanymi rękami i nogami wygodniej mieć 2,5 × 2,5 m.",
    },
    {
      pytanie: "Czy potrzebny jest internet?",
      odpowiedz:
        "Do treningu nie. Tablet łączy się przez Bluetooth, a platforma nie ma elektroniki. Internet jest potrzebny do aktualizacji aplikacji.",
    },
    {
      pytanie: "Gdzie trzymać Cloud po sesji?",
      odpowiedz:
        "Cloud waży 12 kg. Możesz go oprzeć o ścianę albo spuścić powietrze i schować do kartonu 60 × 80 × 33 cm.",
    },
    {
      pytanie: "Czy mogę najpierw przetestować?",
      odpowiedz:
        "Nie wysyłamy sprzętu na test. Zamiast tego masz 30 dni na zwrot od dnia dostawy, więc sprawdzasz Cloud u siebie, z własnymi pacjentami albo klientami.",
    },
    {
      pytanie: "Czy pacjenci za to zapłacą?",
      odpowiedz:
        "To zależy od Twojego cennika. Kalkulator wyżej pokazuje, po ilu sesjach pakiet się zwraca przy cenie, którą ustawisz.",
    },
  ],
} as const;

export const ZAMOWIENIE = {
  naglowek: "Zamówienie",
  lead: "Wypełniasz formularz, dzwonimy tego samego dnia roboczego, potwierdzamy dane i wysyłamy proformę. Jeśli masz pytania, najpierw zadzwoń albo umów rozmowę.",
  ileNaglowek: "Co i ile zamawiasz",
  pomocIlosc:
    "Licencja PRO z pakietu obejmuje 5 urządzeń, więc do kolejnych platform możesz dobrać sam Cloud i używać ich z własnymi tabletami. Przy większym zamówieniu zadzwoń, dobierzemy liczbę tabletów i licencji.",
  maksSztuk: 20,
  wstep: "Zamówienie nie jest płatnością.",
  zgoda:
    "Zgadzam się na kontakt telefoniczny i mailowy w sprawie tego zamówienia oraz na przetwarzanie moich danych w tym celu.",
  sukces:
    "Zamówienie przyjęte. Dzwonimy tego samego dnia roboczego, żeby potwierdzić dane do proformy.",
  rozmowaNaglowek: "Masz pytania przed zamówieniem",
  rozmowaTekst: "Zadzwoń albo wybierz termin. Rozmowa trwa 15 minut i dzwonimy my.",
} as const;

/**
 * Rzeczy, które stoją na stronie w wersji roboczej. Nie publikować przed
 * potwierdzeniem.
 */
export const DO_POTWIERDZENIA = [
  "Cena samego Cloud: 5 600 zł netto (Sebastian)",
  "Zakres licencji PRO: 5 urządzeń, 250 użytkowników, co przy zmianie wersji aplikacji (Sebastian, GmbH)",
  "Czy jedna licencja PRO z pakietu obsłuży kilka platform kupionych jako sam Cloud: tak wynika z „5 urządzeń”, ale to wniosek, nie potwierdzenie (GmbH)",
  "Czy historia z pierwszych 30 dni zostaje po aktywacji licencji (GmbH)",
  "Czas dostawy do Polski: 2 do 4 dni roboczych od wpłaty (Sebastian, GmbH)",
  "Maksymalna waga ćwiczącego: na stronie 110 kg, FAQ producenta podaje 150 kg (GmbH)",
  "Potrzebne miejsce: 1,5 × 2,5 m według producenta, 2,5 × 2,5 m według testów (GmbH)",
  "Warunki zwrotu w 30 dni (Sebastian, prawnik)",
  "Dodatki do zamówienia: materiały do social mediów, wpis na mapie, programy, rozmowa wdrożeniowa (Sebastian)",
  "Gwarancja i serwis przy przebiciu: na stronie nie ma o tym ani słowa (GmbH)",
  "Numer telefonu i zdjęcie Jarosława do sekcji zamówienia: teraz numer ogólny firmy",
  "Sekcja „Kto już używa”: czeka na zgody placówek i pierwszą prawdziwą opinię",
] as const;
