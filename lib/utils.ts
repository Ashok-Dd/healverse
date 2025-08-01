import { DailySummary, HealthData } from "@/types/type";

export const convertWeight = (weight : number, fromUnit : string | "kg" | "lbs", toUnit : "kg" | "lbs" ) => {
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

export const createDefaultSummary = (date: string): DailySummary => ({
    date,
    targetCalories: 0,
    consumedCalories: 0,
    caloriesBurned: 0,
    remainingCalories: 0,
    targetProtein: 0,
    consumedProtein: 0,
    targetCarbs: 0,
    consumedCarbs: 0,
    targetFat: 0,
    consumedFat: 0,
    waterConsumedMl: 0,
    targetWaterMl: 0,
    caloriesProgress: 0,
    proteinProgress: 0,
    carbsProgress: 0,
    fatProgress: 0,
    waterProgress: 0,
});

export const createDefaultHealthData = (date: string): HealthData => ({
    summary: createDefaultSummary(date),
    foodLogs: [],
    exerciseLogs: [],
    waterLogs: [],
});