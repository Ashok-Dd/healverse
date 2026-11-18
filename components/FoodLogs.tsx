import LogCard from "@/components/LogCard";
import InlineError from "@/components/ui/InlineError";
import { useFoodLogs } from "@/store/healthStore";
import type { MealType } from "@/types/type";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";
import { FoodLogHolder } from "./LogHolders";

const MEALS: { type: MealType; title: string; description: string; action: string }[] = [
  { type: "BREAKFAST", title: "Breakfast", description: "Start your day with a log.", action: "Log breakfast" },
  { type: "LUNCH", title: "Lunch", description: "Nothing logged for lunch yet.", action: "Log lunch" },
  { type: "DINNER", title: "Dinner", description: "Nothing logged for dinner yet.", action: "Log dinner" },
  { type: "SNACK", title: "Snacks", description: "Mindful snacking keeps energy steady.", action: "Log snack" },
];

const FoodLogs = ({ date }: { date: string }) => {
  const { data, isLoading, isError, refetch } = useFoodLogs.ByDate(date);

  // One pass instead of filtering the list four times on every render.
  const byMeal = useMemo(() => {
    const groups: Record<MealType, NonNullable<typeof data>> = {
      BREAKFAST: [],
      LUNCH: [],
      DINNER: [],
      SNACK: [],
    };
    data?.forEach((log) => groups[log.mealType]?.push(log));
    return groups;
  }, [data]);

  // One message for all four meals instead of four identical errors; Food in the quick-add row still works.
  if (isError && !data) {
    return (
      <View className="mb-3 rounded-3xl border border-border bg-card p-4">
        <InlineError message="Couldn't load your meals." onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <View>
      {MEALS.map((meal) => (
        <LogCard
          key={meal.type}
          icon="restaurant-outline"
          title={meal.title}
          description={meal.description}
          actionLabel={meal.action}
          onAction={() => router.push(`/(root)/calorie-counter/${meal.type}` as any)}
          items={byMeal[meal.type]}
          getKey={(log) => log.id}
          renderItem={(log) => <FoodLogHolder log={log} />}
          loading={isLoading}
        />
      ))}
    </View>
  );
};

export default React.memo(FoodLogs);
