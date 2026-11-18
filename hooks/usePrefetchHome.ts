import { useAuthStore } from "@/store/authStore";
import { getCurrentDate } from "@/lib/today";
import { isValidDateForData } from "@/store/dietPlan";
import { healthAPIs, healthQueryKeys } from "@/store/healthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Warms the cache with today's data for the tabs the user has not opened yet, so each tab
 * opens with content instead of starting its first request on tap. Stale times match the
 * screens' own queries, so opening a tab does not refetch what was just prefetched.
 * Failures are ignored here; the screen shows its own error state when it needs the data.
 */
export function usePrefetchHome() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasUser = useAuthStore((s) => !!s.user);

  useEffect(() => {
    if (!isAuthenticated || !hasUser) return;
    const today = getCurrentDate();
    if (!isValidDateForData(today)) return;

    // Logging tab (the summary and food logs are fetched by the tracker tab itself).
    // The diet plan is deliberately not prefetched: its endpoint can trigger AI generation.
    queryClient.prefetchQuery({
      queryKey: healthQueryKeys.exerciseLogs.byDate(today),
      queryFn: () => healthAPIs.fetchExerciseLogsByDate(today),
      staleTime: 2 * 60 * 1000,
    });
    queryClient.prefetchQuery({
      queryKey: healthQueryKeys.waterLogs.byDate(today),
      queryFn: () => healthAPIs.fetchWaterLogsByDate(today),
      staleTime: 1 * 60 * 1000,
    });
  }, [queryClient, isAuthenticated, hasUser]);
}
