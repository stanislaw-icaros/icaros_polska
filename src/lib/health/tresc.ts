/**
 * Treść landingu /health.
 *
 * Źródła, w tej kolejności: katalog ICAROS 2026 (wersja polska), opracowanie
 * "ICAROS Studies" przeniesione do src/lib/studies.ts, icaros.com oraz
 * src/lib/products.ts. Film promocyjny jest tylko jednym z nich, nie kanwą
 * całej strony.
 *
 * Każda liczba ma przy sobie badanie i ośrodek. Nic tu nie jest szacunkiem,
 * i każda dotyczy Healtha: wyniki innych urządzeń ciągnęły rozmowę w stronę,
 * której ta strona nie prowadzi.
 *
 * Zasada projektu: bez em-dashy, cudzysłowy „ i ".
 */

/** Film na YouTube. Po zmianie linku wystarczy podmienić to ID. */
export const FILM_YOUTUBE_ID = "vBO9DDpyfFI";
export const FILM_TYTUL = "ICAROS Health w praktyce";
export const FILM_DLUGOSC = "1 minuta";

/** Krok sesji treningowej. `parametry` zmieniają się razem z krokiem. */
export type KrokSesji = {
  nazwa: string;
  opis: string;
  obraz: string;
  obrazAlt: string;
  /** Zamiast zdjęcia pokaż zbudowany na stronie widok aplikacji. */
  panel?: true;
  parametry: Array<{ etykieta: string; wartosc: string }>;
};

export const sesja: KrokSesji[] = [
  {
    nazwa: "Wejście",
    opis:
      "Podpórki i stopnie pozwalają zająć pozycję bez dźwigania pacjenta. Terapeuta ustawia urządzenie pod wzrost pacjenta i dobiera ćwiczenia do jego możliwości.",
    obraz: "/health/sesja-wejscie.webp",
    obrazAlt: "ICAROS Health bez pacjenta, ze stopniami wejściowymi, oświetlony na czarnym tle",
    parametry: [
      { etykieta: "Pozycja", wartosc: "Podpór na brzuchu" },
      { etykieta: "Wzrost", wartosc: "140 do 200 cm" },
      { etykieta: "Masa", wartosc: "do 130 kg" },
    ],
  },
  {
    nazwa: "Trening",
    opis:
      "Pacjent steruje lotem, przechylając ciało. Żeby skręcić w lewo, musi napiąć lewą stronę. Żeby utrzymać kurs, musi utrzymać podpór. Ćwiczenie jest takie samo jak w podporze bez sprzętu, tylko uwaga jest gdzie indziej.",
    obraz: "/health/sesja-trening.webp",
    obrazAlt: "Pacjentka na urządzeniu ICAROS Health, w tle alpejska dolina o świcie",
    parametry: [
      { etykieta: "Czas sesji", wartosc: "Od około 5 minut" },
      { etykieta: "Obraz", wartosc: "Gogle PICO 4 albo tablet" },
      { etykieta: "Sterowanie", wartosc: "Tułów, bez rąk" },
    ],
  },
  {
    nazwa: "Wynik",
    opis:
      "Czas, kalorie i wynik testu sprawności zapisują się w profilu pacjenta. Terapeuta i pacjent widzą postęp między wizytami, bez osobnego arkusza.",
    obraz: "/health/panel.webp",
    obrazAlt:
      "Aplikacja ICAROS: dzisiejsza sesja, ostatnie treningi, tygodniowy cel i wykres aktywności",
    panel: true,
    parametry: [
      { etykieta: "Zapisywane", wartosc: "Czas, kalorie, test" },
      { etykieta: "Widok", wartosc: "Sesja i historia" },
      { etykieta: "Gdzie", wartosc: "Profil w aplikacji" },
    ],
  },
];

/** Doświadczenie z katalogu aplikacji ICAROS. Nazwy własne jak na icaros.com. */
export type Doswiadczenie = {
  nazwa: string;
  miejsce: string;
  opis: string;
  obraz: string;
  obrazAlt: string;
};

