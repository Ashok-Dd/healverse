import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
}) => {
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
    <View className=" rounded-xl  px-2 ">
      {/* Meal Header */}
      <View className="px-2 py-1 justify-center">
        <View className="flex-row items-center justify-between my-2">
          <View className="flex-row  items-center">
            <Text className="text-sm mr-2">{getMealTypeIcon()}</Text>
            <Text className="text-sm font-bold text-gray-800 capitalize">
              {mealType}
            </Text>
          </View>

          <View className="flex-row  items-center gap-2">
            <View className="flex-row items-center bg-gray-100 rounded-full px-1 ">
              <Text className="text-sm">
                <MaterialCommunityIcons name="fire" color={"red"} size={12} />
              </Text>
              <Text className="text-sm font-semibold text-red-500 ml-1">
                {calories}kcal
              </Text>
            </View>

            <View className="flex-row items-center   bg-gray-100 rounded-full px-1  ">
              <Text className="text-sm">
                <MaterialCommunityIcons
                  name="food-drumstick"
                  color={"blue"}
                  size={12}
                />
              </Text>
              <Text className="text-sm font-semibold text-blue-600 ml-1">
                {protein}g
              </Text>
            </View>

            <View className="flex-row items-center  bg-gray-100 rounded-full px-1  ">
              <Text className="text-sm">
                <Entypo name="drop" color={"orange"} size={12} />
              </Text>
              <Text className="text-sm font-semibold text-orange-400 ml-1">
                {fat}g
              </Text>
            </View>

            <View className="flex-row items-center  bg-gray-100 rounded-full px-1  ">
              <Text className="text-sm">
                <MaterialCommunityIcons name="leaf" color={"green"} size={12} />
              </Text>
              <Text className="text-sm font-semibold text-green-600 ml-1">
                {carbs}g
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Meal Content */}
      <View className="p-4 bg-gray-100 rounded-lg ">
        <View className="flex-row items-center mb-3">
          <Text className="text-lg mr-2">{mealIcon}</Text>
          <Text className="text-lg font-semibold text-gray-800 flex-1">
            {mealName}
          </Text>
        </View>

        {/* Ingredients */}
        <View className="mb-4">
          {ingredients.map((ingredient, index) => (
            <View key={index} className="flex-row items-center mb-1">
              <Text className="text-xs text-gray-400 mr-2">•</Text>
              <Text className="text-sm text-gray-700">{ingredient}</Text>
            </View>
          ))}
        </View>

        {/* How to prepare */}
        <TouchableOpacity
          onPress={() => setShowDetails(!showDetails)}
          className="flex-row items-center justify-between mb-3"
        >
          <View className="flex-row items-center">
            <Text className="text-lg mr-2">🔧</Text>
            <Text className="text-base font-semibold text-gray-800">
              How to prepare
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-lg mr-2">⏱</Text>
            <Text className="text-sm text-gray-600">{prepTime} minutes</Text>
          </View>
        </TouchableOpacity>

        {showDetails && (
          <View className="mb-4 p-3 bg-gray-50 rounded-lg">
            <Text className="text-sm text-gray-700 leading-5">
              {instructions}
            </Text>
          </View>
        )}

        {/* Health Benefits */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Text className="text-lg mr-2">💚</Text>
            <Text className="text-base font-semibold text-gray-800">
              Health benefits
            </Text>
          </View>
          <Text className="text-sm text-gray-700 leading-5">
            {healthBenefits}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-center gap-5">
          <TouchableOpacity className="px-4 bg-blue-100 rounded-full py-2 flex-row items-center justify-center gap-1 ">
            <Feather name="refresh-cw" size={14} color="#1D4ED8" />
            <Text className="text-blue-700 text-xs">AI Replace</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push(`/(root)/calorie-counter/${mealType}` as any)
            }
            className="px-4 bg-green-100 rounded-full py-2 flex-row items-center justify-center gap-1 "
          >
            <Feather name="plus" color={"green"} />
            <Text className="text-green-700 text-xs">Log Food</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MealCard;
