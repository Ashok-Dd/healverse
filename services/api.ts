import { getDummyDietPlan } from "@/constants/data";
import { fetchApi } from "@/lib/fetchApi";
import { DietPlan } from "@/types/type";

// ==================== API FUNCTIONS ====================
export const dietPlanApi = {
  fetchByDate: async (date: string): Promise<DietPlan | null> => {
    try {
      return await fetchApi<DietPlan>(`/api/diet-plans/generate/${date}`, {
        method: "POST",
        requiresAuth: true,
      });
    } catch (error: any) {
      // // If not found, return dummy data or generate new plan
      // if (error.status === 404) {
      //   // In development, return dummy data
      //   return getDummyDietPlan();
      //   // In production, you might want to generate a new plan:
      //   // return await dietPlanApi.generate(date);
      // }

      return null;
    }
  },

  fetchToday: async (): Promise<DietPlan> => {
    try {
      return await fetchApi<DietPlan>("/api/diet-plans/today", {
        method: "GET",
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
      return await fetchApi<DietPlan>("/api/diet-plans/generate", {
        method: "POST",
        requiresAuth: true,
        body: planDate ? { planDate } : {},
      });
    } catch (error) {
      // Fallback to dummy data for development
      console.warn("API not available, using dummy data");
      return getDummyDietPlan();
    }
  },
};