import Image from "next/image";
import Link from "next/link";
import VideoEmbed from "@/components/VideoEmbed";
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

type Tokens = ReturnType<typeof tokens>;

function SectionHeading({ children, t }: { children: string; t: Tokens }) {
  return (
    <h2 className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
      {children}
    </h2>
  );
}

function InfoList({ title, items, t }: { title: string; items: string[]; t: Tokens }) {
  return (
    <div>
      <SectionHeading t={t}>{title}</SectionHeading>
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

            {product.awards && product.awards.length > 0 && (
              <div className={`mt-7 border-t ${t.border} pt-6`}>
                <SectionHeading t={t}>Nagrody</SectionHeading>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {product.awards.map((award) => (
                    <li key={award} className={`flex items-center gap-2 text-[13px] ${t.body}`}>
                      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth={1.8}>
                        <circle cx="12" cy="9" r="6" />
                        <path strokeLinecap="round" d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5" />
                      </svg>
                      {award}
                    </li>
                  ))}
                </ul>
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

        {/* Liczby z badań */}
        {product.evidence && product.evidence.length > 0 && (
          <div className={`mt-12 border-t ${t.border} pt-10`}>
            <SectionHeading t={t}>Co pokazują badania</SectionHeading>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {product.evidence.map((item) => (
                <div key={item.label} className={`border p-6 ${t.card}`}>
                  <p
                    className="bg-clip-text text-[28px] font-bold leading-none tracking-[-0.03em] text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                  >
                    {item.value}
                  </p>
                  <p className={`mt-3 text-[14px] leading-[1.6] ${t.body}`}>{item.label}</p>
                  <p className={`mt-3 text-[11.5px] ${t.label}`}>{item.source}</p>
                </div>
              ))}
            </div>
            {/* Baza badań żyje w strefie pacjenta, więc linkujemy tylko stamtąd. */}
            {variant === "patient" && (
              <Link
                href="/efektywnosc"
                className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground"
              >
                Zobacz wszystkie badania
              </Link>
            )}
          </div>
        )}

        {/* Co zyskujesz */}
        {product.outcomes.length > 0 && (
          <div className={`mt-12 border-t ${t.border} pt-10`}>
            <SectionHeading t={t}>Co zyskujesz</SectionHeading>
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

        {/* Galeria */}
        {product.gallery && product.gallery.length > 0 && (
          <div className={`mt-12 border-t ${t.border} pt-10`}>
            <SectionHeading t={t}>Zdjęcia</SectionHeading>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {product.gallery.map((photo) => (
                <div
                  key={photo.src}
                  className={`relative aspect-[4/3] overflow-hidden border ${t.border} ${
                    t.dark ? "bg-white/[0.03]" : "bg-foreground/[0.02]"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 280px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jak wygląda sesja */}
        {product.sessionSteps && product.sessionSteps.length > 0 && (
          <div className={`mt-12 border-t ${t.border} pt-10`}>
            <SectionHeading t={t}>Jak wygląda sesja</SectionHeading>
            <ol className={`mt-6 grid grid-cols-1 border-l border-t ${t.border} sm:grid-cols-2`}>
              {product.sessionSteps.map((step, i) => (
                <li key={step.title} className={`border-b border-r ${t.border} p-7`}>
                  <span
                    className="bg-clip-text text-[12px] font-bold tracking-[0.15em] text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={`mt-3 text-[16px] font-semibold tracking-[-0.01em] ${t.text}`}>
                    {step.title}
                  </h3>
                  <p className={`mt-2.5 text-[14px] leading-[1.7] ${t.body}`}>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Zastosowania / Cechy / Grupy docelowe */}
        <div className={`mt-12 grid grid-cols-1 gap-10 border-t ${t.border} pt-10 sm:grid-cols-2 lg:grid-cols-3`}>
          <InfoList title="Zastosowania" items={product.applications} t={t} />
          <InfoList title="Najważniejsze cechy" items={product.features} t={t} />
          <InfoList title="Dla kogo" items={product.targetGroups} t={t} />
        </div>

        {/* Oprogramowanie i tryby treningu */}
        {product.software && product.software.length > 0 && (
          <div className={`mt-12 border-t ${t.border} pt-10`}>
            <SectionHeading t={t}>Aplikacja i tryby treningu</SectionHeading>
            <div className="mt-6 space-y-4">
              {product.software.map((sw) => (
                <div key={sw.name} className={`border p-6 ${t.card}`}>
                  <h3 className={`text-[16px] font-semibold tracking-[-0.01em] ${t.text}`}>{sw.name}</h3>
                  <p className={`mt-2.5 max-w-[820px] text-[14px] leading-[1.75] ${t.body}`}>
                    {sw.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Cytat z mediów */}
        {product.press && (
          <div className={`mt-8 flex flex-col gap-2 border-l-2 py-1 pl-5 sm:flex-row sm:items-baseline sm:gap-4`} style={{ borderColor: "#ff6600" }}>
            <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${t.label}`}>
              {product.press.outlet}
            </span>
            <span className={`text-[15px] leading-[1.6] ${t.body}`}>
              &ldquo;{product.press.quote}&rdquo;
            </span>
          </div>
        )}

        {/* Film produktowy - polska wersja z kanału ICAROS POLSKA */}
        {product.videos && product.videos.length > 0 && (
          <div id="film" className={`mt-12 scroll-mt-24 border-t ${t.border} pt-10`}>
            <SectionHeading t={t}>Zobacz w akcji</SectionHeading>
            <p className={`mt-4 max-w-[620px] text-[15px] leading-[1.7] ${t.body}`}>
              {product.videos.length > 1
                ? `Trzy urządzenia, które składają się na ${product.shortName}, w krótkich filmach.`
                : `Krótki film pokazuje, jak wygląda trening na urządzeniu ${product.shortName}.`}
            </p>

            {product.videos.length === 1 ? (
              <VideoEmbed
                videoId={product.videos[0].id}
                title={`${product.videos[0].title} - film produktowy`}
                poster={product.videos[0].poster}
                posterAlt={product.videos[0].posterAlt}
                posterLabel={product.category}
                posterTitle={product.videos[0].title}
                theme={theme}
                size="hero"
                hint="Film ładuje się z YouTube dopiero po kliknięciu."
                className="mt-6"
              />
            ) : (
              <>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {product.videos.map((video) => (
                    <VideoEmbed
                      key={video.id}
                      videoId={video.id}
                      title={`${video.title} - film produktowy`}
                      poster={video.poster}
                      posterAlt={video.posterAlt}
                      posterLabel={video.caption}
                      posterTitle={video.title}
                      theme={theme}
                      size="card"
                    />
                  ))}
                </div>
                <p className={`mt-4 text-[11.5px] ${t.label}`}>
                  Filmy ładują się z YouTube dopiero po kliknięciu.
                </p>
              </>
            )}
          </div>
        )}

        {/* Dane urządzenia - wymiary z katalogu ICAROS 2026 */}
        <div className={`mt-12 border-t ${t.border} pt-10`}>
          <SectionHeading t={t}>Dane urządzenia</SectionHeading>
          <dl className={`mt-6 grid grid-cols-1 border-l border-t ${t.border} sm:grid-cols-2 lg:grid-cols-3`}>
            {[
              { k: "Wymiary", v: product.specs.dimensions },
              { k: "Masa", v: product.specs.weight },
              { k: "Wzrost użytkownika", v: product.specs.userHeight },
              { k: "Masa użytkownika", v: product.specs.userWeight },
              { k: "Kompatybilność", v: product.specs.compatibility },
            ].map((row) => (
              <div key={row.k} className={`border-b border-r ${t.border} p-6`}>
                <dt className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${t.label}`}>
                  {row.k}
                </dt>
                <dd className={`mt-2 text-[14px] leading-[1.6] ${t.body}`}>{row.v}</dd>
              </div>
            ))}
          </dl>
          <p className={`mt-4 text-[11.5px] ${t.label}`}>
            Dane z katalogu produktowego ICAROS 2026.
          </p>
        </div>

        {/* Przestrzeń, wymagania i zawartość dostawy - tylko wersja biznes */}
        {variant === "business" && (
          <div className={`mt-12 grid grid-cols-1 gap-6 border-t ${t.border} pt-10 sm:grid-cols-2`}>
            <div className={`border p-6 ${t.card}`}>
              <SectionHeading t={t}>Wymagana przestrzeń</SectionHeading>
              <p className={`mt-3 text-[14px] leading-[1.7] ${t.body}`}>{product.space}</p>
            </div>
            <div className={`border p-6 ${t.card}`}>
              <SectionHeading t={t}>Wymagania techniczne</SectionHeading>
              <p className={`mt-3 text-[14px] leading-[1.7] ${t.body}`}>{product.technical}</p>
            </div>
            {product.included && (
              <div className={`border p-6 sm:col-span-2 ${t.card}`}>
                <SectionHeading t={t}>W zestawie</SectionHeading>
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

        {/* Pytania o to urządzenie */}
        {product.faqs && product.faqs.length > 0 && (
          <div className={`mt-12 border-t ${t.border} pt-10`}>
            <SectionHeading t={t}>Częste pytania</SectionHeading>
            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {product.faqs.map((faq) => (
                <div key={faq.question} className={`border p-6 ${t.card}`}>
                  <h3 className={`text-[15px] font-semibold leading-[1.5] ${t.text}`}>{faq.question}</h3>
                  <p className={`mt-3 text-[14px] leading-[1.75] ${t.body}`}>{faq.answer}</p>
                </div>
              ))}
            </div>
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
