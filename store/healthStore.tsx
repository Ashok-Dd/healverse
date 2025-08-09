import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {QueryClient} from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetchApi";
import {
    CreateExerciseLogData,
    CreateWaterLogData,
    DailySummary,
    ExerciseLog, FoodItem,
    FoodLog,
    HealthData,
    MealType,
    UpdateExerciseLogData,
    UpdateFoodLogData,
    WaterLog,
} from "@/types/type";
import { getCurrentDate, isValidDateForData} from "./dietPlan";
import {useCallback, useState} from "react";

const healthBaseKey = ["health"] as const;

export const healthQueryKeys = {
  all: healthBaseKey,
  dashboard: (date: string) => [...healthBaseKey, "dashboard", date] as const,
  foodLogs: {
    all: [...healthBaseKey, "food-logs"] as const,
    today: () => [...healthBaseKey, "food-logs", "today"] as const,
    byMealType: (mealType: MealType) =>
      [...healthBaseKey, "food-logs", "meal-type", mealType] as const,
    byDate: (date: string) =>
      [...healthBaseKey, "food-logs", "date", date] as const,
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

const healthAPIs = {
  fetchDashboardDataByDate: async (date: string): Promise<HealthData | null> => {
    try {
      // Uncomment when API is ready
      return await fetchApi<HealthData | null>(`/api/dashboard/${date}`, {
        method: "GET",
        requiresAuth: true,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      return null;
    }
  },
  fetchTodayFoodLogs: async (): Promise<FoodLog[]> => {
    const response = await fetchApi<FoodLog[]>("/api/food-logs/today", {
      method: "GET",
      requiresAuth: true,
    });
    return response;
  },
  fetchTodayFoodLogsByMealType: async (
    mealType: MealType
  ): Promise<FoodLog[]> => {
    const response = await fetchApi<FoodLog[]>(
      `/api/food-logs/today/${mealType}`,
      {
        method: "GET",
        requiresAuth: true,
      }
    );
    return response;
  },
};

interface UseDateSelectorOptions {
    initialDate?: string;
    autoFetch?: boolean;
}

export const useDateSelectorForHealthStore = (options: UseDateSelectorOptions = {}) => {
    const queryClient = useQueryClient();
    const currentDate = getCurrentDate();
    const [selectedDate, setSelectedDate] = useState(
        options.initialDate || currentDate
    );

    const selectDate = useCallback((date: string | null | undefined) => {
        // Safely handle date input
        const safeDate = date && typeof date === 'string' ? date : currentDate;
        setSelectedDate(safeDate);

        // Prefetch data for the selected date if valid and autoFetch is enabled
        if (options.autoFetch !== false && isValidDateForData(safeDate)) {
            queryClient.prefetchQuery({
                queryKey: healthQueryKeys.dashboard(safeDate),
                queryFn: () => healthAPIs.fetchDashboardDataByDate(safeDate),
                staleTime: 5 * 60 * 1000,
            });
        }
    }, [queryClient, options.autoFetch, currentDate]);

    const selectToday = useCallback(() => {
        selectDate(currentDate);
    }, [currentDate, selectDate]);

    const selectPreviousDay = useCallback(() => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        selectDate(prevDate.toISOString().split('T')[0]);
    }, [selectedDate, selectDate]);

    const selectNextDay = useCallback(() => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        selectDate(nextDate.toISOString().split('T')[0]);
    }, [selectedDate, selectDate]);

    const isToday = selectedDate === currentDate;
    const isValidDate = isValidDateForData(selectedDate);

    return {
        // State
        selectedDate,
        currentDate,
        isToday,
        isValidDate,

        // Actions
        setSelectedDate: selectDate,
        selectToday,
        selectPreviousDay,
        selectNextDay,

        // Utilities
        isValidDateForData,
    };
};


export const useDashboardData = (date: string) => {
    const query = useQuery<HealthData>({
        queryKey: healthQueryKeys.dashboard(date),
        queryFn: () => healthAPIs.fetchDashboardDataByDate(date),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        enabled: isValidDateForData(date),
    });

    // Helper getters (avoid repeating filter logic in components)
    const getExerciseLogs = (): ExerciseLog[] =>
        (query.data as HealthData)?.exerciseLogs || [];

    const getWaterLogs = (): WaterLog[] =>
        (query.data as HealthData)?.waterLogs || [];

    const getFoodLogsByMealType = (
        mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK"
    ): FoodLog[] =>
        (query.data as HealthData)?.foodLogs?.filter((f) => f.mealType === mealType) || [];

    const getAllFoodLogs = (): FoodLog[] =>
        (query.data as HealthData)?.foodLogs || [];

    return {
        ...query,
        getExerciseLogs,
        getWaterLogs,
        getFoodLogsByMealType,
        getAllFoodLogs,
    };
};

export const useFoodLogs = {
  Today: () => {
    return useQuery({
      queryKey: healthQueryKeys.foodLogs.today(),
      queryFn: () => healthAPIs.fetchTodayFoodLogs(),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  },

  ByMealType: (mealType: MealType) => {
    return useQuery({
      queryKey: healthQueryKeys.foodLogs.byMealType(mealType),
      queryFn: () => healthAPIs.fetchTodayFoodLogsByMealType(mealType),
      staleTime: 2 * 60 * 1000,
    });
  },
};

export const useFoodLogMutations = () => {
    const queryClient: QueryClient = useQueryClient();

    const calculateTotalNutrition = (items: FoodItem[]) => {
        return items.reduce(
            (total, item) => ({
                calories: total.calories + item.calories,
                protein: total.protein + item.protein,
                carbs: total.carbs + item.carbs,
                fat: total.fat + (item.fats || 0)
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
    };


    const addFoodLog = useMutation({
            mutationKey: ["addFoodLog"],
            mutationFn: async (formData: FormData): Promise<FoodLog> => {
                // Change endpoint to match your backend
                return await fetchApi<FoodLog>("/api/food-logs/log/image", {
                    method: "POST",
                    requiresAuth: true,
                    body: formData,
                    headers: {
                        // Don't set Content-Type header for FormData, let the browser set it
                    },
                });
            },
            onSuccess: (newLog) => {
                // Calculate nutrition totals from items
                const nutrition = calculateTotalNutrition(newLog.items);

                // Update today's food logs
                queryClient.setQueryData<FoodLog[]>(
                    ["foodLogs", "today"],
                    (old = []) => [...old, newLog]
                );

                // Update meal type specific logs
                queryClient.setQueryData<FoodLog[]>(
                    ["foodLogs", "mealType", newLog.mealType],
                    (old = []) => [...old, newLog]
                );

                // Update dashboard data
                const today = new Date().toISOString().split("T")[0];
                queryClient.setQueryData<HealthData>(
                    ["dashboard", today],
                    (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            foodLogs: [...old.foodLogs, newLog],
                            summary: {
                                ...old.summary,
                                consumedCalories: old.summary.consumedCalories + nutrition.calories,
                                consumedProtein: old.summary.consumedProtein + nutrition.protein,
                                consumedCarbs: old.summary.consumedCarbs + nutrition.carbs,
                                consumedFat: old.summary.consumedFat + nutrition.fat,
                            },
                        };
                    }
                );

                // Invalidate related queries
                queryClient.invalidateQueries({ queryKey: ["foodLogs"] });
            },
            onError: (error) => {
                console.error("Food log mutation error:", error);
            }
        });

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
            // Get the old log to calculate nutrition difference
            const oldLog = (queryClient
                .getQueryData<FoodLog[]>(healthQueryKeys.foodLogs.today()) as FoodLog[])
                ?.find((log) => log.id === updatedLog.id);

            // Update all relevant queries
            queryClient.setQueryData<FoodLog[]>(
                healthQueryKeys.foodLogs.today(),
                (old = []) =>
                    old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
            );

            queryClient.setQueryData<FoodLog[]>(
                healthQueryKeys.foodLogs.byMealType(updatedLog.mealType),
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

                const today = new Date().toISOString().split("T")[0];
                queryClient.setQueryData<HealthData>(
                    healthQueryKeys.dashboard(today),
                    (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            foodLogs: old.foodLogs.map((log) =>
                                log.id === updatedLog.id ? updatedLog : log
                            ),
                            summary: {
                                ...old.summary,
                                consumedCalories: old.summary.consumedCalories + nutritionDiff.calories,
                                consumedProtein: old.summary.consumedProtein + nutritionDiff.protein,
                                consumedCarbs: old.summary.consumedCarbs + nutritionDiff.carbs,
                                consumedFat: old.summary.consumedFat + nutritionDiff.fat,
                            },
                        };
                    }
                );
            } else {
                // If we can't find the old log, just invalidate dashboard
                queryClient.invalidateQueries({
                    queryKey: healthQueryKeys.dashboard(
                        new Date().toISOString().split("T")[0]
                    ),
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
            // Get the deleted log to calculate nutrition to subtract
            const deletedLog = (queryClient
                .getQueryData<FoodLog[]>(healthQueryKeys.foodLogs.today()) as FoodLog[])
                ?.find((log) => log.id === deletedId);

            // Remove from all relevant queries
            queryClient.setQueryData<FoodLog[]>(
                healthQueryKeys.foodLogs.today(),
                (old = []) => old.filter((log) => log.id !== deletedId)
            );

            // Remove from meal type specific logs
            if (deletedLog) {
                queryClient.setQueryData<FoodLog[]>(
                    healthQueryKeys.foodLogs.byMealType(deletedLog.mealType),
                    (old = []) => old.filter((log) => log.id !== deletedId)
                );

                // Update dashboard data by subtracting deleted log's nutrition
                const deletedNutrition = calculateTotalNutrition(deletedLog.items);

                const today = new Date().toISOString().split("T")[0];
                queryClient.setQueryData<HealthData>(
                    healthQueryKeys.dashboard(today),
                    (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            foodLogs: old.foodLogs.filter((log) => log.id !== deletedId),
                            summary: {
                                ...old.summary,
                                consumedCalories: Math.max(0, old.summary.consumedCalories - deletedNutrition.calories),
                                consumedProtein: Math.max(0, old.summary.consumedProtein - deletedNutrition.protein),
                                consumedCarbs: Math.max(0, old.summary.consumedCarbs - deletedNutrition.carbs),
                                consumedFat: Math.max(0, old.summary.consumedFat - deletedNutrition.fat),
                            },
                        };
                    }
                );
            } else {
                // If we can't find the deleted log, invalidate dashboard
                queryClient.invalidateQueries({
                    queryKey: healthQueryKeys.dashboard(
                        new Date().toISOString().split("T")[0]
                    ),
                });
            }

            queryClient.invalidateQueries({ queryKey: healthQueryKeys.foodLogs.all });
        },
    });

    // Additional mutation for updating individual food items within a log
    const updateFoodItem = useMutation({
        mutationFn: async ({
                               logId,
                               itemId,
                               updates,
                           }: {
            logId: number;
            itemId: number;
            updates: Partial<Pick<FoodItem, 'quantity' | 'unit' | 'calories' | 'protein' | 'carbs' | 'facts'>>;
        }): Promise<FoodLog> => {
            const response = await fetchApi<FoodLog>(`/api/food-logs/${logId}/items/${itemId}`, {
                method: "PUT",
                requiresAuth: true,
                body: updates,
            });
            return response;
        },
        onSuccess: (updatedLog) => {
            // Update all relevant queries with the updated log
            queryClient.setQueryData<FoodLog[]>(
                healthQueryKeys.foodLogs.today(),
                (old = []) =>
                    old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
            );

            queryClient.setQueryData<FoodLog[]>(
                healthQueryKeys.foodLogs.byMealType(updatedLog.mealType),
                (old = []) =>
                    old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
            );

            // Invalidate dashboard to recalculate totals
            queryClient.invalidateQueries({
                queryKey: healthQueryKeys.dashboard(
                    new Date().toISOString().split("T")[0]
                ),
            });
        },
    });

    // Mutation for adding a food item to an existing log
    const addFoodItem = useMutation({
        mutationFn: async ({
                               logId,
                               item,
                           }: {
            logId: number;
            item: Omit<FoodItem, 'id'>;
        }): Promise<FoodLog> => {
            const response = await fetchApi<FoodLog>(`/api/food-logs/${logId}/items`, {
                method: "POST",
                requiresAuth: true,
                body: item,
            });
            return response;
        },
        onSuccess: (updatedLog) => {
            // Update all relevant queries
            queryClient.setQueryData<FoodLog[]>(
                healthQueryKeys.foodLogs.today(),
                (old = []) =>
                    old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
            );

            queryClient.setQueryData<FoodLog[]>(
                healthQueryKeys.foodLogs.byMealType(updatedLog.mealType),
                (old = []) =>
                    old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
            );

            // Invalidate dashboard to recalculate totals
            queryClient.invalidateQueries({
                queryKey: healthQueryKeys.dashboard(
                    new Date().toISOString().split("T")[0]
                ),
            });
        },
    });

    // Mutation for removing a food item from a log
    const removeFoodItem = useMutation({
        mutationFn: async ({
                               logId,
                               itemId,
                           }: {
            logId: number;
            itemId: number;
        }): Promise<FoodLog> => {
            const response = await fetchApi<FoodLog>(`/api/food-logs/${logId}/items/${itemId}`, {
                method: "DELETE",
                requiresAuth: true,
            });
            return response;
        },
        onSuccess: (updatedLog) => {
            // Update all relevant queries
            queryClient.setQueryData<FoodLog[]>(
                healthQueryKeys.foodLogs.today(),
                (old = []) =>
                    old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
            );

            queryClient.setQueryData<FoodLog[]>(
                healthQueryKeys.foodLogs.byMealType(updatedLog.mealType),
                (old = []) =>
                    old.map((log) => (log.id === updatedLog.id ? updatedLog : log))
            );

            // Invalidate dashboard to recalculate totals
            queryClient.invalidateQueries({
                queryKey: healthQueryKeys.dashboard(
                    new Date().toISOString().split("T")[0]
                ),
            });
        },
    });

    return {
        addFoodLog,
        updateFoodLog,
        deleteFoodLog,
        updateFoodItem,
        addFoodItem,
        removeFoodItem,
    };
};

export const useExerciseLogs = {
  Today: () => {
    return useQuery({
      queryKey: healthQueryKeys.exerciseLogs.today(),
      queryFn: async (): Promise<ExerciseLog[]> => {
        const response = await fetchApi<ExerciseLog[]>(
          "/api/exercise-logs/today",
          {
            method: "GET",
            requiresAuth: true,
          }
        );
        return response;
      },
      staleTime: 2 * 60 * 1000,
    });
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
        return response;
      },
      staleTime: 60 * 60 * 1000, // 1 hour - exercise types don't change often
    });
  },
};

export const useExerciseLogMutations = () => {
  const queryClient = useQueryClient();

  const addExerciseLog = useMutation({
    mutationFn: async (data: CreateExerciseLogData): Promise<ExerciseLog> => {
      return await fetchApi<ExerciseLog>("/api/exercise-logs/log", {
        method: "POST",
        requiresAuth: true,
        body: data,
      });
    },
    onSuccess: (newLog) => {
      queryClient.setQueryData<ExerciseLog[]>(
        healthQueryKeys.exerciseLogs.today(),
        (old = []) => [...old, newLog]
      );

      const today = new Date().toISOString().split("T")[0];
      queryClient.setQueryData<HealthData>(
        healthQueryKeys.dashboard(today),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            exerciseLogs: [...old.exerciseLogs, newLog],
            summary: {
              ...old.summary,
              caloriesBurned:
                old.summary.caloriesBurned + newLog.caloriesBurned,
             remainingCalories : old.remainingCalories + newLog.caloriesBurned,

            },
          };
        }
      );
    },
  });

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
        queryKey: healthQueryKeys.dashboard(
          new Date().toISOString().split("T")[0]
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
        queryKey: healthQueryKeys.dashboard(
          new Date().toISOString().split("T")[0]
        ),
      });
    },
  });

  return {
    addExerciseLog,
    updateExerciseLog,
    deleteExerciseLog,
  };
};

