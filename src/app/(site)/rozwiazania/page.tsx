import type { Metadata } from "next";
import ValueProposition from "@/components/ValueProposition";
import VideoShowcase from "@/components/VideoShowcase";

export const metadata: Metadata = {
  title: "Rozwiązania | ICAROS Polska",
  description:
    "Jak działa system ICAROS - niemiecka technologia łącząca rehabilitację, trening i wirtualną rzeczywistość. Poznaj rozwiązania ICAROS dla klinik i placówek.",
};

export default function RozwiazaniaPage() {
  return (
    <>
      <ValueProposition />
      <VideoShowcase />
    </>
  );
}
