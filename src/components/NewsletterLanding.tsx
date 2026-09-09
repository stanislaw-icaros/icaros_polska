import { Ticket, MapPin, PackagePlus, Microscope } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import {
  NEWSLETTER_BENEFITS,
  NEWSLETTER_EYEBROW,
  NEWSLETTER_LEAD,
  NEWSLETTER_TITLE,
  type NewsletterBenefit,
} from "@/lib/newsletter";

const icons: Record<NewsletterBenefit["key"], typeof Ticket> = {
  targi: Ticket,
  testy: MapPin,
  nowosci: PackagePlus,
  badania: Microscope,
};

/**
 * Treść strony zapisu, wspólna dla strefy jasnej (/newsletter) i ciemnej
 * (/newsletter-partner). Ta sama obietnica, inna oprawa.
 */
export default function NewsletterLanding({
  tone = "light",
  source,
}: {
  tone?: "light" | "dark";
  source: string;
}) {
  const dark = tone === "dark";

  const t = {
    main: dark ? "bg-foreground text-white" : "bg-white",
    eyebrow: dark ? "text-white/50" : "text-foreground/35",
    heading: dark ? "text-white" : "text-foreground",
    lead: dark ? "text-white/60" : "text-foreground/55",
    rule: dark ? "border-white/[0.09]" : "border-foreground/[0.08]",
    iconBox: dark ? "border-white/15" : "border-foreground/[0.10]",
    itemTitle: dark ? "text-white" : "text-foreground",
    itemDesc: dark ? "text-white/55" : "text-foreground/55",
    note: dark ? "text-white/35" : "text-foreground/40",
  };

  return (
    <main className={`relative overflow-hidden pb-24 pt-32 lg:pb-32 lg:pt-40 ${t.main}`}>
      <div
        className={`pointer-events-none absolute inset-0 ${dark ? "opacity-[0.035]" : "opacity-[0.03]"}`}
        style={{
          backgroundImage: dark
            ? "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)"
            : "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {dark && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 85% 12%, rgba(255,102,0,0.16), transparent 68%)",
          }}
        />
      )}

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 lg:px-10">
        {/* Na telefonie kolejność to nagłówek, formularz, lista. Na desktopie
            formularz stoi w prawej kolumnie obok obu bloków tekstu. */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[57fr_43fr] lg:gap-x-20 lg:gap-y-14">
          <div className="animate-[fade-up_0.7s_ease-out_both] lg:col-start-1 lg:row-start-1">
            <div className="flex items-center gap-3">
              <span
                className="h-[2px] w-7"
                style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }}
              />
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}
              >
                {NEWSLETTER_EYEBROW}
              </span>
            </div>

            <h1
              className={`mt-5 text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.03] tracking-[-0.04em] ${t.heading}`}
            >
              {NEWSLETTER_TITLE}
            </h1>

            <p className={`mt-5 max-w-[520px] text-[15px] leading-[1.8] sm:text-[16px] ${t.lead}`}>
              {NEWSLETTER_LEAD}
            </p>
          </div>

          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <div className="lg:sticky lg:top-28">
              <NewsletterSignup
                source={source}
                tone={tone}
                className="animate-[fade-up_0.7s_ease-out_0.15s_both]"
              />
            </div>
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <ul className={`border-t ${t.rule}`}>
              {NEWSLETTER_BENEFITS.map((benefit, index) => {
                const Icon = icons[benefit.key];
                return (
                  <li
                    key={benefit.key}
                    className={`flex gap-5 border-b py-6 animate-[fade-up_0.7s_ease-out_both] ${t.rule}`}
                    style={{ animationDelay: `${0.1 + index * 0.07}s` }}
                  >
                    <span
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border ${t.iconBox}`}
                    >
                      <Icon
                        className="h-[18px] w-[18px] text-brand-orange"
                        strokeWidth={1.5}
                      />
                    </span>
                    <div>
                      <h2 className={`text-[16px] font-bold tracking-[-0.01em] ${t.itemTitle}`}>
                        {benefit.title}
                      </h2>
                      <p className={`mt-2 max-w-[520px] text-[14px] leading-[1.75] ${t.itemDesc}`}>
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className={`mt-8 max-w-[520px] text-[13px] leading-[1.8] ${t.note}`}>
              Listę prowadzi ICAROS Polska, oficjalny dystrybutor technologii
              ICAROS. Piszemy po polsku i&nbsp;odpowiadamy na odpowiedzi wysłane
              na tę wiadomość.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
