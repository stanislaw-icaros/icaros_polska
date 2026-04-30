export type FacilityTypeKey =
  | "klinika"
  | "fizjoterapia"
  | "poliklinika"
  | "wellness"
  | "sport"
  | "senior"
  | "inne";

export type HoursBandKey = "do4" | "4-6" | "6-8" | "8-10" | "pow10";
export type StaffBandKey = "1" | "2-3" | "4-6" | "7plus";
export type WorkingDaysBandKey = "do18" | "18-20" | "20-22" | "pow22";

export type QuizAnswers = {
  facilityType: FacilityTypeKey | null;
  hoursBand: HoursBandKey | null;
  staffBand: StaffBandKey | null;
  baseSessionPrice: number | null;
  workingDaysBand: WorkingDaysBandKey | null;
};

export type CalculatorResult = {
  sessionsPerDay: number;
  icarosSessionPrice: number;
  monthlyRevenue: number;
  /** ICAROS Circle — szacunkowa rata netto, 48 rat, 10% wpłata, 1% wykup */
  leasingMonthlyNet: number;
  profitMonthlyNet: number;
  yearlyProfitNet: number;
  mappedHours: number;
  mappedStaff: number;
  mappedDays: number;
};

