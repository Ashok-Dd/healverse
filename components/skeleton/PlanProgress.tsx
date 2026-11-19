import React from "react";
import { Text, View } from "react-native";

interface PlanProgressProps {
  /** `loading` reads a stored plan (fast); the other two are AI calls that can take close to a minute. */
  kind: "loading" | "generating" | "regenerating";
}

/**
 * Placeholder while the Diet tab waits. For a generation it says so, instead of looking frozen.
 */
export function PlanProgress({ kind }: PlanProgressProps) {
  return (
    <View className="flex-1 px-1 pt-4">
      {kind !== "loading" && (
        <View accessibilityLiveRegion="polite" className="mb-5 rounded-3xl bg-accent p-5">
          <Text className="font-display text-lg text-accent-foreground">
            {kind === "regenerating" ? "Creating a fresh plan..." : "Preparing your meal plan..."}
          </Text>
          <Text className="mt-1 font-body text-sm text-foreground">
            Your dietitian is building meals around your goals. This can take up to a minute, and
            you can leave this screen while it works.
          </Text>
        </View>
      )}

      {[0, 1, 2].map((i) => (
        <View
          key={i}
          className="mb-4 rounded-3xl border border-border bg-card p-4"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <View className="mb-3 h-4 w-24 animate-pulse rounded bg-muted" />
          <View className="mb-3 h-6 w-3/4 animate-pulse rounded bg-muted" />
          <View className="mb-2 h-3 w-full animate-pulse rounded bg-muted" />
          <View className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </View>
      ))}
    </View>
  );
}
