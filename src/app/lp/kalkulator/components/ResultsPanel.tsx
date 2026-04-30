"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency, LEASING_RATES_48M_NET_PLN } from "../lib/calculations";
import type { CalculatorResult } from "../lib/types";

const LEASING_VARIANTS = [
  { label: "ICAROS Guardian", netValue: 63_500, rate: LEASING_RATES_48M_NET_PLN.guardian },
  { label: "ICAROS Health", netValue: 106_000, rate: LEASING_RATES_48M_NET_PLN.health },
  { label: "ICAROS Circle", netValue: 212_000, rate: LEASING_RATES_48M_NET_PLN.circle },
] as const;

type ResultsPanelProps = {
  result: CalculatorResult;
};

function CountNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const fromRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    fromRef.current = displayValue;
    const from = fromRef.current;
    const duration = 400;
    const start = performance.now();

    cancelAnimationFrame(rafRef.current);

    const update = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(from + (value - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{formatCurrency(displayValue)}</>;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <section className="mt-12 border border-foreground/[0.08] bg-white p-6 lg:p-10">
      <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-foreground/30">
        Szacowany dodatkowy przychód z ICAROS Circle
      </p>

      <div className="mt-6">
        <p className="text-[20px] lg:text-[28px] font-bold tracking-[-0.03em] text-foreground">
          {result.sessionsPerDay} sesji ICAROS / dzień
        </p>
        <p className="mt-2 text-[13px] text-foreground/40">
          Konserwatywny start przy Twoim zespole i zapełnieniu 50%.
        </p>
      </div>

      <div className="mt-8 space-y-3 text-[15px]" style={{ fontVariantNumeric: "tabular-nums" }}>
        <div className="flex items-center justify-between border-b border-foreground/[0.06] pb-2">
          <span className="text-foreground/50">Dodatkowy przychód</span>
          <span className="font-semibold text-foreground">
            <CountNumber value={result.monthlyRevenue} /> zł / mies.
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-foreground/[0.06] pb-2">
          <span className="text-foreground/50">Rata leasingowa Circle (48 mies.)</span>
          <span className="font-semibold text-foreground">
            -{" "}
            {formatCurrency(result.leasingMonthlyNet, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            zł / mies.
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-foreground/60 font-medium">Szacowany zysk netto</span>
          <span
            className={`text-[22px] font-bold tracking-[-0.02em] ${
              result.profitMonthlyNet >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            <CountNumber value={Math.round(result.profitMonthlyNet)} /> zł / mies.
          </span>
        </div>
      </div>

      <div className="mt-8 border border-foreground/[0.06] bg-surface p-4 lg:p-5 text-[13px]" style={{ fontVariantNumeric: "tabular-nums" }}>
        <p className="text-[11px] text-foreground/45 leading-relaxed mb-4">
          Szacunkowe raty netto przy 48 ratach, 10% wpłacie wstępnej i 1% wykupie końcowym (wyrób medyczny,
          rok prod. 2026). Ostateczna oferta zależy od leasingodawcy.
        </p>
        <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr] gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.12em] font-semibold text-foreground/35 border-b border-foreground/[0.06] pb-2">
          <span>Wariant</span>
          <span className="text-right">Wartość netto</span>
          <span className="text-right">Rata / mies.</span>
        </div>
        <div className="mt-3 space-y-2.5 text-foreground/70">
          {LEASING_VARIANTS.map((row) => (
            <div key={row.label} className="grid grid-cols-[1.2fr_0.9fr_0.9fr] gap-x-3 items-baseline">
              <span className="text-[13px]">{row.label}</span>
              <span className="text-right tabular-nums">{formatCurrency(row.netValue)} zł</span>
              <span className="text-right tabular-nums">
                {formatCurrency(row.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-foreground/[0.06] grid grid-cols-2 gap-3 text-[13px]">
          <div>
            <span className="text-foreground/45">Szac. zysk / mies. (Circle)</span>
            <div
              className={`mt-1 font-semibold tabular-nums ${
                result.profitMonthlyNet >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {formatCurrency(Math.round(result.profitMonthlyNet))} zł
            </div>
          </div>
          <div>
            <span className="text-foreground/45">Szac. zysk / rok (Circle)</span>
            <div
              className={`mt-1 font-semibold tabular-nums ${
                result.yearlyProfitNet >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {formatCurrency(Math.round(result.yearlyProfitNet))} zł
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-foreground/35 leading-relaxed">
        Kwoty netto. Kalkulator pokazuje wyłącznie szacunki edukacyjne przy powyższych założeniach leasingu
        (m.in. 10% wpłaty i 48 rat). Wynik zależy także od Twojej ceny sesji i zapełnienia — nie zastępuje oferty
        leasingodawcy.
      </p>
    </section>
  );
}
