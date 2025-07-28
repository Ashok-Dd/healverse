import React from "react";
import { View } from "react-native";
import {StepProgressBarProps} from "@/types/type";

export default function StepProgressBar({
                                          currentStep,
                                          totalSteps,
                                        }: StepProgressBarProps) {
  const progress = currentStep / totalSteps;

  return (
      <View className="w-full px-6">
        <View className="w-full bg-secondary-200 rounded-full h-1.5 overflow-hidden">
          <View
              className="bg-primary-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%` }}
          />
        </View>
      </View>
  );
}