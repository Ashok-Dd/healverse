import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface StepProgressProps {
  step: number;
  total: number;
}

/** Thin animated progress bar with an "n of total" label. */
export function StepProgress({ step, total }: StepProgressProps) {
  const width = useSharedValue((step / total) * 100);

  useEffect(() => {
    width.value = withTiming((step / total) * 100, { duration: 300 });
  }, [step, total, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View
      className="flex-1 flex-row items-center gap-3"
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${step} of ${total}`}
      accessibilityValue={{ min: 0, max: total, now: step }}
    >
      <View className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <Animated.View className="h-full rounded-full bg-primary" style={fillStyle} />
      </View>
      <Text className="font-body-semibold text-sm text-muted-foreground">
        {step}/{total}
      </Text>
    </View>
  );
}
