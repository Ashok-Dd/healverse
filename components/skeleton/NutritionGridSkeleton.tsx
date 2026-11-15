import React from "react";
import { View } from "react-native";

interface NutritionGridSkeletonProps {
  /** Number of rings; matches the real grid so nothing jumps when data arrives. */
  count?: number;
  size?: number;
}

/** Placeholder rings shown while the daily summary loads. */
export function NutritionGridSkeleton({ count = 4, size = 90 }: NutritionGridSkeletonProps) {
  return (
    <View
      accessible
      accessibilityLabel="Loading nutrition overview"
      className="flex-row px-4 py-1"
      style={{ gap: 12 }}
    >
      {Array.from({ length: count }, (_, i) => (
        <View key={i} className="items-center" style={{ width: size + 5 }}>
          <View className="mb-2 h-4 w-14 animate-pulse rounded bg-muted" />
          <View
            className="animate-pulse rounded-full bg-muted"
            style={{ width: size, height: size }}
          />
          <View className="mt-2 h-3 w-12 animate-pulse rounded bg-muted" />
        </View>
      ))}
    </View>
  );
}
