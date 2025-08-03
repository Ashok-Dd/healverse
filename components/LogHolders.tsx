import { ExerciseLog, FoodLog, WaterLog } from "@/types/type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export const ExerciseLogHolder = (log: ExerciseLog) => {
  return (
    <View className="bg-gray-100 rounded-md flex-row mb-1 justify-between items-center px-3 py-3">
      <View>
        <Text className="text-sm font-semibold text-gray-800">
          🏋️ {log.exerciseName}
        </Text>
        <Text className="text-xs text-gray-700 ml-5">
          ({log.durationMinutes} min)
        </Text>
      </View>
      <Text className="text-xs font-semibold text-green-800">
        <MaterialCommunityIcons name="fire" color={"green"} />-
        {log.caloriesBurned} kcal
      </Text>
    </View>
  );
};

export const WaterLogHolder = (log: WaterLog) => {
  return (
    <View className="bg-gray-100 rounded-md mb-1 px-3 py-2">
      <Text className="text-sm font-semibold text-gray-800">
        Drank {log.amountMl} mL
      </Text>
      <Text className="text-xs text-gray-600">
        Logged at: {new Date(log.loggedAt).toLocaleTimeString()}
      </Text>
    </View>
  );
};

export const FoodLogHolder = (log: FoodLog) => {
  return (
    <View className="bg-gray-100 flex flex-row items-center gap-3  rounded-md px-3 py-2">
      {/* {log.imageDescription && (
        <View className="bg-white p-2 w-[50px] h-[50px] flex items-center justify-center   rounded-md mt-1 border border-gray-200">
          <Text className="text-[11px] text-gray-500 italic">📷</Text>
        </View>
      )} */}
      <View>
        <Text className="text-sm font-semibold text-black">
          🍴 {log.foodName} ({log.quantity} {log.unit})
        </Text>
        <Text className="text-xs  text-gray-600 mb-1">
          {log.calories} kcal • {log.protein}g protein • {log.carbs}g carbs •{" "}
          {log.fat}g fat
        </Text>
      </View>
    </View>
  );
};
