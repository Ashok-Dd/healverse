import { fetchApi } from "@/lib/fetchApi";
import {
  DailySummary,
  ExerciseLog,
  FoodItem,
  FoodLog,
  MealType,
  UpdateExerciseLogData,
  UpdateFoodLogData,
  WaterLog,
} from "@/types/type";
import type { QueryClient } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useOutboxEntries } from "@/hooks/useOutboxEntries";
import {
  exerciseLogFromEntry,
  isOnDay,
  mergeQueued,
  waterLogFromEntry,
} from "@/lib/outboxOverlay";
import { withPausedAsLoading } from "@/lib/queryStatus";
import { getCurrentDate, isValidDateForData } from "./dietPlan";

import { healthQueryKeys } from "@/lib/healthQueryKeys";

// Re-exported so existing imports from "@/store/healthStore" keep working.
export { healthQueryKeys };

export const healthAPIs = {
  fetchDashboardDataByDate: async (
    date: string
  ): Promise<DailySummary | null> => {
    // Uncomment when API is ready
    return await fetchApi<DailySummary>(`/api/dashboard/summary/${date}`, {
      method: "GET",
      requiresAuth: true,
    });
  },
  fetchFoodLogsByDate: async (date: string): Promise<FoodLog[]> =>
    (await fetchApi<FoodLog[]>(`/api/food-logs/date/${date}`, {
      method: "GET",
      requiresAuth: true,
    })) ?? [],

  fetchExerciseLogsByDate: async (date: string): Promise<ExerciseLog[]> =>
    (await fetchApi<ExerciseLog[]>(`/api/exercise-logs/${date}`, {
      method: "GET",
      requiresAuth: true,
    })) ?? [],

  fetchWaterLogsByDate: async (date: string): Promise<WaterLog[]> =>
    await fetchApi<WaterLog[]>(`/api/water-logs/${date}`, {
      method: "GET",
      requiresAuth: true,
    }),

  fetchTodayFoodLogsByMealType: async (
    mealType: MealType
  ): Promise<FoodLog[]> =>
    (await fetchApi<FoodLog[]>(`/api/food-logs/today/${mealType}`, {
      method: "GET",
      requiresAuth: true,
    })) ?? [],

  fetchFoodLogById: async (id: number): Promise<FoodLog> =>
    await fetchApi<FoodLog>(`/api/food-logs/${id}`, {
      method: "GET",
      requiresAuth: true,
    }),
};

interface UseDateSelectorOptions {
  initialDate?: string;
  autoFetch?: boolean;
}

export const useDateSelectorForHealthStore = (
  options: UseDateSelectorOptions = {}
) => {
  const queryClient = useQueryClient();
  const currentDate = getCurrentDate();
  const [selectedDate, setSelectedDate] = useState(
    options.initialDate || currentDate
  );

  const selectDate = useCallback(
    (date: string | null | undefined) => {
      // Safely handle date input
      const safeDate = date && typeof date === "string" ? date : currentDate;
      setSelectedDate(safeDate);

      // Prefetch data for the selected date if valid and autoFetch is enabled
      if (options.autoFetch !== false && isValidDateForData(safeDate)) {
        queryClient.prefetchQuery({
          queryKey: healthQueryKeys.summary(safeDate),
          queryFn: () => healthAPIs.fetchDashboardDataByDate(safeDate),
          staleTime: 5 * 60 * 1000,
        });
      }
    },
    [queryClient, options.autoFetch, currentDate]
  );

  // const selectToday = useCallback(() => {
  //     selectDate(currentDate);
  // }, [currentDate, selectDate]);

  // const selectPreviousDay = useCallback(() => {
  //     const prevDate = new Date(selectedDate);
  //     prevDate.setDate(prevDate.getDate() - 1);
  //     selectDate(prevDate.toISOString().split('T')[0]);
  // }, [selectedDate, selectDate]);

  // const selectNextDay = useCallback(() => {
  //     const nextDate = new Date(selectedDate);
  //     nextDate.setDate(nextDate.getDate() + 1);
  //     selectDate(nextDate.toISOString().split('T')[0]);
  // }, [selectedDate, selectDate]);

  // const isToday = selectedDate === currentDate;
  const isValidDate = isValidDateForData(selectedDate);

  return {
    // State
    selectedDate,
    currentDate,
    // isToday,
    isValidDate,

    // Actions
    setSelectedDate: selectDate,
    // selectToday,
    // selectPreviousDay,
    // selectNextDay,

    // Utilities
    isValidDateForData,
  };
};

