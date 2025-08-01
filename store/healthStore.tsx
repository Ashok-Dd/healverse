import {
  CreateFoodLogData,
  ExerciseLog,
  FoodLog,
  HealthData,
  HealthStore,
  MealType,
  UpdateFoodLogData,
  UpdateExerciseLogData,
  UpdateWaterLogData,
  User,
  DailySummary,
  ExerciseIntensity,
  CreateExerciseLogData,
  CreateWaterLogData,
  WaterLog,
} from "@/types/type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { fetchApi } from "@/lib/fetchApi";
import { createDefaultHealthData } from "@/lib/utils";
import { useAuthStore } from "./authStore";

const useHealthStore = create<HealthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        currentDate: new Date().toISOString().split("T")[0],
        selectedDate: new Date().toISOString().split("T")[0],
        healthData: null,
        isLoading: false,
        error: null,

        // Basic Actions
        setCurrentDate: (date: string) => {
          set((state) => {
            state.currentDate = date;
          });
        },

        setSelectedDate: (date: string) => {
          set((state) => {
            state.selectedDate = date;
          });
          // Automatically fetch data when date changes
          get().fetchDashboardData(date);
        },

        setHealthData: (data: HealthData) => {
          set((state) => {
            state.healthData = data;
            state.error = null;
          });
        },

        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading;
          });
        },

        setError: (error: string | null) => {
          set((state) => {
            state.error = error;
          });
        },

        // Data fetching
        fetchDashboardData: async (date?: string) => {
          const targetDate = date || get().selectedDate;

          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            // Check if date is valid for fetching data
            if (!get().isValidDateForData(targetDate)) {
              // Set default empty data for invalid dates (future dates or before user creation)
              set((state) => {
                state.healthData = createDefaultHealthData(targetDate);
                state.isLoading = false;
              });
              return;
            }

            // Fetch data from API
            const response = await fetchApi<HealthData>(
              "/api/dashboard/today",
              {
                method: "GET",
                requiresAuth: true,
              }
            );

            set((state) => {
              state.healthData = response;
              state.isLoading = false;
            });
          } catch (error) {
            console.error("Failed to fetch dashboard data:", error);

            // Set default empty data on error
            set((state) => {
              state.healthData = createDefaultHealthData(targetDate);
              state.error =
                error instanceof Error ? error.message : "Failed to fetch data";
              state.isLoading = false;
            });
          }
        },

        isValidDateForData: (date: string) => {
          const { currentDate } = get();
          const { user: currentUser } = useAuthStore.getState();
          // If no user, return false
          if (!currentUser) return false;

          const selectedDateObj = new Date(date);
          const currentDateObj = new Date(currentDate);
          const userCreatedDateObj = new Date(
            currentUser.createdAt.split("T")[0]
          );

          // Date should not be in the future
          if (selectedDateObj > currentDateObj) return false;

          // Date should not be before user creation date
          if (selectedDateObj < userCreatedDateObj) return false;

          return true;
        },

        // Food Log Actions
        addFoodLog: (foodLogData: CreateFoodLogData) => {
          set((state) => {
            if (!state.healthData) return;

            const newFoodLog: FoodLog = {
              ...foodLogData,
              id: Date.now(), // Temporary ID, should be replaced by backend
              createdAt: new Date().toISOString(),
            };

            state.healthData.foodLogs.push(newFoodLog);

            // Update summary
            state.healthData.summary.consumedCalories += newFoodLog.calories;
            state.healthData.summary.consumedProtein += newFoodLog.protein;
            state.healthData.summary.consumedCarbs += newFoodLog.carbs;
            state.healthData.summary.consumedFat += newFoodLog.fat;
          });
          get().recalculateProgress();
        },

        updateFoodLog: (id: number, updates: UpdateFoodLogData) => {
          set((state) => {
            if (!state.healthData) return;

            const index = (state.healthData.foodLogs as FoodLog[]).findIndex(
              (log) => log.id === id
            );
            if (index !== -1) {
              const oldLog = state.healthData.foodLogs[index];
              const updatedLog = { ...oldLog, ...updates };

              // Update summary by removing old values and adding new ones
              state.healthData.summary.consumedCalories +=
                updatedLog.calories - oldLog.calories;
              state.healthData.summary.consumedProtein +=
                updatedLog.protein - oldLog.protein;
              state.healthData.summary.consumedCarbs +=
                updatedLog.carbs - oldLog.carbs;
              state.healthData.summary.consumedFat +=
                updatedLog.fat - oldLog.fat;

              state.healthData.foodLogs[index] = updatedLog;
            }
          });
          get().recalculateProgress();
        },

        deleteFoodLog: (id: number) => {
          set((state) => {
            if (!state.healthData) return;

            const logToDelete = (state.healthData.foodLogs as FoodLog[]).find(
              (log) => log.id === id
            );
            if (logToDelete) {
              // Update summary by removing the deleted log's values
              state.healthData.summary.consumedCalories -= logToDelete.calories;
              state.healthData.summary.consumedProtein -= logToDelete.protein;
              state.healthData.summary.consumedCarbs -= logToDelete.carbs;
              state.healthData.summary.consumedFat -= logToDelete.fat;

              state.healthData.foodLogs = (
                state.healthData.foodLogs as FoodLog[]
              ).filter((log) => log.id !== id);
            }
          });
          get().recalculateProgress();
        },

        getFoodLogById: (id: number) => {
          const { healthData } = get();
          return healthData?.foodLogs.find((log) => log.id === id);
        },

        getFoodLogsByMealType: (mealType: MealType) => {
          const { healthData } = get();
          return (
            healthData?.foodLogs.filter((log) => log.mealType === mealType) ||
            []
          );
        },

        getFoodLogsByDate: (date: string) => {
          const { healthData } = get();
          return (
            healthData?.foodLogs.filter((log) =>
              log.loggedAt.startsWith(date)
            ) || []
          );
        },

        // Exercise Log Actions
        addExerciseLog: (exerciseLogData: CreateExerciseLogData) => {
          set((state) => {
            if (!state.healthData) return;

            const newExerciseLog: ExerciseLog = {
              ...exerciseLogData,
              id: Date.now(),
              createdAt: new Date().toISOString(),
            };

            state.healthData.exerciseLogs.push(newExerciseLog);
            state.healthData.summary.caloriesBurned +=
              newExerciseLog.caloriesBurned;
          });
          get().recalculateProgress();
        },

        updateExerciseLog: (id: number, updates: UpdateExerciseLogData) => {
          set((state) => {
            if (!state.healthData) return;

            const index = (
              state.healthData.exerciseLogs as ExerciseLog[]
            ).findIndex((log) => log.id === id);
            if (index !== -1) {
              const oldLog = state.healthData.exerciseLogs[index];
              const updatedLog = { ...oldLog, ...updates };

              state.healthData.summary.caloriesBurned +=
                updatedLog.caloriesBurned - oldLog.caloriesBurned;
              state.healthData.exerciseLogs[index] = updatedLog;
            }
          });
          get().recalculateProgress();
        },

        deleteExerciseLog: (id: number) => {
          set((state) => {
            if (!state.healthData) return;

            const logToDelete = (
              state.healthData.exerciseLogs as ExerciseLog[]
            ).find((log) => log.id === id);
            if (logToDelete) {
              state.healthData.summary.caloriesBurned -=
                logToDelete.caloriesBurned;
              state.healthData.exerciseLogs = (
                state.healthData.exerciseLogs as ExerciseLog[]
              ).filter((log) => log.id !== id);
            }
          });
          get().recalculateProgress();
        },

        getExerciseLogById: (id: number) => {
          const { healthData } = get();
          return healthData?.exerciseLogs.find((log) => log.id === id);
        },

        getExerciseLogsByDate: (date: string) => {
          const { healthData } = get();
          return (
            healthData?.exerciseLogs.filter((log) =>
              log.loggedAt.startsWith(date)
            ) || []
          );
        },

        getExerciseLogsByIntensity: (intensity: ExerciseIntensity) => {
          const { healthData } = get();
          return (
            healthData?.exerciseLogs.filter(
              (log) => log.intensity === intensity
            ) || []
          );
        },

        // Water Log Actions
        addWaterLog: (waterLogData: CreateWaterLogData) => {
          set((state) => {
            if (!state.healthData) return;

            const newWaterLog: WaterLog = {
              ...waterLogData,
              id: Date.now(),
              createdAt: new Date().toISOString(),
            };

            state.healthData.waterLogs.push(newWaterLog);
            state.healthData.summary.waterConsumedMl += newWaterLog.amountMl;
          });
          get().recalculateProgress();
        },

        updateWaterLog: (id: number, updates: UpdateWaterLogData) => {
          set((state) => {
            if (!state.healthData) return;

            const index = (state.healthData.waterLogs as WaterLog[]).findIndex(
              (log) => log.id === id
            );
            if (index !== -1) {
              const oldLog = state.healthData.waterLogs[index];
              const updatedLog = { ...oldLog, ...updates };

              state.healthData.summary.waterConsumedMl +=
                updatedLog.amountMl - oldLog.amountMl;
              state.healthData.waterLogs[index] = updatedLog;
            }
          });
          get().recalculateProgress();
        },

        deleteWaterLog: (id: number) => {
          set((state) => {
            if (!state.healthData) return;

            const logToDelete = (state.healthData.waterLogs as WaterLog[]).find(
              (log) => log.id === id
            );
            if (logToDelete) {
              state.healthData.summary.waterConsumedMl -= logToDelete.amountMl;
              state.healthData.waterLogs = (
                state.healthData.waterLogs as WaterLog[]
              ).filter((log) => log.id !== id);
            }
          });
          get().recalculateProgress();
        },

        getWaterLogById: (id: number) => {
          const { healthData } = get();
          return healthData?.waterLogs.find((log) => log.id === id);
        },

        getWaterLogsByDate: (date: string) => {
          const { healthData } = get();
          return (
            healthData?.waterLogs.filter((log) =>
              log.loggedAt.startsWith(date)
            ) || []
          );
        },

        // Summary Actions
        updateSummary: (summaryUpdates: Partial<DailySummary>) => {
          set((state) => {
            if (!state.healthData) return;
            state.healthData.summary = {
              ...state.healthData.summary,
              ...summaryUpdates,
            };
          });
          get().recalculateProgress();
        },

        recalculateProgress: () => {
          set((state) => {
            if (!state.healthData) return;

            const { summary } = state.healthData;

            // Calculate remaining calories
            summary.remainingCalories =
              summary.targetCalories -
              summary.consumedCalories +
              summary.caloriesBurned;

            // Calculate progress percentages
            summary.caloriesProgress =
              (summary.consumedCalories / summary.targetCalories) * 100;
            summary.proteinProgress =
              (summary.consumedProtein / summary.targetProtein) * 100;
            summary.carbsProgress =
              (summary.consumedCarbs / summary.targetCarbs) * 100;
            summary.fatProgress =
              (summary.consumedFat / summary.targetFat) * 100;
            summary.waterProgress =
              (summary.waterConsumedMl / summary.targetWaterMl) * 100;
          });
        },

        // Utility Actions
        clearAllData: () => {
          set((state) => {
            state.healthData = null;
            state.error = null;
          });
        },

        syncData: (data: HealthData) => {
          set((state) => {
            state.healthData = data;
            state.error = null;
            state.isLoading = false;
          });
        },

        // Initialize with default data
        initializeDefaultData: () => {
          const { selectedDate } = get();
          set((state) => {
            state.healthData = createDefaultHealthData(selectedDate);
          });
        },

        getTotalCaloriesConsumed: () => {
          const { healthData } = get();
          return healthData?.summary.consumedCalories || 0;
        },

        getTotalCaloriesBurned: () => {
          const { healthData } = get();
          return healthData?.summary.caloriesBurned || 0;
        },

        getTotalWaterConsumed: () => {
          const { healthData } = get();
          return healthData?.summary.waterConsumedMl || 0;
        },

        getTotalNutrients: () => {
          const { healthData } = get();
          return {
            protein: healthData?.summary.consumedProtein || 0,
            carbs: healthData?.summary.consumedCarbs || 0,
            fat: healthData?.summary.consumedFat || 0,
          };
        },
      })),
      {
        name: "health-store",
        partialize: (state) => ({
          currentDate: state.currentDate,
          selectedDate: state.selectedDate,
          healthData: state.healthData,
        }),
      }
    ),
    {
      name: "health-store",
    }
  )
);

export default useHealthStore;
