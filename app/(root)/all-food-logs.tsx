import ErrorCard from "@/components/cards/ErrorCard";
import FoodLogCard from "@/components/cards/FoodLogCard";
import { QueuedFoodCard } from "@/components/cards/QueuedFoodCard";
import DaySelector from "@/components/DaySelector";
import { BackHeader } from "@/components/headers/BackHeader";
import { OutboxFailures } from "@/components/OutboxFailures";
import PlaceHolder from "@/components/PlaceHolder";
import { images } from "@/constants";
import { useThemeColors } from "@/constants/theme";
import { useOutboxEntries } from "@/hooks/useOutboxEntries";
import { dayOf } from "@/lib/day";
import { getCurrentDate } from "@/lib/today";
import { healthQueryKeys, useDateSelectorForHealthStore, useFoodLogs } from "@/store/healthStore";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Every meal logged on one day, as a vertical list. The server only returns food logs per day,
 * so the day selector moves between days. Opened from the tracker with the day it was showing.
 * Built like the tracker screen (ScrollView, same padding) so the layout behaves the same.
 */
export default function AllFoodLogs() {
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ date?: string }>();
  const initialDate =
    typeof params.date === "string" && DATE_PATTERN.test(params.date)
      ? params.date
      : getCurrentDate();

  const { selectedDate, setSelectedDate, isValidDate } = useDateSelectorForHealthStore({
    initialDate,
  });
  const foodLogs = useFoodLogs.ByDate(selectedDate);
  const queuedPhotos = useOutboxEntries("food-photo").filter(
    (entry) => dayOf(entry.payload.loggedAt) === selectedDate
  );
  const logs = foodLogs.data ?? [];
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.refetchQueries({ queryKey: healthQueryKeys.foodLogs.byDate(selectedDate) });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, selectedDate]);

  const renderContent = () => {
    if (!isValidDate) return <PlaceHolder image={images.dietPlanUnavailable} message="There's no data for this date." />;

    if (queuedPhotos.length > 0 || logs.length > 0) {
      return (
        <View className="w-full pt-3">
          {queuedPhotos.map((entry) => (
            <View key={`queued-${entry.id}`} className="mb-3 w-full rounded-xl bg-muted">
              <QueuedFoodCard entry={entry} />
            </View>
          ))}
          {logs.map((log) => (
            <View key={`log-${log.id}`} className="mb-3 w-full rounded-xl bg-muted">
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Open ${log.mealName || log.mealType || "meal"}`}
                onPress={() => router.push(`/(root)/food-log/${log.id}` as any)}
              >
                <FoodLogCard foodLog={log} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      );
    }

    if (foodLogs.isLoading) {
      return (
        <View className="w-full gap-3 pt-3" accessible accessibilityLabel="Loading food logs">
          {[0, 1, 2].map((i) => (
            <View key={i} className="h-28 w-full animate-pulse rounded-xl bg-muted" />
          ))}
        </View>
      );
    }

    if (foodLogs.error) {
      return (
        <ErrorCard
          message={foodLogs.error.message}
          onPress={() => foodLogs.refetch()}
          className="mx-0"
        />
      );
    }

    return <PlaceHolder message="You haven't logged any foods on this day." />;
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <BackHeader title="Logged foods" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-3 pb-28"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <DaySelector selectedDate={selectedDate} handleDateChange={setSelectedDate} />
        <OutboxFailures />
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}