export const useFoodLogs = {
  ByDate: (date: string) => {
    const query = useQuery({
      queryKey: healthQueryKeys.foodLogs.byDate(date),
      queryFn: () => healthAPIs.fetchFoodLogsByDate(date),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });

    const getById = useCallback(
      (id: number) => {
        return query.data?.find((log) => log.id === id);
      },
      [query.data]
    );

    return {
      ...withPausedAsLoading(query),
      getById,
    };
  },

  ByMealType: (mealType: MealType) => {
    return useQuery({
      queryKey: healthQueryKeys.foodLogs.byMealType(mealType),
      queryFn: () => healthAPIs.fetchTodayFoodLogsByMealType(mealType),
      staleTime: 2 * 60 * 1000,
    });
  },

  ById: (id: number) => {
    return useQuery({
      queryKey: healthQueryKeys.foodLogs.byId(id),
      queryFn: () => healthAPIs.fetchFoodLogById(id),
      staleTime: 2 * 60 * 1000,
    });
  },
};

export const useFoodLogMutations = (date: string) => {
  const queryClient: QueryClient = useQueryClient();

  const calculateTotalNutrition = (items: FoodItem[]) => {
    return items.reduce(
      (total, item) => ({
        calories: total.calories + item.calories,
        protein: total.protein + item.protein,
        carbs: total.carbs + item.carbs,
        fat: total.fat + (item.fats || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const updateFoodLog = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: UpdateFoodLogData;
    }): Promise<FoodLog> => {
      const response = await fetchApi<FoodLog>(`/api/food-logs/${id}`, {
        method: "PUT",
        requiresAuth: true,
        body: updates,
      });
      return response;
    },
    onSuccess: (updatedLog, variables) => {
      const oldLog = (
        queryClient.getQueryData<FoodLog[]>(
          healthQueryKeys.foodLogs.byDate(date)
        ) as FoodLog[]
      )?.find((log) => log.id === updatedLog.id);

      // Update food logs
      queryClient.setQueryData<FoodLog[]>(
        healthQueryKeys.foodLogs.byDate(date),
        (old = []) =>
          old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
      );

      // Update dashboard data with nutrition differences
      if (oldLog) {
        const oldNutrition = calculateTotalNutrition(oldLog.items);
        const newNutrition = calculateTotalNutrition(updatedLog.items);

        const nutritionDiff = {
          calories: newNutrition.calories - oldNutrition.calories,
          protein: newNutrition.protein - oldNutrition.protein,
          carbs: newNutrition.carbs - oldNutrition.carbs,
          fat: newNutrition.fat - oldNutrition.fat,
        };

        queryClient.setQueryData<DailySummary>(
          healthQueryKeys.summary(date),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              consumedCalories: old.consumedCalories + nutritionDiff.calories,
              consumedProtein: old.consumedProtein + nutritionDiff.protein,
              consumedCarbs: old.consumedCarbs + nutritionDiff.carbs,
              consumedFat: old.consumedFat + nutritionDiff.fat,
            };
          }
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: healthQueryKeys.summary(date),
        });
      }
    },
  });

  const deleteFoodLog = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await fetchApi(`/api/food-logs/${id}`, {
        method: "DELETE",
        requiresAuth: true,
      });
    },
    onSuccess: (_, deletedId) => {
      const deletedLog = (
        queryClient.getQueryData<FoodLog[]>(
          healthQueryKeys.foodLogs.byDate(date)
        ) as FoodLog[]
      )?.find((log) => log.id === deletedId);

      // Remove from food logs
      queryClient.setQueryData<FoodLog[]>(
        healthQueryKeys.foodLogs.byDate(date),
        (old = []) => old.filter((log) => log.id !== deletedId)
      );

      if (deletedLog) {
        const deletedNutrition = calculateTotalNutrition(deletedLog.items);

        queryClient.setQueryData<DailySummary>(
          healthQueryKeys.summary(date),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              consumedCalories: Math.max(
                0,
                old.consumedCalories - deletedNutrition.calories
              ),
              consumedProtein: Math.max(
                0,
                old.consumedProtein - deletedNutrition.protein
              ),
              consumedCarbs: Math.max(
                0,
                old.consumedCarbs - deletedNutrition.carbs
              ),
              consumedFat: Math.max(0, old.consumedFat - deletedNutrition.fat),
            };
          }
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: healthQueryKeys.summary(date),
        });
      }

      queryClient.invalidateQueries({ queryKey: healthQueryKeys.foodLogs.all });
    },
  });

  // Keep other mutations the same...
  const updateFoodItem = useMutation({
    mutationFn: async ({
      logId,
      itemId,
      updates,
    }: {
      logId: number;
      itemId: number;
      updates: Partial<
        Pick<
          FoodItem,
          "quantity" | "unit" | "calories" | "protein" | "carbs" | "fats"
        >
      >;
    }): Promise<FoodLog> => {
      const response = await fetchApi<FoodLog>(
        `/api/food-logs/${logId}/items/${itemId}`,
        {
          method: "PUT",
          requiresAuth: true,
          body: updates,
        }
      );
      return response;
    },
    onSuccess: (updatedLog) => {
      queryClient.setQueryData<FoodLog[]>(
        healthQueryKeys.foodLogs.byDate(date),
        (old = []) =>
          old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
      );

      queryClient.invalidateQueries({
        queryKey: healthQueryKeys.summary(date),
      });
    },
  });

  const addFoodItem = useMutation({
    mutationFn: async ({
      logId,
      item,
    }: {
      logId: number;
      item: Omit<FoodItem, "id">;
    }): Promise<FoodLog> => {
      const response = await fetchApi<FoodLog>(
        `/api/food-logs/${logId}/items`,
        {
          method: "POST",
          requiresAuth: true,
          body: item,
        }
      );
      return response;
    },
    onSuccess: (updatedLog) => {
      queryClient.setQueryData<FoodLog[]>(
        healthQueryKeys.foodLogs.byDate(date),
        (old = []) =>
          old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
      );

      queryClient.invalidateQueries({
        queryKey: healthQueryKeys.summary(date),
      });
    },
  });

  const removeFoodItem = useMutation({
    mutationFn: async ({
      logId,
      itemId,
    }: {
      logId: number;
      itemId: number;
    }): Promise<FoodLog> => {
      const response = await fetchApi<FoodLog>(
        `/api/food-logs/${logId}/items/${itemId}`,
        {
          method: "DELETE",
          requiresAuth: true,
        }
      );
      return response;
    },
    onSuccess: (updatedLog) => {
      queryClient.setQueryData<FoodLog[]>(
        healthQueryKeys.foodLogs.byDate(date),
        (old = []) =>
          old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
      );

      queryClient.invalidateQueries({
        queryKey: healthQueryKeys.summary(date),
      });
    },
  });

  return {
    updateFoodLog,
    deleteFoodLog,
    updateFoodItem,
    addFoodItem,
    removeFoodItem,
  };
};

