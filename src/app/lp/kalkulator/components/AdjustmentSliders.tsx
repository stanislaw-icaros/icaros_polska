"use client";

import { useCallback, useRef } from "react";
import { formatCurrency } from "../lib/calculations";

type AdjustmentSlidersProps = {
  sessionsPerDay: number;
  icarosSessionPrice: number;
  daysInMonth: number;
  onSessionsChange: (value: number) => void;
  onPriceChange: (value: number) => void;
  onDaysChange: (value: number) => void;
};

export default function AdjustmentSliders({
  sessionsPerDay,
  icarosSessionPrice,
  daysInMonth,
  onSessionsChange,
  onPriceChange,
  onDaysChange,
}: AdjustmentSlidersProps) {
  const dragging = useRef(false);

  const lockScroll = useCallback((e: React.TouchEvent) => {
    dragging.current = true;
    const el = e.currentTarget as HTMLElement;
    const prevent = (ev: TouchEvent) => { if (dragging.current) ev.preventDefault(); };
    el.addEventListener("touchmove", prevent, { passive: false });
    const unlock = () => {
      dragging.current = false;
      el.removeEventListener("touchmove", prevent);
      el.removeEventListener("touchend", unlock);
      el.removeEventListener("touchcancel", unlock);
    };
    el.addEventListener("touchend", unlock, { once: true });
    el.addEventListener("touchcancel", unlock, { once: true });
  }, []);

  return (
    <section className="mt-12 border border-foreground/[0.08] bg-white p-5 sm:p-6 lg:p-10">
      <h3 className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
        Chcesz sprawdzić inne scenariusze?
      </h3>
      <p className="mt-2 text-[14px] text-foreground/45">
        Dostosuj parametry i obserwuj, jak zmienia się wynik kalkulacji.
      </p>

      <div className="mt-8 space-y-7">
        <div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-foreground/60">Liczba sesji ICAROS / dzień</span>
            <span className="font-semibold text-foreground">{sessionsPerDay}</span>
          </div>
          <input
            className="premium-slider mt-3"
            type="range"
            min={1}
            max={14}
            step={1}
            value={sessionsPerDay}
            onChange={(event) => onSessionsChange(Number(event.target.value))}
            onTouchStart={lockScroll}
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-foreground/60">Cena sesji ICAROS</span>
            <span className="font-semibold text-foreground">{formatCurrency(icarosSessionPrice)} zł</span>
          </div>
          <input
            className="premium-slider mt-3"
            type="range"
            min={80}
            max={300}
            step={5}
            value={icarosSessionPrice}
            onChange={(event) => onPriceChange(Number(event.target.value))}
            onTouchStart={lockScroll}
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-foreground/60">Dni robocze w miesiącu</span>
            <span className="font-semibold text-foreground">{daysInMonth}</span>
          </div>
          <input
            className="premium-slider mt-3"
            type="range"
            min={14}
            max={26}
            step={1}
            value={daysInMonth}
            onChange={(event) => onDaysChange(Number(event.target.value))}
            onTouchStart={lockScroll}
          />
        </div>
      </div>
    </section>
  );
}
