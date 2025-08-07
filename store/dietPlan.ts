import { getDummyDietPlan } from "@/constants/data";
import { fetchApi } from '@/lib/fetchApi';
import { useAuthStore } from "@/store/authStore";
import { DietPlan, Meal, MealType } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

// ==================== QUERY KEYS ====================
export const dietPlanKeys = {
  all: ['dietPlans'] as const,
  byDate: (date: string) => [...dietPlanKeys.all, 'byDate', date] as const,
  today: () => [...dietPlanKeys.all, 'today'] as const,
} as const;

// ==================== API FUNCTIONS ====================
const dietPlanApi = {
  fetchByDate: async (date: string): Promise<DietPlan> => {
    try {
      return await fetchApi<DietPlan>(`/api/diet-plans/${date}`, {
        method: 'GET',
        requiresAuth: true,
      });
    } catch (error: any) {
      // If not found, return dummy data or generate new plan
      if (error.status === 404) {
        // In development, return dummy data
        return getDummyDietPlan();
        // In production, you might want to generate a new plan:
        // return await dietPlanApi.generate(date);
      }
      throw error;
    }
  },

  fetchToday: async (): Promise<DietPlan> => {
    try {
      return await fetchApi<DietPlan>('/api/diet-plans/today', {
        method: 'GET',
        requiresAuth: true,
      });
    } catch (error: any) {
      // Fallback to dummy data for development
      if (error.status === 404) {
        return getDummyDietPlan();
      }
      throw error;
    }
  },

  generate: async (planDate?: string): Promise<DietPlan> => {
    try {
      return await fetchApi<DietPlan>('/api/diet-plans/generate', {
        method: 'POST',
        requiresAuth: true,
        body: planDate ? { planDate } : {},
      });
    } catch (error) {
      // Fallback to dummy data for development
      console.warn('API not available, using dummy data');
      return getDummyDietPlan();
    }
  },
};

// ==================== UTILITY FUNCTIONS ====================
const getCurrentDate = (): string => {
  try {
    return new Date().toISOString().split('T')[0];
  } catch (error) {
    console.error('Error getting current date:', error);
    return new Date().toLocaleDateString('en-CA'); // Fallback format YYYY-MM-DD
  }
};

const isValidDateForData = (date: string | undefined | null): boolean => {
  console.log('🔍 Validating date:', date);
  
  if (!date || typeof date !== 'string') {
    console.log('❌ Date validation failed: Invalid date format', { date, type: typeof date });
    return false;
  }
  
  const { user: currentUser } = useAuthStore.getState();
  console.log('👤 Current user:', currentUser ? 'exists' : 'null');

  if (!currentUser) {
    console.log('❌ Date validation failed: No current user');
    return false;
  }

  try {
    const selectedDateObj = new Date(date);
    const currentDateObj = new Date(getCurrentDate());
    
    console.log('📅 Dates parsed:', {
      selectedDate: date,
      selectedDateObj: selectedDateObj.toISOString(),
      currentDate: getCurrentDate(),
      currentDateObj: currentDateObj.toISOString(),
    });
    
    // Handle createdAt safely
    const createdAtDate = currentUser.createdAt;
    console.log('🎂 User createdAt:', createdAtDate, typeof createdAtDate);
    
    if (!createdAtDate) {
      console.log('❌ Date validation failed: No user creation date');
      return false;
    }
    
    const userCreatedDateStr = typeof createdAtDate === 'string' 
      ? createdAtDate.split('T')[0] 
      : createdAtDate.toISOString().split('T')[0];
    
    const userCreatedDateObj = new Date(userCreatedDateStr);
    
    console.log('🎂 User creation date processed:', {
      original: createdAtDate,
      processed: userCreatedDateStr,
      dateObj: userCreatedDateObj.toISOString(),
    });

    // Check for invalid dates
    if (isNaN(selectedDateObj.getTime()) || 
        isNaN(currentDateObj.getTime()) || 
        isNaN(userCreatedDateObj.getTime())) {
      console.log('❌ Date validation failed: Invalid date objects', {
        selectedValid: !isNaN(selectedDateObj.getTime()),
        currentValid: !isNaN(currentDateObj.getTime()),
        userCreatedValid: !isNaN(userCreatedDateObj.getTime()),
      });
      return false;
    }

    // Date should not be in the future
    if (selectedDateObj > currentDateObj) {
      console.log('❌ Date validation failed: Date is in the future', {
        selected: selectedDateObj.toISOString(),
        current: currentDateObj.toISOString(),
      });
      return false;
    }

    // Date should not be before user creation date
    if (selectedDateObj < userCreatedDateObj) {
      console.log('❌ Date validation failed: Date is before user creation', {
        selected: selectedDateObj.toISOString(),
        userCreated: userCreatedDateObj.toISOString(),
      });
      return false;
    }

    console.log('✅ Date validation passed!');
    return true;
  } catch (error) {
    console.error('❌ Error validating date:', error, { date, currentUser });
    return false;
  }
};

// ==================== HOOK 1: DIET PLAN QUERY ====================
interface UseDietPlanOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export const useDietPlan = (date?: string | null, options: UseDietPlanOptions = {}) => {
  const targetDate = date || getCurrentDate();
  const isValidDate = isValidDateForData(targetDate);

