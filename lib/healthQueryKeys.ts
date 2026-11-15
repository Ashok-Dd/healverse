import type { MealType } from "@/types/type";

/**
 * React Query keys for the health data. They live in their own file (not in store/healthStore)
 * so lib/healthCache can use them without importing the store's hooks, which import the auth
 * store: that import chain was a require cycle.
 */
const healthBaseKey = ["health"] as const;

export const healthQueryKeys = {
  all: healthBaseKey,

  summary: (date: string) => [...healthBaseKey, "summary", date] as const,

  foodLogs: {
    all: [...healthBaseKey, "food-logs"] as const,
    today: () => [...healthBaseKey, "food-logs", "today"] as const,
    byMealType: (mealType: MealType) =>
      [...healthBaseKey, "food-logs", "meal-type", mealType] as const,
    byDate: (date: string) =>
      [...healthBaseKey, "food-logs", "date", date] as const,
    byId: (id: number) => [...healthBaseKey, "food-logs", "id", id] as const,
  },

  exerciseLogs: {
    all: [...healthBaseKey, "exercise-logs"] as const,
    today: () => [...healthBaseKey, "exercise-logs", "today"] as const,
    byDate: (date: string) =>
      [...healthBaseKey, "exercise-logs", "date", date] as const,
    types: () => [...healthBaseKey, "exercise-logs", "types"] as const,
  },

  waterLogs: {
    all: [...healthBaseKey, "water-logs"] as const,
    today: () => [...healthBaseKey, "water-logs", "today"] as const,
    todayTotal: () => [...healthBaseKey, "water-logs", "today-total"] as const,
    byDate: (date: string) =>
      [...healthBaseKey, "water-logs", "date", date] as const,
  },

  weekly: () => [...healthBaseKey, "weekly"] as const,
} as const;
