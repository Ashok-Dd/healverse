import {
    DietPlan,
    Meal,
    MealType,
    DietPlanStore,
} from "@/types/type";
import {create} from "zustand";
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { fetchApi } from '@/lib/fetchApi';
import {useAuthStore} from "@/store/authStore";
import {getDummyDietPlan} from "@/constants/data";


const useDietPlanStore = create<DietPlanStore>()(
    devtools(
        // persist(
            immer((set, get) => ({
                // Initial State
                currentDate: new Date().toISOString().split('T')[0],
                selectedDate: new Date().toISOString().split('T')[0],
                dietPlan: null,
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
                        void get().fetchDietPlan(date);
                    });
                },

                setDietPlan: (dietPlan: DietPlan | null) => {
                    set((state) => {
                        state.dietPlan = dietPlan;
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

                // Diet Plan Actions
                generateDietPlan: async (planDate?: string) => {
                    const targetDate = planDate || get().selectedDate;

                    set((state) => {
                        state.isLoading = true;
                        state.error = null;
                    });

                    try {
                        // const response = await fetchApi<DietPlan>('/api/diet-plans/generate', {
                        //     method: 'POST',
                        //     requiresAuth: true,
                        //     body: planDate ? { planDate } : {},
                        // });

                        set((state) => {
                            state.dietPlan = getDummyDietPlan();
                            state.isLoading = false;
                        });

                        return getDummyDietPlan();
                    } catch (error) {
                        console.error('Failed to generate diet plan:', error);
                        set((state) => {
                            state.error = error instanceof Error ? error.message : 'Failed to generate diet plan';
                            state.isLoading = false;
                        });
                        throw error;
                    }
                },

                fetchDietPlan: async (date?: string) => {
                    const targetDate = date || get().selectedDate;

                    set((state) => {
                        state.isLoading = true;
                        state.error = null;
                    });

                    try {
                        // First try to get existing diet plan
                        let response: DietPlan;
                        try {
                            // response = await fetchApi<DietPlan>(`/api/diet-plans/${targetDate}`, {
                            //     method: 'GET',
                            //     requiresAuth: true,
                            // });
                        } catch (error: any) {
                            // If not found (404), generate new one
                            // if (error.status === 404) {
                            //     response = await get().generateDietPlan(targetDate);
                            // } else {
                            //     throw error;
                            // }
                        }

                        set((state) => {
                            state.dietPlan = getDummyDietPlan();
                            state.isLoading = false;
                        });

                        return getDummyDietPlan();
                    } catch (error) {
                        console.error('Failed to fetch diet plan:', error);
                        set((state) => {
                            state.dietPlan = null;
                            state.error = error instanceof Error ? error.message : 'Failed to fetch diet plan';
                            state.isLoading = false;
                        });
                        throw error;
                    }
                },

                fetchTodaysDietPlan: async () => {
                    set((state) => {
                        state.isLoading = true;
                        state.error = null;
                    });

                    try {
                        const response = await fetchApi<DietPlan>('/api/diet-plans/today', {
                            method: 'GET',
                            requiresAuth: true,
                        });

                        set((state) => {
                            state.dietPlan = response;
                            state.isLoading = false;
                        });

                        return response;
                    } catch (error) {
                        console.error('Failed to fetch today\'s diet plan:', error);
                        set((state) => {
                            state.error = error instanceof Error ? error.message : 'Failed to fetch today\'s diet plan';
                            state.isLoading = false;
                        });
                        throw error;
                    }
                },

                getMealsByType: (mealType: MealType) => {
                    const { dietPlan } = get();
                    return (dietPlan?.meals as Meal[]).filter(meal => meal.mealType === mealType) || [];
                },

                getMealById: (id: number) => {
                    const { dietPlan } = get();
                    return (dietPlan?.meals as Meal[]).find(meal => meal.id === id);
                },

                // Utility Actions
                clearData: () => {
                    set((state) => {
                        state.dietPlan = null;
                        state.error = null;
                    });
                },
            })),
        //     {
        //         name: 'diet-plan-store',
        //         partialize: (state) => ({
        //             currentDate: state.currentDate,
        //             selectedDate: state.selectedDate,
        //             dietPlan: state.dietPlan,
        //         }),
        //     }
        // ),
        {
            name: 'diet-plan-store',
        }
    )
);

export default useDietPlanStore;