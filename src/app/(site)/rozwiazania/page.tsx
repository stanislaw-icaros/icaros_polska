import type { Metadata } from "next";
import HowItWorks from "@/components/HowItWorks";
import VideoShowcase from "@/components/VideoShowcase";

export const metadata: Metadata = {
  title: "Jak to działa | ICAROS Polska",
  description:
    "Jak działa ICAROS - terapia w formie gry. Ćwiczysz ruchami całego ciała w wirtualnej rzeczywistości, wzmacniasz mięśnie, równowagę i koordynację. Rehabilitacja, która wciąga.",
};

export default function RozwiazaniaPage() {
  return (
    <>
      <HowItWorks />
      <VideoShowcase />
    </>
  );
}
