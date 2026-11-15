import { colors } from "@/constants/theme";
import type { ExerciseLog, FoodItem, FoodLog, WaterLog } from "@/types/type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import FoodItemCard from "./cards/FoodItemCard";

export const ExerciseLogHolder = ({ log }: { log: ExerciseLog }) => (
  <View className="flex-row items-center justify-between rounded-2xl bg-muted p-3">
    <View className="flex-row items-center gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-accent">
        <MaterialCommunityIcons name="dumbbell" size={20} color={colors.accentForeground} />
      </View>
      <View>
        <Text className="font-body-bold text-sm text-foreground">{log.exerciseName}</Text>
        <Text className="font-body text-xs text-muted-foreground">
          {log.durationMinutes} min
        </Text>
      </View>
    </View>
    <View className="flex-row items-center gap-1">
      <MaterialCommunityIcons name="fire" size={16} color={colors.destructive} />
      <Text className="font-body-semibold text-xs text-destructive">
        {log.caloriesBurned} kcal
      </Text>
    </View>
  </View>
);

export const WaterLogHolder = ({ log }: { log: WaterLog }) => (
  <View className="flex-row items-center gap-3 rounded-2xl bg-muted p-3">
    <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
      <MaterialCommunityIcons name="cup-water" size={20} color={colors.info} />
    </View>
    <View className="flex-1">
      <Text className="font-body-bold text-base text-foreground">{log.amountMl} mL</Text>
      <Text className="font-body text-xs text-muted-foreground">
        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>
    </View>
  </View>
);

export const FoodLogHolder = ({ log }: { log: FoodLog }) => (
  <View className="gap-2">
    {log.items.map((item: FoodItem) => (
      <Pressable
        key={`${log.id}-${item.id}`}
        onPress={() => router.push(`/(root)/food-log/${log.id}`)}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, open details`}
        className="active:opacity-80"
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
      </Pressable>
    ))}
  </View>
);
