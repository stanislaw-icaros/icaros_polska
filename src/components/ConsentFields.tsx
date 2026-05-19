import Link from "next/link";

type ConsentFieldsProps = {
  dataConsent: boolean;
  onDataConsentChange: (value: boolean) => void;
  marketingConsent?: boolean;
  onMarketingConsentChange?: (value: boolean) => void;
  /** Ukryj zgodę marketingową — np. w krokach lejka, gdzie nie zbieramy adresu e-mail. */
  showMarketing?: boolean;
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Zgody RODO używane w formularzach:
 * - zgoda na przetwarzanie danych (wymagana, warunek obsługi zgłoszenia),
 * - zgoda marketingowa (opcjonalna, warunek dopisania do listy nurture).
 */
export default function ConsentFields({
  dataConsent,
  onDataConsentChange,
  marketingConsent = false,
  onMarketingConsentChange,
  showMarketing = true,
  tone = "dark",
  className = "",
}: ConsentFieldsProps) {
  const textClass = tone === "dark" ? "text-white/50" : "text-foreground/55";
  const mutedClass = tone === "dark" ? "text-white/30" : "text-foreground/35";
  const linkClass =
    tone === "dark"
      ? "text-white/75 decoration-white/25 hover:text-white"
      : "text-foreground/75 decoration-foreground/30 hover:text-foreground";

  return (
    <div className={`space-y-2.5 ${className}`}>
      <label className={`flex items-start gap-2.5 text-[12px] leading-[1.5] ${textClass}`}>
        <input
          type="checkbox"
          required
          checked={dataConsent}
          onChange={(event) => onDataConsentChange(event.target.checked)}
          className="mt-[2px] shrink-0 accent-brand-orange"
        />
        <span>
          Wyrażam zgodę na przetwarzanie moich danych przez ICAROS Polska w celu
          obsługi zgłoszenia. Zapoznałem się z{" "}
          <Link
            href="/polityka-prywatnosci"
            target="_blank"
            className={`underline underline-offset-2 transition-colors ${linkClass}`}
          >
            Polityką prywatności
          </Link>
          . <span className={mutedClass}>(wymagane)</span>
        </span>
      </label>
      {showMarketing && onMarketingConsentChange ? (
        <label className={`flex items-start gap-2.5 text-[12px] leading-[1.5] ${textClass}`}>
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(event) => onMarketingConsentChange(event.target.checked)}
            className="mt-[2px] shrink-0 accent-brand-orange"
          />
          <span>
            Chcę otrzymywać od ICAROS Polska materiały edukacyjne i informacje
            o rozwiązaniach dla rehabilitacji e-mailem. Zgodę mogę wycofać
            w każdej chwili.
          </span>
        </label>
      ) : null}
    </div>
  );
}
