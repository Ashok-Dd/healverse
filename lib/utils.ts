import { FoodItem } from "@/types/type";

export const convertWeight = (
  weight: number,
  fromUnit: string | "kg" | "lbs",
  toUnit: "kg" | "lbs"
) => {
  if (fromUnit === toUnit) return weight;
  if (fromUnit === "kg" && toUnit === "lbs")
    return Math.round(weight * 2.205 * 10) / 10;
  if (fromUnit === "lbs" && toUnit === "kg")
    return Math.round((weight / 2.205) * 10) / 10;
  return weight;
};

export const generateWeekDates = (weekStart: Date): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export const generateUUID = (): string => {
  const timestamp = Date.now().toString(36); // base36 time
  const random = Math.random().toString(36).substring(2, 10); // 8-char random
  return `${timestamp}-${random}`;
};

export const generateSessionId = () =>
  `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const calculateTotals = (items: FoodItem[]) => {
  return items?.reduce(
    (acc, item) => {
      acc.calories += item.calories || 0;
      acc.protein += item.protein || 0;
      acc.carbs += item.carbs || 0;
      acc.fats += item.fats || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
};

