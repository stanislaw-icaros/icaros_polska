/**
 * Dane produktów ICAROS - wspólne źródło dla stron pacjenta (/produkty/[slug])
 * i biznesu (/urzadzenia/[slug]). Treść przetłumaczona z icaros.com.
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
  features: string[];
  applications: string[];
  targetGroups: string[];
  /** Tylko niektóre urządzenia (np. Guardian) - zawartość zestawu. */
  included?: string[];
  /** Zalecana powierzchnia montażu - pokazywane w wersji biznes. */
  space: string;
  /** Wymagania techniczne - pokazywane w wersji biznes. */
  technical: string;
  image: string;
  imageAlt: string;
};

export const products: IcarosProduct[] = [
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
    features: ["Lekki", "Mała powierzchnia", "Elastyczne zastosowanie", "Mikrosiłownia"],
    applications: ["Trening fitness", "Zajęcia grupowe", "Równowaga i stabilizacja"],
    targetGroups: ["Kluby fitness", "Dzieci", "Dorośli", "Zawodowi sportowcy"],
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
