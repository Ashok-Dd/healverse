// api/medicationApi.ts
import { getDummyDietPlan } from "@/constants/data";
import { fetchApi } from "@/lib/fetchApi";
import {
  CreateMedicationRequest,
  DashboardStats,
  DietPlan,
  LogMedicationRequest,
  Medication,
  TodayMedication,
} from "@/types/type";

export const medicationApi = {
  getAll: (): Promise<Medication[]> =>
    fetchApi<Medication[]>("/api/medications", { requiresAuth: true }),

  create: (data: CreateMedicationRequest): Promise<Medication> =>
    fetchApi<Medication>("/api/medications", {
      method: "POST",
      body: data,
      requiresAuth: true,
    }),

  update: (id: string, data: CreateMedicationRequest): Promise<Medication> =>
    fetchApi<Medication>(`/api/medications/${id}`, {
      method: "PUT",
      body: data,
      requiresAuth: true,
    }),

  delete: (id: string): Promise<void> =>
    fetchApi<void>(`/api/medications/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    }),

  logIntake: (id: string, data: LogMedicationRequest): Promise<void> =>
    fetchApi<void>(`/api/medications/${id}/log`, {
      method: "POST",
      body: data,
      requiresAuth: true,
    }),
};

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    // console.log("📡 Fetching dashboard stats...");
    const res = await fetchApi<DashboardStats>(
      "/api/medication-dashboard/stats",
      { requiresAuth: true }
    );
    // console.log("📊 Dashboard stats:", res);
    return res;
  },
  getTodayMedications: (): Promise<TodayMedication[]> =>
    fetchApi<TodayMedication[]>("/api/medication-dashboard/today", {
      requiresAuth: true,
    }),
};

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