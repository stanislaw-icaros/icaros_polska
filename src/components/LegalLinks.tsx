import Link from "next/link";

type LegalLinksProps = {
  className?: string;
  linkClassName?: string;
};

export default function LegalLinks({
  className = "flex items-center gap-8",
  linkClassName = "text-[11px] text-white/15 hover:text-white/40 transition-colors duration-500",
}: LegalLinksProps) {
  return (
    <div className={className}>
      <Link href="/polityka-prywatnosci" className={linkClassName}>
        Polityka prywatności
      </Link>
      <Link href="/polityka-cookies" className={linkClassName}>
        Polityka cookies
      </Link>
    </div>
  );
}
