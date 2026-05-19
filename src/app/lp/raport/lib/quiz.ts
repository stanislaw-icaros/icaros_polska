import {
  LEASING_RATES_48M_NET_PLN,
  formatCurrency,
} from "@/app/lp/kalkulator/lib/calculations";

export { formatCurrency };

/** Klucz sessionStorage - dane leada przenoszone z /lp/raport do /lp/raport/quiz. */
export const LEAD_STORAGE_KEY = "icaros_lp_raport_lead";

export type LeadHandoff = {
  firstName: string;
  email: string;
  company: string;
  marketingConsent: boolean;
  utm: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  };
};

export type FacilityType = "klinika" | "fizjoterapia" | "senior" | "szpital";
export type PatientsBand = "1-5" | "6-15" | "16-30" | "30+";
export type TechInterest = "aktywnie" | "zainteresowani" | "tradycyjne";

export type QuizAnswers = {
  facilityType: FacilityType | null;
  patientsBand: PatientsBand | null;
  techInterest: TechInterest | null;
};

export const FACILITY_OPTIONS: { key: FacilityType; label: string }[] = [
  { key: "klinika", label: "Klinika rehabilitacyjna" },
  { key: "fizjoterapia", label: "Gabinet fizjoterapii" },
  { key: "senior", label: "Centrum senioralne / dom opieki" },
  { key: "szpital", label: "Szpital / oddział rehabilitacji" },
];

export const PATIENTS_OPTIONS: { key: PatientsBand; label: string }[] = [
  { key: "1-5", label: "1-5 pacjentów" },
  { key: "6-15", label: "6-15 pacjentów" },
  { key: "16-30", label: "16-30 pacjentów" },
  { key: "30+", label: "Powyżej 30 pacjentów" },
];

export const TECH_OPTIONS: { key: TechInterest; label: string }[] = [
  { key: "aktywnie", label: "Tak, aktywnie szukamy" },
  { key: "zainteresowani", label: "Interesuje nas, ale jeszcze nie szukaliśmy" },
  { key: "tradycyjne", label: "Na razie stawiamy na metody tradycyjne" },
];

/** Cena jednej sesji VR - konserwatywnie, w widełkach polskiego rynku (60-200 zł / 30 min). */
export const VR_SESSION_PRICE_PLN = 100;
/** Standardowa liczba dni roboczych placówki w miesiącu. */
export const WORKING_DAYS_PER_MONTH = 21;

type ModelKey = "guardian" | "health" | "circle";

type IcarosModel = {
  key: ModelKey;
  name: string;
  /** Do czego model jest przeznaczony - krótki opis dla wyniku quizu. */
  purpose: string;
  /** Cena netto urządzenia w PLN (materiały polskie). */
  priceNet: number;
  /** Szacunkowa rata leasingu netto / mies., 48 rat, 10% wpłaty, 1% wykupu (EFL). */
  leasingNet: number;
};

export const ICAROS_MODELS: Record<ModelKey, IcarosModel> = {
  guardian: {
    key: "guardian",
    name: "ICAROS Guardian",
    purpose: "prewencja upadków i terapia seniorów",
    priceNet: 63500,
    leasingNet: LEASING_RATES_48M_NET_PLN.guardian,
  },
  health: {
    key: "health",
    name: "ICAROS Health",
    purpose: "rehabilitacja neurologiczna i ortopedyczna",
    priceNet: 106000,
    leasingNet: LEASING_RATES_48M_NET_PLN.health,
  },
  circle: {
    key: "circle",
    name: "ICAROS Circle",
    purpose: "pełny system 4 urządzeń dla placówek o dużym przepływie pacjentów",
    priceNet: 212000,
    leasingNet: LEASING_RATES_48M_NET_PLN.circle,
  },
};

/**
 * Szacunkowa liczba sesji ICAROS dziennie - konserwatywnie, jako ułamek
 * dziennego przepływu pacjentów (część pacjentów kwalifikuje się do terapii VR).
 */
const SESSIONS_PER_DAY: Record<PatientsBand, number> = {
  "1-5": 2,
  "6-15": 3,
  "16-30": 5,
  "30+": 6,
};

/**
 * Dobór modelu do segmentu placówki:
 * - centra senioralne / domy opieki -> Guardian (prewencja upadków),
 * - placówki o dużym przepływie pacjentów -> Circle (pełny system),
 * - pozostałe (mniejsze kliniki i gabinety) -> Health.
 */
function pickModel(facility: FacilityType, band: PatientsBand): ModelKey {
  if (facility === "senior") return "guardian";
  if (band === "16-30" || band === "30+") return "circle";
  return "health";
}

export type QuizResult = {
  model: IcarosModel;
  sessionsPerDay: number;
  sessionPrice: number;
  workingDays: number;
  monthlyRevenue: number;
  leasingNet: number;
  monthlyProfit: number;
  yearlyProfit: number;
};

export function calculateQuizResult(answers: QuizAnswers): QuizResult | null {
  const { facilityType, patientsBand, techInterest } = answers;
  if (!facilityType || !patientsBand || !techInterest) return null;

  const model = ICAROS_MODELS[pickModel(facilityType, patientsBand)];
  const sessionsPerDay = SESSIONS_PER_DAY[patientsBand];
  const monthlyRevenue = sessionsPerDay * WORKING_DAYS_PER_MONTH * VR_SESSION_PRICE_PLN;
  const monthlyProfit = Math.round((monthlyRevenue - model.leasingNet) / 10) * 10;

  return {
    model,
    sessionsPerDay,
    sessionPrice: VR_SESSION_PRICE_PLN,
    workingDays: WORKING_DAYS_PER_MONTH,
    monthlyRevenue,
    leasingNet: model.leasingNet,
    monthlyProfit,
    yearlyProfit: monthlyProfit * 12,
  };
}

export function facilityLabel(key: FacilityType | null): string {
  return FACILITY_OPTIONS.find((option) => option.key === key)?.label ?? "-";
}

export function patientsLabel(key: PatientsBand | null): string {
  return PATIENTS_OPTIONS.find((option) => option.key === key)?.label ?? "-";
}

export function techLabel(key: TechInterest | null): string {
  return TECH_OPTIONS.find((option) => option.key === key)?.label ?? "-";
}
