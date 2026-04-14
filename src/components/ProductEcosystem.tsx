"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";

const products = [
  {
    step: "01",
    name: "ICAROS Health",
    category: "Rehabilitacja",
    description:
      "Wspomagany trening w pozycji horyzontalnej. Certyfikowany wyrób medyczny klasy I — idealne rozwiązanie dla pacjentów neurologicznych i ortopedycznych.",
    position: "Horyzontalna — wspomagana",
    indications: "Bóle kręgosłupa, wskazania neurologiczne",
    image: "/Icaros-24_0544.webp",
    imageAlt: "Terapeuta asystujący pacjentce podczas sesji na ICAROS Health z goglami VR",
  },
  {
    step: "02",
    name: "ICAROS Guardian",
    category: "Trening stabilności",
    description:
      "Dynamiczny trening pionowy z pełnym wsparciem. Poprawia kontrolę posturalną, równowagę i koordynację. Minimalny nadzór — idealne dla seniorów.",
    position: "Wertykalna — wspierana",
    indications: "Prewencja upadków, rehabilitacja seniorów",
    image: "/senior_2.webp",
    imageAlt: "Senior ćwiczący na ICAROS Guardian z interaktywną grą na ekranie",
  },
  {
    step: "03",
    name: "ICAROS Cloud",
    category: "Trening pełnego ciała",
    description:
      "Wszechstronny trening post-rehabilitacyjny całego ciała. Lekki, kompaktowy — idealny na końcowym etapie rehabilitacji i w przygotowaniu motorycznym.",
    position: "Wertykalna — wolnostojąca",
    indications: "Post-rehabilitacja, trening wydolnościowy",
    image: "/Icaros-24_0428.webp",
    imageAlt: "Kobieta trenująca na platformie ICAROS Cloud z ekranem wyświetlającym grę",
  },
];

export default function ProductEcosystem() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="produkty" ref={ref} className="py-28 lg:py-40 bg-foreground text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/40">
            ICAROS Circle
          </p>
          <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.03em] text-white leading-[1.1]">
            Kompletny ekosystem treningowy
          </h2>
          <p className="mt-5 text-[16px] text-white/45 leading-[1.8]">
            Trzy zaawansowane urządzenia. Jeden zintegrowany system. Pełna ścieżka
            terapeutyczna — od pierwszych ćwiczeń wspomaganych po intensywny trening
            całego ciała.
          </p>
        </motion.div>

        <div className="mt-20 space-y-0">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.2 + i * 0.15,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-white/[0.06] last:border-b"
            >
              <div
                className={`relative aspect-[16/10] lg:aspect-auto lg:min-h-[400px] overflow-hidden ${
                  i % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/20" />
              </div>

              <div
                className={`p-8 lg:p-14 flex flex-col justify-center ${
                  i % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <span
                  className="text-[48px] lg:text-[56px] font-bold leading-none bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                >
                  {product.step}
                </span>

                <div className="mt-4">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40">
                    {product.category}
                  </span>

                  <h3 className="mt-3 text-[22px] font-bold text-white tracking-[-0.01em]">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-[12px] text-white/35 font-medium">
                    {product.position}
                  </p>

                  <p className="mt-5 text-[14px] text-white/50 leading-[1.8]">
                    {product.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-white/[0.06]">
                    <p className="text-[13px] text-white/45">
                      {product.indications}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="#kontakt"
            className="group inline-flex items-center gap-3 text-[13px] font-semibold text-white/50 hover:text-white transition-colors duration-500 tracking-[0.02em]"
          >
            Dowiedz się więcej o ICAROS Circle
            <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
