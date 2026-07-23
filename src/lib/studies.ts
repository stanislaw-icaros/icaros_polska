/**
 * Baza badań klinicznych ICAROS - dane z opracowania "ICAROS Studies" oraz publikacji.
 * Linki prowadzą wyłącznie do zweryfikowanych, publicznie dostępnych źródeł.
 */

export type StudyLink = { label: string; href: string };

export type Study = {
  id: string;
  device: string;
  title: string;
  institution: string;
  year: string;
  finding: string;
  links?: StudyLink[];
};

/** Ośrodki naukowe, które badały skuteczność treningu ICAROS. */
export const researchPartners: string[] = [
  "Uniwersytet w Salzburgu",
  "Ruhr-Universität Bochum",
  "Niemiecki Uniwersytet Sportowy w Kolonii",
  "Politechnika w Monachium",
  "Uniwersytet w Heidelbergu",
  "Center for Healthcare Professions Tyrol",
];

export const studies: Study[] = [
  {
    id: "G-I",
    device: "ICAROS Guardian",
    title:
      "Wpływ treningu balansowego opartego na grze na mobilność, równowagę, funkcje poznawcze i prędkość chodu u osób starszych",
    institution: "Niemiecki Uniwersytet Sportowy w Kolonii",
    year: "2024",
    finding:
      "Po 6 tygodniach treningu istotny wzrost siły nóg, poprawa mobilności i prędkości chodu oraz funkcji poznawczych (MoCA) u zdrowych seniorów.",
  },
  {
    id: "G-II",
    device: "ICAROS Guardian",
    title:
      "Trening oparty na grze wspierający mobilność i funkcje poznawcze u osób starszych - badanie wykonalności",
    institution: "Niemiecki Uniwersytet Sportowy w Kolonii",
    year: "2026",
    finding:
      "Poprawa siły nóg, mobilności, prędkości chodu i funkcji poznawczych u seniorów i pacjentów rehabilitacji geriatrycznej - praktyczna i motywująca alternatywa dla tradycyjnego treningu.",
    links: [
      {
        label: "German Journal of Sports Medicine",
        href: "https://www.germanjournalsportsmedicine.com/",
      },
    ],
  },
  {
    id: "G-III",
    device: "ICAROS Guardian",
    title: "Efekty treningu na ICAROS Guardian u pacjentów po udarze",
    institution: "Niemiecki Uniwersytet Sportowy w Kolonii",
    year: "2026",
    finding:
      "Pacjenci po udarze istotnie poprawili test wstawania z krzesła, Timed Up and Go oraz prędkość chodu - czują się pewniej i bardziej komfortowo w codziennym życiu.",
  },
  {
    id: "H-I",
    device: "ICAROS Health",
    title:
      "Dodatkowy trening ICAROS w opiece porehabilitacyjnej pacjentów z bólem dolnego odcinka kręgosłupa",
    institution: "Politechnika w Monachium",
    year: "2018",
    finding:
      "Dodatkowy trening istotnie zwiększa izometryczną siłę mięśni głębokich i zmniejsza ograniczenia w codziennym funkcjonowaniu pacjentów z dolegliwościami lędźwiowymi.",
  },
  {
    id: "H-II",
    device: "ICAROS Health",
    title:
      "Wydatek energetyczny i aktywność mięśni podczas treningu na urządzeniu ICAROS",
    institution: "Politechnika w Monachium",
    year: "2017",
    finding:
      "Dwukrotnie większa stymulacja mięśni i o 30% wyższy wydatek kaloryczny w porównaniu ze standardowym plankiem.",
  },
  {
    id: "H-III",
    device: "ICAROS Health",
    title:
      "Wpływ treningu całego ciała w wirtualnej rzeczywistości na parametry sercowo-naczyniowe i mięśniowe",
    institution: "Niemiecki Uniwersytet Sportowy w Kolonii",
    year: "2019",
    finding:
      "Skuteczna aktywacja mięśni grzbietu (do 30% maksymalnego skurczu izometrycznego), umiarkowana intensywność aerobowa i wysoki poziom zaangażowania.",
    links: [
      { label: "JMIR Serious Games", href: "https://games.jmir.org/2019/3/e12324/" },
      { label: "PubMed", href: "https://pubmed.ncbi.nlm.nih.gov/31464194/" },
      { label: "Wideo", href: "https://www.youtube.com/watch?v=ODcs1JU2W9Q" },
    ],
  },
  {
    id: "H-IV",
    device: "ICAROS Health",
    title:
      "Ocena treningu VR ICAROS w promocji zdrowia i profilaktyce",
    institution: "Center for Healthcare Professions Tyrol",
    year: "2022",
    finding:
      "6-tygodniowy program istotnie poprawił funkcję i reaktywność mięśni oraz stabilność, a uczestnicy zgłaszali zmniejszenie bólu pleców i lepszą mobilność.",
  },
  {
    id: "H-V",
    device: "ICAROS Health",
    title:
      "Trening terapeutyczny oparty na grze w niespecyficznym ostrym bólu dolnego odcinka kręgosłupa",
    institution: "Niemiecki Uniwersytet Sportowy w Kolonii",
    year: "2023",
    finding:
      "Użytkownicy w każdym wieku szybko adaptują się do systemu; poprawa funkcji mięśni grzbietu, redukcja ostrego bólu i wyższy poziom dobrostanu.",
  },
  {
    id: "H-VI",
    device: "ICAROS Health",
    title: "Terapia ruchowa w VR w zespole przewlekłego zmęczenia po COVID",
    institution: "Uniwersytet w Heidelbergu",
    year: "2025",
    finding:
      "Randomizowane badanie kliniczne: bezpieczna i klinicznie wartościowa metoda - istotna redukcja zmęczenia, wyższa satysfakcja i rzadsze nasilenia objawów (9% vs 22%).",
  },
  {
    id: "C-I",
    device: "ICAROS Cloud",
    title:
      "Obciążenie krążeniowo-oddechowe i metaboliczne podczas treningu na ICAROS Cloud",
    institution: "Ruhr-Universität Bochum",
    year: "2021",
    finding:
      "Wyższy wydatek energetyczny (+5%) i stężenie mleczanów niż na macie oraz większa przyjemność z treningu.",
  },
  {
    id: "C-II",
    device: "ICAROS Cloud",
    title: "Czy regularny trening na ICAROS Cloud poprawia siłę mięśni głębokich?",
    institution: "Uniwersytet w Salzburgu",
    year: "2021",
    finding:
      "Wzrost siły core o 15,85% w 3 tygodnie, współczynnik zaangażowania 8,11/10, a 90% uczestników chciało kontynuować trening.",
  },
  {
    id: "I.S.T-I",
    device: "ICAROS I.S.T. Board",
    title:
      "Trening oparty na grze jako sposób na aktywność fizyczną dzieci i młodzieży podczas hemodializy",
    institution: "Niemiecki Uniwersytet Sportowy w Kolonii i Szpital Uniwersytecki w Kolonii",
    year: "2026",
    finding:
      "123 sesje treningowe podczas dializy bez poważnych powikłań; metoda oceniona pozytywnie przez dzieci, rodziny i personel medyczny - obiecująca i wykonalna.",
    links: [
      {
        label: "Pediatric Nephrology",
        href: "https://link.springer.com/article/10.1007/s00467-026-07158-0",
      },
      {
        label: "Omówienie (Healio)",
        href: "https://www.healio.com/news/nephrology/20260316/qa-exergaming-may-increase-physical-activity-among-children-adolescents-on-dialysis",
      },
    ],
  },
];
