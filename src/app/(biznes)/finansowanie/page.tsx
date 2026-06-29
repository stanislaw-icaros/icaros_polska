import type { Metadata } from "next";
import Finansowanie from "./Finansowanie";

export const metadata: Metadata = {
  title: "Finansowanie | ICAROS Biznes",
  description:
    "Modele finansowania ICAROS: zakup, leasing 48-miesięczny oraz przygotowywana oferta leasingu z EFL. Sprawdź, który model pasuje do Twojej placówki.",
};

export default function FinansowaniePage() {
  return <Finansowanie />;
}
