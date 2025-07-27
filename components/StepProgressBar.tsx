import React from "react";
import { View } from "react-native";

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgressBar({
  currentStep,
  totalSteps,
}: StepProgressBarProps) {
  const progress = currentStep / totalSteps;

  return (
    <View className="w-full px-4">
      <View className="w-full bg-gray-200 rounded-full  overflow-hidden">
        <View
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </View>
    </View>
  );
}
