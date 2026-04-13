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
    leaseMonthlyEUR: 610,
    leaseMonthlyPLN: 2600,
    leasePeriodMonths: 60,
  },
  {
    id: "guardian",
    name: "ICAROS Guardian",
    shortName: "Guardian",
    purchaseEUR: 14900,
    purchasePLN: 63500,
    leaseMonthlyEUR: 355,
    leaseMonthlyPLN: 1500,
    leasePeriodMonths: 60,
  },
  {
    id: "circle",
    name: "ICAROS Circle",
    shortName: "Circle",
    purchaseEUR: 49900,
    purchasePLN: 212000,
    leaseMonthlyEUR: 990,
    leaseMonthlyPLN: 4200,
    leasePeriodMonths: 60,
  },
];

const DEFAULT_SESSIONS_PER_DAY = 10;
const DEFAULT_WORKING_DAYS = 22;
const DEFAULT_PRICE_PER_SESSION = 100;

function formatPLN(value: number): string {
  return value.toLocaleString("pl-PL");
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
          <span className="text-[12px] text-foreground/25">{unit}</span>
        </div>
      </div>
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 pointer-events-none">
          <div
            className="h-full bg-foreground/80 transition-all duration-150"
            style={{ width: `${percentage}%` }}
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
        <div className="inline-flex border border-foreground/[0.08] p-[3px]">
          <button
            onClick={() => setMode("purchase")}
            className={`px-6 py-2.5 text-[12px] font-semibold tracking-[0.05em] uppercase transition-all duration-400 ${
              mode === "purchase"
                ? "bg-foreground text-white"
                : "text-foreground/30 hover:text-foreground/60"
            }`}
          >
            Zakup
          </button>
          <button
            onClick={() => setMode("lease")}
            className={`px-6 py-2.5 text-[12px] font-semibold tracking-[0.05em] uppercase transition-all duration-400 ${
              mode === "lease"
                ? "bg-foreground text-white"
                : "text-foreground/30 hover:text-foreground/60"
            }`}
          >
            Leasing 60 mies.
          </button>
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
                ? "bg-foreground text-white"
                : "bg-white hover:bg-foreground/[0.02] text-foreground"
            } ${d.id !== "circle" ? "border-r border-foreground/[0.06]" : ""}`}
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={`text-[10px] font-medium tracking-[0.15em] uppercase ${
                  d.id === selectedDevice ? "text-white/40" : "text-foreground/20"
                }`}
              >
                ICAROS
              </span>
              <span className="text-[16px] lg:text-[18px] font-bold tracking-[-0.02em]">
                {d.shortName}
              </span>
              <span
                className={`text-[12px] font-medium mt-1 ${
                  d.id === selectedDevice ? "text-white/50" : "text-foreground/30"
                }`}
              >
                {mode === "lease"
                  ? `${formatPLN(d.leaseMonthlyPLN)} zł / mies.`
                  : `${formatPLN(d.purchasePLN)} zł netto`}
              </span>
            </div>
            {d.id === "circle" && (
              <span
                className={`absolute top-3 right-3 text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${
                  d.id === selectedDevice
                    ? "bg-white/10 text-white/60"
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
                <span className="text-[13px] font-medium text-foreground/25">zł</span>
              </motion.span>
            </div>

            {/* Monthly cost (lease only) */}
            {mode === "lease" && (
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-foreground/40">Rata leasingowa</span>
                  <span className="text-[16px] font-medium text-foreground/40 tabular-nums tracking-tight">
                    -{formatPLN(results.monthlyCost)}{" "}
                    <span className="text-[12px] text-foreground/20">zł</span>
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
                {formatPLN(mode === "lease" ? results.monthlyProfit : results.monthlyRevenue)}{" "}
                <span className="text-[14px] font-medium text-foreground/25">zł</span>
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
                <span className="text-[12px] text-foreground/20">zł</span>
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
                  <span className="text-[12px] text-foreground/20">zł</span>
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
                  <span className="text-[12px] text-foreground/20">mies.</span>
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
                    <span className="text-[14px] font-medium text-foreground/25">zł</span>
                  </motion.span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Exchange rate note */}
      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-[11px] text-foreground/15">
          Kurs EUR/PLN: {EUR_TO_PLN.toFixed(2)} &middot; Ceny netto &middot;
          Kalkulacja ma charakter orientacyjny
        </p>
        <p className="text-[11px] text-foreground/15">
          Leasing: 60 mies. &middot; Warunki indywidualne
        </p>
      </div>
    </div>
  );
}
