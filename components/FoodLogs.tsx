import LogCard from "@/components/LogCard"; // Adjust path
import { useFoodLogs } from "@/store/healthStore";
import { FoodLog, MealType } from "@/types/type"; // Adjust import path to your types
import { useRouter } from "expo-router";
import { View } from "react-native";
import ErrorCard from "./cards/ErrorCard";
import { FoodLogHolder } from "./LogHolders";
import { SkeletonLogCard } from "./skeleton/LoggingSkeleton";

interface FoodLogsProps {
  date: string;
}

const mealTitles: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snacks",
};

const mealEmojis: Record<MealType, string> = {
  BREAKFAST: "🍽",
  LUNCH: "🥗",
  DINNER: "🍝",
  SNACK: "🍫",
};

export default function FoodLogs({ date }: FoodLogsProps) {
  const router = useRouter();

  const { data: foodLogs = [], isLoading, isError } = useFoodLogs.ByDate(date);

  if (isLoading) {
    return <SkeletonLogCard />;
  }

  if (isError) {
    return <ErrorCard message="Failed to load food logs." />;
  }

  return (
    <View>
      {(["BREAKFAST", "LUNCH", "DINNER", "SNACK"] as MealType[]).map(
        (mealType) => (
          <LogCard<FoodLog>
            key={mealType}
            icon="🍴"
            title={mealTitles[mealType]}
            description={
              mealType === "SNACK"
                ? "Mindful snacking helps energy!"
                : "Recommended meal intake"
            }
            buttonText={mealType === "SNACK" ? "+ Log Snack" : "+ Log Food"}
            Link={() =>
              router.push(`/(root)/calorie-counter/${mealType}` as any)
            }
            showArrow={false}
            emojiIcon={mealEmojis[mealType]}
            backgroundStyle="bg-orange-50"
            items={foodLogs.filter((f) => f.mealType === mealType)}
            component={(item) => <FoodLogHolder {...item} />}
          />
        )
      )}
    </View>
  );
}
