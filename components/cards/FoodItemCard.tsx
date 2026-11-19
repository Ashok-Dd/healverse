import React from "react";
import { Text, View } from "react-native";
import NutrientBadge from "../ui/NutritionBadge";

interface FoodItemCardProps {
  name: string;
  quantity: number | string;
  unit: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  name,
  quantity,
  unit,
  calories,
  protein,
  fats,
  carbs,
}) => {
  return (
    <View className="w-full gap-2 rounded-2xl bg-muted px-3 py-3">
      <Text className="font-body-semibold text-sm text-foreground" numberOfLines={2}>
        {name} ({quantity} {unit})
      </Text>

      {/* Wraps onto a second row instead of squeezing the name or overflowing. */}
      <View className="flex-row flex-wrap gap-1">
        <NutrientBadge iconName="fire" value={calories} unit="kcal" tone="destructive" />
        <NutrientBadge iconName="food-drumstick" value={protein} unit="g" tone="info" />
        <NutrientBadge iconType="Entypo" iconName="drop" value={fats} unit="g" tone="warning" />
        <NutrientBadge iconName="leaf" value={carbs} unit="g" tone="success" />
      </View>
    </View>
  );
};

export default FoodItemCard;
