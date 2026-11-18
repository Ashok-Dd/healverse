import DayStatusStrip from "@/components/DayStatusStrip";
import { OutboxFailures } from "@/components/OutboxFailures";
import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import DaySelector from "@/components/DaySelector";
import ErrorCard from "@/components/cards/ErrorCard";
import ExerciseLogs from "@/components/ExerciseLogs";
import FoodLogs from "@/components/FoodLogs";
import GlobalHeader from "@/components/headers/GlobalHeader";
import PlaceHolder from "@/components/PlaceHolder";
import { images } from "@/constants";
import LoggingSkeleton, { SkeletonLogCard } from "@/components/skeleton/LoggingSkeleton";
import SummarySection from "@/components/SummarySection";
import WaterLogs from "@/components/WaterLogs";
import { WaterLogModal } from "@/components/WaterLogModel";
import { useThemeColors } from "@/constants/theme";
import { useDayLogs } from "@/hooks/useDayLogs";
import { useIsOnline } from "@/lib/network";
import { useDateSelectorForHealthStore } from "@/store/healthStore";
import React, { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Logging() {
  const colors = useThemeColors();
  const isOnline = useIsOnline();
  const { selectedDate, setSelectedDate, isValidDate } = useDateSelectorForHealthStore();
  const day = useDayLogs(selectedDate);
  const [refreshing, setRefreshing] = useState(false);
  const [waterOpen, setWaterOpen] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await day.refetchAll();
    } finally {
      setRefreshing(false);
    }
  };

  const content = (() => {
    if (day.isFirstLoad) {
      return isOnline ? (
        <>
          <LoggingSkeleton />
          <SkeletonLogCard />
          <SkeletonLogCard />
        </>
      ) : (
        <PlaceHolder
          image={images.dietPlanUnavailable}
          message="This day isn't saved on your phone yet. Connect to the internet to load it."
        />
      );
    }
    if (day.allFailed) {
      return <ErrorCard onPress={() => day.refetchAll()} className="mx-0" />;
    }
    return (
      <>
        <SummarySection date={selectedDate} />
        <ExerciseLogs date={selectedDate} />
        <WaterLogs date={selectedDate} onLogWater={() => setWaterOpen(true)} />
        <FoodLogs date={selectedDate} />
      </>
    );
  })();

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-3 pb-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <GlobalHeader />
          <DaySelector selectedDate={selectedDate} handleDateChange={setSelectedDate} />
          <OutboxFailures />

          {isValidDate ? (
            <>
              <DayStatusStrip hasRefreshError={day.hasRefreshError} onRetry={() => day.refetchAll()} />
              {content}
            </>
          ) : (
            <PlaceHolder image={images.dietPlanUnavailable} message="There's no data for this date." />
          )}
        </ScrollView>

        {waterOpen && (
          <WaterLogModal
            visible={waterOpen}
            onClose={() => setWaterOpen(false)}
            currentIntake={day.summary?.waterConsumedMl || 0}
            dailyGoal={day.summary?.targetWaterMl || 0}
          />
        )}
      </SafeAreaView>
    </>
  );
}
