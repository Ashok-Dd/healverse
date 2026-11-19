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
import { useToday } from "@/lib/today";
import { isValidDateForData } from "./dietPlan";

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
  const currentDate = useToday();
  // Only a day the user picked is remembered. Otherwise the selection follows "today".
  const [pickedDate, setPickedDate] = useState<string | null>(options.initialDate ?? null);
  const selectedDate = pickedDate ?? currentDate;

  const selectDate = useCallback(
    (date: string | null | undefined) => {
      // Safely handle date input
      const safeDate = date && typeof date === "string" ? date : currentDate;
      setPickedDate(safeDate === currentDate ? null : safeDate);

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

/** Drops the cached day totals so they are fetched again after a log was changed or removed. */
const refreshSummary = (queryClient: QueryClient, date: string) =>
  queryClient.invalidateQueries({ queryKey: healthQueryKeys.summary(date) });

export const useExerciseLogMutations = (date: string) => {
  const queryClient = useQueryClient();
  const listKey = healthQueryKeys.exerciseLogs.byDate(date);

  const updateExerciseLog = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: UpdateExerciseLogData;
    }): Promise<ExerciseLog> =>
      await fetchApi<ExerciseLog>(`/api/exercise-logs/${id}`, {
        method: "PUT",
        requiresAuth: true,
        body: updates,
      }),
    onSuccess: (updatedLog) => {
      queryClient.setQueryData<ExerciseLog[]>(listKey, (old = []) =>
        old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
      );
      refreshSummary(queryClient, date);
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
      queryClient.setQueryData<ExerciseLog[]>(listKey, (old = []) =>
        old.filter((log) => log.id !== deletedId)
      );
      refreshSummary(queryClient, date);
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
  const listKey = healthQueryKeys.waterLogs.byDate(date);

  const updateWaterLog = useMutation({
    mutationFn: async ({ id, amountMl }: { id: number; amountMl: number }): Promise<WaterLog> =>
      await fetchApi<WaterLog>(`/api/water-logs/${id}`, {
        method: "PUT",
        requiresAuth: true,
        body: { amountMl },
      }),
    onSuccess: (updatedLog) => {
      queryClient.setQueryData<WaterLog[]>(listKey, (old = []) =>
        old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
      );
      refreshSummary(queryClient, date);
    },
  });

  const deleteWaterLog = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await fetchApi(`/api/water-logs/${id}`, {
        method: "DELETE",
        requiresAuth: true,
      });
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<WaterLog[]>(listKey, (old = []) =>
        old.filter((log) => log.id !== deletedId)
      );
      refreshSummary(queryClient, date);
    },
  });

  return { updateWaterLog, deleteWaterLog };
};
