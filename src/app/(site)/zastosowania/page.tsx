import type { Metadata } from "next";
import UseCases from "@/components/UseCases";

export const metadata: Metadata = {
  title: "Zastosowania | ICAROS Polska",
  description:
    "Zastosowania ICAROS - rehabilitacja, medical fitness, kliniki, hotele medyczne i obiekty premium. Gdzie sprawdza się technologia ICAROS.",
};

export default function ZastosowaniaPage() {
  return <UseCases />;
}
