import { ExerciseLog, FoodItem, FoodLog, WaterLog } from "@/types/type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FoodItemCard from "./cards/FoodItemCard";

export const ExerciseLogHolder = (log: ExerciseLog) => {
  return (
<View className="bg-green-50 border border-green-200 rounded-xl p-2 mb-2 flex-row items-center justify-between">
      {/* Left Section */}
      <View className="flex-row items-center">
        <View className="bg-green-100 p-3 rounded-full mr-3">
          <MaterialCommunityIcons name="dumbbell" size={22} color="#15803d" />
        </View>
        <View>
          <Text className="text-sm font-bold text-green-900">
            {log.exerciseName}
          </Text>
          <Text className="text-xs text-gray-600">
            {log.durationMinutes} min
          </Text>
        </View>
      </View>

      {/* Calories Section */}
      <View className="flex-row items-center">
        <MaterialCommunityIcons name="fire" size={16} color="#dc2626" />
        <Text className="text-xs font-semibold text-red-600 ml-1">
          {log.caloriesBurned} kcal
        </Text>
      </View>
    </View>
  );
};

export const WaterLogHolder = (log: WaterLog) => {
  return (
    <View className="bg-blue-50 border border-blue-200 rounded-xl p-2 mb-2 flex-row items-center">
      {/* Icon */}
      <View className="bg-blue-100 p-3 rounded-full mr-3">
        <MaterialCommunityIcons name="cup-water" size={24} color="#2563eb" />
      </View>

      {/* Text info */}
      <View className="flex-1">
        <Text className="text-base font-bold text-blue-800">
          {log.amountMl} mL
        </Text>
        <Text className="text-xs text-gray-500">
          {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </View>
  );
};


export const FoodLogHolder = (log: FoodLog) => {
  return (
    <View className="flex flex-col gap-2">
      {log.items.map((item: FoodItem) => (
        <TouchableOpacity
          key={`${log.id}-${item.id}`}
          onPress={() => {
            
            router.push(`/(root)/food-log/${log.id}`);
          }}
        >
          <FoodItemCard
            id={item.id}
            name={item.name}
            quantity={item.quantity}
            unit={item.unit}
            calories={item.calories}
            protein={item.protein}
            fats={item.fats}
            carbs={item.carbs}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};