import { isValidDateForData } from "@/store/dietPlan";
import { healthAPIs, healthQueryKeys } from "@/store/healthStore";
import { DailySummary, ExerciseLog } from "@/types/type";
import { useQuery } from "@tanstack/react-query";





export const useSummaryData = (date: string) => {
    return useQuery<DailySummary>({
        queryKey: healthQueryKeys.summary(date),
        queryFn: () => healthAPIs.fetchDashboardDataByDate(date) as Promise<DailySummary>,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        enabled: isValidDateForData(date),
    });
};