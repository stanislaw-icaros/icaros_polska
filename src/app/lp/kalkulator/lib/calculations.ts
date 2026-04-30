import type {
  CalculatorResult,
  HoursBandKey,
  QuizAnswers,
  StaffBandKey,
  WorkingDaysBandKey,
} from "./types";

export const HOURS_MAP: Record<HoursBandKey, number> = {
  do4: 3.5,
  "4-6": 5,
  "6-8": 7,
  "8-10": 9,
  pow10: 11,
};

export const STAFF_MAP: Record<StaffBandKey, number> = {
  "1": 1,
  "2-3": 2.5,
  "4-6": 5,
  "7plus": 7,
};

export const DAYS_MAP: Record<WorkingDaysBandKey, number> = {
  do18: 17,
  "18-20": 19,
  "20-22": 21,
  pow22: 23,
};

/** Szacunkowe raty netto / mies., 48 rat, wpłata wstępna 10%, wykup 1%, przedmiot: wyrób medyczny, rok prod. 2026 */
export const LEASING_RATES_48M_NET_PLN = {
  guardian: 1443.75,
  health: 2410.05,
  circle: 4820.09,
} as const;

/** Kalkulator LP (ICAROS Circle) — odjęcie od przychodu */
export const LEASING_CIRCLE_MONTHLY_NET_PLN = LEASING_RATES_48M_NET_PLN.circle;

type SimulationInput = {
  mappedHours: number;
  mappedStaff: number;
  mappedDays: number;
  baseSessionPrice: number;
  sessionOverride?: number;
  icarosPriceOverride?: number;
  daysOverride?: number;
};

export function runSimulation({
  mappedHours,
  mappedStaff,
  mappedDays,
  baseSessionPrice,
  sessionOverride,
  icarosPriceOverride,
  daysOverride,
}: SimulationInput): CalculatorResult {
  const maxFromTime = mappedHours * 2;
  const maxFromStaff = mappedStaff * 2;
  const baseSessions = Math.min(maxFromTime, maxFromStaff) * 0.5;

  const sessionsPerDay = Math.max(1, sessionOverride ?? Math.floor(baseSessions));
  const icarosSessionPrice =
    icarosPriceOverride ?? Math.max(50, Math.round(baseSessionPrice * 1.2));
  const daysInMonth = daysOverride ?? mappedDays;

  const monthlyRevenue = sessionsPerDay * daysInMonth * icarosSessionPrice;
  const profitMonthlyNet = monthlyRevenue - LEASING_CIRCLE_MONTHLY_NET_PLN;

  return {
    sessionsPerDay,
    icarosSessionPrice,
    monthlyRevenue,
    leasingMonthlyNet: LEASING_CIRCLE_MONTHLY_NET_PLN,
    profitMonthlyNet,
    yearlyProfitNet: profitMonthlyNet * 12,
    mappedHours,
    mappedStaff,
    mappedDays: daysInMonth,
  };
}

export function calculateFromAnswers(answers: QuizAnswers): CalculatorResult | null {
  if (
    !answers.hoursBand ||
    !answers.staffBand ||
    !answers.workingDaysBand ||
    !answers.baseSessionPrice
  ) {
    return null;
  }

  return runSimulation({
    mappedHours: HOURS_MAP[answers.hoursBand],
    mappedStaff: STAFF_MAP[answers.staffBand],
    mappedDays: DAYS_MAP[answers.workingDaysBand],
    baseSessionPrice: answers.baseSessionPrice,
  });
}

export function formatCurrency(
  value: number,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
) {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(value);
}

