import ErrorCard from "@/components/cards/ErrorCard";
import { Button } from "@/components/ui/Button";
import { useGamificationSummary } from "@/lib/tanstack";
import type { GamificationActivity } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const COLLAPSED_COUNT = 4;

const ACTIVITY: Record<string, { icon: IconName; text: string; bg: string }> = {
  DAILY_LOGIN: { icon: "calendar-outline", text: "text-info", bg: "bg-info/10" },
  FOOD_LOG: { icon: "restaurant-outline", text: "text-warning", bg: "bg-warning/10" },
  DIET_FOLLOW: { icon: "restaurant-outline", text: "text-warning", bg: "bg-warning/10" },
  EXERCISE_LOG: { icon: "fitness-outline", text: "text-destructive", bg: "bg-destructive/10" },
  WATER_LOG: { icon: "water-outline", text: "text-info", bg: "bg-info/10" },
  WEIGHT_UPDATE: { icon: "scale-outline", text: "text-success", bg: "bg-success/10" },
  CHAT_INTERACTION: { icon: "chatbubble-outline", text: "text-success", bg: "bg-success/10" },
  STREAK_MILESTONE: { icon: "flame-outline", text: "text-warning", bg: "bg-warning/10" },
  DAILY_COMPLETE: { icon: "checkmark-circle-outline", text: "text-success", bg: "bg-success/10" },
};
const FALLBACK = { icon: "star-outline" as IconName, text: "text-success", bg: "bg-success/10" };

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const hours = (Date.now() - date.getTime()) / 36e5;
  if (hours < 1) return "Just now";
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  if (hours < 48) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const Stat = ({
  icon,
  value,
  label,
  text,
  bg,
}: {
  icon: IconName;
  value: number;
  label: string;
  text: string;
  bg: string;
}) => (
  <View
    accessible
    accessibilityLabel={`${label}: ${value}`}
    className="flex-1 items-center rounded-2xl border border-border bg-card px-2 py-3"
  >
    <View className={`mb-2 h-9 w-9 items-center justify-center rounded-full ${bg}`}>
      <Ionicons name={icon} size={18} className={text} />
    </View>
    <Text className="font-display text-xl text-foreground">{value}</Text>
    <Text className="font-body text-xs text-muted-foreground">{label}</Text>
  </View>
);

const ActivityRow = ({ activity }: { activity: GamificationActivity }) => {
  const style = ACTIVITY[activity.reason] ?? FALLBACK;
  return (
    <View className="flex-row items-center gap-3 py-2">
      <View className={`h-10 w-10 items-center justify-center rounded-full ${style.bg}`}>
        <Ionicons name={style.icon} size={18} className={style.text} />
      </View>
      <View className="flex-1">
        <Text className="font-body-semibold text-sm text-foreground" numberOfLines={1}>
          {activity.description}
        </Text>
        <Text className="font-body text-xs text-muted-foreground">{formatDate(activity.date)}</Text>
      </View>
      <View className="rounded-full bg-accent px-3 py-1">
        <Text className="font-body-bold text-xs text-accent-foreground">
          +{activity.pointsEarned}
        </Text>
      </View>
    </View>
  );
};

const Skeleton = () => (
  <View accessible accessibilityLabel="Loading progress" className="gap-3">
    <View className="flex-row gap-3">
      {[0, 1, 2].map((i) => (
        <View key={i} className="h-[104px] flex-1 animate-pulse rounded-2xl bg-muted" />
      ))}
    </View>
    <View className="h-24 animate-pulse rounded-3xl bg-muted" />
  </View>
);

/** Streaks, points and recent activity. */
const GamificationSection = () => {
  const { data, isLoading, error, refetch } = useGamificationSummary();
  const [expanded, setExpanded] = useState(false);

  if (isLoading) return <Skeleton />;
  if (error || !data) {
    return <ErrorCard message={error?.message} onPress={() => refetch()} className="mx-0" />;
  }

  const activities = data.recentActivity ?? [];
  const visible = expanded ? activities : activities.slice(0, COLLAPSED_COUNT);

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <Stat icon="flame-outline" value={data.currentStreak} label="Day streak" text="text-warning" bg="bg-warning/10" />
        <Stat icon="star-outline" value={data.totalPoints} label="Total points" text="text-success" bg="bg-success/10" />
        <Stat icon="trending-up-outline" value={data.longestStreak} label="Best streak" text="text-info" bg="bg-info/10" />
      </View>

      <View className="flex-row items-center justify-between rounded-3xl border border-border bg-card p-4">
        <View>
          <Text className="font-body text-sm text-muted-foreground">Points today</Text>
          <Text className="font-display-bold text-3xl text-primary">{data.todayPoints}</Text>
        </View>
        <Ionicons name="trophy-outline" size={36} className="text-border" />
      </View>

      <View className="rounded-3xl border border-border bg-card px-4 py-3">
        <Text accessibilityRole="header" className="mb-1 font-display text-base text-foreground">
          Recent activity
        </Text>
        {visible.length > 0 ? (
          visible.map((activity) => <ActivityRow key={activity.id} activity={activity} />)
        ) : (
          <Text className="py-4 font-body text-sm text-muted-foreground">
            No activity yet. Log a meal or a glass of water to earn points.
          </Text>
        )}
        {activities.length > COLLAPSED_COUNT && (
          <Button
            variant="ghost"
            size="sm"
            title={expanded ? "Show less" : `Show all (${activities.length})`}
            onPress={() => setExpanded((v) => !v)}
          />
        )}
      </View>
    </View>
  );
};

export default GamificationSection;
