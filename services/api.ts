import { fetchApi } from "@/lib/fetchApi";
import { DietPlan } from "@/types/type";

export const dietPlanApi = {
  /**
   * Gets (and, if needed, generates) the plan for a date. Returns `null` only when the server
   * says there is none (404); every other failure is thrown so screens can show an error
   * with a retry instead of a misleading "no plan yet" state.
   */
  fetchByDate: async (date: string): Promise<DietPlan | null> => {
    try {
      return await fetchApi<DietPlan>(`/api/diet-plans/generate/${date}`, {
        method: "POST",
        requiresAuth: true,
      });
    } catch (error) {
      if ((error as { status?: number }).status === 404) return null;
      throw error;
    }
  },
};
