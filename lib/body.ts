/** Body-measurement helpers shared by the onboarding steps. Canonical units: kg and cm. */

const LB_PER_KG = 2.20462;
const CM_PER_INCH = 2.54;

export type WeightUnit = "kg" | "lbs";
export type HeightUnit = "cm" | "ft";

export const kgToLbs = (kg: number) => Math.round(kg * LB_PER_KG);
export const lbsToKg = (lbs: number) => Math.round((lbs / LB_PER_KG) * 10) / 10;

export const cmToInches = (cm: number) => Math.round(cm / CM_PER_INCH);
export const inchesToCm = (inches: number) => Math.round(inches * CM_PER_INCH);

/** 175 cm -> `5' 9"` */
export const formatFeetInches = (cm: number) => {
  const totalInches = cmToInches(cm);
  return `${Math.floor(totalInches / 12)}' ${totalInches % 12}"`;
};

export const calculateBmi = (weightKg: number, heightCm: number) =>
  weightKg / (heightCm / 100) ** 2;

/** Weight range (kg) that gives a BMI of 18.5 to 24.9 for the given height. */
export const healthyWeightRangeKg = (heightCm: number) => {
  const m2 = (heightCm / 100) ** 2;
  return { min: Math.ceil(18.5 * m2), max: Math.floor(24.9 * m2) };
};

export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

export const bmiCategory = (bmi: number): BmiCategory => {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
};
