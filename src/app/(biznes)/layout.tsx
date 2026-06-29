import Navigation from "@/components/Navigation";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function BiznesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navigation variant="business" />
      <main className="bg-[#0a0a0a]">
        {children}
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
