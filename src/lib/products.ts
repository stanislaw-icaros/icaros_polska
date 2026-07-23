/**
 * Dane produktów ICAROS - wspólne źródło dla stron pacjenta (/produkty/[slug])
 * i biznesu (/urzadzenia/[slug]). Treść na podstawie icaros.com i katalogu 2026.
 *
 * Zasada: bez em-dashy (—). Stosujemy zwykły dywiz "-" lub przebudowane zdanie.
 *
 * Pola `space` i `technical` (wymagana przestrzeń, wymagania techniczne)
 * pokazujemy TYLKO w wersji biznes. ICAROS nie publikuje fizycznych wymiarów
 * urządzeń (kg/cm), więc jako "wymiary" podajemy zalecaną powierzchnię montażu.
 * Realne wymiary urządzeń dodamy tu później, gdy będą dostępne.
 */
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
  /** Opcjonalny film do osadzenia (embed). Uzupełnimy później. */
  videoUrl?: string;
  /** Zalecana powierzchnia montażu - pokazywane w wersji biznes. */
  space: string;
  /** Wymagania techniczne - pokazywane w wersji biznes. */
  technical: string;
  image: string;
  imageAlt: string;
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
    testimonial: {
      quote:
        "ICAROS oferuje wyjątkowo skuteczny sprzęt do poprawy stabilności, koordynacji i równowagi.",
      author: "Domenico Gurzi",
      role: "Kierownik Działu Biomechaniki, IBS Health",
    },
    space:
      "Powierzchnia dla pełnego zestawu ustalana indywidualnie, w zależności od liczby urządzeń.",
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
    testimonial: {
      quote:
        "Radość, jaką daje mi trening ICAROS, motywuje mnie, żeby za każdym razem dawać z siebie wszystko.",
      author: "Sandra",
      role: "Pacjentka po udarze",
    },
    space: "Zalecana powierzchnia montażu: co najmniej 1,50 m × 2,50 m.",
    technical: "Standardowe gniazdko 230 V. Dostęp do internetu przez Wi-Fi.",
    image: "/Icaros-24_0544.webp",
    imageAlt:
      "Terapeutka asystująca pacjentce podczas sesji na ICAROS Health z goglami VR",
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
    testimonial: {
      quote: "Małe ruchy zamieniają się w realne postępy.",
      author: "ICAROS",
      role: "Idea I.S.T. Board",
    },
    space: "Wymagana powierzchnia: około 60 cm × 50 cm.",
    technical:
      "Smartfon lub tablet z aplikacją ICAROS (iOS/Android). Połączenie Bluetooth, Wi-Fi nie jest wymagane.",
    image: "/icaros_ist_hero_1.webp",
    imageAlt: "ICAROS I.S.T. Board - trening stóp i nóg sterowany ruchem",
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
      "iPad do sterowania aplikacją",
      "Apple TV i ekran do zajęć grupowych",
      "Dostęp do aplikacji ICAROS",
    ],
    testimonial: {
      quote: "Dzięki treningowi z ICAROS stałem się szybszy i silniejszy.",
      author: "Walter",
      role: "Pacjent po udarze",
    },
    space: "Zalecana powierzchnia montażu: co najmniej 1,50 m × 2,50 m.",
    technical: "Standardowe gniazdko 230 V. Dostęp do internetu przez Wi-Fi.",
    image: "/senior_2.webp",
    imageAlt: "Senior ćwiczący na ICAROS Guardian z interaktywną grą na ekranie",
  },
  {
    slug: "lightning",
    name: "ICAROS Lightning",
    shortName: "Lightning",
    category: "Fitness i VR",
    tagline: "Nowy wymiar treningu w wirtualnej rzeczywistości.",
    shortDesc:
      "Trening fitness w VR - latasz przez wirtualne światy, wzmacniając górę ciała i tułów oraz poprawiając refleks, równowagę i koordynację.",
    longDesc: [
      "ICAROS Lightning przenosi fitness do wirtualnego świata i zamienia trening w wyjątkowe przeżycie. Lecąc przez fascynujące otoczenia VR, w ukierunkowany sposób wzmacniasz mięśnie górnej części ciała i tułowia oraz poprawiasz refleks, równowagę i koordynację.",
      "Nadaje się zarówno do domu, jak i na siłownię, do użytku prywatnego i komercyjnego. Dzięki nagradzanemu designowi i wyjątkowemu przeżyciu treningowemu to urządzenie fitness XXI wieku.",
    ],
    focusAreas: ["Kontrola poznawczo-ruchowa", "Zdrowe plecy", "Kontrola postawy"],
    outcomes: [
      "Wzmacnia górę ciała i mięśnie tułowia",
      "Poprawia refleks, równowagę i koordynację",
      "Angażujące przeżycie w wirtualnej rzeczywistości",
      "Do domu i do obiektów komercyjnych",
    ],
    features: ["Nagradzany design", "Lekki", "Mała powierzchnia"],
    applications: ["Trening mięśni tułowia", "Równowaga", "Gaming i rozrywka"],
    targetGroups: ["Dom", "Fitness i hotele", "Rozrywka"],
    testimonial: {
      quote: "Nasi goście na TUI Mein Schiff 1 i 2 są zachwyceni urządzeniami ICAROS.",
      author: "Martina Schumann",
      role: "Dyrektor Spa & Sport, sea chefs Cruises Worldwide GmbH",
    },
    space: "Kompaktowa powierzchnia, około 1,5 m × 2,5 m.",
    technical: "Standardowe gniazdko 230 V. Gogle VR i aplikacja ICAROS.",
    image: "/lightning.webp",
    imageAlt: "ICAROS Lightning - trening fitness w wirtualnej rzeczywistości",
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
    testimonial: {
      quote: "ICAROS Cloud to trening przyszłości.",
      author: "You Sport and Wellness Clinic",
      role: "Wilno, Litwa",
    },
    space: "Kompaktowa powierzchnia, około 1,5 m × 2,5 m.",
    technical:
      "Smartfon lub tablet z aplikacją ICAROS (iOS/Android). Połączenie Bluetooth, Wi-Fi nie jest wymagane.",
    image: "/icaros_cloud_7.webp",
    imageAlt: "ICAROS Cloud - kompaktowe urządzenie do cyfrowego treningu całego ciała",
  },
];

export function getProduct(slug: string): IcarosProduct | undefined {
  return products.find((p) => p.slug === slug);
}
