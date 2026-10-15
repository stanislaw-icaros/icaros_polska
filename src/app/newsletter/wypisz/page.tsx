import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterUnsubscribe from "@/components/NewsletterUnsubscribe";
import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe";

export const metadata: Metadata = {
  title: "Wypisanie z listy | ICAROS Polska",
  description: "Rezygnacja z newslettera ICAROS Polska.",
  robots: { index: false, follow: false },
};

/**
 * Strona z linku „Wypisz się” w wiadomościach. Adres bierzemy z podpisanego
 * linku, więc nie trzeba go wpisywać; samo wypisanie wykonuje przycisk,
 * żeby skaner linków w kliencie pocztowym nikogo nie wypisał przypadkiem.
 */
export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; t?: string }>;
}) {
  const { e, t } = await searchParams;
  const email = verifyUnsubscribeToken(e, t);
  const query = email ? new URLSearchParams({ e: e ?? "", t: t ?? "" }).toString() : "";

  return (
    <>
      <Navigation />
      <main className="relative overflow-hidden bg-white pb-24 pt-32 lg:pb-32 lg:pt-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[640px] px-6 lg:px-10">
          <NewsletterUnsubscribe email={email} query={query} />
        </div>
      </main>
      <Footer variant="patient" />
    </>
  );
}
