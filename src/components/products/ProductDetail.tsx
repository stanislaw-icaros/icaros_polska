import Image from "next/image";
import Link from "next/link";
import type { IcarosProduct } from "@/lib/products";

type Theme = "light" | "dark";
type Variant = "patient" | "business";

function tokens(theme: Theme) {
  const dark = theme === "dark";
  return {
    dark,
    text: dark ? "text-white" : "text-foreground",
    eyebrow: dark ? "text-white/55" : "text-foreground/55",
    tagline: dark ? "text-white/80" : "text-foreground/75",
    body: dark ? "text-white/70" : "text-foreground/70",
    label: dark ? "text-white/45" : "text-foreground/45",
    border: dark ? "border-white/10" : "border-foreground/10",
    card: dark ? "border-white/[0.08] bg-white/[0.02]" : "border-foreground/[0.08] bg-foreground/[0.02]",
    chip: dark
      ? "border-white/12 bg-white/[0.04] text-white/75"
      : "border-foreground/12 bg-foreground/[0.03] text-foreground/75",
    dot: dark ? "text-white/70" : "text-foreground/70",
    back: dark ? "text-white/55 hover:text-white" : "text-foreground/55 hover:text-foreground",
  };
}

function InfoList({
  title,
  items,
  t,
}: {
  title: string;
  items: string[];
  t: ReturnType<typeof tokens>;
}) {
  return (
    <div>
      <h2 className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className={`flex gap-2.5 text-[14px] leading-[1.6] ${t.body}`}>
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ background: "#ff6600" }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductDetail({
  product,
  theme,
  variant,
  basePath,
}: {
  product: IcarosProduct;
  theme: Theme;
  variant: Variant;
  basePath: string;
}) {
  const t = tokens(theme);

  return (
    <article className={`relative px-6 pb-20 pt-28 sm:px-10 lg:px-16 lg:pb-28 lg:pt-36 ${t.text}`}>
      <div className="mx-auto w-full max-w-[1180px]">
        <Link
          href={basePath}
          className={`inline-flex items-center gap-2 text-[13px] font-medium transition-colors ${t.back}`}
        >
          <span aria-hidden>←</span> Wszystkie urządzenia
        </Link>

        {/* Nagłówek + zdjęcie */}
        <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-7" style={{ background: "linear-gradient(90deg,#ff6600,#ff7b1f)" }} />
              <span className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
                {product.category}
              </span>
            </div>
            <h1 className="mt-4 text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.03] tracking-[-0.035em]">
              {product.name}
            </h1>
            <p className={`mt-3 text-[17px] font-medium ${t.tagline}`}>{product.tagline}</p>
            <p className={`mt-5 max-w-[520px] text-[15px] leading-[1.7] ${t.body}`}>
              {product.shortDesc}
            </p>

            {product.focusAreas.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.focusAreas.map((area) => (
                  <span
                    key={area}
                    className={`border px-3 py-1.5 text-[11px] font-medium ${t.chip}`}
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={`relative aspect-[4/3] overflow-hidden border ${t.border}`}>
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 560px"
              priority
            />
          </div>
        </div>

        {/* Dłuższy opis */}
        <div className={`mt-14 max-w-[760px] space-y-4 border-t ${t.border} pt-10`}>
          {product.longDesc.map((para, i) => (
            <p key={i} className={`text-[15.5px] leading-[1.8] ${t.body}`}>
              {para}
            </p>
          ))}
        </div>

        {/* Co zyskujesz */}
        {product.outcomes.length > 0 && (
          <div className={`mt-12 border-t ${t.border} pt-10`}>
            <h2 className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
              Co zyskujesz
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {product.outcomes.map((outcome) => (
                <div key={outcome} className={`flex items-start gap-3 border p-4 ${t.card}`}>
                  <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className={`text-[14px] leading-[1.6] ${t.body}`}>{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zastosowania / Cechy / Grupy docelowe */}
        <div className={`mt-12 grid grid-cols-1 gap-10 border-t ${t.border} pt-10 sm:grid-cols-2 lg:grid-cols-3`}>
          <InfoList title="Zastosowania" items={product.applications} t={t} />
          <InfoList title="Najważniejsze cechy" items={product.features} t={t} />
          <InfoList title="Dla kogo" items={product.targetGroups} t={t} />
        </div>

        {/* Opinia */}
        {product.testimonial && (
          <figure className={`mt-12 border-t ${t.border} pt-10`}>
            <blockquote className={`max-w-[760px] text-[19px] font-light italic leading-[1.55] lg:text-[22px] ${t.text}`}>
              &ldquo;{product.testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-baseline gap-2">
              <span className={`text-[14px] font-semibold ${t.text}`}>{product.testimonial.author}</span>
              <span className={`text-[13px] ${t.label}`}>{product.testimonial.role}</span>
            </figcaption>
          </figure>
        )}

        {/* Film - pojawia się, gdy uzupełnimy videoUrl */}
        {product.videoUrl && (
          <div className={`mt-12 border-t ${t.border} pt-10`}>
            <h2 className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
              Zobacz w akcji
            </h2>
            <div className={`relative mt-5 aspect-video overflow-hidden border ${t.border}`}>
              <iframe
                src={product.videoUrl}
                title={`${product.name} - film`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Dane techniczne i przestrzeń - tylko wersja biznes */}
        {variant === "business" && (
          <div className={`mt-12 grid grid-cols-1 gap-6 border-t ${t.border} pt-10 sm:grid-cols-2`}>
            <div className={`border p-6 ${t.card}`}>
              <h2 className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
                Wymagana przestrzeń
              </h2>
              <p className={`mt-3 text-[14px] leading-[1.7] ${t.body}`}>{product.space}</p>
            </div>
            <div className={`border p-6 ${t.card}`}>
              <h2 className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
                Wymagania techniczne
              </h2>
              <p className={`mt-3 text-[14px] leading-[1.7] ${t.body}`}>{product.technical}</p>
            </div>
            {product.included && (
              <div className={`border p-6 sm:col-span-2 ${t.card}`}>
                <h2 className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
                  W zestawie
                </h2>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {product.included.map((item) => (
                    <li key={item} className={`flex gap-2.5 text-[14px] leading-[1.6] ${t.body}`}>
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ background: "#ff6600" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className={`mt-14 flex flex-col items-start gap-4 border-t ${t.border} pt-10 sm:flex-row sm:items-center sm:justify-between`}>
          <p className={`text-[15px] ${t.body}`}>
            {variant === "business"
              ? `Chcesz zobaczyć ${product.shortName} na żywo? Umów bezpłatną prezentację.`
              : `Chcesz dowiedzieć się więcej o ${product.shortName}? Napisz do nas lub znajdź placówkę z ICAROS w pobliżu.`}
          </p>
          <a
            href={variant === "business" ? "#kontakt" : "/kontakt"}
            className="inline-flex shrink-0 items-center gap-2 px-7 py-3 text-[13px] font-semibold text-white transition-opacity duration-300 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
          >
            {variant === "business" ? "Umów prezentację" : "Skontaktuj się"}
          </a>
        </div>
      </div>
    </article>
  );
}
