import DaySelector from "@/components/DaySelector";
import ExerciseLogs from "@/components/ExerciseLogs";
import FoodLogs from "@/components/FoodLogs";
import GlobalHeader from "@/components/headers/GlobalHeader";
import PlaceHolder from "@/components/PlaceHolder";
import SummarySection from "@/components/SummarySection";
import WaterLogs from "@/components/WaterLogs";
import { colors } from "@/constants/theme";
import { healthQueryKeys, useDateSelectorForHealthStore } from "@/store/healthStore";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Logging() {
  const queryClient = useQueryClient();
  const { selectedDate, setSelectedDate, isValidDate } = useDateSelectorForHealthStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: healthQueryKeys.summary(selectedDate) }),
        queryClient.refetchQueries({ queryKey: healthQueryKeys.foodLogs.byDate(selectedDate) }),
        queryClient.refetchQueries({ queryKey: healthQueryKeys.exerciseLogs.byDate(selectedDate) }),
        queryClient.refetchQueries({ queryKey: healthQueryKeys.waterLogs.byDate(selectedDate) }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, selectedDate]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
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

          {isValidDate ? (
            <>
              <SummarySection date={selectedDate} />
              <ExerciseLogs date={selectedDate} />
              <WaterLogs date={selectedDate} />
              <FoodLogs date={selectedDate} />
            </>
          ) : (
            <PlaceHolder message="There's no data for this date." />
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
