import { useOutboxEntries } from "@/hooks/useOutboxEntries";
import { isOnDay } from "@/lib/outboxOverlay";
import { withPausedAsLoading } from "@/lib/queryStatus";
import { isValidDateForData } from "@/store/dietPlan";
import { healthAPIs, healthQueryKeys } from "@/store/healthStore";
import { DailySummary } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * The day's totals. Water and exercise that are still waiting to upload are added on top, so
 * the numbers move the moment the user logs, with or without a connection. (Meals are not:
 * their calories come from the server's analysis of the photo.)
 */
export const useSummaryData = (date: string) => {
    const query = withPausedAsLoading(
        useQuery<DailySummary>({
            queryKey: healthQueryKeys.summary(date),
            queryFn: () => healthAPIs.fetchDashboardDataByDate(date) as Promise<DailySummary>,
            staleTime: 5 * 60 * 1000,
            enabled: isValidDateForData(date),
        })
    );
    const water = useOutboxEntries("water");
    const exercise = useOutboxEntries("exercise");

    const data = useMemo(() => {
        if (!query.data) return query.data;
        const waitingWaterMl = water
            .filter((entry) => entry.status !== "failed" && isOnDay(entry, date))
            .reduce((sum, entry) => sum + entry.payload.amountMl, 0);
        const waitingBurned = exercise
            .filter((entry) => entry.status !== "failed" && isOnDay(entry, date))
            .reduce((sum, entry) => sum + entry.payload.caloriesBurned, 0);
        if (waitingWaterMl === 0 && waitingBurned === 0) return query.data;
        return {
            ...query.data,
            waterConsumedMl: query.data.waterConsumedMl + waitingWaterMl,
            caloriesBurned: query.data.caloriesBurned + waitingBurned,
            remainingCalories: query.data.remainingCalories - waitingBurned,
        };
    }, [query.data, water, exercise, date]);

    return { ...query, data };
};
