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

export const LEASING_48 = 5100;
export const LEASING_60 = 4200;

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
  const profit48 = monthlyRevenue - LEASING_48;
  const profit60 = monthlyRevenue - LEASING_60;

  return {
    sessionsPerDay,
    icarosSessionPrice,
    monthlyRevenue,
    leasing48: LEASING_48,
    leasing60: LEASING_60,
    profit48,
    profit60,
    yearlyProfit48: profit48 * 12,
    yearlyProfit60: profit60 * 12,
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

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 0,
  }).format(value);
}