export const doswiadczenia: Doswiadczenie[] = [
  {
    nazwa: "DOLOMITEN",
    miejsce: "Dolomity",
    opis:
      "Lot między wapiennymi turniami na podstawie map 3D Reality Maps. Teren jest prawdziwy, nie wymyślony.",
    obraz: "/health/vr-dolomity.webp",
    obrazAlt: "Lot nisko między skalnymi turniami Dolomitów o wschodzie słońca",
  },
  {
    nazwa: "ENGADIN",
    miejsce: "Engadyna, Szwajcaria",
    opis:
      "Dolina lodowcowa z turkusowym jeziorem i modrzewiami. Trasa spokojna, dobra na pierwsze sesje.",
    obraz: "/health/vr-engadyna.webp",
    obrazAlt: "Lot nad doliną Engadyny z turkusowym jeziorem i złotymi modrzewiami",
  },
  {
    nazwa: "BERCHTESGADEN",
    miejsce: "Park Narodowy Berchtesgaden",
    opis:
      "Przelot nad Königssee między pionowymi ścianami, z poranną mgłą na wodzie.",
    obraz: "/health/vr-berchtesgaden.webp",
    obrazAlt: "Lot nad jeziorem Königssee między stromymi ścianami skalnymi",
  },
  {
    nazwa: "EXPLORE",
    miejsce: "Manhattan, Rzym, Wenecja i wiele więcej",
    opis:
      "Zwiedzanie miast z lotu ptaka dzięki Google 3D Tiles. Zamiast liczyć powtórzenia, pacjent wybiera, dokąd leci. Tam, gdzie Google ma model 3D, da się domówić własną trasę, choćby nad okolicą placówki.",
    obraz: "/health/vr-manhattan.webp",
    obrazAlt: "Lot między wieżowcami Manhattanu w złotym świetle",
  },
  {
    nazwa: "FLIGHT",
    miejsce: "Lodowiec",
    opis:
      "Tryb zwiedzania, trasy z bramkami i wersja na punkty. Ten sam ruch, trzy poziomy trudności.",
    obraz: "/health/vr-flight.webp",
    obrazAlt: "Lot nad spękanym lodowcem alpejskim",
  },
  {
    nazwa: "DEEP",
    miejsce: "Ocean",
    opis:
      "Dla pacjentów, którym wysokość nie odpowiada. Zamiast lotu jest zanurzenie, mechanika sterowania ta sama.",
    obraz: "/health/vr-deep.webp",
    obrazAlt: "Podwodna scena z rekinem wielorybim w błękitnej toni",
  },
  {
    nazwa: "GRAVITY",
    miejsce: "Orbita",
    opis:
      "Swobodny spadek w stronę Ziemi, w dwóch trybach nastawionych na wysiłek.",
    obraz: "/health/vr-gravity.webp",
    obrazAlt: "Widok na Ziemię z krawędzi atmosfery podczas swobodnego spadku",
  },
];

/** Liczba z badania. `zrodlo` trafia na stronę, nie w komentarz. */
export type Wynik = { wartosc: string; opis: string; zrodlo: string };

/** Zaangażowanie i chęć kontynuowania terapii. */
export const zaangazowanie: Wynik[] = [
  {
    wartosc: "90%",
    opis: "uczestników chciało kontynuować trening po zakończeniu programu",
    zrodlo: "Uniwersytet w Salzburgu, 2021, ICAROS Cloud",
  },
  {
    wartosc: "8,11/10",
    opis: "współczynnik zaangażowania w trzytygodniowym programie",
    zrodlo: "Uniwersytet w Salzburgu, 2021, ICAROS Cloud",
  },
  {
    wartosc: "5,60/7",
    opis: "ocena przyjemności treningu w grupie 61 osób",
    zrodlo: "AWF im. Jerzego Kukuczki w Katowicach, 2019",
  },
  {
    wartosc: "50,8%",
    opis:
      "czasu sesji mieściło się w zakresie intensywności zalecanym dla korzyści zdrowotnych",
    zrodlo: "AWF im. Jerzego Kukuczki w Katowicach, 2019",
  },
];

/** Wyniki fizjologiczne dla samego ICAROS Health. */
export const badania: Wynik[] = [
  {
    wartosc: "2×",
    opis: "więcej pracy mięśni niż w planku na kolanach",
    zrodlo: "Politechnika w Monachium, 2017",
  },
  {
    wartosc: "+30%",
    opis: "wyższy wydatek kaloryczny niż przy klasycznym planku",
    zrodlo: "Politechnika w Monachium, 2017",
  },
  {
    wartosc: "+25,8%",
    opis: "poprawy funkcji mięśni po programie treningowym",
    zrodlo: "Niemiecki Uniwersytet Sportowy w Kolonii",
  },
];

/** Głosy, które nie pochodzą z filmu. */
export const glosy = {
  pacjentka: {
    cytat:
      "Przyjemność, jaką czerpię z treningów ICAROS, motywuje mnie, aby dawać z siebie wszystko za każdym razem.",
    autor: "Sandra",
    rola: "Pacjentka po udarze",
    zrodlo: "Katalog ICAROS 2026",
  },
  badaczka: {
    cytat:
      "Ciekawe jest obserwowanie skupienia i powagi, z jaką ludzie oddają się grze-treningowi.",
    autor: "Prof. dr Brixius",
    rola: "Niemiecki Uniwersytet Sportowy w Kolonii",
    zrodlo: "Wywiad, katalog ICAROS 2026",
  },
  lekarz: {
    cytat:
      "Od razu przekonał mnie element zabawy w waszych systemach, który rozpala ambicję zarówno uczestników badań, jak i pacjentów.",
    autor: "Prof. dr hab. Winkler",
    rola: "Neurochirurg",
    zrodlo: "Wywiad, katalog ICAROS 2026",
  },
};

