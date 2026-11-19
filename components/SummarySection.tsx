import { INFO_ABOUT_CALORIE_CALCUATION } from "@/constants";
import { useSummaryData } from "@/hooks/useSummaryData";
import React from "react";
import { Text, View } from "react-native";
import CalorieSummary from "./CalorieSummary";
import NutritionInfo from "./NutritionInfo";
import LoggingSkeleton from "./skeleton/LoggingSkeleton";
import GuidanceButton from "./ui/GuidanceButton";
import InlineError from "./ui/InlineError";

const SectionHeader = ({ title, help }: { title: string; help?: string }) => (
  <View className="mb-2 flex-row items-center justify-between">
    <Text accessibilityRole="header" className="font-display text-base text-foreground">
      {title}
    </Text>
    {help && <GuidanceButton title={title} content={help} />}
  </View>
);

/** Remaining calories and macro totals for the selected day. */
const SummarySection = ({ date }: { date: string }) => {
  const { data: summary, isLoading, error, refetch } = useSummaryData(date);

  if (isLoading) return <LoggingSkeleton />;
  if (!summary) {
    return (
      <View className="mb-3">
        <InlineError
          message={error ? "Couldn't load your summary." : "Your summary is not ready yet."}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View className="mb-3">
      <SectionHeader title="Remaining calories" help={INFO_ABOUT_CALORIE_CALCUATION} />
      <View className="mb-4 rounded-3xl border border-border bg-card p-4">
        <CalorieSummary
          targetCalories={summary.targetCalories || 0}
          caloriesBurned={summary.caloriesBurned || 0}
          consumedCalories={summary.consumedCalories || 0}
          remainingCalories={summary.remainingCalories || 0}
        />
      </View>

      <SectionHeader title="Daily total" />
      <NutritionInfo
        calories={summary.consumedCalories || 0}
        carbs={summary.consumedCarbs || 0}
        fat={summary.consumedFat || 0}
        protein={summary.consumedProtein || 0}
        targetCalories={summary.targetCalories}
        targetCarbs={summary.targetCarbs}
        targetFat={summary.targetFat}
        targetProtein={summary.targetProtein}
      />
    </View>
  );
};

export default React.memo(SummarySection);
