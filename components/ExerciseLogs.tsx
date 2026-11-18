import { useExerciseLogs } from "@/store/healthStore";
import { router } from "expo-router";
import React from "react";
import LogCard from "./LogCard";
import { ExerciseLogHolder } from "./LogHolders";

const ExerciseLogs = ({ date }: { date: string }) => {
  const { data, isLoading, isError, refetch } = useExerciseLogs.ByDate(date);

  return (
    <LogCard
      icon="barbell-outline"
      title="Exercise"
      description="Nothing logged yet. Move a little and add it here."
      actionLabel="Log exercise"
      onAction={() => router.push("/(root)/add-exercise-log")}
      onSeeAll={() => router.push("/(root)/all-logs/exercise" as any)}
      items={data ?? []}
      getKey={(log) => log.id}
      renderItem={(log) => <ExerciseLogHolder log={log} />}
      loading={isLoading}
      error={isError && !data ? { onRetry: () => refetch() } : undefined}
    />
  );
};

export default React.memo(ExerciseLogs);
