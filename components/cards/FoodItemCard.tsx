// FoodItemCard.tsx
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
            value={calories}
            unit="kcal"
            tone="destructive"
          />
          <NutrientBadge
            iconName="food-drumstick"
            value={protein}
            unit="g"
            tone="info"
          />
          <NutrientBadge
            iconType="Entypo"
            iconName="drop"
            value={fats}
            unit="g"
            tone="warning"
          />
          <NutrientBadge
            iconName="leaf"
            value={carbs}
            unit="g"
            tone="success"
          />
        </View>
      </View>
    </View>
  );
};

export default FoodItemCard;
