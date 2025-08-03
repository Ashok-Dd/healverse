// components/CalorieSummary.tsx
import { HealthData } from "@/types/type";
import React from "react";
import { Text, View } from "react-native";
import CalorieStatItem from "./CalorieStatItem";

interface HealthSummary {
  targetCalories: number;
  caloriesBurned: number;
  consumedCalories: number;
  remainingCalories: number;
}

interface CalorieSummaryProps {
  healthData: HealthData | null;
}

interface StatItem {
  label?: string;
  value?: number | string;
  color?: string;
  icon?: boolean;
  symbol?: string;
}

const CalorieSummary: React.FC<CalorieSummaryProps> = ({ healthData }) => {
  const summary = healthData?.summary;

  const calorieStats: StatItem[] = [
    {
      label: "Target",
      value: summary?.targetCalories || 0,
      color: "text-gray-800",
      icon: true,
    },
    { symbol: "+" },
    {
      label: "Exercise",
      value: summary?.caloriesBurned || 0,
      color: "text-teal-500",
    },
    { symbol: "−" },
    {
      label: "Food",
      value: summary?.consumedCalories || 0,
      color: "text-orange-500",
    },
    { symbol: "=" },
    {
      label: "Remaining",
      value: summary?.remainingCalories || 0,
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
