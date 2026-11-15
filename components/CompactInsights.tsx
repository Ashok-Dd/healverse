import { useInsights } from "@/lib/tanstack";
import type { Insight } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type InsightType = "health" | "diet";

interface CompactInsightsProps {
  type: InsightType;
  maxItems?: number;
}

const CONFIG: Record<InsightType, { icon: React.ComponentProps<typeof Ionicons>["name"]; title: string }> = {
  health: { icon: "heart-outline", title: "AI health insights" },
  diet: { icon: "restaurant-outline", title: "AI diet insights" },
};

const Header = ({ type }: { type: InsightType }) => (
  <View className="mb-2 flex-row items-center gap-2">
    <Ionicons name={CONFIG[type].icon} size={18} className="text-foreground" />
    <Text accessibilityRole="header" className="font-display text-base text-foreground">
      {CONFIG[type].title}
    </Text>
  </View>
);

/** AI insights card. Never blocks the screen: shows a skeleton while loading and a retry if it fails. */
const CompactInsights = ({ type, maxItems = 3 }: CompactInsightsProps) => {
  const { data, isLoading, isError, refetch } = useInsights();

  if (isLoading) {
    return (
      <View className="my-5" accessible accessibilityLabel="Loading insights">
        <Header type={type} />
        <View className="gap-3 rounded-2xl bg-muted p-4">
          <View className="h-3 w-full animate-pulse rounded bg-border" />
          <View className="h-3 w-5/6 animate-pulse rounded bg-border" />
          <View className="h-3 w-2/3 animate-pulse rounded bg-border" />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="my-5">
        <Header type={type} />
        <View className="flex-row items-center justify-between rounded-2xl bg-muted p-4">
          <Text className="flex-1 font-body text-sm text-muted-foreground">
            Insights are not available right now.
          </Text>
          <Pressable
            onPress={() => refetch()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Retry loading insights"
            className="min-h-[44px] justify-center pl-4"
          >
            <Text className="font-body-bold text-sm text-primary">Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const all: Insight[] = (type === "health" ? data?.healthInsights : data?.dietInsights) ?? [];
  if (all.length === 0) return null;

  const shown = all.slice(0, maxItems);
  const hidden = all.length - shown.length;

  return (
    <View className="my-5">
      <Header type={type} />
      <View className="gap-3 rounded-2xl bg-muted p-4">
        {shown.map((insight, index) => (
          <View key={`${index}-${insight.content}`} className="flex-row items-start">
            <View className="mr-3 mt-2 h-2 w-2 rounded-full bg-ring" />
            <Text className="flex-1 font-body text-sm text-foreground">{insight.content}</Text>
          </View>
        ))}
        {hidden > 0 && (
          <Text className="border-t border-border pt-3 text-center font-body text-xs text-muted-foreground">
            +{hidden} more {hidden === 1 ? "insight" : "insights"}
          </Text>
        )}
      </View>
    </View>
  );
};

export default CompactInsights;
