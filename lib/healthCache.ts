import { dayOf } from "@/lib/day";
import { healthQueryKeys } from "@/lib/healthQueryKeys";
import type { DailySummary, ExerciseLog, FoodItem, FoodLog, WaterLog } from "@/types/type";
import type { QueryClient } from "@tanstack/react-query";


const withoutDuplicate = <T extends { id: number }>(list: T[] | undefined, item: T): T[] => [
  ...(list ?? []).filter((existing) => existing.id !== item.id),
  item,
];

/** Puts a log the server just confirmed into the cached day, and keeps that day's totals in step. */
export function applyWaterLog(queryClient: QueryClient, log: WaterLog): void {
  const date = dayOf(log.loggedAt);
  queryClient.setQueryData<WaterLog[]>(healthQueryKeys.waterLogs.byDate(date), (old) =>
    withoutDuplicate(old, log)
  );
  queryClient.setQueryData<DailySummary>(healthQueryKeys.summary(date), (old) =>
    old ? { ...old, waterConsumedMl: old.waterConsumedMl + log.amountMl } : old
  );
}

export function applyExerciseLog(queryClient: QueryClient, log: ExerciseLog): void {
  const date = dayOf(log.loggedAt);
  queryClient.setQueryData<ExerciseLog[]>(healthQueryKeys.exerciseLogs.byDate(date), (old) =>
    withoutDuplicate(old, log)
  );
  queryClient.setQueryData<DailySummary>(healthQueryKeys.summary(date), (old) =>
    old
      ? {
          ...old,
          caloriesBurned: old.caloriesBurned + log.caloriesBurned,
          remainingCalories: old.remainingCalories - log.caloriesBurned,
        }
      : old
  );
}

const nutritionOf = (items: FoodItem[]) =>
  items.reduce(
    (total, item) => ({
      calories: total.calories + item.calories,
      protein: total.protein + item.protein,
      carbs: total.carbs + item.carbs,
      fat: total.fat + (item.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

export function applyFoodLog(queryClient: QueryClient, log: FoodLog): void {
  const date = dayOf(log.loggedAt);
  queryClient.setQueryData<FoodLog[]>(healthQueryKeys.foodLogs.byDate(date), (old) =>
    withoutDuplicate(old, log)
  );

  const added = nutritionOf(log.items);
  queryClient.setQueryData<DailySummary>(healthQueryKeys.summary(date), (old) => {
    if (!old) return old;
    const calories = old.consumedCalories + added.calories;
    const protein = old.consumedProtein + added.protein;
    const carbs = old.consumedCarbs + added.carbs;
    const fat = old.consumedFat + added.fat;
    return {
      ...old,
      consumedCalories: calories,
      consumedProtein: protein,
      consumedCarbs: carbs,
      consumedFat: fat,
      calorieProgress: (calories / old.targetCalories) * 100,
      proteinProgress: (protein / old.targetProtein) * 100,
      carbsProgress: (carbs / old.targetCarbs) * 100,
      fatProgress: (fat / old.targetFat) * 100,
    };
  });
}
