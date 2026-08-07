/**
 * Referencyjne ośrodki, które pracują na urządzeniach ICAROS poza Polską.
 *
 * Zasada redakcyjna: opisy mają pracować faktami (liczba łóżek, metraż, liczba
 * pacjentów, zasięg sieci), a nie przymiotnikami. Każda liczba pochodzi ze
 * strony danego ośrodka, z jego materiałów prasowych albo z katalogu
 * produktowego ICAROS 2026. Jeśli czegoś nie potwierdziliśmy, nie piszemy tego.
 *
 * Bez em-dashy (—). Stosujemy zwykły dywiz "-".
 */

export type WorldCategoryId = "longevity" | "sport" | "medycyna";

export type WorldPlace = {
  /** Klucz techniczny, używany też jako id kotwicy. */
  id: string;
  name: string;
  city: string;
  country: string;
  /** Dwuliterowy kod kraju - znak wodny na karcie bez zdjęcia. */
  countryCode: string;
  category: WorldCategoryId;
  /** Dwa do trzech zdań: czym to miejsce jest i dlaczego jest znaczące. */
  summary: string;
  /** Krótkie, twarde liczby. Maksymalnie trzy, bo więcej przestaje działać. */
  facts: string[];
  href: string;
  /**
   * Zdjęcie ośrodka w /public/swiat, pobrane ze strony danego ośrodka.
   * Bez zdjęcia karta pokazuje wariant typograficzny z kodem kraju.
   */
  image?: string;
  imageAlt?: string;
  /** Podpis pod kadrem. Zawsze podajemy źródło zdjęcia. */
  imageCredit?: string;
};

export type WorldCategory = {
  id: WorldCategoryId;
  label: string;
  lead: string;
};

export const worldCategories: WorldCategory[] = [
  {
    id: "longevity",
    label: "Longevity i wellness premium",
    lead: "Ośrodki, w których medycyna prewencyjna działa razem z hotelarstwem najwyższej półki.",
  },
  {
    id: "sport",
    label: "Sport wyczynowy",
    lead: "Ośrodki przygotowania motorycznego i kliniki, które prowadzą zawodników przez uraz i powrót do startów.",
  },
  {
    id: "medycyna",
    label: "Medycyna i rehabilitacja",
    lead: "Szpitale, kliniki rehabilitacyjne i gabinety fizjoterapii, od ponadregionalnych centrów urazowych po sieci praktyk osiedlowych.",
  },
];

