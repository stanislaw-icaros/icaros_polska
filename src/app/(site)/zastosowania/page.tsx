import type { Metadata } from "next";
import UseCases, { type UseCaseItem } from "@/components/UseCases";

export const metadata: Metadata = {
  title: "Dla kogo | ICAROS Polska",
  description:
    "Dla kogo jest ICAROS - rehabilitacja po udarze i chorobach neurologicznych, powrót do formy po urazach, trening równowagi dla seniorów i ćwiczenia przy bólu pleców.",
};

const patientCases: UseCaseItem[] = [
  {
    number: "01",
    title: "Po udarze i w chorobach neurologicznych",
    description:
      "Odzyskuj równowagę, chód i sprawność po udarze, w stwardnieniu rozsianym czy chorobie Parkinsona. Trening poznawczo-ruchowy wspiera powrót do samodzielności, krok po kroku.",
    image: "/Icaros-24_0544.webp",
    imageAlt: "Terapeutka wspiera pacjentkę podczas rehabilitacji neurologicznej na ICAROS",
  },
  {
    number: "02",
    title: "Po urazach i operacjach",
    description:
      "Wracaj do formy po kontuzji, złamaniu czy operacji kręgosłupa lub kończyn. Wzmacniasz mięśnie głębokie i stabilizację, ćwicząc bezpiecznie i bez nadmiernego przeciążania.",
    image: "/icaros_health_w_uzyciu.webp",
    imageAlt: "Pacjent podczas treningu stabilizacji tułowia na ICAROS Health",
  },
  {
    number: "03",
    title: "Seniorzy i profilaktyka upadków",
    description:
      "Utrzymuj mobilność, równowagę i pewność w codziennym życiu. Bezpieczny, angażujący trening pomaga zmniejszyć ryzyko upadków i dłużej cieszyć się samodzielnością.",
    image: "/senior_2.webp",
    imageAlt: "Seniorka podczas treningu równowagi na ICAROS Guardian",
  },
  {
    number: "04",
    title: "Przewlekły ból pleców",
    description:
      "Wzmacniaj mięśnie tułowia i łagodź napięcia. Ćwiczenia na niestabilnym podłożu odciążają kręgosłup, poprawiają postawę i pomagają wrócić do aktywności bez bólu.",
    image: "/Icaros-24_0552.webp",
    imageAlt: "Trening mięśni głębokich odciążający kręgosłup na urządzeniu ICAROS",
  },
];

export default function ZastosowaniaPage() {
  return (
    <UseCases
      variant="patient"
      eyebrow="Dla kogo"
      title="Komu pomaga ICAROS?"
      intro="Od rehabilitacji po udarze, przez powrót do formy po urazach, po trening równowagi dla seniorów - ICAROS wspiera osoby, które chcą wrócić do sprawności i samodzielności."
      items={patientCases}
    />
  );
}
