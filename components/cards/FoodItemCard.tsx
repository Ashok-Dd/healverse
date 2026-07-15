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
      className="bg-gray-100 flex flex-row items-center gap-3 rounded-md px-1 py-2"
    >
      <View className="flex-row justify-between w-full">
        <Text className="text-xs truncate font-semibold text-black">
          🍴 {name} ({quantity} {unit})
        </Text>

        <View className="flex-row items-center gap-1">
          <NutrientBadge
            iconName="fire"
            iconColor="red"
            value={calories}
            unit="kcal"
            textColor="text-red-500"
          />
          <NutrientBadge
            iconName="food-drumstick"
            iconColor="blue"
            value={protein}
            unit="g"
            textColor="text-blue-600"
          />
          <NutrientBadge
            iconType="Entypo"
            iconName="drop"
            iconColor="orange"
            value={fats}
            unit="g"
            textColor="text-orange-400"
          />
          <NutrientBadge
            iconName="leaf"
            iconColor="green"
            value={carbs}
            unit="g"
            textColor="text-green-600"
          />
        </View>
      </View>
    </View>
  );
};

export default FoodItemCard;
