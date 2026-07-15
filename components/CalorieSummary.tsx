// components/CalorieSummary.tsx
import React from "react";
import { Text, View } from "react-native";
import CalorieStatItem from "./CalorieStatItem";

interface HealthSummary {
  targetCalories: number;
  caloriesBurned: number;
  consumedCalories: number;
  remainingCalories: number;
}

interface StatItem {
  label?: string;
  value?: number | string;
  color?: string;
  icon?: boolean;
  symbol?: string;
}

const CalorieSummary: React.FC<HealthSummary> = ({ targetCalories, caloriesBurned, consumedCalories, remainingCalories }) => {

  const calorieStats: StatItem[] = [
    {
      label: "Target",
      value: targetCalories,
      color: "text-gray-800",
      icon: true,
    },
    { symbol: "+" },
    {
      label: "Exercise",
      value: caloriesBurned,
      color: "text-teal-500",
    },
    { symbol: "−" },
    {
      label: "Food",
      value: consumedCalories || 0,
      color: "text-orange-500",
    },
    { symbol: "=" },
    {
      label: "Remaining",
      value: remainingCalories || 0,
      color: "text-red-500",
    },
  ];

  return (
    <View className="flex-row items-center justify-between">
      {calorieStats.map((item, index) =>
        item.symbol ? (
          <Text key={index} className="text-xl font-light text-gray-400">
            {item.symbol}
          </Text>
        ) : (
          <CalorieStatItem
            key={index}
            value={item.value}
            label={item.label!}
            color={item.color!}
            icon={item.icon}
          />
        )
      )}
    </View>
  );
};

export default CalorieSummary;
