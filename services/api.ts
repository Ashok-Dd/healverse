// api/medicationApi.ts
import { fetchApi } from "@/lib/fetchApi";
import {
  CreateMedicationRequest,
  DashboardStats,
  LogMedicationRequest,
  Medication,
  TodayMedication,
} from "@/types/type";

export const medicationApi = {
  getAll: (): Promise<Medication[]> =>
    fetchApi<Medication[]>("/medications", { requiresAuth: true }),

  create: (data: CreateMedicationRequest): Promise<Medication> =>
    fetchApi<Medication>("/medications", {
      method: "POST",
      body: data,
      requiresAuth: true,
    }),

  update: (id: string, data: CreateMedicationRequest): Promise<Medication> =>
    fetchApi<Medication>(`/medications/${id}`, {
      method: "PUT",
      body: data,
      requiresAuth: true,
    }),

  delete: (id: string): Promise<void> =>
    fetchApi<void>(`/medications/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    }),

  logIntake: (id: string, data: LogMedicationRequest): Promise<void> =>
    fetchApi<void>(`/medications/${id}/log`, {
      method: "POST",
      body: data,
      requiresAuth: true,
    }),
};

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    console.log("📡 Fetching dashboard stats...");
    const res = await fetchApi<DashboardStats>(
      "/api/medication-dashboard/stats",
      { requiresAuth: true }
    );
    console.log("📊 Dashboard stats:", res);
    return res;
  },
  getTodayMedications: (): Promise<TodayMedication[]> =>
    fetchApi<TodayMedication[]>("/api/medication-dashboard/today", {
      requiresAuth: true,
    }),
};
