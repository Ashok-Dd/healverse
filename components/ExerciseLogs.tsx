import { useExerciseLogs } from "@/store/healthStore";
import { router } from "expo-router";
import React from "react";
import ErrorCard from "./cards/ErrorCard";
import LogCard from "./LogCard";
import { ExerciseLogHolder } from "./LogHolders";
import { SkeletonLogCard } from "./skeleton/LoggingSkeleton";

const ExerciseLogs = ({ date }: { date: string }) => {
  const { data, isLoading, error, refetch } = useExerciseLogs.ByDate(date);

  if (isLoading) return <SkeletonLogCard />;
  if (error) return <ErrorCard message={error.message} onPress={() => refetch()} className="mx-0" />;

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
    />
  );
};

export default React.memo(ExerciseLogs);
