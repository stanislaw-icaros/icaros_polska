"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

const EUR_TO_PLN = 4.25;

type AcquisitionMode = "purchase" | "lease";

interface DeviceConfig {
  id: string;
  name: string;
  shortName: string;
  purchaseEUR: number;
  purchasePLN: number;
  leaseMonthlyEUR: number;
  leaseMonthlyPLN: number;
  leasePeriodMonths: number;
}

const devices: DeviceConfig[] = [
  {
    id: "health",
    name: "ICAROS Health",
    shortName: "Health",
    purchaseEUR: 24900,
    purchasePLN: 106000,
    leaseMonthlyEUR: 567,
    leaseMonthlyPLN: 2410.05,
    leasePeriodMonths: 48,
  },
  {
    id: "guardian",
    name: "ICAROS Guardian",
    shortName: "Guardian",
    purchaseEUR: 14900,
    purchasePLN: 63500,
    leaseMonthlyEUR: 340,
    leaseMonthlyPLN: 1443.75,
    leasePeriodMonths: 48,
  },
  {
    id: "circle",
    name: "ICAROS Circle",
    shortName: "Circle",
    purchaseEUR: 49900,
    purchasePLN: 212000,
    leaseMonthlyEUR: 1134,
    leaseMonthlyPLN: 4820.09,
    leasePeriodMonths: 48,
  },
];

const DEFAULT_SESSIONS_PER_DAY = 10;
const DEFAULT_WORKING_DAYS = 22;
const DEFAULT_PRICE_PER_SESSION = 100;