export const useExerciseLogs = {
  ByDate: (date: string) => {
    const query = useQuery({
      queryKey: healthQueryKeys.exerciseLogs.byDate(date),
      queryFn: () => healthAPIs.fetchExerciseLogsByDate(date),
      staleTime: 2 * 60 * 1000,
    });
    const queued = useOutboxEntries("exercise");
    return mergeQueued(
      query,
      queued.filter((entry) => isOnDay(entry, date)).map(exerciseLogFromEntry)
    );
  },

  Types: () => {
    return useQuery({
      queryKey: healthQueryKeys.exerciseLogs.types(),
      queryFn: async (): Promise<
        { name: string; metValue: number; category: string }[]
      > => {
        const response = await fetchApi<
          { name: string; metValue: number; category: string }[]
        >("/api/exercise-logs/types", {
          method: "GET",
          requiresAuth: true,
        });
        return response ?? [];
      },
      staleTime: 60 * 60 * 1000, // 1 hour - exercise types don't change often
    });
  },
};

export const useExerciseLogMutations = (date: string) => {
  const queryClient = useQueryClient();

  const updateExerciseLog = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: UpdateExerciseLogData;
    }): Promise<ExerciseLog> => {
      const response = await fetchApi<ExerciseLog>(`/api/exercise-logs/${id}`, {
        method: "PUT",
        requiresAuth: true,
        body: updates,
      });
      return response;
    },
    onSuccess: (updatedLog) => {
      queryClient.setQueryData<ExerciseLog[]>(
        healthQueryKeys.exerciseLogs.today(),
        (old = []) =>
          old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
      );

      queryClient.invalidateQueries({
        queryKey: healthQueryKeys.summary(
          getCurrentDate()
        ),
      });
    },
  });

  const deleteExerciseLog = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await fetchApi(`/api/exercise-logs/${id}`, {
        method: "DELETE",
        requiresAuth: true,
      });
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ExerciseLog[]>(
        healthQueryKeys.exerciseLogs.today(),
        (old = []) => old.filter((log) => log.id !== deletedId)
      );

      queryClient.invalidateQueries({
        queryKey: healthQueryKeys.summary(
          getCurrentDate()
        ),
      });
    },
  });

  return {
    updateExerciseLog,
    deleteExerciseLog,
  };
};

export const useWaterLogs = {
  ByDate: (date: string) => {
    const query = useQuery({
      queryKey: healthQueryKeys.waterLogs.byDate(date),
      queryFn: () => healthAPIs.fetchWaterLogsByDate(date),
      staleTime: 1 * 60 * 1000, // 1 minute
    });
    const queued = useOutboxEntries("water");
    return mergeQueued(
      query,
      queued.filter((entry) => isOnDay(entry, date)).map(waterLogFromEntry)
    );
  },
};

export const useWaterLogMutations = (date: string) => {
  const queryClient = useQueryClient();

  const deleteWaterLog = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await fetchApi(`/api/water-logs/${id}`, {
        method: "DELETE",
        requiresAuth: true,
      });
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<WaterLog[]>(
        healthQueryKeys.waterLogs.today(),
        (old = []) => old.filter((log) => log.id !== deletedId)
      );

      queryClient.invalidateQueries({
        queryKey: healthQueryKeys.waterLogs.todayTotal(),
      });
      queryClient.invalidateQueries({
        queryKey: healthQueryKeys.summary(
          getCurrentDate()
        ),
      });
    },
  });

  return {
    deleteWaterLog,
  };
};
