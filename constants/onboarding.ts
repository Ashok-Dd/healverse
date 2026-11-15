import type { HeightUnit, WeightUnit } from "@/lib/body";
import type { ActivityLevel, Goal, WeightLossSpeed } from "@/types/type";

/** Number of onboarding screens (app/(auth)/(onboarding)/step1..stepN). */
export const ONBOARDING_TOTAL_STEPS = 10;

export const onboardingPath = (step: number) =>
  `/(auth)/(onboarding)/step${step}` as const;

export const ACCOUNT_REVIEW_PATH = "/(auth)/register" as const;

/** Goals that need a lower / higher target weight than the current one. */
export const WEIGHT_LOSS_GOALS: Goal[] = ["LOSE_WEIGHT"];
export const WEIGHT_GAIN_GOALS: Goal[] = ["GAIN_WEIGHT", "BUILD_MUSCLE"];

/** Approximate weekly change (kg) for each pace the user can choose. */
export const PACE_OPTIONS: { value: WeightLossSpeed; label: string; kgPerWeek: number }[] = [
  { value: "SLOW", label: "Relaxed", kgPerWeek: 0.25 },
  { value: "MODERATE", label: "Steady", kgPerWeek: 0.5 },
  { value: "FAST", label: "Quick", kgPerWeek: 0.75 },
];

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  SEDENTARY: "Sedentary",
  LIGHTLY_ACTIVE: "Lightly active",
  MODERATELY_ACTIVE: "Moderately active",
  VERY_ACTIVE: "Very active",
  EXTREMELY_ACTIVE: "Extremely active",
};

export const WEIGHT_UNIT_OPTIONS: { label: string; value: WeightUnit }[] = [
  { label: "kg", value: "kg" },
  { label: "lbs", value: "lbs" },
];

export const HEIGHT_UNIT_OPTIONS: { label: string; value: HeightUnit }[] = [
  { label: "cm", value: "cm" },
  { label: "ft / in", value: "ft" },
];
