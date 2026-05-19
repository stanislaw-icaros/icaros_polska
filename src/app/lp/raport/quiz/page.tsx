import type { Metadata } from "next";
import { Suspense } from "react";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Quiz: VR w Twojej placówce | ICAROS Polska",
  description:
    "Sprawdź w 30 sekund, jak technologia VR mogłaby wyglądać w Twojej placówce rehabilitacyjnej.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RaportQuizPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-foreground" />}>
      <QuizClient />
    </Suspense>
  );
}
