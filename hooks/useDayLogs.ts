import { useSummaryData } from "@/hooks/useSummaryData";
import { useExerciseLogs, useFoodLogs, useWaterLogs } from "@/store/healthStore";

/**
 * The four requests behind the Logging tab (summary, food, exercise, water) seen as one page,
 * so the screen can decide once what to show instead of every section deciding on its own.
 */
export function useDayLogs(date: string) {
  const summary = useSummaryData(date);
  const food = useFoodLogs.ByDate(date);
  const exercise = useExerciseLogs.ByDate(date);
  const water = useWaterLogs.ByDate(date);
  const queries = [summary, food, exercise, water];

  return {
    summary: summary.data,
    /** Nothing cached for this day yet and the first load is still running. */
    isFirstLoad: queries.every((q) => q.data === undefined) && queries.some((q) => q.isLoading),
    /** Every request failed and there is nothing cached to show. */
    allFailed: queries.every((q) => q.isError && q.data === undefined),
    /** At least one refresh failed (the screen may still show older data). */
    hasRefreshError: queries.some((q) => q.isError),
    refetchAll: () => Promise.all(queries.map((q) => q.refetch())),
  };
}
