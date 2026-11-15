// FoodItemCard.tsx
import { colors } from "@/constants/theme";
import React from "react";
import { View, Text } from "react-native";
import NutrientBadge from "../ui/NutritionBadge";

interface FoodItemCardProps {
  id: string | number;
  name: string;
  quantity: number | string;
  unit: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  id,
  name,
  quantity,
  unit,
  calories,
  protein,
  fats,
  carbs,
}) => {
  return (
    <View
      key={id}
      className="bg-muted flex flex-row items-center gap-3 rounded-md px-1 py-2"
    >
      <View className="flex-row justify-between w-full">
        <Text className="flex-1 font-body-semibold text-xs text-foreground" numberOfLines={1}>
          {name} ({quantity} {unit})
        </Text>

        <View className="flex-row items-center gap-1">
          <NutrientBadge
            iconName="fire"
            iconColor={colors.destructive}
            value={calories}
            unit="kcal"
            textColor="text-destructive"
          />
          <NutrientBadge
            iconName="food-drumstick"
            iconColor={colors.info}
            value={protein}
            unit="g"
            textColor="text-info"
          />
          <NutrientBadge
            iconType="Entypo"
            iconName="drop"
            iconColor={colors.warning}
            value={fats}
            unit="g"
            textColor="text-warning"
          />
          <NutrientBadge
            iconName="leaf"
            iconColor={colors.success}
            value={carbs}
            unit="g"
            textColor="text-success"
          />
        </View>
      </View>
    </View>
  );
};

export default FoodItemCard;
