/**
 * Dane produktów ICAROS - wspólne źródło dla stron pacjenta (/produkty/[slug])
 * i biznesu (/urzadzenia/[slug]). Treść na podstawie icaros.com i katalogu
 * produktowego ICAROS 2026 (public/ICAROS-katalog-produktowy-2026.pdf).
 *
 * Zasada: bez em-dashy (—). Stosujemy zwykły dywiz "-" lub przebudowane zdanie.
 *
 * Kolejność tablicy = kolejność w menu "Urządzenia" i na listingach.
 *
 * Pola `space`, `technical` i `included` (przestrzeń, wymagania, zawartość
 * dostawy) pokazujemy TYLKO w wersji biznes. Wymiary i masa z `specs`
 * pochodzą z katalogu 2026 i są widoczne w obu wersjach.
 */
export type ProductVideo = {
  /** ID filmu z YouTube - fragment po watch?v= (kanał ICAROS POLSKA). */
  id: string;
  /** Tytuł filmu pokazywany na miniaturze. */
  title: string;
  /** Podpis używany, gdy przy produkcie jest kilka filmów (np. Circle). */
  caption?: string;
  /**
   * Własna miniatura z /public. Ustawiamy ją tam, gdzie automatyczna klatka
   * z YouTube wypada słabo (I.S.T. Board, Cloud). Bez tego pola bierzemy
   * miniaturę z YouTube.
   */
  poster?: string;
  posterAlt?: string;
};

/** Zdjęcie do galerii urządzenia. */
export type ProductPhoto = { src: string; alt: string };

/** Dane fizyczne urządzenia z katalogu ICAROS 2026 (strona 37). */
export type ProductSpecs = {
  dimensions: string;
  weight: string;
  userHeight: string;
  userWeight: string;
  compatibility: string;
};

/** Wynik badania podany liczbą - buduje wiarygodność szybciej niż zdanie. */
export type ProductEvidence = { value: string; label: string; source: string };

/** Oprogramowanie i tryby treningowe dostępne na urządzeniu. */
export type ProductSoftware = { name: string; description: string };

/** Krok sesji treningowej - jak to wygląda w praktyce. */
export type ProductStep = { title: string; description: string };

export type ProductFaq = { question: string; answer: string };

export type IcarosProduct = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  shortDesc: string;
  longDesc: string[];
  /** Obszary treningu z katalogu (np. kontrola postawy) - pokazywane jako badge. */
  focusAreas: string[];
  /** Konkretne korzyści dla pacjenta. */
  outcomes: string[];
  features: string[];
  applications: string[];
  targetGroups: string[];
  /** Tylko niektóre urządzenia (np. Guardian) - zawartość zestawu. */
  included?: string[];
  /** Opcjonalna wypowiedź pacjenta lub eksperta (z katalogu ICAROS). */
  testimonial?: { quote: string; author: string; role: string };
  /**
   * Filmy prezentujące urządzenie (polskie wersje z kanału ICAROS POLSKA).
   * Jeden film pokazujemy dużym kadrem, kilka - w siatce (tak ma Circle,
   * który łączy trzy urządzenia i nie ma własnego filmu).
   */
  videos?: ProductVideo[];
  /** Dodatkowe zdjęcia urządzenia poza głównym kadrem. */
  gallery?: ProductPhoto[];
  /** Liczby z badań klinicznych dotyczące tego urządzenia. */
  evidence?: ProductEvidence[];
  /** Aplikacja, gry i tryby VR dostępne na urządzeniu. */
  software?: ProductSoftware[];
  /** Jak wygląda pojedyncza sesja. */
  sessionSteps?: ProductStep[];
  /** Nagrody wzornicze i branżowe. */
  awards?: string[];
  /** Cytat z mediów o urządzeniu. */
  press?: { outlet: string; quote: string };
  /** Pytania i odpowiedzi dotyczące tego konkretnego urządzenia. */
  faqs?: ProductFaq[];
  /** Wymiary, masa i wymagania wobec użytkownika (katalog 2026). */
  specs: ProductSpecs;
  /** Zalecana powierzchnia montażu - pokazywane w wersji biznes. */
  space: string;
  /** Wymagania techniczne - pokazywane w wersji biznes. */
  technical: string;
  image: string;
  imageAlt: string;
};

