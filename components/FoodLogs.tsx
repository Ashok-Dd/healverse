import LogCard from "@/components/LogCard";
import { useFoodLogs } from "@/store/healthStore";
import type { MealType } from "@/types/type";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";
import ErrorCard from "./cards/ErrorCard";
import { FoodLogHolder } from "./LogHolders";
import { SkeletonLogCard } from "./skeleton/LoggingSkeleton";

const MEALS: { type: MealType; title: string; description: string; action: string }[] = [
  { type: "BREAKFAST", title: "Breakfast", description: "Start your day with a log.", action: "Log breakfast" },
  { type: "LUNCH", title: "Lunch", description: "Nothing logged for lunch yet.", action: "Log lunch" },
  { type: "DINNER", title: "Dinner", description: "Nothing logged for dinner yet.", action: "Log dinner" },
  { type: "SNACK", title: "Snacks", description: "Mindful snacking keeps energy steady.", action: "Log snack" },
];

const FoodLogs = ({ date }: { date: string }) => {
  const { data, isLoading, isError, error, refetch } = useFoodLogs.ByDate(date);

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

  if (isLoading) return <SkeletonLogCard />;
  if (isError) return <ErrorCard message={error?.message} onPress={() => refetch()} className="mx-0" />;

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
        />
      ))}
    </View>
  );
};

export default React.memo(FoodLogs);
