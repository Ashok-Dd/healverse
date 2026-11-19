import { fetchApi } from "@/lib/fetchApi";
import { DietPlan } from "@/types/type";

export const dietPlanApi = {
  /**
   * The stored plan for a date. Returns `null` only when none was generated yet (404); every
   * other failure is thrown so screens can show an error with a retry instead of a misleading
   * "no plan yet" state. Never generates a plan.
   */
  fetchByDate: async (date: string): Promise<DietPlan | null> => {
    try {
      return await fetchApi<DietPlan>(`/api/diet-plans/daily/${date}`, {
        method: "GET",
        requiresAuth: true,
      });
    } catch (error) {
      if ((error as { status?: number }).status === 404) return null;
      throw error;
    }
  },

  /** Generates the plan for a date (an AI call, up to a minute). Safe to repeat: returns the stored plan if one exists. */
  generate: (date: string) =>
    fetchApi<DietPlan>(`/api/diet-plans/generate/${date}`, {
      method: "POST",
      requiresAuth: true,
    }),
};