/** Cztery urządzenia systemu ICAROS, od najmniejszego obciążenia. */
export const urzadzeniaSystemu = [
  {
    nazwa: "I.S.T. Board",
    slug: "ist-board",
    pozycja: "Na siedząco",
    opis: "Aktywacja stóp i nóg. Pacjent nie musi wstawać z krzesła ani z wózka.",
    obraz: "/health/urzadzenie-ist.webp",
    obrazAlt: "ICAROS I.S.T. Board: podnóżek z paskiem, chodzik z siedziskiem i ekran na szafce",
  },
  {
    nazwa: "ICAROS Health",
    slug: "health",
    pozycja: "W podporze",
    opis: "Mięśnie głębokie i tułów, z asekuracją. Faza wczesna, ortopedia i neurologia.",
    obraz: "/health/urzadzenie-health.webp",
    obrazAlt: "ICAROS Health, urządzenie do treningu w pozycji podpartej",
  },
  {
    nazwa: "ICAROS Guardian",
    slug: "guardian",
    pozycja: "W pionie, z poręczą",
    opis: "Kontrola postawy i równowaga przy pełnym zabezpieczeniu przed upadkiem.",
    obraz: "/health/urzadzenie-guardian.webp",
    obrazAlt: "ICAROS Guardian, trenażer równowagi z poręczą i ekranem",
  },
  {
    nazwa: "ICAROS Cloud",
    slug: "cloud",
    pozycja: "Swobodnie, na stojąco",
    opis: "Trening całego ciała po rehabilitacji. Najmniejsze urządzenie z całej czwórki.",
    obraz: "/health/urzadzenie-cloud.webp",
    obrazAlt: "ICAROS Cloud, okrągła platforma treningowa",
  },
];

export const pytania = [
  {
    pytanie: "Czy trzeba zakładać gogle?",
    odpowiedz:
      "Nie. Trening można prowadzić, patrząc na tablet. Gogle PICO 4 dają pełne zanurzenie, ale nie są warunkiem ćwiczeń.",
  },
  {
    pytanie: "Czy poradzi sobie osoba z niedowładem?",
    odpowiedz:
      "Tak. Pacjent leży w podporze, ma podpórki i asekurację, a czułość sterowania terapeuta ustawia tak, żeby wystarczył minimalny ruch tułowia.",
  },
  {
    pytanie: "Ile trwa sesja?",
    odpowiedz:
      "Zwykle zaczyna się od około pięciu minut i wydłuża wraz z postępami. Czas, kalorie i wynik testu zapisują się w profilu pacjenta.",
  },
  {
    pytanie: "Ilu pacjentów obsłuży jedno urządzenie?",
    odpowiedz:
      "Sesja na jednym urządzeniu trwa zwykle od 5 do 15 minut, a nadzór jest minimalny, więc przy pełnym grafiku na jedno stanowisko przypada kilkunastu pacjentów dziennie.",
  },
  {
    pytanie: "Czy pacjenci nie mają choroby symulatorowej?",
    odpowiedz:
      "Ruch w goglach odpowiada ruchowi ciała, co ogranicza konflikt bodźców. Dla osób wrażliwych na wysokość w katalogu jest DEEP, czyli zanurzenie zamiast lotu, oraz tryb na tablecie.",
  },
  {
    pytanie: "Dla kogo to nie jest?",
    odpowiedz:
      "Dla pacjentów, którzy nie utrzymają pozycji podpartej nawet z asekuracją, i przy przeciwwskazaniach do wysiłku w pozycji na brzuchu. To ustala terapeuta przed pierwszą sesją.",
  },
];

/**
 * Ujęcia urządzenia w sekcji „Budowa". Pięć kadrów wygenerowanych z rendera
 * producenta, z tym samym ustawieniem światła, plus opis elementu, który
 * w danym kadrze widać najlepiej. Scroll przesuwa się między nimi.
 *
 * Nazwy części są propozycją odczytaną z rendera i z katalogu. Przed publikacją
 * potwierdza je ICAROS.
 */