function formatPLN(value: number, fractionDigits = 0): string {
  return value.toLocaleString("pl-PL", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="py-5">
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-[13px] text-foreground/50">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-[20px] font-bold text-foreground tabular-nums tracking-tight">
            {value}
          </span>
          <span className="text-[12px] text-foreground/35">{unit}</span>
        </div>
      </div>
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 pointer-events-none">
          <div
            className="h-full transition-all duration-150"
            style={{ width: `${percentage}%`, background: "linear-gradient(90deg, #ff6600, #ff7b1f)" }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="premium-slider relative z-10 w-full"
        />
      </div>
    </div>
  );
}

export default function ROICalculator() {
  const [mode, setMode] = useState<AcquisitionMode>("lease");
  const [selectedDevice, setSelectedDevice] = useState<string>("circle");
  const [sessionsPerDay, setSessionsPerDay] = useState(DEFAULT_SESSIONS_PER_DAY);
  const [workingDays, setWorkingDays] = useState(DEFAULT_WORKING_DAYS);
  const [pricePerSession, setPricePerSession] = useState(DEFAULT_PRICE_PER_SESSION);

  const device = useMemo(
    () => devices.find((d) => d.id === selectedDevice)!,
    [selectedDevice]
  );

  const results = useMemo(() => {
    const monthlySessions = sessionsPerDay * workingDays;
    const monthlyRevenue = monthlySessions * pricePerSession;
    const annualRevenue = monthlyRevenue * 12;

    if (mode === "lease") {
      const monthlyCost = device.leaseMonthlyPLN;
      const monthlyProfit = monthlyRevenue - monthlyCost;
      const annualProfit = monthlyProfit * 12;
      const totalLeaseCost = monthlyCost * device.leasePeriodMonths;

      return {
        monthlySessions,
        monthlyRevenue,
        monthlyProfit,
        annualRevenue,
        annualProfit,
        monthlyCost,
        totalCost: totalLeaseCost,
        paybackMonths: monthlyProfit > 0 ? 0 : Infinity,
        isProfitable: monthlyProfit > 0,
      };
    }

    const totalCost = device.purchasePLN;
    const monthlyProfit = monthlyRevenue;
    const paybackMonths = monthlyRevenue > 0
      ? Math.ceil(totalCost / monthlyRevenue)
      : Infinity;
    const annualProfitFirstYear = annualRevenue - totalCost;
    const annualProfitSubsequent = annualRevenue;

    return {
      monthlySessions,
      monthlyRevenue,
      monthlyProfit,
      annualRevenue,
      annualProfit: annualProfitFirstYear,
      annualProfitSubsequent,
      monthlyCost: 0,
      totalCost,
      paybackMonths,
      isProfitable: annualProfitFirstYear > 0,
    };
  }, [mode, device, sessionsPerDay, workingDays, pricePerSession]);

  const handleDeviceSelect = useCallback((id: string) => {
    setSelectedDevice(id);
  }, []);

  return (
    <div className="relative">
      {/* Mode toggle */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex border border-foreground/[0.08] p-[3px]">
            <button
              onClick={() => setMode("purchase")}
              className={`px-6 py-2.5 text-[12px] font-semibold tracking-[0.05em] uppercase transition-all duration-400 ${
                mode === "purchase"
                  ? "text-white"
                  : "text-foreground/30 hover:text-foreground/60"
              }`}
              style={mode === "purchase" ? { background: "linear-gradient(135deg, #ff6600, #ff7b1f)" } : undefined}
            >
              Zakup
            </button>
            <button
              onClick={() => setMode("lease")}
              className={`px-6 py-2.5 text-[12px] font-semibold tracking-[0.05em] uppercase transition-all duration-400 ${
                mode === "lease"
                  ? "text-white"
                  : "text-foreground/30 hover:text-foreground/60"
              }`}
              style={mode === "lease" ? { background: "linear-gradient(135deg, #ff6600, #ff7b1f)" } : undefined}
            >
              Leasing 48 mies.
            </button>
          </div>
          {mode === "lease" && (
            <p className="text-[11px] text-foreground/30 max-w-md text-center leading-relaxed">
              Szacunkowe raty netto: 48 rat, wpłata wstępna 10%, wykup 1%, przedmiot wyrób medyczny (rok prod.
              2026). Ostateczna oferta zależy od leasingodawcy i weryfikacji Twojej firmy.
            </p>
          )}
        </div>
      </div>

      {/* Device selector */}
      <div className="grid grid-cols-3 gap-0 border border-foreground/[0.06] mb-12">
        {devices.map((d) => (
          <button
            key={d.id}
            onClick={() => handleDeviceSelect(d.id)}
            className={`relative p-5 lg:p-6 text-left transition-all duration-500 ${
              d.id === selectedDevice
                ? "text-white"
                : "bg-white hover:bg-foreground/[0.02] text-foreground"
            } ${d.id !== "circle" ? "border-r border-foreground/[0.06]" : ""}`}
            style={d.id === selectedDevice ? { background: "linear-gradient(135deg, #ff6600, #ff7b1f)" } : undefined}
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={`text-[10px] font-medium tracking-[0.15em] uppercase ${
                  d.id === selectedDevice ? "text-white/70" : "text-foreground/30"
                }`}
              >
                ICAROS
              </span>
              <span className={`text-[16px] lg:text-[18px] font-bold tracking-[-0.02em] ${
                d.id === selectedDevice ? "text-white" : ""
              }`}>
                {d.shortName}
              </span>
              <span
                className={`text-[12px] font-semibold mt-1 ${
                  d.id === selectedDevice ? "text-white/90" : "text-foreground/40"
                }`}
              >
                {mode === "lease"
                  ? `${formatPLN(d.leaseMonthlyPLN, 2)} zł / mies.`
                  : `${formatPLN(d.purchasePLN)} zł netto`}
              </span>
            </div>
            {d.id === "circle" && (
              <span
                className={`absolute top-3 right-3 text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${
                  d.id === selectedDevice
                    ? "bg-white/20 text-white/90"
                    : "bg-foreground/[0.04] text-foreground/25"
                }`}
              >
                3 w 1
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Calculator grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-foreground/[0.06]">
        {/* Left: parameters */}
        <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-foreground/[0.06]">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-foreground/20 mb-2">
            Parametry
          </p>

          <div className="divide-y divide-foreground/[0.04]">
            <SliderControl
              label="Sesji dziennie"
              value={sessionsPerDay}
              min={1}
              max={30}
              step={1}
              unit="/ dzień"
              onChange={setSessionsPerDay}
            />
            <SliderControl
              label="Dni roboczych w miesiącu"
              value={workingDays}
              min={10}
              max={30}
              step={1}
              unit="dni"
              onChange={setWorkingDays}
            />
            <SliderControl
              label="Cena za sesję (30 min)"
              value={pricePerSession}
              min={50}
              max={300}
              step={5}
              unit="zł"
              onChange={setPricePerSession}
            />
          </div>
        </div>

        {/* Right: results */}
        <div className="p-8 lg:p-10">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-foreground/20 mb-6">
            Wyniki
          </p>

          <div className="space-y-6">
            {/* Monthly sessions */}
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-foreground/40">Sesji miesięcznie</span>
              <motion.span
                key={results.monthlySessions}
                initial={{ opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[20px] font-bold text-foreground tabular-nums tracking-tight"
              >
                {results.monthlySessions}
              </motion.span>
            </div>

            <div className="h-px bg-foreground/[0.04]" />

            {/* Monthly revenue */}
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-foreground/40">Przychód miesięczny</span>
              <motion.span
                key={results.monthlyRevenue}
                initial={{ opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[20px] font-bold text-foreground tabular-nums tracking-tight"
              >
                {formatPLN(results.monthlyRevenue)}{" "}
                <span className="text-[13px] font-medium text-foreground/35">zł</span>
              </motion.span>
            </div>

            {/* Monthly cost (lease only) */}
            {mode === "lease" && (
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-foreground/40">Rata leasingowa</span>
                  <span className="text-[16px] font-medium text-foreground/40 tabular-nums tracking-tight">
                    -{formatPLN(results.monthlyCost, 2)}{" "}
                    <span className="text-[12px] text-foreground/30">zł</span>
                  </span>
                </div>

                <div className="h-px bg-foreground/[0.04]" />
              </>
            )}

            {/* Monthly profit */}
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-foreground/40">
                {mode === "lease" ? "Zysk miesięczny" : "Przychód miesięczny"}
              </span>
              <motion.span
                key={`profit-${mode === "lease" ? results.monthlyProfit : results.monthlyRevenue}`}
                initial={{ opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-[24px] font-bold tabular-nums tracking-tight ${
                  (mode === "lease" ? results.monthlyProfit : results.monthlyRevenue) > 0
                    ? "text-foreground"
                    : "text-foreground/30"
                }`}
              >
                {formatPLN(mode === "lease" ? Math.round(results.monthlyProfit) : results.monthlyRevenue)}{" "}
                <span className="text-[14px] font-medium text-foreground/35">zł</span>
              </motion.span>
            </div>

            <div className="h-px bg-foreground/[0.04]" />

            {/* Annual figures */}
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-foreground/40">Przychód roczny</span>
              <motion.span
                key={results.annualRevenue}
                initial={{ opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[16px] font-medium text-foreground tabular-nums tracking-tight"
              >
                {formatPLN(results.annualRevenue)}{" "}
                <span className="text-[12px] text-foreground/30">zł</span>
              </motion.span>
            </div>

            {mode === "lease" && (
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-foreground/40">Zysk roczny</span>
                <motion.span
                  key={results.annualProfit}
                  initial={{ opacity: 0.5, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[16px] font-medium text-foreground tabular-nums tracking-tight"
                >
                  {formatPLN(results.annualProfit)}{" "}
                  <span className="text-[12px] text-foreground/30">zł</span>
                </motion.span>
              </div>
            )}

            {mode === "purchase" && (
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-foreground/40">Zwrot z inwestycji</span>
                <motion.span
                  key={results.paybackMonths}
                  initial={{ opacity: 0.5, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[16px] font-medium text-foreground tabular-nums tracking-tight"
                >
                  {results.paybackMonths === Infinity ? "—" : `${results.paybackMonths}`}{" "}
                  <span className="text-[12px] text-foreground/30">mies.</span>
                </motion.span>
              </div>
            )}

            {mode === "purchase" && (
              <>
                <div className="h-px bg-foreground/[0.04]" />
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-foreground/40">Zysk w 1. roku</span>
                  <motion.span
                    key={results.annualProfit}
                    initial={{ opacity: 0.5, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[24px] font-bold tabular-nums tracking-tight ${
                      results.annualProfit > 0 ? "text-foreground" : "text-foreground/30"
                    }`}
                  >
                    {formatPLN(results.annualProfit)}{" "}
                    <span className="text-[14px] font-medium text-foreground/35">zł</span>
                  </motion.span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Exchange rate note */}
      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-[11px] text-foreground/25">
          Kurs EUR/PLN: {EUR_TO_PLN.toFixed(2)} &middot; Ceny netto &middot;
          Kalkulacja ma charakter orientacyjny
        </p>
        <p className="text-[11px] text-foreground/25 max-w-md text-right leading-relaxed">
          Leasing: 48 mies., 10% wpłata, 1% wykup (netto, szacunek) &middot; warunki potwierdza leasingodawca
        </p>
      </div>
    </div>
  );
}
