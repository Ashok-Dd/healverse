import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {StepProgressBarProps} from "@/types/type";

export default function StepProgressBar({
                                          currentStep,
                                          totalSteps,
                                        }: StepProgressBarProps) {
  const progress = currentStep / totalSteps;
  const width = useSharedValue(progress * 100);

  useEffect(() => {
    width.value = withTiming(progress * 100, { duration: 300 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
      <View className="w-full px-6">
        <View className="w-full bg-secondary-200 rounded-full h-1.5 overflow-hidden">
          <Animated.View
              className="bg-primary-500 h-full rounded-full"
              style={animatedStyle}
          />
        </View>
      </View>
  );
}