export type UjecieBudowy = {
  nazwa: string;
  opis: string;
  obraz: string;
  obrazAlt: string;
  /**
   * Gdzie na tym kadrze leży opisywany element, w procentach szerokości
   * i wysokości zdjęcia. Reszta kadru jest przygaszana, więc te współrzędne
   * decydują o tym, co widać.
   */
  ognisko: { x: number; y: number; rx: number; ry: number };
};

export const budowa: UjecieBudowy[] = [
  {
    nazwa: "Podparcie tułowia i nóg",
    opis:
      "Ciężar ciała spoczywa na miękkich podporach pod klatką piersiową, biodrami i nogami. Barki, nadgarstki i stawy kolanowe zostają odciążone, dlatego w tej pozycji ćwiczą też osoby, które nie utrzymają się na przedramionach.",
    obraz: "/health/kat-1.webp",
    ognisko: { x: 45, y: 31, rx: 21, ry: 27 },
    obrazAlt: "ICAROS Health z boku, widoczne podparcia tułowia i nóg",
  },
  {
    nazwa: "Pierścień przechyłu",
    opis:
      "Łuk, na którym platforma przechyla się na boki i w przód. To z tego ruchu powstaje sterowanie: pacjent zmienia kurs, napinając jedną stronę tułowia.",
    obraz: "/health/kat-2.webp",
    ognisko: { x: 40, y: 50, rx: 19, ry: 26 },
    obrazAlt: "ICAROS Health w ujęciu pokazującym łuk przechyłu",
  },
  {
    nazwa: "Uchwyty",
    opis:
      "Pacjent trzyma je przez całą sesję. Dają punkt odniesienia dla rąk i miejsce na kontroler, ale nie przenoszą ciężaru ciała.",
    obraz: "/health/kat-3.webp",
    ognisko: { x: 63, y: 17, rx: 18, ry: 21 },
    obrazAlt: "ICAROS Health w ujęciu pokazującym uchwyty",
  },
  {
    nazwa: "Stopnie wejściowe",
    opis:
      "Ułatwienia przy wchodzeniu, dzięki którym pacjent zajmuje pozycję samodzielnie albo z lekką asekuracją, bez dźwigania przez personel.",
    obraz: "/health/kat-4.webp",
    ognisko: { x: 33, y: 64, rx: 16, ry: 21 },
    obrazAlt: "ICAROS Health w ujęciu pokazującym stopnie wejściowe",
  },
  {
    nazwa: "Uchwyt na tablet",
    opis:
      "Ekran dla pacjenta, który ćwiczy bez gogli, i podgląd sesji dla terapeuty stojącego obok urządzenia.",
    obraz: "/health/kat-5.webp",
    ognisko: { x: 50, y: 17, rx: 14, ry: 19 },
    obrazAlt: "ICAROS Health od frontu, widoczny uchwyt na tablet",
  },
];

/**
 * Czym różni się trening stabilności na urządzeniu od tego samego ćwiczenia
 * bez sprzętu. Punktem odniesienia jest podpór na przedramionach, bo to
 * standardowe ćwiczenie stabilności tułowia, a nie „mata" jako sprzęt.
 */
export const porownanie = [
  {
    cecha: "Pozycja",
    bez: "Podpór na przedramionach, bez asekuracji",
    icaros: "Podpór na urządzeniu, z podpórkami i asekuracją",
  },
  {
    cecha: "Obciążenie stawów",
    bez: "Barki i nadgarstki przenoszą ciężar ciała",
    icaros: "Ciężar spoczywa na podporze, barki odciążone",
  },
  {
    cecha: "Praca mięśni",
    bez: "Tyle, ile w planku na kolanach",
    icaros: "Dwa razy tyle",
    zrodlo: "Politechnika w Monachium, 2017",
  },
  {
    cecha: "Wydatek energetyczny",
    bez: "Tyle, ile w klasycznym planku",
    icaros: "O 30 procent więcej",
    zrodlo: "Politechnika w Monachium, 2017",
  },
  {
    cecha: "Dobór trudności",
    bez: "Na oko, w trakcie ćwiczenia",
    icaros: "Czułość sterowania ustawia terapeuta przed sesją",
  },
  {
    cecha: "Na czym skupia się pacjent",
    bez: "Na odliczaniu sekund",
    icaros: "Na trasie i wyniku",
  },
  {
    cecha: "Powroty na kolejne sesje",
    bez: "Zależą od motywacji pacjenta",
    icaros: "90 procent uczestników chciało kontynuować trening",
    zrodlo: "Uniwersytet w Salzburgu, 2021, ICAROS Cloud",
  },
  {
    cecha: "Pomiar postępu",
    bez: "Obserwacja terapeuty",
    icaros: "Czas, kalorie i test sprawności w profilu pacjenta",
  },
];

