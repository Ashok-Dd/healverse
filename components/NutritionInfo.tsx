import { colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Text, View } from "react-native";

import type { NutritionInfoProps } from "@/types/type";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const ITEMS: {
  key: "calories" | "protein" | "fat" | "carbs";
  target: "targetCalories" | "targetProtein" | "targetFat" | "targetCarbs";
  label: string;
  unit: string;
  icon: IconName;
  color: string;
  text: string;
}[] = [
  {
    key: "calories",
    target: "targetCalories",
    label: "Calories",
    unit: "kcal",
    icon: "fire",
    color: colors.destructive,
    text: "text-destructive",
  },
  {
    key: "protein",
    target: "targetProtein",
    label: "Protein",
    unit: "g",
    icon: "food-drumstick",
    color: colors.info,
    text: "text-info",
  },
  {
    key: "fat",
    target: "targetFat",
    label: "Fat",
    unit: "g",
    icon: "water",
    color: colors.warning,
    text: "text-warning",
  },
  {
    key: "carbs",
    target: "targetCarbs",
    label: "Carbs",
    unit: "g",
    icon: "leaf",
    color: colors.success,
    text: "text-success",
  },
];

/** Four-column macro totals for a day. */
const NutritionInfo = (props: NutritionInfoProps) => (
  <View className="flex-row justify-between rounded-3xl border border-border bg-card px-3 py-4">
    {ITEMS.map((item) => {
      const target = props[item.target];
      const exceeded = target ? props[item.key] > target : false;
      return (
        <View
          key={item.key}
          accessible
          accessibilityLabel={`${item.label} ${Math.round(props[item.key])} ${item.unit}${exceeded ? ", over target" : ""}`}
          className="flex-1 items-center"
        >
          <MaterialCommunityIcons
            name={exceeded ? "alert-circle" : item.icon}
            size={22}
            color={exceeded ? colors.destructive : item.color}
          />
          <Text
            className={`mt-1 font-display text-lg ${exceeded ? "text-destructive" : item.text}`}
          >
            {Math.round(props[item.key])}
          </Text>
          <Text className="font-body text-xs text-muted-foreground">
            {item.unit === "kcal" ? "kcal" : `${item.label} ${item.unit}`}
          </Text>
        </View>
      );
    })}
  </View>
);

export default memo(NutritionInfo);
