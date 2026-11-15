import { useSummaryData } from "@/hooks/useSummaryData";
import { useWaterLogs } from "@/store/healthStore";
import { router } from "expo-router";
import React, { useState } from "react";
import ErrorCard from "./cards/ErrorCard";
import LogCard from "./LogCard";
import { WaterLogHolder } from "./LogHolders";
import { SkeletonLogCard } from "./skeleton/LoggingSkeleton";
import { WaterLogModal } from "./WaterLogModel";

const WaterLogs = ({ date }: { date: string }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading, error, refetch } = useWaterLogs.ByDate(date);
  const { data: summary } = useSummaryData(date);

  if (isLoading) return <SkeletonLogCard />;
  if (error) return <ErrorCard message={error.message} onPress={() => refetch()} className="mx-0" />;

  return (
    <>
      <LogCard
        icon="water-outline"
        title="Water"
        description="No water logged yet. Stay hydrated!"
        actionLabel="Log water"
        onAction={() => setModalOpen(true)}
        onSeeAll={() => router.push("/(root)/all-logs/water" as any)}
        items={data ?? []}
        getKey={(log) => log.id}
        renderItem={(log) => <WaterLogHolder log={log} />}
      />
      {modalOpen && (
        <WaterLogModal
          date={date}
          visible={modalOpen}
          onClose={() => setModalOpen(false)}
          currentIntake={summary?.waterConsumedMl || 0}
          dailyGoal={summary?.targetWaterMl || 0}
        />
      )}
    </>
  );
};

export default React.memo(WaterLogs);
