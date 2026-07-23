import Navigation from "@/components/Navigation";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navigation />
      <main>
        {children}
        <ContactCTA variant="patient" />
      </main>
      <Footer variant="patient" />
    </>
  );
}
