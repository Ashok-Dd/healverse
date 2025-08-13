import { medicationApi } from '@/services/api';
import { CreateMedicationRequest, LogMedicationRequest } from '@/types/type';
import { NotificationService } from '@/utils/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const MEDICATIONS_QUERY_KEY = 'medications';

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
      await NotificationService.scheduleMedicationReminders(newMedication);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateMedication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateMedicationRequest }) => {
      return await medicationApi.update(id, data);
    },
    onSuccess: async (updatedMedication) => {
      // Update medications cache
      queryClient.setQueryData([MEDICATIONS_QUERY_KEY], (old: any) => {
        if (!old) return [updatedMedication];
        return old.map((med: any) => med.id === updatedMedication.id ? updatedMedication : med);
      });
      
      // Reschedule notifications
      await NotificationService.cancelMedicationReminders(updatedMedication.id);
      await NotificationService.scheduleMedicationReminders(updatedMedication);
      
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
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
      
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useLogMedication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ medicationId, data }: { medicationId: string; data: LogMedicationRequest }) => {
      await medicationApi.logIntake(medicationId, data);
      return { medicationId, data };
    },
    onSuccess: () => {
      // Invalidate dashboard and today's medications
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['todayMedications'] });
    },
  });
}