  const query = useQuery({
    queryKey: dietPlanKeys.byDate(targetDate),
    queryFn: () => dietPlanApi.fetchByDate(targetDate),
    enabled: isValidDate && (options.enabled !== false),
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options.gcTime ?? 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false;
      return failureCount < 3;
    },
  });

  // Utility functions for working with meals
  const getMealsByType = useCallback((mealType: MealType): Meal[] => {
    if (!query.data?.meals) return [];
    return (query.data.meals as Meal[]).filter(meal => meal.mealType === mealType);
  }, [query.data]);

  const getMealById = useCallback((id: number): Meal | undefined => {
    if (!query.data?.meals) return undefined;
    return (query.data.meals as Meal[]).find(meal => meal.id === id);
  }, [query.data]);

  const totalNutrition = useMemo(() => {
    if (!query.data?.meals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    const meals = query.data.meals as Meal[];
    return meals.reduce(
      (total, meal) => ({
        calories: total.calories + (meal.calories || 0),
        protein: total.protein + (meal.protein || 0),
        carbs: total.carbs + (meal.carbs || 0),
        fat: total.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [query.data]);

  return {
    // Query state
    dietPlan: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    
    // Query actions
    refetch: query.refetch,
    
    // Utility functions
    getMealsByType,
    getMealById,
    totalNutrition,
    isValidDate,
    targetDate,
  };
};

// ==================== HOOK 2: DATE MANAGEMENT ====================
interface UseDateSelectorOptions {
  initialDate?: string;
  autoFetch?: boolean;
}

export const useDateSelector = (options: UseDateSelectorOptions = {}) => {
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
        queryKey: dietPlanKeys.byDate(safeDate),
        queryFn: () => dietPlanApi.fetchByDate(safeDate),
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

// ==================== HOOK 3: DIET PLAN MUTATIONS ====================
export const useDietPlanMutations = () => {
  const queryClient = useQueryClient();

  const generatePlan = useMutation({
    mutationFn: dietPlanApi.generate,
    onSuccess: (data, variables) => {
      const targetDate = variables || getCurrentDate();
      
      // Update the cache for the specific date
      queryClient.setQueryData(dietPlanKeys.byDate(targetDate), data);
      
      // If generating for today, also update today's query
      if (targetDate === getCurrentDate()) {
        queryClient.setQueryData(dietPlanKeys.today(), data);
      }
      
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: dietPlanKeys.all,
        refetchType: 'none' // Don't refetch immediately since we just updated
      });
    },
    onError: (error) => {
      console.error('Failed to generate diet plan:', error);
    },
  });

  const refreshPlan = useMutation({
    mutationFn: async (date: string) => {
      // Invalidate and refetch the specific date
      await queryClient.invalidateQueries({ 
        queryKey: dietPlanKeys.byDate(date) 
      });
      return queryClient.fetchQuery({
        queryKey: dietPlanKeys.byDate(date),
        queryFn: () => dietPlanApi.fetchByDate(date),
      });
    },
    onSuccess: (data, date) => {
      // Ensure the cache is updated
      queryClient.setQueryData(dietPlanKeys.byDate(date), data);
    },
  });

  const clearCache = useCallback((date?: string) => {
    if (date) {
      queryClient.removeQueries({ queryKey: dietPlanKeys.byDate(date) });
    } else {
      queryClient.removeQueries({ queryKey: dietPlanKeys.all });
    }
  }, [queryClient]);

  const prefetchDate = useCallback((date: string) => {
    if (!isValidDateForData(date)) return;
    
    return queryClient.prefetchQuery({
      queryKey: dietPlanKeys.byDate(date),
      queryFn: () => dietPlanApi.fetchByDate(date),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  const getCachedPlan = useCallback((date: string): DietPlan | undefined => {
    return queryClient.getQueryData(dietPlanKeys.byDate(date));
  }, [queryClient]);

  return {
    // Mutations
    generatePlan,
    refreshPlan,
    
    // Mutation states
    isGenerating: generatePlan.isPending,
    isRefreshing: refreshPlan.isPending,
    generateError: generatePlan.error,
    refreshError: refreshPlan.error,
    
    // Actions
    generate: generatePlan.mutateAsync,
    refresh: refreshPlan.mutateAsync,
    
    // Sync actions
    generateSync: generatePlan.mutate,
    refreshSync: refreshPlan.mutate,
    
    // Cache utilities
    clearCache,
    prefetchDate,
    getCachedPlan,
  };
};

// ==================== BONUS: COMPOSITE HOOK ====================
// This combines all three hooks for easy usage in components
export const useDietPlanManager = (initialDate?: string) => {
  const dateSelector = useDateSelector({ initialDate });
  const dietPlan = useDietPlan(dateSelector.selectedDate);
  const mutations = useDietPlanMutations();

  const handleDateChange = useCallback((date: string) => {
    dateSelector.setSelectedDate(date);
  }, [dateSelector]);

  const handleGenerate = useCallback(async () => {
    try {
      await mutations.generate(dateSelector.selectedDate);
    } catch (error) {
      console.error('Failed to generate diet plan:', error);
      throw error;
    }
  }, [mutations, dateSelector.selectedDate]);

  const handleRefresh = useCallback(async () => {
    try {
      await mutations.refresh(dateSelector.selectedDate);
    } catch (error) {
      console.error('Failed to refresh diet plan:', error);
      throw error;
    }
  }, [mutations, dateSelector.selectedDate]);

  return {
    // Date management
    ...dateSelector,
    handleDateChange,
    
    // Diet plan data
    ...dietPlan,
    
    // Mutations
    ...mutations,
    handleGenerate,
    handleRefresh,
    
    // Combined loading states
    isLoading: dietPlan.isLoading || mutations.isGenerating || mutations.isRefreshing,
  };
};