"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "../lib/calculations";
import type { CalculatorResult } from "../lib/types";

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
          <span className="text-foreground/50">Rata leasingowa (60 mies.)</span>
          <span className="font-semibold text-foreground">- {formatCurrency(result.leasing60)} zł / mies.</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-foreground/60 font-medium">Szacowany zysk netto</span>
          <span
            className={`text-[22px] font-bold tracking-[-0.02em] ${
              result.profit60 >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            <CountNumber value={result.profit60} /> zł / mies.
          </span>
        </div>
      </div>

      <div className="mt-8 border border-foreground/[0.06] bg-surface p-4 lg:p-5 text-[13px]" style={{ fontVariantNumeric: "tabular-nums" }}>
        <div className="grid grid-cols-3 gap-3 text-foreground/35 uppercase tracking-[0.14em] text-[10px] font-semibold">
          <span />
          <span>48 mies.</span>
          <span>60 mies.</span>
        </div>
        <div className="mt-3 space-y-2 text-foreground/70">
          <div className="grid grid-cols-3 gap-3">
            <span>Rata netto</span>
            <span>{formatCurrency(result.leasing48)} zł</span>
            <span>{formatCurrency(result.leasing60)} zł</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <span>Szac. zysk/mies.</span>
            <span>{formatCurrency(result.profit48)} zł</span>
            <span>{formatCurrency(result.profit60)} zł</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <span>Szac. zysk/rok</span>
            <span>{formatCurrency(result.yearlyProfit48)} zł</span>
            <span>{formatCurrency(result.yearlyProfit60)} zł</span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-foreground/35 leading-relaxed">
        Kwoty netto. Kalkulacja szacunkowa na podstawie podanych danych. Warunki leasingu zależą od
        leasingodawcy i sytuacji finansowej firmy.
      </p>
    </section>
  );
}