/** Aplikacja ICAROS jest wspólna dla wszystkich urządzeń. */
const ICAROS_APP: ProductSoftware = {
  name: "Aplikacja ICAROS",
  description:
    "Wspólna aplikacja na iOS i Androida. Zawiera exergames (m.in. Biathlon, XRSki, Brainboxing, Predator & Prey), gotowe playlisty oraz testy koordynacji, równowagi i stabilności, dzięki którym postępy są mierzalne. Terapeuta może tworzyć własne zestawy ćwiczeń.",
};

export const products: IcarosProduct[] = [
  {
    slug: "circle",
    name: "ICAROS Circle",
    shortName: "Circle",
    category: "Kompletny system",
    tagline: "Kompletny obieg rehabilitacji w jednym systemie.",
    shortDesc:
      "Zestaw łączący ICAROS Health, Guardian i Cloud - pełna rehabilitacja na każdym etapie, od treningu w podporze po trening całego ciała.",
    longDesc: [
      "ICAROS Circle to kompleksowy i wysokiej jakości system terapii i treningu, który elastycznie dopasowuje się do potrzeb pacjentów i podopiecznych. Łączy ICAROS Health, ICAROS Guardian i ICAROS Cloud w jeden spójny obieg rehabilitacyjny.",
      "Prowadzi pacjenta przez kolejne etapy: od treningu mięśni głębokich w podporze, przez dynamiczne ćwiczenia równowagi w pozycji pionowej, po trening całego ciała w fazie po rehabilitacji.",
      "To rozwiązanie dla placówek, które chcą oferować nowoczesną terapię w pełnym zakresie, z jedną aplikacją do obsługi wszystkich urządzeń.",
    ],
    focusAreas: ["Kontrola poznawczo-ruchowa", "Wydolność krążeniowo-oddechowa", "Kontrola postawy"],
    outcomes: [
      "Pełny obieg terapii w jednym systemie",
      "Trening na każdym etapie rehabilitacji",
      "Jedna aplikacja do wszystkich urządzeń",
      "Elastyczne dopasowanie do pacjenta",
    ],
    features: [
      "Kompletny zestaw treningowy ICAROS",
      "Jedna aplikacja do wszystkich urządzeń",
      "Intuicyjna obsługa",
    ],
    applications: [
      "Trening stabilności i równowagi",
      "Koordynacja i terapia krążeniowo-oddechowa",
      "Rehabilitacja na każdym etapie",
    ],
    targetGroups: [
      "Ośrodki rehabilitacji neurologicznej i ortopedycznej",
      "Medical fitness",
    ],
    included: [
      "ICAROS Health",
      "ICAROS Guardian",
      "ICAROS Cloud",
      "ICAROS I.S.T. Board",
      "Wyposażenie techniczne i dostęp do aplikacji",
    ],
    testimonial: {
      quote:
        "ICAROS oferuje wyjątkowo skuteczny sprzęt do poprawy stabilności, koordynacji i równowagi.",
      author: "Domenico Gurzi",
      role: "Kierownik Działu Biomechaniki, IBS Health",
    },
    videos: [
      { id: "tM6JjLU_veQ", title: "ICAROS Health", caption: "Trening wspomagany" },
      { id: "B8WvQh_rFGk", title: "ICAROS Guardian", caption: "Trening równowagi" },
      {
        id: "TCrm7hsQ-Yw",
        title: "ICAROS Cloud",
        caption: "Trening całego ciała",
        poster: "/Icaros-24_0428.webp",
        posterAlt: "Sportsmenka trenująca na platformie ICAROS Cloud",
      },
    ],
    gallery: [
      {
        src: "/Circle_Raw_photo_display.webp",
        alt: "Trzy urządzenia ICAROS Circle: Health, Cloud i Guardian obok siebie",
      },
      {
        src: "/ICAROS-17_0051.webp",
        alt: "Pacjent podczas sesji terapeutycznej ICAROS w wirtualnej rzeczywistości",
      },
      {
        src: "/Icaros-24_0428.webp",
        alt: "Sportsmenka trenująca na platformie ICAROS Cloud",
      },
    ],
    evidence: [
      {
        value: "2x",
        label: "silniejsza stymulacja mięśni niż klasyczny plank (ICAROS Health)",
        source: "Politechnika w Monachium",
      },
      {
        value: "+15,85%",
        label: "wzrost siły mięśni głębokich (ICAROS Cloud)",
        source: "Uniwersytet w Salzburgu",
      },
      {
        value: "6 tyg.",
        label: "do istotnej poprawy siły nóg i prędkości chodu (ICAROS Guardian)",
        source: "Niemiecki Uniwersytet Sportowy w Kolonii",
      },
    ],
    software: [ICAROS_APP],
    sessionSteps: [
      {
        title: "Faza wczesna: ICAROS Health",
        description:
          "Pacjent ćwiczy w pozycji podpartej, z asekuracją i podpórkami. Trening skupia się na mięśniach głębokich i kontroli tułowia.",
      },
      {
        title: "Faza pionizacji: ICAROS Guardian",
        description:
          "Trening równowagi na stojąco, z barierkami i pełnym podparciem. Ruchy ciała sterują grą wyświetlaną na ekranie.",
      },
      {
        title: "Faza po rehabilitacji: ICAROS Cloud",
        description:
          "Swobodny trening całego ciała na niestabilnej platformie. Wzmacnia core, nogi i górę ciała, także w formie zajęć grupowych.",
      },
    ],
    awards: [
      "German Design Award 2024 (Guardian)",
      "FIBO Innovation & Trend Award 2023 (Guardian)",
      "German Design Award 2021 (Cloud)",
    ],
    faqs: [
      {
        question: "Czy trzeba kupić wszystkie urządzenia naraz?",
        answer:
          "Nie. Circle to komplet, ale możesz zacząć od jednego urządzenia i rozbudowywać system później. Aplikacja i konta użytkowników pozostają te same.",
      },
      {
        question: "Czy każde urządzenie wymaga osobnej obsługi?",
        answer:
          "Nie. Wszystkie urządzenia obsługuje jedna aplikacja ICAROS, z jednym profilem użytkownika i wspólną historią treningów.",
      },
    ],
    specs: {
      dimensions: "Zestaw wymaga około 650 × 250 cm powierzchni",
      weight: "Około 200 kg (suma urządzeń)",
      userHeight: "140 cm do 200 cm",
      userWeight: "do 130 kg",
      compatibility: "Gogle VR PICO 4, urządzenia mobilne, aplikacja ICAROS",
    },
    space:
      "Powierzchnia dla pełnego zestawu ustalana indywidualnie, w zależności od liczby urządzeń. Katalogowo około 650 × 250 cm.",
    technical:
      "Standardowe gniazdko 230 V. Dostęp do internetu przez Wi-Fi. Jedna aplikacja ICAROS do wszystkich urządzeń.",
    image: "/Full_Icaros_Circle_Display.webp",
    imageAlt: "ICAROS Circle - kompletny zestaw urządzeń Health, Guardian i Cloud",
  },
  {
    slug: "health",
    name: "ICAROS Health",
    shortName: "Health",
    category: "Rehabilitacja",
    tagline: "Rehabilitacja na nowym poziomie.",
    shortDesc:
      "Trening stabilności tułowia i równowagi dla ortopedii i neurologii. Certyfikowany wyrób medyczny klasy I.",
    longDesc: [
      "Stabilność tułowia i równowaga to podstawa terapii, zarówno w ortopedii, jak i w neurologii. ICAROS Health to certyfikowany wyrób medyczny klasy I, wykonany w Niemczech, z podpórkami i ułatwieniami przy wchodzeniu do codziennej pracy z pacjentem.",
      "Urządzenie jest zaprojektowane do profesjonalnego użytku w terapii i wspiera osoby z ograniczeniami ruchowymi. Dzięki indywidualnym ustawieniom i prostej obsłudze trening da się dopasować do każdego pacjenta.",
      "Sprawdza się w fizjoterapii, terapii zajęciowej i ćwiczeniach leczniczych. Pozwala wzmacniać mięśnie głębokie i tułowia, trenować równowagę i koordynację oraz prowadzić trening poznawczo-ruchowy z grami, a także wspierać rehabilitację przy dolegliwościach kręgosłupa i schorzeniach neurologicznych.",
    ],
    focusAreas: ["Kontrola poznawczo-ruchowa", "Zdrowe plecy", "Kontrola postawy"],
    outcomes: [
      "Wzmacnia mięśnie głębokie i tułowia",
      "Poprawia równowagę i koordynację",
      "Wspiera powrót do sprawności po urazach kręgosłupa",
      "Trening dopasowany do możliwości pacjenta",
    ],
    features: [
      "Wyrób medyczny klasy I",
      "Podpórki i ułatwienia przy wchodzeniu",
      "Jakość wykonania z Niemiec",
      "Możliwość rozbudowy o cyfrowe gry treningowe",
    ],
    applications: ["Trening mięśni głębokich", "Równowaga", "Koordynacja", "Terapia"],
    targetGroups: [
      "Ośrodki rehabilitacji neurologicznej i ortopedycznej",
      "Medical fitness",
      "Hotele",
    ],
    included: [
      "Urządzenie ICAROS Health",
      "Kontroler",
      "Uchwyt na tablet",
      "Gogle VR i doświadczenie VR",
      "Dostęp do aplikacji ICAROS",
    ],
    testimonial: {
      quote:
        "Radość, jaką daje mi trening ICAROS, motywuje mnie, żeby za każdym razem dawać z siebie wszystko.",
      author: "Sandra",
      role: "Pacjentka po udarze",
    },
    videos: [{ id: "tM6JjLU_veQ", title: "ICAROS Health" }],
    gallery: [
      {
        src: "/Health25_Tooltip.webp",
        alt: "ICAROS Health - widok całego urządzenia z podpórkami i uchwytem na tablet",
      },
      {
        src: "/editedSphinx.webp",
        alt: "Kobieta w pozycji podpartej na ICAROS Health podczas treningu mięśni głębokich",
      },
      {
        src: "/icaros_health_w_uzyciu.webp",
        alt: "Pacjent podczas treningu stabilizacji tułowia na ICAROS Health",
      },
      {
        src: "/Icaros-24_0552.webp",
        alt: "Trening mięśni głębokich odciążający kręgosłup na urządzeniu ICAROS",
      },
    ],
    evidence: [
      {
        value: "2x",
        label: "silniejsza stymulacja mięśni niż klasyczny plank w klęku",
        source: "Politechnika w Monachium",
      },
      {
        value: "+30%",
        label: "wyższy wydatek kaloryczny niż przy klasycznym planku",
        source: "Politechnika w Monachium",
      },
      {
        value: "+25,8%",
        label: "poprawa funkcji mięśni po programie treningowym",
        source: "Niemiecki Uniwersytet Sportowy w Kolonii",
      },
    ],
    software: [
      ICAROS_APP,
      {
        name: "N.E.X.T",
        description:
          "Program dla osób po urazach i chorobach neurologicznych. Algorytm dobiera poziom trudności do bieżących wyników, a trening skupia się na symetrycznej równowadze i koordynacji, żeby pobudzać niedowładne części ciała. Powstał przy udziale terapeutów i pacjentów.",
      },
      {
        name: "Real Landscape",
        description:
          "Loty nad prawdziwymi krajobrazami Alp (Engadyna, Berchtesgaden, Dolomity) na podstawie map 3D Reality Maps. Tryby: wingsuit, swobodny lot, lot orła oraz odkrywanie z ciekawostkami geograficznymi.",
      },
      {
        name: "ICAROS EXPLORE",
        description:
          "Lot nad Manhattanem, Rzymem, Wenecją, Barceloną czy Monachium dzięki technologii Google 3D Tiles. Zamiast liczyć powtórzenia, pacjent zwiedza świat.",
      },
    ],
    sessionSteps: [
      {
        title: "Wejście i ustawienie",
        description:
          "Podpórki i stopnie ułatwiają zajęcie pozycji. Terapeuta ustawia urządzenie pod wzrost i możliwości pacjenta.",
      },
      {
        title: "Kalibracja w aplikacji",
        description:
          "Aplikacja rozpoznaje zakres ruchu i dobiera czułość sterowania, więc nawet niewielki ruch tułowia wystarcza do gry.",
      },
      {
        title: "Trening w formie gry",
        description:
          "Pacjent steruje lotem, przechylając tułów. Sesje zaczynają się zwykle od około 5 minut i wydłużają wraz z postępami.",
      },
      {
        title: "Podsumowanie wyników",
        description:
          "Czas, spalone kalorie i wynik testu zapisują się w profilu, dzięki czemu widać progres między sesjami.",
      },
    ],
    press: {
      outlet: "The Sunday Times",
      quote: "Czy latająca maszyna może pomóc ci znów chodzić?",
    },
    faqs: [
      {
        question: "Czy trzeba zakładać gogle VR?",
        answer:
          "Nie. Trening można prowadzić patrząc na ekran tabletu. Gogle PICO 4 dają pełne zanurzenie, ale nie są warunkiem ćwiczeń.",
      },
      {
        question: "Czy poradzi sobie osoba z niedowładem?",
        answer:
          "Tak. Urządzenie powstało z myślą o osobach z ograniczeniami ruchowymi: pacjent leży w podporze, ma podpórki i asekurację, a czułość sterowania da się ustawić tak, żeby wystarczył minimalny ruch.",
      },
      {
        question: "Czy to wyrób medyczny?",
        answer:
          "Tak. ICAROS Health jest certyfikowanym wyrobem medycznym klasy I, wyprodukowanym w Niemczech.",
      },
    ],
    specs: {
      dimensions: "203 × 85 × 104 cm",
      weight: "124 kg",
      userHeight: "140 cm do 200 cm",
      userWeight: "do 130 kg",
      compatibility: "Gogle VR PICO 4, urządzenia mobilne, aplikacja ICAROS",
    },
    space: "Zalecana powierzchnia montażu: co najmniej 1,50 m × 2,50 m.",
    technical: "Standardowe gniazdko 230 V. Dostęp do internetu przez Wi-Fi.",
    image: "/Icaros-24_0544.webp",
    imageAlt:
      "Terapeutka asystująca pacjentce podczas sesji na ICAROS Health z goglami VR",
  },
  {
    slug: "guardian",
    name: "ICAROS Guardian",
    shortName: "Guardian",
    category: "Trening stabilności",
    tagline: "Trening równowagi bez kompromisów.",
    shortDesc:
      "Bezpieczny trening stabilności i równowagi z grami i cyfrową oceną postępów. Minimalny nadzór.",
    longDesc: [
      "ICAROS Guardian łączy pełną stabilność z angażującym treningiem w formie gry i cyfrowym śledzeniem postępów. To bezpieczny trening równowagi dla placówek o wysokich wymaganiach bezpieczeństwa.",
      "Pacjent ćwiczy bezpiecznie i od razu widzi efekty, a personel prowadzi zajęcia przy minimalnym nadzorze. Urządzenie sprawdza się w klinikach, rehabilitacji, domach seniora i medical fitness.",
      "Trening obejmuje kontrolę poznawczo-ruchową, wydolność krążeniowo-oddechową i kontrolę postawy, a także koordynację i stabilizację.",
    ],
    focusAreas: ["Kontrola poznawczo-ruchowa", "Wydolność krążeniowo-oddechowa", "Kontrola postawy"],
    outcomes: [
      "Bezpieczny trening równowagi z podparciem",
      "Pomaga zmniejszyć ryzyko upadków",
      "Postępy widoczne od razu na ekranie",
      "Dla seniorów i pacjentów po udarze",
    ],
    features: ["Niski nakład nadzoru", "Plug and play", "Nacisk na bezpieczeństwo"],
    applications: ["Trening stabilności i równowagi", "Koordynacja", "Terapia"],
    targetGroups: [
      "Rehabilitacja neurologiczna i ortopedyczna",
      "Domy seniora",
      "Medical fitness",
    ],
    included: [
      "Urządzenie ICAROS Guardian",
      "System ICAROS Cloud360",
      "iPad do sterowania aplikacją",
      "Apple TV i ekran 32 cale do zajęć grupowych",
      "Magic Trackpad",
      "Dostęp do aplikacji ICAROS",
    ],
    testimonial: {
      quote: "Dzięki treningowi z ICAROS stałem się szybszy i silniejszy.",
      author: "Walter",
      role: "Pacjent po udarze",
    },
    videos: [{ id: "B8WvQh_rFGk", title: "ICAROS Guardian" }],
    gallery: [
      {
        src: "/ICAROS_Guardian_neu_Tooltips.webp",
        alt: "ICAROS Guardian - platforma z barierkami, ekranem i tabletem sterującym",
      },
      {
        src: "/senior_3.webp",
        alt: "Senior ćwiczący na ICAROS Guardian w domowym salonie",
      },
      {
        src: "/senior_6.webp",
        alt: "Dwie seniorki ćwiczące wspólnie na ICAROS Guardian",
      },
      {
        src: "/0.webp",
        alt: "ICAROS Guardian w ekskluzywnym wnętrzu z widokiem na jezioro",
      },
    ],
    evidence: [
      {
        value: "6 tyg.",
        label: "do istotnego wzrostu siły nóg, mobilności i prędkości chodu u seniorów",
        source: "Niemiecki Uniwersytet Sportowy w Kolonii",
      },
      {
        value: "MoCA",
        label: "poprawa wyników testu funkcji poznawczych po programie treningowym",
        source: "Niemiecki Uniwersytet Sportowy w Kolonii",
      },
      {
        value: "TUG",
        label: "istotna poprawa testu Timed Up and Go u pacjentów po udarze",
        source: "Niemiecki Uniwersytet Sportowy w Kolonii",
      },
    ],
    software: [ICAROS_APP],
    sessionSteps: [
      {
        title: "Wejście na platformę",
        description:
          "Barierki z trzech stron i niski stopień sprawiają, że wejście jest bezpieczne także dla osób z lękiem przed upadkiem.",
      },
      {
        title: "Wybór gry i poziomu",
        description:
          "Terapeuta wybiera ćwiczenie na iPadzie. Obraz idzie na duży ekran, więc w zajęciach grupowych wszyscy widzą przebieg.",
      },
      {
        title: "Trening w pozycji stojącej",
        description:
          "Pacjent przenosi ciężar ciała, sterując grą. Dłonie przez cały czas mogą pozostać na barierkach.",
      },
      {
        title: "Test i porównanie",
        description:
          "Wbudowane testy stabilności pokazują wynik liczbowo, więc łatwo porównać sesje z kolejnych tygodni.",
      },
    ],
    awards: ["German Design Award 2024", "FIBO Innovation & Trend Award 2023"],
    faqs: [
      {
        question: "Czy można spaść z platformy?",
        answer:
          "Konstrukcja jest zamknięta barierkami, a ruch platformy jest ograniczony. Pacjent przez cały trening trzyma się poręczy, dlatego urządzenie sprawdza się także u osób z wysokim ryzykiem upadku.",
      },
      {
        question: "Czy nadaje się do zajęć grupowych?",
        answer:
          "Tak. Obraz z aplikacji trafia na ekran 32 cale przez Apple TV, więc grupa może obserwować i kibicować ćwiczącemu.",
      },
      {
        question: "Ile trwa jedna sesja?",
        answer:
          "Zwykle od 5 do 15 minut. Dobrą praktyką jest zaczynanie od krótkich sesji i wydłużanie ich wraz z postępami.",
      },
    ],
    specs: {
      dimensions: "160 × 112 × 162 do 176 cm",
      weight: "70 kg",
      userHeight: "140 cm do 200 cm",
      userWeight: "do 130 kg",
      compatibility: "Apple iPad, Apple TV, monitor, Magic Trackpad, aplikacja ICAROS",
    },
    space: "Zalecana powierzchnia montażu: co najmniej 1,50 m × 2,50 m.",
    technical: "Standardowe gniazdko 230 V. Dostęp do internetu przez Wi-Fi.",
    image: "/senior_2.webp",
    imageAlt: "Senior ćwiczący na ICAROS Guardian z interaktywną grą na ekranie",
  },
  {
    slug: "cloud",
    name: "ICAROS Cloud",
    shortName: "Cloud",
    category: "Trening całego ciała",
    tagline: "Fitness i gra, cyfrowo i wszechstronnie.",
    shortDesc:
      "Skuteczny trening całego ciała, sterowany smartfonem lub tabletem. Do domu, studia i siłowni.",
    longDesc: [
      "ICAROS Cloud pozwala skutecznie i w angażujący sposób trenować całe ciało, w domu, w butikowym studiu albo na zajęciach grupowych na siłowni.",
      "Ćwiczenia na niestabilnym podłożu wzmacniają mięśnie tułowia, nóg i górnej części ciała oraz poprawiają koordynację i równowagę. Urządzeniem sterujesz ruchami ciała, a cyfrowy interfejs obsługujesz smartfonem lub tabletem.",
      "Jest lekki, zajmuje mało miejsca i łatwo ustawić go w różnych miejscach. To wygodne rozwiązanie dla klubów fitness, dzieci, dorosłych i zawodowych sportowców.",
    ],
    focusAreas: ["Kontrola poznawczo-ruchowa", "Wydolność krążeniowo-oddechowa", "Kontrola postawy"],
    outcomes: [
      "Wzmacnia całe ciało: core, nogi i górę ciała",
      "Poprawia koordynację i równowagę",
      "Kompaktowy, ćwiczysz niemal wszędzie",
      "Angażująca, grywalizowana forma treningu",
    ],
    features: ["Lekki", "Mała powierzchnia", "Elastyczne zastosowanie", "Mikrosiłownia"],
    applications: ["Trening fitness", "Zajęcia grupowe", "Równowaga i stabilizacja"],
    targetGroups: ["Kluby fitness", "Dzieci", "Dorośli", "Zawodowi sportowcy"],
    included: [
      "Platforma ICAROS Cloud",
      "Pompka",
      "Gumy oporowe",
      "Uchwyt na tablet",
      "Dostęp do aplikacji ICAROS",
    ],
    testimonial: {
      quote: "ICAROS Cloud to trening przyszłości.",
      author: "You Sport and Wellness Clinic",
      role: "Wilno, Litwa",
    },
    videos: [
      {
        id: "TCrm7hsQ-Yw",
        title: "ICAROS Cloud",
        poster: "/Icaros-24_0428.webp",
        posterAlt: "Sportsmenka trenująca na platformie ICAROS Cloud",
      },
    ],
    gallery: [
      {
        src: "/icaros_cloud_360.webp",
        alt: "Kobieta balansująca na platformie ICAROS Cloud w pozycji stojącej",
      },
      {
        src: "/Icaros-24_0428.webp",
        alt: "Sportsmenka trenująca na platformie ICAROS Cloud",
      },
      {
        src: "/Cloud_Home_render.webp",
        alt: "ICAROS Cloud - platforma z uchwytami i gumami oporowymi",
      },
    ],
    evidence: [
      {
        value: "+15,85%",
        label: "wzrost siły mięśni głębokich w programie treningowym",
        source: "Uniwersytet w Salzburgu",
      },
      {
        value: "+5%",
        label: "wyższy wydatek energetyczny niż ćwiczenia na macie",
        source: "Ruhr-Universität Bochum",
      },
      {
        value: "8,11/10",
        label: "współczynnik zaangażowania w treningu",
        source: "Uniwersytet w Salzburgu",
      },
    ],
    software: [ICAROS_APP],
    sessionSteps: [
      {
        title: "Rozłożenie platformy",
        description:
          "Platforma waży 12 kg i jest napompowana. Wystarczy położyć ją na podłodze i podłączyć uchwyt na tablet.",
      },
      {
        title: "Wybór treningu",
        description:
          "W aplikacji wybierasz gotową playlistę albo pojedyncze ćwiczenie, od cardio po stabilizację.",
      },
      {
        title: "Trening na niestabilnym podłożu",
        description:
          "Ćwiczysz w podporze, w klęku lub na stojąco. Niestabilne podłoże angażuje mięśnie głębokie w każdym z tych ustawień.",
      },
    ],
    awards: ["German Design Award 2021", "UX Design Awards 2022"],
    press: {
      outlet: "VOGUE",
      quote: "ICAROS Cloud to trening przyszłości.",
    },
    faqs: [
      {
        question: "Czy potrzebuję gogli VR?",
        answer:
          "Nie. Cloud działa ze smartfonem lub tabletem na uchwycie. Wystarczy Bluetooth, Wi-Fi nie jest konieczne.",
      },
      {
        question: "Czy zmieści się w domu?",
        answer:
          "Tak. Platforma ma 182 × 130 × 40 cm i waży 12 kg, więc łatwo ją przestawić i schować po treningu.",
      },
      {
        question: "Czy nadaje się dla początkujących?",
        answer:
          "Tak. Poziom trudności zależy od pozycji i wybranego ćwiczenia, więc ta sama platforma działa dla osoby początkującej i dla zawodowego sportowca.",
      },
    ],
    specs: {
      dimensions: "182 × 130 × 40 cm",
      weight: "12 kg",
      userHeight: "140 cm do 200 cm",
      userWeight: "do 110 kg",
      compatibility: "Smartfon lub tablet (iOS, Android), Bluetooth, aplikacja ICAROS",
    },
    space: "Kompaktowa powierzchnia, około 1,5 m × 2,5 m.",
    technical:
      "Smartfon lub tablet z aplikacją ICAROS (iOS/Android). Połączenie Bluetooth, Wi-Fi nie jest wymagane.",
    image: "/icaros_cloud_7.webp",
    imageAlt: "ICAROS Cloud - kompaktowe urządzenie do cyfrowego treningu całego ciała",
  },
  {
    slug: "ist-board",
    name: "ICAROS I.S.T. Board",
    shortName: "I.S.T. Board",
    category: "Aktywacja i mobilność",
    tagline: "Gotowy od razu, sterowany ruchem stóp.",
    shortDesc:
      "Łatwo dostępny trening równowagi, reakcji, koordynacji i mobilizacji nóg, prowadzony przez aplikację.",
    longDesc: [
      "I.S.T. Board umożliwia prosty i angażujący trening równowagi, reakcji, koordynacji oraz mobilizacji kończyn dolnych.",
      "Sterujesz nim precyzyjnymi ruchami stóp i nóg, w połączeniu z różnymi grami treningowymi w aplikacji ICAROS. To motywujące i wszechstronne narzędzie, gotowe do użycia od razu po rozłożeniu.",
      "Nadaje się dla niemal każdej grupy: pacjentów z ograniczoną zdolnością stania, seniorów, dzieci i młodzieży, osób po operacjach kończyn dolnych, a także do treningu profilaktycznego i treningu równowagi w pozycji siedzącej.",
    ],
    focusAreas: ["Kontrola poznawczo-ruchowa", "Mobilizacja", "Stabilność"],
    outcomes: [
      "Trening równowagi także w pozycji siedzącej",
      "Aktywizuje stopy i nogi",
      "Gotowy do użycia od razu po rozłożeniu",
      "Dla osób z ograniczoną zdolnością stania",
    ],
    features: ["Kompaktowy i mobilny", "Plug and play", "Intuicyjny w obsłudze"],
    applications: [
      "Trening stabilności i równowagi",
      "Koordynacja",
      "Równowaga w pozycji siedzącej",
      "Mobilizacja",
    ],
    targetGroups: [
      "Fizjoterapia i terapia zajęciowa",
      "Osoby z ograniczoną zdolnością stania",
      "Seniorzy",
    ],
    included: [
      "Deska ICAROS I.S.T. Board",
      "Linki mocujące",
      "Uchwyt na smartfon i tablet",
      "Dostęp do aplikacji ICAROS",
    ],
    testimonial: {
      quote: "Małe ruchy zamieniają się w realne postępy.",
      author: "ICAROS",
      role: "Idea I.S.T. Board",
    },
    videos: [
      {
        id: "79r28U9c7NM",
        title: "ICAROS I.S.T. Board",
        poster: "/icaros_ist_1.webp",
        posterAlt: "Kobieta ćwicząca na ICAROS I.S.T. Board w pozycji siedzącej",
      },
    ],
    gallery: [
      {
        src: "/icaros_ist_1.webp",
        alt: "Kobieta na wózku podpórkowym ćwicząca na I.S.T. Board przed ekranem z grą",
      },
    ],
    evidence: [
      {
        value: "123",
        label: "sesje treningowe u dzieci podczas dializy bez poważnych powikłań",
        source: "Niemiecki Uniwersytet Sportowy i Szpital Uniwersytecki w Kolonii",
      },
      {
        value: "5 kg",
        label: "masa urządzenia, więc trening da się przenieść do łóżka pacjenta",
        source: "Katalog ICAROS 2026",
      },
    ],
    software: [ICAROS_APP],
    sessionSteps: [
      {
        title: "Rozłożenie deski",
        description:
          "Deska waży 5 kg i nie wymaga montażu. Wystarczy położyć ją przed krzesłem, fotelem albo wózkiem podpórkowym.",
      },
      {
        title: "Pozycja siedząca",
        description:
          "Pacjent siada i stawia stopy na desce. Nie musi wstawać ani utrzymywać ciężaru ciała.",
      },
      {
        title: "Sterowanie stopami",
        description:
          "Precyzyjne ruchy stóp i nóg sterują grą na tablecie lub ekranie. Trening angażuje reakcję i koordynację, a nie siłę.",
      },
    ],
    faqs: [
      {
        question: "Czy trzeba umieć stać?",
        answer:
          "Nie. I.S.T. Board powstał właśnie dla osób z ograniczoną zdolnością stania. Cały trening można przeprowadzić na siedząco.",
      },
      {
        question: "Czy nadaje się dla dzieci?",
        answer:
          "Tak. Urządzenie było wykorzystywane w badaniu z dziećmi i młodzieżą podczas hemodializy w Szpitalu Uniwersyteckim w Kolonii. Minimalny wzrost użytkownika to 120 cm.",
      },
      {
        question: "Co jest potrzebne do startu?",
        answer:
          "Smartfon albo tablet z aplikacją ICAROS i połączenie Bluetooth. Wi-Fi nie jest wymagane.",
      },
    ],
    specs: {
      dimensions: "62 × 52 × 22 cm",
      weight: "5 kg",
      userHeight: "120 cm do 210 cm",
      userWeight: "do 130 kg",
      compatibility: "Smartfon lub tablet (iOS, Android), Bluetooth, aplikacja ICAROS",
    },
    space: "Wymagana powierzchnia: około 60 cm × 50 cm.",
    technical:
      "Smartfon lub tablet z aplikacją ICAROS (iOS/Android). Połączenie Bluetooth, Wi-Fi nie jest wymagane.",
    image: "/icaros_ist_hero_1.webp",
    imageAlt: "ICAROS I.S.T. Board - trening stóp i nóg sterowany ruchem",
  },
];

export function getProduct(slug: string): IcarosProduct | undefined {
  return products.find((p) => p.slug === slug);
}
