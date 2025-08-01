import {
    CreateFoodLogData,
    ExerciseLog,
    FoodLog,
    HealthData,
    MealType,
    UpdateFoodLogData,
    UpdateExerciseLogData,
    UpdateWaterLogData,
    DailySummary,
    ExerciseIntensity,
    CreateExerciseLogData,
    CreateWaterLogData,
    WaterLog,
    HealthStore
} from "@/types/type";
import {create} from "zustand";
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { fetchApi } from '@/lib/fetchApi';
import {createDefaultHealthData} from "@/constants/data";
import {useAuthStore} from "@/store/authStore";



const useHealthStore = create<HealthStore>()(
    devtools(
        persist(
            immer((set, get) => ({
                // Initial State
                currentDate: new Date().toISOString().split('T')[0],
                selectedDate: new Date().toISOString().split('T')[0],
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
                        void get().fetchDashboardData(date);
                    });
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
                        // const response = await fetchApi<HealthData>(`/api/dashboard/${targetDate}`, {
                        //     method: 'GET',
                        //     requiresAuth: true,
                        // });

                        set((state) => {
                            state.healthData = createDefaultHealthData(targetDate);
                            state.isLoading = false;
                        });

                    } catch (error) {
                        console.error('Failed to fetch dashboard data:', error);

                        // Set default empty data on error
                        set((state) => {
                            state.healthData = createDefaultHealthData(targetDate);
                            state.error = error instanceof Error ? error.message : 'Failed to fetch data';
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
                    const userCreatedDateObj = new Date(currentUser.createdAt.split('T')[0]);

                    // Date should not be in the future
                    if (selectedDateObj > currentDateObj) return false;

                    // Date should not be before user creation date
                    if (selectedDateObj < userCreatedDateObj) return false;

                    return true;
                },

                // Food Log Actions (updated to work with API)
                addFoodLog: async (foodLogData: CreateFoodLogData) => {
                    try {
                        const response = await fetchApi<FoodLog>('/api/food-logs/log', {
                            method: 'POST',
                            requiresAuth: true,
                            body: foodLogData,
                        });

                        set((state) => {
                            if (!state.healthData) return;
                            state.healthData.foodLogs.push(response);

                            // Update summary
                            state.healthData.summary.consumedCalories += response.calories;
                            state.healthData.summary.consumedProtein += response.protein;
                            state.healthData.summary.consumedCarbs += response.carbs;
                            state.healthData.summary.consumedFat += response.fat;
                        });

                        get().recalculateProgress();
                        return response;
                    } catch (error) {
                        console.error('Failed to add food log:', error);
                        throw error;
                    }
                },

                updateFoodLog: async (id: number, updates: UpdateFoodLogData) => {
                    try {
                        const response = await fetchApi<FoodLog>(`/api/food-logs/${id}`, {
                            method: 'PUT',
                            requiresAuth: true,
                            body: updates,
                        });

                        set((state) => {
                            if (!state.healthData) return;

                            const index = (state.healthData.foodLogs as FoodLog[]).findIndex(log => log.id === id);
                            if (index !== -1) {
                                const oldLog = state.healthData.foodLogs[index];

                                // Update summary by removing old values and adding new ones
                                state.healthData.summary.consumedCalories += (response.calories - oldLog.calories);
                                state.healthData.summary.consumedProtein += (response.protein - oldLog.protein);
                                state.healthData.summary.consumedCarbs += (response.carbs - oldLog.carbs);
                                state.healthData.summary.consumedFat += (response.fat - oldLog.fat);

                                state.healthData.foodLogs[index] = response;
                            }
                        });

                        get().recalculateProgress();
                        return response;
                    } catch (error) {
                        console.error('Failed to update food log:', error);
                        throw error;
                    }
                },

                deleteFoodLog: async (id: number) => {
                    try {
                        await fetchApi(`/api/food-logs/${id}`, {
                            method: 'DELETE',
                            requiresAuth: true,
                        });

                        set((state) => {
                            if (!state.healthData) return;

                            const logToDelete = (state.healthData.foodLogs as FoodLog[]).find(log => log.id === id);
                            if (logToDelete) {
                                // Update summary by removing the deleted log's values
                                state.healthData.summary.consumedCalories -= logToDelete.calories;
                                state.healthData.summary.consumedProtein -= logToDelete.protein;
                                state.healthData.summary.consumedCarbs -= logToDelete.carbs;
                                state.healthData.summary.consumedFat -= logToDelete.fat;

                                state.healthData.foodLogs = (state.healthData.foodLogs as FoodLog[]).filter(log => log.id !== id);
                            }
                        });

                        get().recalculateProgress();
                    } catch (error) {
                        console.error('Failed to delete food log:', error);
                        throw error;
                    }
                },

                getFoodLogById: (id: number) => {
                    const { healthData } = get();
                    return (healthData?.foodLogs as FoodLog[]).find(log => log.id === id);
                },

                getFoodLogsByMealType: (mealType: MealType) => {
                    const { healthData } = get();
                    return (healthData?.foodLogs as FoodLog[]).filter(log => log.mealType === mealType) || [];
                },

                getFoodLogsByDate: (date: string) => {
                    const { healthData } = get();
                    return (healthData?.foodLogs as FoodLog[]).filter(log =>
                        log.loggedAt.startsWith(date)
                    ) || [];
                },

                fetchTodaysFoodLogs: async () => {
                    try {
                        const response = await fetchApi<FoodLog[]>('/api/food-logs/today', {
                            method: 'GET',
                            requiresAuth: true,
                        });
                        return response;
                    } catch (error) {
                        console.error('Failed to fetch today\'s food logs:', error);
                        throw error;
                    }
                },

                fetchFoodLogsByMealType: async (mealType: MealType) => {
                    try {
                        const response = await fetchApi<FoodLog[]>(`/api/food-logs/today/${mealType}`, {
                            method: 'GET',
                            requiresAuth: true,
                        });
                        return response;
                    } catch (error) {
                        console.error(`Failed to fetch ${mealType} food logs:`, error);
                        throw error;
                    }
                },

                // Exercise Log Actions (updated to work with API)
                addExerciseLog: async (exerciseLogData: CreateExerciseLogData) => {
                    try {
                        const response = await fetchApi<ExerciseLog>('/api/exercise-logs/log', {
                            method: 'POST',
                            requiresAuth: true,
                            body: exerciseLogData,
                        });

                        set((state) => {
                            if (!state.healthData) return;
                            state.healthData.exerciseLogs.push(response);
                            state.healthData.summary.caloriesBurned += response.caloriesBurned;
                        });

                        get().recalculateProgress();
                        return response;
                    } catch (error) {
                        console.error('Failed to add exercise log:', error);
                        throw error;
                    }
                },

                updateExerciseLog: async (id: number, updates: UpdateExerciseLogData) => {
                    try {
                        const response = await fetchApi<ExerciseLog>(`/api/exercise-logs/${id}`, {
                            method: 'PUT',
                            requiresAuth: true,
                            body: updates,
                        });

                        set((state) => {
                            if (!state.healthData) return;

                            const index = (state.healthData.exerciseLogs as ExerciseLog[]).findIndex(log => log.id === id);
                            if (index !== -1) {
                                const oldLog = state.healthData.exerciseLogs[index];
                                state.healthData.summary.caloriesBurned += (response.caloriesBurned - oldLog.caloriesBurned);
                                state.healthData.exerciseLogs[index] = response;
                            }
                        });

                        get().recalculateProgress();
                        return response;
                    } catch (error) {
                        console.error('Failed to update exercise log:', error);
                        throw error;
                    }
                },

                deleteExerciseLog: async (id: number) => {
                    try {
                        await fetchApi(`/api/exercise-logs/${id}`, {
                            method: 'DELETE',
                            requiresAuth: true,
                        });

                        set((state) => {
                            if (!state.healthData) return;

                            const logToDelete = (state.healthData.exerciseLogs as ExerciseLog[]).find(log => log.id === id);
                            if (logToDelete) {
                                state.healthData.summary.caloriesBurned -= logToDelete.caloriesBurned;
                                state.healthData.exerciseLogs = (state.healthData.exerciseLogs as ExerciseLog[]).filter(log => log.id !== id);
                            }
                        });

                        get().recalculateProgress();
                    } catch (error) {
                        console.error('Failed to delete exercise log:', error);
                        throw error;
                    }
                },

                getExerciseLogById: (id: number) => {
                    const { healthData } = get();
                    return (healthData?.exerciseLogs as ExerciseLog[]).find(log => log.id === id);
                },

                getExerciseLogsByDate: (date: string) => {
                    const { healthData } = get();
                    return (healthData?.exerciseLogs as ExerciseLog[]).filter(log =>
                        log.loggedAt.startsWith(date)
                    ) || [];
                },

                getExerciseLogsByIntensity: (intensity: ExerciseIntensity) => {
                    const { healthData } = get();
                    return (healthData?.exerciseLogs as ExerciseLog[]).filter(log => log.intensity === intensity) || [];
                },

                fetchTodaysExerciseLogs: async () => {
                    try {
                        const response = await fetchApi<ExerciseLog[]>('/api/exercise-logs/today', {
                            method: 'GET',
                            requiresAuth: true,
                        });
                        return response;
                    } catch (error) {
                        console.error('Failed to fetch today\'s exercise logs:', error);
                        throw error;
                    }
                },

                fetchExerciseTypes: async () => {
                    try {
                        const response = await fetchApi<{name: string, metValue: number, category: string}[]>('/api/exercise-logs/types', {
                            method: 'GET',
                            requiresAuth: true,
                        });
                        return response;
                    } catch (error) {
                        console.error('Failed to fetch exercise types:', error);
                        throw error;
                    }
                },

                // Water Log Actions (updated to work with API)
                addWaterLog: async (waterLogData: CreateWaterLogData) => {
                    try {
                        const response = await fetchApi<WaterLog>('/api/water-logs/log', {
                            method: 'POST',
                            requiresAuth: true,
                            body: waterLogData,
                        });

                        set((state) => {
                            if (!state.healthData) return;
                            state.healthData.waterLogs.push(response);
                            state.healthData.summary.waterConsumedMl += response.amountMl;
                        });

                        get().recalculateProgress();
                        return response;
                    } catch (error) {
                        console.error('Failed to add water log:', error);
                        throw error;
                    }
                },

                addQuickWaterLog: async (presetType: 'GLASS' | 'BOTTLE' | 'LARGE') => {
                    try {
                        const response = await fetchApi<WaterLog>('/api/water-logs/quick', {
                            method: 'POST',
                            requiresAuth: true,
                            body: { presetType },
                        });

                        set((state) => {
                            if (!state.healthData) return;
                            state.healthData.waterLogs.push(response);
                            state.healthData.summary.waterConsumedMl += response.amountMl;
                        });

                        get().recalculateProgress();
                        return response;
                    } catch (error) {
                        console.error('Failed to add quick water log:', error);
                        throw error;
                    }
                },

                updateWaterLog: (id: number, updates: UpdateWaterLogData) => {
                    set((state) => {
                        if (!state.healthData) return;

                        const index = (state.healthData.waterLogs as WaterLog[]).findIndex(log => log.id === id);
                        if (index !== -1) {
                            const oldLog = state.healthData.waterLogs[index];
                            const updatedLog = { ...oldLog, ...updates } as WaterLog;

                            state.healthData.summary.waterConsumedMl += (updatedLog.amountMl - oldLog.amountMl);
                            state.healthData.waterLogs[index] = updatedLog;
                        }
                    });
                    get().recalculateProgress();
                },

                deleteWaterLog: async (id: number) => {
                    try {
                        await fetchApi(`/api/water-logs/${id}`, {
                            method: 'DELETE',
                            requiresAuth: true,
                        });

                        set((state) => {
                            if (!state.healthData) return;

                            const logToDelete = (state.healthData.waterLogs as WaterLog[]).find(log => log.id === id);
                            if (logToDelete) {
                                state.healthData.summary.waterConsumedMl -= logToDelete.amountMl;
                                state.healthData.waterLogs = (state.healthData.waterLogs as WaterLog[]).filter(log => log.id !== id);
                            }
                        });

                        get().recalculateProgress();
                    } catch (error) {
                        console.error('Failed to delete water log:', error);
                        throw error;
                    }
                },

                getWaterLogById: (id: number) => {
                    const { healthData } = get();
                    return (healthData?.waterLogs as WaterLog[]).find(log => log.id === id);
                },

                getWaterLogsByDate: (date: string) => {
                    const { healthData } = get();
                    return (healthData?.waterLogs as WaterLog[]).filter(log =>
                        log.loggedAt.startsWith(date)
                    ) || [];
                },

                fetchTodaysWaterLogs: async () => {
                    try {
                        const response = await fetchApi<WaterLog[]>('/api/water-logs/today', {
                            method: 'GET',
                            requiresAuth: true,
                        });
                        return response;
                    } catch (error) {
                        console.error('Failed to fetch today\'s water logs:', error);
                        throw error;
                    }
                },

                fetchTodaysWaterTotal: async () => {
                    try {
                        const response = await fetchApi<{totalMl: number}>('/api/water-logs/today/total', {
                            method: 'GET',
                            requiresAuth: true,
                        });
                        return response.totalMl;
                    } catch (error) {
                        console.error('Failed to fetch today\'s water total:', error);
                        throw error;
                    }
                },

                // Summary Actions
                updateSummary: (summaryUpdates: Partial<DailySummary>) => {
                    set((state) => {
                        if (!state.healthData) return;
                        state.healthData.summary = { ...state.healthData.summary, ...summaryUpdates };
                    });
                    get().recalculateProgress();
                },

                recalculateProgress: () => {
                    set((state) => {
                        if (!state.healthData) return;

                        const { summary } = state.healthData;

                        // Calculate remaining calories
                        summary.remainingCalories = summary.targetCalories - summary.consumedCalories + summary.caloriesBurned;

                        // Calculate progress percentages
                        summary.caloriesProgress = (summary.consumedCalories / summary.targetCalories) * 100;
                        summary.proteinProgress = (summary.consumedProtein / summary.targetProtein) * 100;
                        summary.carbsProgress = (summary.consumedCarbs / summary.targetCarbs) * 100;
                        summary.fatProgress = (summary.consumedFat / summary.targetFat) * 100;
                        summary.waterProgress = (summary.waterConsumedMl / summary.targetWaterMl) * 100;
                    });
                },

                // Weekly Dashboard
                fetchWeeklyDashboard: async () => {
                    try {
                        const response = await fetchApi<{
                            weeklySummaries: DailySummary[],
                            weeklyStats: {
                                avgCaloriesConsumed: number,
                                avgCaloriesBurned: number,
                                avgWaterIntake: number,
                                daysOnTrack: number,
                                totalDays: number
                            }
                        }>('/api/dashboard/weekly', {
                            method: 'GET',
                            requiresAuth: true,
                        });
                        return response;
                    } catch (error) {
                        console.error('Failed to fetch weekly dashboard:', error);
                        throw error;
                    }
                },

                // Nutrition Sync
                syncTodaysNutrition: async () => {
                    try {
                        const response = await fetchApi<DailySummary>('/api/nutrition-sync/sync/today', {
                            method: 'POST',
                            requiresAuth: true,
                        });

                        set((state) => {
                            if (state.healthData) {
                                state.healthData.summary = response;
                            }
                        });

                        return response;
                    } catch (error) {
                        console.error('Failed to sync today\'s nutrition:', error);
                        throw error;
                    }
                },

                syncNutritionByDate: async (date: string) => {
                    try {
                        const response = await fetchApi<DailySummary>(`/api/nutrition-sync/sync/${date}`, {
                            method: 'POST',
                            requiresAuth: true,
                        });
                        return response;
                    } catch (error) {
                        console.error('Failed to sync nutrition for date:', error);
                        throw error;
                    }
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
                name: 'health-store',
                partialize: (state) => ({
                    currentDate: state.currentDate,
                    selectedDate: state.selectedDate,
                    healthData: state.healthData,
                }),
            }
        ),
        {
            name: 'health-store',
        }
    )
);

export default useHealthStore;