export const useWaterLogs = {
  today: () => {
    return useQuery({
      queryKey: healthQueryKeys.waterLogs.today(),
      queryFn: async (): Promise<WaterLog[]> => {
        const response = await fetchApi<WaterLog[]>("/api/water-logs/today", {
          method: "GET",
          requiresAuth: true,
        });
        return response;
      },
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  },

  todayTotal: () => {
    return useQuery({
      queryKey: healthQueryKeys.waterLogs.todayTotal(),
      queryFn: async (): Promise<number> => {
        const response = await fetchApi<{ totalMl: number }>(
          "/api/water-logs/today/total",
          {
            method: "GET",
            requiresAuth: true,
          }
        );
        return response.totalMl;
      },
      staleTime: 1 * 60 * 1000,
    });
  },
};

export const useWaterLogMutations = () => {
  const queryClient = useQueryClient();

  const addWaterLog = useMutation({
    mutationFn: async (data: CreateWaterLogData): Promise<WaterLog> => {
      const response = await fetchApi<WaterLog>("/api/water-logs/log", {
        method: "POST",
        requiresAuth: true,
        body: data,
      });
      return response;
    },
    onSuccess: (newLog) => {
      queryClient.setQueryData<WaterLog[]>(
        healthQueryKeys.waterLogs.today(),
        (old = []) => [...old, newLog]
      );

      queryClient.setQueryData<number>(
        healthQueryKeys.waterLogs.todayTotal(),
        (old = 0) => old + newLog.amountMl
      );

      const today = new Date().toISOString().split("T")[0];
      queryClient.setQueryData<HealthData>(
        healthQueryKeys.dashboard(today),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            waterLogs: [...old.waterLogs, newLog],
            summary: {
              ...old.summary,
              waterConsumedMl: old.summary.waterConsumedMl + newLog.amountMl,
            },
          };
        }
      );
    },
  });

  const addQuickWaterLog = useMutation({
    mutationFn: async (
      presetType: "GLASS" | "BOTTLE" | "LARGE"
    ): Promise<WaterLog> => {
      const response = await fetchApi<WaterLog>("/api/water-logs/quick", {
        method: "POST",
        requiresAuth: true,
        body: { presetType },
      });
      return response;
    },
    onSuccess: (newLog) => {
      queryClient.setQueryData<WaterLog[]>(
        healthQueryKeys.waterLogs.today(),
        (old = []) => [...old, newLog]
      );

      queryClient.setQueryData<number>(
        healthQueryKeys.waterLogs.todayTotal(),
        (old = 0) => old + newLog.amountMl
      );

      const today = new Date().toISOString().split("T")[0];
      queryClient.setQueryData<HealthData>(
        healthQueryKeys.dashboard(today),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            waterLogs: [...old.waterLogs, newLog],
            summary: {
              ...old.summary,
              waterConsumedMl: old.summary.waterConsumedMl + newLog.amountMl,
            },
          };
        }
      );
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
      queryClient.setQueryData<WaterLog[]>(
        healthQueryKeys.waterLogs.today(),
        (old = []) => old.filter((log) => log.id !== deletedId)
      );

      queryClient.invalidateQueries({
        queryKey: healthQueryKeys.waterLogs.todayTotal(),
      });
      queryClient.invalidateQueries({
        queryKey: healthQueryKeys.dashboard(
          new Date().toISOString().split("T")[0]
        ),
      });
    },
  });

  return {
    addWaterLog,
    addQuickWaterLog,
    deleteWaterLog,
  };
};

