import type { Metadata } from "next";
import UseCases, { type UseCaseItem } from "@/components/UseCases";

export const metadata: Metadata = {
  title: "Zastosowania dla placówek | ICAROS Polska",
  description:
    "Gdzie sprawdza się ICAROS - kliniki rehabilitacyjne, centra senioralne, obiekty premium i wellness oraz centra sportowe. Nowoczesna technologia dla Twojej placówki.",
  alternates: { canonical: "/dla-placowek" },
};

const businessCases: UseCaseItem[] = [
  {
    number: "01",
    title: "Kliniki rehabilitacyjne",
    description:
      "Zwiększ skuteczność terapii i wyróżnij swoją placówkę technologią przyszłości. ICAROS wspiera rehabilitację neurologiczną i ortopedyczną na każdym etapie.",
    image: "/Icaros-24_0544.webp",
    imageAlt: "Terapeuta z pacjentką podczas rehabilitacji na ICAROS Health",
  },
  {
    number: "02",
    title: "Centra senioralne",
    description:
      "Prewencja upadków i poprawa mobilności osób starszych. ICAROS Guardian zapewnia bezpieczny trening równowagi z minimalnym nadzorem personelu.",
    image: "/senior_6.webp",
    imageAlt: "Dwie seniorki ćwiczące wspólnie na ICAROS Guardian",
  },
  {
    number: "03",
    title: "Obiekty premium i wellness",
    description:
      "Wyróżnij swoją ofertę innowacyjną technologią treningową. ICAROS to element, który przyciąga uwagę, buduje wizerunek i generuje dodatkowe przychody.",
    image: "/0.webp",
    imageAlt: "ICAROS Guardian w ekskluzywnym wnętrzu z widokiem na jezioro",
  },
  {
    number: "04",
    title: "Centra sportowe i trenerskie",
    description:
      "Trening fitness i przygotowanie motoryczne w formie angażujących exergames. ICAROS Cloud wzmacnia core, nogi i górę ciała, poprawia koordynację oraz równowagę - w klubach fitness, na zajęciach grupowych i w treningu sportowców.",
    image: "/Icaros-24_0428.webp",
    imageAlt: "Sportsmenka trenująca na platformie ICAROS Cloud",
  },
];

export default function ZastosowaniaBiznesPage() {
  return (
    <UseCases
      variant="business"
      eyebrow="Zastosowania"
      title="Dla jakich placówek jest ICAROS?"
      intro="Nasze rozwiązania wspierają placówki, które stawiają na nowoczesną rehabilitację, jakość usług i przewagę konkurencyjną."
      items={businessCases}
    />
  );
}
