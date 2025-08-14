import { medicationApi } from "@/services/api";
import {
  CreateMedicationRequest,
  DashboardStats,
  LogMedicationRequest,
  TodayMedication,
} from "@/types/type";
import { NotificationService } from "@/utils/notifications";
import { MedicationReminderService } from "@/utils/tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const MEDICATIONS_QUERY_KEY = "medications";

export function useMedications() {
  return useQuery({
    queryKey: [MEDICATIONS_QUERY_KEY],
    queryFn: async () => {
      return await medicationApi.getAll();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMedicationRequest) => {
      const response = await medicationApi.create(data);
      return response;
    },
    onSuccess: async (newMedication) => {
      // Update medications cache
      queryClient.setQueryData([MEDICATIONS_QUERY_KEY], (old: any) => {
        if (!old) return [newMedication];
        return [...old, newMedication];
      });

      // Schedule notifications for the new medication
      await MedicationReminderService.scheduleMedicationReminders(
        newMedication
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}

export function useUpdateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateMedicationRequest;
    }) => {
      return await medicationApi.update(id, data);
    },
    onSuccess: async (updatedMedication) => {
      // Update medications cache
      queryClient.setQueryData([MEDICATIONS_QUERY_KEY], (old: any) => {
        if (!old) return [updatedMedication];
        return old.map((med: any) =>
          med.id === updatedMedication.id ? updatedMedication : med
        );
      });

      // Reschedule notifications
      await NotificationService.cancelMedicationReminders(updatedMedication.id);
      await NotificationService.scheduleMedicationReminders(updatedMedication);

      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}

export function useDeleteMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await medicationApi.delete(id);
      return id;
    },
    onSuccess: async (deletedId) => {
      // Remove from medications cache
      queryClient.setQueryData([MEDICATIONS_QUERY_KEY], (old: any) => {
        if (!old) return [];
        return old.filter((med: any) => med.id !== deletedId);
      });

      // Cancel notifications
      await NotificationService.cancelMedicationReminders(deletedId);

      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useLogMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      medicationId,
      data,
    }: {
      medicationId: string;
      data: LogMedicationRequest;
    }) => {
      // Optional: prevent logging if already logged
      const existing = queryClient.getQueryData<TodayMedication[]>([
        "todayMedications",
      ]);
      const alreadyLogged = existing?.some(
        (m) =>
          m.medicationId === medicationId &&
          m.scheduledTime === data.scheduledTime &&
          m.status === "TAKEN"
      );
      if (alreadyLogged) {
        throw new Error("Medication already logged for this time");
      }

      await medicationApi.logIntake(medicationId, data);
      return { medicationId, data };
    },

    onMutate: async ({ medicationId, data }) => {
      // Cancel any ongoing queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ["todayMedications"] });
      await queryClient.cancelQueries({ queryKey: ["dashboard", "stats"] });

      // Snapshot previous state
      const prevTodayMeds = queryClient.getQueryData<TodayMedication[]>([
        "todayMedications",
      ]);
      const prevDashboard = queryClient.getQueryData<DashboardStats>([
        "dashboard",
        "stats",
      ]);

      // Optimistically update TodayMedications
      queryClient.setQueryData<TodayMedication[]>(["todayMedications"], (old) =>
        old?.map((med) =>
          med.medicationId === medicationId &&
          med.scheduledTime === data.scheduledTime
            ? { ...med, status: data.status, actualTime: data.actualTime }
            : med
        )
      );

      // Optimistically update Dashboard stats
      queryClient.setQueryData<DashboardStats>(
        ["dashboard", "stats"],
        (old) => {
          if (!old) return old;
          const updatedTodayMeds = old.todayMedications.map((med) =>
            med.medicationId === medicationId &&
            med.scheduledTime === data.scheduledTime
              ? { ...med, status: data.status, actualTime: data.actualTime }
              : med
          );
          const todayTaken = updatedTodayMeds.filter(
            (m) => m.status === "TAKEN"
          ).length;
          return { ...old, todayMedications: updatedTodayMeds, todayTaken };
        }
      );

      return { prevTodayMeds, prevDashboard };
    },

    onError: (error, _vars, context) => {
      // Roll back optimistic updates
      if (context?.prevTodayMeds) {
        queryClient.setQueryData(["todayMedications"], context.prevTodayMeds);
      }
      if (context?.prevDashboard) {
        queryClient.setQueryData(["dashboard", "stats"], context.prevDashboard);
      }
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to log medication"
      );
    },

    onSuccess: ({ medicationId, data }) => {
      // Cancel notifications only if in the future
      if (data.scheduledTime > new Date().toISOString()) {
        NotificationService.cancelMedicationReminders(medicationId);
      }
    },

    onSettled: () => {
      // Ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["todayMedications"] });
    },
  });
}
