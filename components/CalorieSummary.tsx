import React from "react";
import { Text, View } from "react-native";

interface CalorieSummaryProps {
  targetCalories: number;
  caloriesBurned: number;
  consumedCalories: number;
  remainingCalories: number;
}

const Stat = ({ label, value, text }: { label: string; value: number; text: string }) => (
  <View accessible accessibilityLabel={`${label} ${value} kilocalories`} className="items-center">
    <Text className={`font-display text-lg ${text}`}>{Math.round(value)}</Text>
    <Text className="font-body text-xs text-muted-foreground">{label}</Text>
  </View>
);

const Operator = ({ symbol }: { symbol: string }) => (
  <Text importantForAccessibility="no" className="font-body text-xl text-muted-foreground">
    {symbol}
  </Text>
);

/** Target + exercise - food = remaining, in kcal. */
const CalorieSummary = ({
  targetCalories,
  caloriesBurned,
  consumedCalories,
  remainingCalories,
}: CalorieSummaryProps) => (
  <View className="flex-row items-center justify-between">
    <Stat label="Target" value={targetCalories} text="text-foreground" />
    <Operator symbol="+" />
    <Stat label="Exercise" value={caloriesBurned} text="text-success" />
    <Operator symbol="−" />
    <Stat label="Food" value={consumedCalories} text="text-warning" />
    <Operator symbol="=" />
    <Stat label="Remaining" value={remainingCalories} text="text-primary" />
  </View>
);

export default React.memo(CalorieSummary);
