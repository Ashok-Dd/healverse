import { useWaterLogs } from "@/store/healthStore";
import { router } from "expo-router";
import React from "react";
import LogCard from "./LogCard";
import { WaterLogHolder } from "./LogHolders";

const WaterLogs = ({ date, onLogWater }: { date: string; onLogWater: () => void }) => {
  const { data, isLoading, isError, refetch } = useWaterLogs.ByDate(date);

  return (
    <LogCard
      icon="water-outline"
      title="Water"
      description="No water logged yet. Stay hydrated!"
      actionLabel="Log water"
      onAction={onLogWater}
      onSeeAll={() => router.push("/(root)/all-logs/water" as any)}
      items={data ?? []}
      getKey={(log) => log.id}
      renderItem={(log) => <WaterLogHolder log={log} />}
      loading={isLoading}
      error={isError && !data ? { onRetry: () => refetch() } : undefined}
    />
  );
};

export default React.memo(WaterLogs);
