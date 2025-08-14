import { FoodItem, LogStatus, StatusBadge } from "@/types/type";

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

export const getStatusColor = (status: LogStatus): string => {
  switch (status) {
    case "TAKEN":
      return "border-emerald-200 bg-emerald-50";
    case "MISSED":
      return "border-red-200 bg-red-50";
    case "PENDING":
      return "border-blue-200 bg-blue-50";
    case "SKIPPED":
      return "border-red-200 bg-red-50";
    default:
      return "border-gray-200 bg-gray-50";
  }
};

export const getStatusBadge = (status: LogStatus): StatusBadge => {
  switch (status) {
    case "TAKEN":
      return { text: "Taken", color: "bg-emerald-100 text-emerald-700" };
    case "MISSED":
      return { text: "Missed", color: "bg-red-100 text-red-700" };
    case "PENDING":
      return { text: "Pending", color: "bg-blue-100 text-blue-700" };
    case "SKIPPED":
      return { text: "Skipped", color: "bg-red-100 text-red-700" };
    default:
      return { text: "Unknown", color: "bg-gray-100 text-gray-700" };
  }
};

export const getCurrentDate = (): string => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return today.toLocaleDateString("en-US", options);
};
