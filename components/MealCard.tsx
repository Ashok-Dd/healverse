
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {Meal} from "@/types/type";
import IconButton from "@/components/ui/IconButton";
import NutrientBadge from "@/components/ui/NutritionBadge";

type MealCardProps = Meal & {
  mealIcon : any;
}


const MealCard = ({
  mealType,
  mealName,
  ingredients,
  instructions,
  prepTime,
  calories,
  protein,
  fat,
  carbs,
  healthBenefits,
  mealIcon,
} : MealCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getMealTypeIcon = () => {
    switch (mealType.toLowerCase()) {
      case "breakfast":
        return "☀";
      case "lunch":
        return "☁";
      case "dinner":
        return "🌙";
      default:
        return "🍽";
    }
  };

  return (
    <View className=" rounded-xl">
      {/* Meal Header */}
      <View className="justify-center">
        <View className="flex-row items-center justify-between my-2">
          <View className="flex-row  items-center">
            <Text className="text-xs mr-2">{getMealTypeIcon()}</Text>
            <Text className="text-xs font-bold text-gray-800 capitalize">
              {mealType}
            </Text>
          </View>

          <View className="flex-row  items-center gap-2">
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
                value={fat}
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

      {/* Meal Content */}
      <View className="p-2 bg-gray-100 rounded-lg ">
        <View className="flex-row items-center mb-3">
          <Text className="text-sm font-semibold text-gray-800 flex-1">
            {mealName}
          </Text>
        </View>

        {/* Ingredients */}
        <View className="mb-4">
          {ingredients.map((ingredient, index) => (
            <View key={index} className="flex-row items-center mb-1">
              <Text className="text-xs text-gray-400 mr-2">•</Text>
              <Text className="text-xs text-gray-700">{ingredient}</Text>
            </View>
          ))}
        </View>

        {/* How to prepare */}
        <TouchableOpacity
          onPress={() => setShowDetails(!showDetails)}
          className="flex-row items-center justify-between mb-3"
        >
          <View className="flex-row items-center">
            <Text className="text-xs mr-2">🔧</Text>
            <Text className="text-xs font-semibold text-gray-800">
              How to prepare
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-xs mr-2">⏱</Text>
            <Text className="text-xs text-gray-600">{prepTime} minutes</Text>
          </View>
        </TouchableOpacity>

        { (
          <View className="mb-4 p-1  rounded-lg">
            <Text className="text-xs text-gray-700 leading-5">
              {instructions}
            </Text>
          </View>
        )}

        {/* Health Benefits */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Text className="text-xs mr-2">💚</Text>
            <Text className="text-xs font-semibold text-gray-800">
              Health benefits
            </Text>
          </View>
          <Text className="text-xs text-gray-700 leading-5">
            {healthBenefits}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-center gap-5">
          <IconButton
              iconName="refresh-cw"
              loadingIconName="loader"
              label="AI Replace Meal"
              loadingLabel="Generating..."
              loading={false}
              onPress={() => {}}
          />
          <IconButton
              iconName="plus"
              loadingIconName="loader"
              label="Log Food"
              loadingLabel="Generating..."
              loading={false}
              onPress={() => router.push(`/(root)/calorie-counter/${mealType.toUpperCase()}`)}
              bgClass={"bg-green-100"}
              textClass={"text-green-800"}
          />
        </View>
      </View>
    </View>
  );
};

export default MealCard;

