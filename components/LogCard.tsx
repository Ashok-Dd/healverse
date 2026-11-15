import IconButton from "@/components/ui/IconButton";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface LogCardProps<T> {
  icon: IconName;
  title: string;
  /** Shown when there are no items yet. */
  description: string;
  actionLabel: string;
  onAction: () => void;
  /** Adds an arrow in the header that opens the full list. */
  onSeeAll?: () => void;
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => React.ReactElement;
}

/** Section card for a kind of log (food, water, exercise) with an add action. */
function LogCard<T>({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  onSeeAll,
  items,
  getKey,
  renderItem,
}: LogCardProps<T>) {
  const hasItems = items.length > 0;

  return (
    <View className="mb-3 rounded-3xl border border-border bg-card p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-accent">
            <Ionicons name={icon} size={20} color={colors.accentForeground} />
          </View>
          <Text accessibilityRole="header" className="font-display text-lg text-foreground">
            {title}
          </Text>
        </View>
        {onSeeAll && (
          <Pressable
            onPress={onSeeAll}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`See all ${title.toLowerCase()} logs`}
            className="h-11 w-11 items-center justify-center"
          >
            <Ionicons name="arrow-forward-circle" size={26} color={colors.ring} />
          </Pressable>
        )}
      </View>

      {hasItems ? (
        <View className="gap-2">
          {items.map((item) => (
            <React.Fragment key={getKey(item)}>{renderItem(item)}</React.Fragment>
          ))}
        </View>
      ) : (
        <Text className="font-body text-sm text-muted-foreground">{description}</Text>
      )}

      <View className="mt-3 flex-row justify-end">
        <IconButton iconName="plus" label={actionLabel} variant="accent" onPress={onAction} />
      </View>
    </View>
  );
}

export default LogCard;
