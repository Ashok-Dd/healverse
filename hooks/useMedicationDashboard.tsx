import { dashboardApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.getStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    // refetchInterval: false, // Disable automatic refetch interval
    // refetchOnMount: true, // Only refetch if data is stale
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: true, // Only refetch on reconnect
    // refetchIntervalInBackground: false,
    // retry: 1,
    // // Add network mode to prevent requests when offline
    // networkMode: "online",
    // // Prevent refetch during render cycles
    // notifyOnChangeProps: ["data", "error", "isLoading"],
    // // Use structural sharing to prevent unnecessary re-renders
    // structuralSharing: true,
  });
}

export function useTodayMedications() {
  return useQuery({
    queryKey: ["todayMedications"],
    queryFn: dashboardApi.getTodayMedications,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}