// Nutrition Sync Hooks
export const useNutritionSync = () => {
  const queryClient = useQueryClient();

  const syncTodaysNutrition = useMutation({
    mutationFn: async (): Promise<DailySummary> => {
      const response = await fetchApi<DailySummary>(
        "/api/nutrition-sync/sync/today",
        {
          method: "POST",
          requiresAuth: true,
        }
      );
      return response;
    },
    onSuccess: (summary) => {
      const today = new Date().toISOString().split("T")[0];
      queryClient.setQueryData<HealthData>(
        healthQueryKeys.dashboard(today),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            summary,
          };
        }
      );
    },
  });

  const syncNutritionByDate = useMutation({
    mutationFn: async (date: string): Promise<DailySummary> => {
      const response = await fetchApi<DailySummary>(
        `/api/nutrition-sync/sync/${date}`,
        {
          method: "POST",
          requiresAuth: true,
        }
      );
      return response;
    },
    onSuccess: (summary, date) => {
      queryClient.setQueryData<HealthData>(
        healthQueryKeys.dashboard(date),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            summary,
          };
        }
      );
    },
  });

  return {
    syncTodaysNutrition,
    syncNutritionByDate,
  };
};

// export const useHealthStats = (date: string) => {
//   const { data: healthData } = useDashboardData(date);
//
//   return {
//     totalCaloriesConsumed: healthData?.summary.consumedCalories || 0,
//     totalCaloriesBurned: healthData?.summary.caloriesBurned || 0,
//     totalWaterConsumed: healthData?.summary.waterConsumedMl || 0,
//     totalNutrients: {
//       protein: healthData?.summary.consumedProtein || 0,
//       carbs: healthData?.summary.consumedCarbs || 0,
//       fat: healthData?.summary.consumedFat || 0,
//     },
//     progress: {
//       calories: healthData?.summary.caloriesProgress || 0,
//       protein: healthData?.summary.proteinProgress || 0,
//       carbs: healthData?.summary.carbsProgress || 0,
//       fat: healthData?.summary.fatProgress || 0,
//       water: healthData?.summary.waterProgress || 0,
//     },
//     remainingCalories: healthData?.summary.remainingCalories || 0,
//   };
// };



