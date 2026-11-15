import IconButton from "@/components/ui/IconButton";
import type { Meal, MealType } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useState } from "react";
import { Pressable, Text, View } from "react-native";

interface MealCardProps {
  meal: Meal;
  /** Show the replace / log actions (only meaningful for today's plan). */
  isToday: boolean;
  /** True while this meal is being regenerated. */
  isReplacing: boolean;
  /** Replacing a meal needs the AI service, so it is off while offline. */
  canReplace: boolean;
  onReplace: (mealType: MealType) => void;
}

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const MEAL_ICONS: Record<string, IconName> = {
  breakfast: "sunny-outline",
  lunch: "partly-sunny-outline",
  dinner: "moon-outline",
  snack: "cafe-outline",
};

const Macro = ({ label, value, text }: { label: string; value: number; text: string }) => (
  <View className="rounded-full bg-muted px-3 py-1">
    <Text className={`font-body-semibold text-xs ${text}`}>
      {Math.round(value)}
      {label}
    </Text>
  </View>
);

const MealCard = ({ meal, isToday, isReplacing, canReplace, onReplace }: MealCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const type = meal.mealType.toLowerCase();

  return (
    <View className="mb-4 rounded-3xl border border-border bg-card p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <Ionicons name={MEAL_ICONS[type] ?? "restaurant-outline"} size={18} className="text-foreground" />
          </View>
          <Text className="font-body-bold text-sm capitalize text-muted-foreground">{type}</Text>
        </View>
        {meal.preparationTimeMinutes ? (
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={14} className="text-muted-foreground" />
            <Text className="font-body text-xs text-muted-foreground">
              {meal.preparationTimeMinutes} min
            </Text>
          </View>
        ) : null}
      </View>

      <Text className="mb-3 font-display text-lg text-foreground">{meal.mealName}</Text>

      <View className="mb-4 flex-row flex-wrap gap-2">
        <Macro label=" kcal" value={meal.calories} text="text-destructive" />
        <Macro label="g protein" value={meal.protein} text="text-info" />
        <Macro label="g fat" value={meal.fat} text="text-warning" />
        <Macro label="g carbs" value={meal.carbs} text="text-success" />
      </View>

      {(meal.ingredients ?? []).map((ingredient, index) => (
        <View key={`${index}-${ingredient}`} className="mb-1 flex-row items-start">
          <View className="mr-3 mt-2 h-1.5 w-1.5 rounded-full bg-ring" />
          <Text className="flex-1 font-body text-sm text-foreground">{ingredient}</Text>
        </View>
      ))}

      <Pressable
        onPress={() => setExpanded((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel="How to prepare and health benefits"
        className="mt-3 min-h-[44px] flex-row items-center justify-between border-t border-border pt-3"
      >
        <Text className="font-body-bold text-sm text-secondary-foreground">
          How to prepare &amp; benefits
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          className="text-muted-foreground"
        />
      </Pressable>

      {expanded && (
        <View className="mt-1 gap-3">
          {meal.instructions ? (
            <Text className="font-body text-sm leading-5 text-foreground">{meal.instructions}</Text>
          ) : null}
          {meal.healthBenefits ? (
            <View className="rounded-2xl bg-accent p-3">
              <Text className="mb-1 font-body-bold text-xs text-accent-foreground">
                Health benefits
              </Text>
              <Text className="font-body text-sm text-foreground">{meal.healthBenefits}</Text>
            </View>
          ) : null}
        </View>
      )}

      {isToday && (
        <View className="mt-4 flex-row flex-wrap gap-3">
          <IconButton
            iconName="refresh-cw"
            label={canReplace ? "Replace meal" : "Replace meal (needs internet)"}
            loadingLabel="Replacing..."
            loading={isReplacing}
            disabled={!canReplace}
            onPress={() => onReplace(meal.mealType)}
          />
          <IconButton
            iconName="plus"
            label="Log food"
            variant="accent"
            onPress={() =>
              router.push(`/(root)/calorie-counter/${meal.mealType.toUpperCase()}` as any)
            }
          />
        </View>
      )}
    </View>
  );
};

export default memo(MealCard);
