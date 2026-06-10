import type { Metadata } from "next";
import BusinessCase from "@/components/BusinessCase";
import Studies from "@/components/Studies";

export const metadata: Metadata = {
  title: "Efekty i badania | ICAROS Polska",
  description:
    "Zwrot z inwestycji ICAROS i dowody naukowe. Kalkulator ROI dla Twojej placówki oraz wyniki ponad 9 badań klinicznych nad terapią VR.",
};

export default function EfektywnoscPage() {
  return (
    <>
      <BusinessCase />
      <Studies />
    </>
  );
}
