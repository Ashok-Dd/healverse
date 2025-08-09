import { ExerciseLog, FoodLog, WaterLog } from "@/types/type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {Link} from "expo-router";

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
        Logged at: {new Date(log.createdAt).toLocaleTimeString()}
      </Text>
    </View>
  );
};

export const FoodLogHolder = (log: FoodLog) => {
    return (
        <View className="flex flex-col gap-2">
            {log.items.map((item) => (
                <Link
                    key={item.id}
                    href={`/food-log/${item.id}` as any}
                    asChild
                >
                    <TouchableOpacity className="bg-gray-100 flex flex-row items-center gap-3 rounded-md px-3 py-2">
                        <View>
                            <Text className="text-sm font-semibold text-black">
                                🍴 {item.name} ({item.quantity} {item.unit})
                            </Text>
                            <Text className="text-xs text-gray-600 mb-1">
                                {item.calories} kcal • {item.protein}g protein • {item.carbs}g carbs •{" "}
                                {item.fats}g fat
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Link>
            ))}
        </View>
    );
};
