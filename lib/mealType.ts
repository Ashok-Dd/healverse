import type { MealType } from "@/types/type";

/** The meal a log made right now most likely belongs to, from the time of day. */
export function mealTypeForNow(): MealType {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "BREAKFAST";
  if (hour >= 11 && hour < 16) return "LUNCH";
  return "DINNER";
}
