import { OutboxFailures } from "@/components/OutboxFailures";
import Ping from "@/components/Calorie-counter-button";
import { NutritionGrid } from "@/components/CalorieProgress";
import ErrorCard from "@/components/cards/ErrorCard";
import FoodLoggingTrackerCard from "@/components/cards/FoodLoggingTrackerCard";
import CompactInsights from "@/components/CompactInsights";
import DaySelector from "@/components/DaySelector";
import GlobalHeader from "@/components/headers/GlobalHeader";
import PlaceHolder from "@/components/PlaceHolder";
import { NutritionGridSkeleton } from "@/components/skeleton/NutritionGridSkeleton";
import { useThemeColors } from "@/constants/theme";
import { useSummaryData } from "@/hooks/useSummaryData";
import { healthQueryKeys, useDateSelectorForHealthStore } from "@/store/healthStore";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SectionTitle = ({
  icon,
  title,
  onPress,
  actionLabel,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  onPress?: () => void;
  actionLabel?: string;
}) => (
  <View className="flex-row items-center justify-between py-2">
    <View className="flex-row items-center gap-2">
      <Ionicons name={icon} size={18} className="text-foreground" />
      <Text accessibilityRole="header" className="font-display text-base text-foreground">
        {title}
      </Text>
    </View>
    {onPress && (
      <Pressable
        onPress={onPress}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        className="min-h-[44px] min-w-[44px] items-end justify-center"
      >
        <Ionicons name="arrow-forward-circle" size={24} className="text-ring" />
      </Pressable>
    )}
  </View>
);

const Tracker = () => {
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const { selectedDate, setSelectedDate, isValidDate } = useDateSelectorForHealthStore();
  const summary = useSummaryData(selectedDate);
  const [refreshing, setRefreshing] = useState(false);

  // Insights come from a slow AI call with a long cache time, so pulling down does not wait for them.
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: healthQueryKeys.summary(selectedDate) }),
        queryClient.refetchQueries({ queryKey: healthQueryKeys.foodLogs.byDate(selectedDate) }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, selectedDate]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
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
        <GlobalHeader />
        <DaySelector selectedDate={selectedDate} handleDateChange={setSelectedDate} />
        <OutboxFailures />

        {isValidDate ? (
          <>
            <SectionTitle
              icon="time-outline"
              title="Logged foods"
              actionLabel="See all logged foods"
              onPress={() => router.push(`/(root)/all-food-logs?date=${selectedDate}` as any)}
            />
            <FoodLoggingTrackerCard date={selectedDate} />

            <SectionTitle icon="analytics-outline" title="Nutrition overview" />
            {summary.isLoading ? (
              <NutritionGridSkeleton />
            ) : summary.data ? (
              <NutritionGrid
                data={summary.data}
                types={["calories", "protein", "fat", "carbs"]}
                size={90}
              />
            ) : (
              <ErrorCard
                message={summary.error?.message ?? "Your summary is not ready yet. Try again in a moment."}
                onPress={() => summary.refetch()}
                className="mx-0"
              />
            )}

            <CompactInsights type="health" />
          </>
        ) : (
          <PlaceHolder message="There's no data for this date." />
        )}
      </ScrollView>

      <Ping />
    </SafeAreaView>
  );
};

export default Tracker;