export const worldPlaces: WorldPlace[] = [
  // Longevity i wellness premium
  {
    id: "sha-wellness",
    name: "SHA Wellness Clinic",
    city: "El Albir, Alicante",
    country: "Hiszpania",
    countryCode: "ES",
    category: "longevity",
    summary:
      "Klinika medycyny prewencyjnej połączona z hotelem, działająca od 2008 roku na wybrzeżu Costa Blanca. Program pobytu łączy diagnostykę medyczną, żywienie i ruch, a gość zostaje zwykle od tygodnia wzwyż.",
    facts: ["Otwarta w 2008 roku", "93 apartamenty i 11 rezydencji", "Ponad 8 000 m² części klinicznej"],
    href: "https://shawellness.com/en/locations/sha-spain/",
    image: "/swiat/sha-wellness.jpg",
    imageAlt: "Kompleks SHA Wellness Clinic na wzgórzu nad wybrzeżem Costa Blanca",
    imageCredit: "fot. SHA Wellness Clinic",
  },
  {
    id: "palazzo-fiuggi",
    name: "Palazzo Fiuggi",
    city: "Fiuggi, Lacjum",
    country: "Włochy",
    countryCode: "IT",
    category: "longevity",
    summary:
      "Medical retreat godzinę drogi od Rzymu, na wysokości 700 m n.p.m., w prywatnym parku o powierzchni 8,5 hektara. Część zabiegowa to 6 000 m² z 12 gabinetami lekarskimi i 39 gabinetami zabiegowymi. W sali treningowej pracuje ICAROS Health.",
    facts: ["102 pokoje i apartamenty", "6 000 m² części medycznej", "12 gabinetów lekarskich"],
    href: "https://www.palazzofiuggi.com/",
    image: "/swiat/palazzo-fiuggi.jpg",
    imageAlt: "Palazzo Fiuggi z lotu ptaka: budynek, basen i park nad miasteczkiem Fiuggi",
    imageCredit: "fot. Palazzo Fiuggi",
  },
  {
    id: "mein-schiff",
    name: "Mein Schiff, TUI Cruises",
    city: "Flota wycieczkowa",
    country: "Niemcy",
    countryCode: "DE",
    category: "longevity",
    summary:
      "Statki Mein Schiff mają na pokładzie strefy spa i sportu sięgające 2 400 m², z basenem, ścianką wspinaczkową i zajęciami grupowymi. Urządzenia ICAROS pracują na Mein Schiff 1 i 2.",
    facts: ["Do 2 400 m² strefy spa i sportu", "ICAROS na Mein Schiff 1 i 2"],
    href: "https://www.meinschiff.com/an-bord/spa-und-sport/sport-gesundheit",
    image: "/swiat/mein-schiff.jpg",
    imageAlt: "Goście na pokładzie statku Mein Schiff o zachodzie słońca",
    imageCredit: "fot. TUI Cruises",
  },

  // Sport wyczynowy
  {
    id: "red-bull-apc",
    name: "Red Bull Athlete Performance Center",
    city: "Salzburg i Los Angeles",
    country: "Austria i USA",
    countryCode: "AT",
    category: "sport",
    summary:
      "Ośrodek przygotowania motorycznego przeznaczony wyłącznie dla zawodowych sportowców i drużyn, z placówkami w Salzburgu (1 600 m²) i Los Angeles (1 000 m²). Pracuje z ponad 900 zawodnikami z 90 krajów, reprezentującymi ponad 200 dyscyplin. Łączy trening, medycynę sportową, diagnostykę biomechaniczną, żywienie i regenerację pod jednym dachem.",
    facts: ["Ponad 900 zawodników", "Ponad 200 dyscyplin", "Salzburg 1 600 m², Los Angeles 1 000 m²"],
    href: "https://www.redbullperformance.com/en/",
    image: "/swiat/red-bull-apc.jpg",
    imageAlt: "Sportowiec podczas treningu siłowego w Athlete Performance Center",
    imageCredit: "fot. Red Bull Athlete Performance Center",
  },
  {
    id: "hessingpark",
    name: "Hessingpark-Clinic",
    city: "Augsburg",
    country: "Niemcy",
    countryCode: "DE",
    category: "sport",
    summary:
      "Prywatna klinika ortopedyczna, której głównym profilem jest opieka nad sportowcami wyczynowymi. Diagnostyka obrazowa (rezonans, tomografia, RTG) działa na miejscu, dzięki czemu rozpoznanie i plan operacji powstają często w ciągu trzech godzin. Podczas mistrzostw świata w kajakarstwie w Augsburgu w 2022 roku klinika jako partner medyczny odpowiadała za około 400 zawodników z 70 krajów.",
    facts: ["1 300 m² sali fizjoterapii", "Ok. 400 zawodników z 70 krajów podczas MŚ 2022", "Diagnostyka obrazowa na miejscu"],
    href: "https://www.hessingpark-clinic.de/de",
    image: "/swiat/hessingpark.webp",
    imageAlt: "Personel medyczny na oddziale Hessingpark-Clinic w Augsburgu",
    imageCredit: "fot. Hessingpark-Clinic",
  },

  // Medycyna i rehabilitacja
  {
    id: "cereneo",
    name: "cereneo",
    city: "Vitznau i Hertenstein",
    country: "Szwajcaria",
    countryCode: "CH",
    category: "medycyna",
    summary:
      "Szwajcarska klinika neurorehabilitacji nad Jeziorem Czterech Kantonów, prowadząca terapię po udarze, urazach mózgu i w chorobie Parkinsona. Ma 12 łóżek w Vitznau i 23 w Hertenstein. Prowadzi badania naukowe wspólnie z Uniwersytetem w Zurychu, ETH Zurich, Johns Hopkins i KU Leuven.",
    facts: ["12 łóżek w Vitznau, 23 w Hertenstein", "Badania z ETH Zurich i Johns Hopkins", "Neurorehabilitacja po udarze"],
    href: "https://cereneo.ch/",
    image: "/swiat/cereneo.webp",
    imageAlt: "Klinika cereneo nad Jeziorem Czterech Kantonów, w tle masyw Pilatus",
    imageCredit: "fot. cereneo",
  },
  {
    id: "bg-murnau",
    name: "BG Klinikum Murnau",
    city: "Murnau am Staffelsee, Bawaria",
    country: "Niemcy",
    countryCode: "DE",
    category: "medycyna",
    summary:
      "Ponadregionalne centrum urazowe zajmujące się ostrą opieką i rehabilitacją osób ciężko poszkodowanych, z około 450 łóżkami i mniej więcej 41 000 pacjentów rocznie. W 1969 roku powstał tutaj pierwszy w Niemczech ośrodek leczenia uszkodzeń rdzenia kręgowego, dziś dysponujący 81 łóżkami.",
    facts: ["Około 450 łóżek", "Około 41 000 pacjentów rocznie", "Pierwszy w Niemczech ośrodek leczenia rdzenia (1969)"],
    href: "https://www.bg-kliniken.de/unfallklinik-murnau/",
    image: "/swiat/bg-murnau.jpg",
    imageAlt: "Zespół BG Klinikum Murnau przyjmuje pacjenta ze śmigłowca ratunkowego",
    imageCredit: "fot. BG Kliniken",
  },
  {
    id: "fachklinik-rhein-ruhr",
    name: "MEDICLIN Fachklinik Rhein/Ruhr",
    city: "Essen-Kettwig",
    country: "Niemcy",
    countryCode: "DE",
    category: "medycyna",
    summary:
      "Jedna z największych klinik rehabilitacyjnych w Nadrenii Północnej-Westfalii: 430 łóżek, 385 pracowników i blisko 5 000 pacjentów rocznie. Prowadzi rehabilitację neurologiczną, ortopedyczną i geriatryczną, stacjonarnie oraz w trybie dziennym. Należy do grupy MEDICLIN, która ma 31 klinik rehabilitacyjnych w Niemczech.",
    facts: ["430 łóżek", "385 pracowników", "Około 5 000 pacjentów rocznie"],
    href: "https://www.fachklinik-rheinruhr.de/",
    image: "/swiat/fachklinik-rhein-ruhr.jpg",
    imageAlt: "Trening medyczny z terapeutką w MEDICLIN Fachklinik Rhein/Ruhr",
    imageCredit: "fot. MEDICLIN",
  },
  {
    id: "srh-dobel",
    name: "SRH Gesundheitszentrum Dobel",
    city: "Dobel, Schwarzwald",
    country: "Niemcy",
    countryCode: "DE",
    category: "medycyna",
    summary:
      "Ośrodek rehabilitacyjny w Czarnym Lesie z 263 łóżkami, z czego 183 przypada na ortopedię, a 80 na onkologię. Prowadzi rehabilitację stacjonarną i ambulatoryjną, a część zajęć odbywa się w terenie na własnym obszarze leśnym. Wchodzi w skład sieci SRH Gesundheitszentren Nordschwarzwald.",
    facts: ["263 łóżka", "183 ortopedia, 80 onkologia", "Rehabilitacja stacjonarna i ambulatoryjna"],
    href: "https://www.gesundheitszentren-nordschwarzwald.de/ihr-aufenthalt/srh-gesundheitszentrum-dobel/",
    image: "/swiat/srh-dobel.jpg",
    imageAlt: "Budynki SRH Gesundheitszentrum Dobel wśród lasów Schwarzwaldu",
    imageCredit: "fot. SRH Gesundheitszentren Nordschwarzwald",
  },
  {
    id: "physiotherapie-potsdam",
    name: "Physiotherapie Potsdam, Campus Jungfernsee",
    city: "Poczdam",
    country: "Niemcy",
    countryCode: "DE",
    category: "medycyna",
    summary:
      "Oddział sieci fizjoterapeutycznej, która prowadzi kilkanaście gabinetów w Poczdamie i okolicy, między innymi centrum ręki i stopy oraz centrum limfologiczne. W samym Campus Jungfernsee pracuje kilkunastu terapeutów, a placówka ma gabinety zabiegowe, salę dziecięcą i salę sportową. W wyposażeniu placówki jest ICAROS, obok terapii manualnej i treningu medycznego.",
    facts: ["Kilkanaście gabinetów w sieci", "Kilkunastu terapeutów w jednej lokalizacji", "ICAROS w wyposażeniu placówki"],
    href: "https://physiotherapie-potsdam.de/standorte/campus-jungfernsee/",
    image: "/swiat/physiotherapie-potsdam.jpg",
    imageAlt: "Wejście do Physiotherapie Potsdam Campus Jungfernsee o zmierzchu",
    imageCredit: "fot. Physiotherapie Potsdam",
  },
  {
    id: "ortho-sturz",
    name: "Orthopädie am Molfsee, Ortho & Sturz",
    city: "Kilonia i Molfsee",
    country: "Niemcy",
    countryCode: "DE",
    category: "medycyna",
    summary:
      "Praktyka ortopedii zachowawczej dr. med. Ove Schrödera, wcześniej starszego lekarza kliniki ortopedii i traumatologii Uniwersyteckiego Szpitala Szlezwik-Holsztyn. Specjalizuje się w przewlekłym bólu pleców, zaburzeniach chodu i profilaktyce upadków. ICAROS Guardian pracuje tam obok platformy HUBER 360 i systemu NEURO GYM.",
    facts: ["Dwie lokalizacje: Kilonia i Molfsee", "Profilaktyka upadków i zaburzenia chodu", "ICAROS Guardian w wyposażeniu"],
    href: "https://www.ortho-sturz.de/",
  },
  {
    id: "vr-clinical-center",
    name: "VR Clinical Center",
    city: "Walencja",
    country: "Hiszpania",
    countryCode: "ES",
    category: "medycyna",
    summary:
      "Ośrodek zbudowany w całości wokół terapii w wirtualnej rzeczywistości, z zespołem ponad ośmiu specjalistów. Prowadzi terapię dna miednicy, stymulację poznawczą, leczenie sarkopenii i fizjoterapię ortopedyczną. W wyposażeniu ma trzy urządzenia ICAROS: Health, Cloud i Guardian.",
    facts: ["Ponad 8 specjalistów", "ICAROS Health, Cloud i Guardian", "Terapia oparta na VR"],
    href: "https://vrclinicalcenter.com/",
    image: "/swiat/vr-clinical-center.webp",
    imageAlt: "Pacjentka w goglach VR podczas sesji w VR Clinical Center w Walencji",
    imageCredit: "fot. VR Clinical Center",
  },
  {
    id: "hzhg",
    name: "Hospital zum Heiligen Geist",
    city: "Hamburg",
    country: "Niemcy",
    countryCode: "DE",
    category: "medycyna",
    summary:
      "Duży ośrodek opieki senioralnej w Hamburgu, działający w ramach Diakonii. Prowadzi opiekę ambulatoryjną, dzienną, krótkoterminową, mieszkania wspomagane, oddziały dla osób z demencją oraz opiekę paliatywną. Na terenie działa własna szkoła pielęgniarska, a osiedle Heilig Geist am Alsterlauf ma sklepy, gabinety lekarskie i część rekreacyjną.",
    facts: ["Pełny zakres opieki senioralnej", "Własna szkoła pielęgniarska", "Fizjoterapia na miejscu"],
    href: "https://www.hzhg.de/",
    image: "/swiat/hzhg.jpg",
    imageAlt: "Mieszkańcy Hospital zum Heiligen Geist w części restauracyjnej",
    imageCredit: "fot. Hospital zum Heiligen Geist",
  },
  {
    id: "sirica",
    name: "Sirica Center",
    city: "Burlingame, Kalifornia",
    country: "USA",
    countryCode: "US",
    category: "medycyna",
    summary:
      "Ośrodek treningu ruchowego i neurotreningu stworzony z myślą o osobach w spektrum autyzmu i neuroatypowych. Powstał z inicjatywy rodzica, którego córka otrzymała diagnozę autyzmu. Łączy technologie immersyjne z pracą nad ruchem i pewnością siebie, a wizytę wprowadzającą oferuje bezpłatnie.",
    facts: ["Program dla osób neuroatypowych", "Technologie immersyjne", "Bezpłatna wizyta wprowadzająca"],
    href: "https://www.siricacenter.com/",
    image: "/swiat/sirica.jpg",
    imageAlt: "Zespół Sirica Center przy urządzeniu ICAROS Health",
    imageCredit: "fot. Sirica Center",
  },
];

/**
 * Dodatkowe wdrożenia wymienione w katalogu produktowym ICAROS 2026.
 * Nie mamy dla nich zweryfikowanych liczb, więc pokazujemy je jako krótką listę.
 */
export const worldExtraReferences: { name: string; type: string; place: string }[] = [
  { name: "Sonne Mellau", type: "Feel Good Hotel", place: "Mellau, Austria" },
  { name: "Sportresort Hohe Salve", type: "Resort sportowy", place: "Hopfgarten, Austria" },
  { name: "You Sport and Wellness Clinic", type: "Klinika sportowo-wellness", place: "Wilno, Litwa" },
  { name: "IBS Health", type: "Ośrodek biomechaniki", place: "Włochy" },
];

export function placesByCategory(category: WorldCategoryId): WorldPlace[] {
  return worldPlaces.filter((p) => p.category === category);
}
