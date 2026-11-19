import IconButton from "@/components/ui/IconButton";
import InlineError from "@/components/ui/InlineError";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Skeleton from "./skeleton/Skeleton";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface LogCardProps<T> {
  icon: IconName;
  title: string;
  /** Shown when there are no items yet. The whole empty row adds a log when pressed. */
  description: string;
  actionLabel: string;
  onAction: () => void;
  /** Adds an arrow in the header that opens the full list. */
  onSeeAll?: () => void;
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => React.ReactElement;
  /** No data yet and a request is on its way. */
  loading?: boolean;
  /** The list could not be loaded and there is nothing cached to show instead. */
  error?: { message?: string; onRetry: () => void };
}

/**
 * Section card for a kind of log (food, water, exercise). Loading and failure only replace the
 * list: the header and the add action stay, because logging never depends on the list loading.
 */
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
  loading = false,
  error,
}: LogCardProps<T>) {
  const hasItems = items.length > 0;

  const body = (() => {
    if (error) {
      return (
        <InlineError
          message={error.message ?? `Couldn't load ${title.toLowerCase()}.`}
          onRetry={error.onRetry}
        />
      );
    }
    if (loading) {
      return (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Skeleton height={56} radius={16} className="mb-2" />
          <Skeleton height={56} radius={16} />
        </View>
      );
    }
    if (hasItems) {
      return (
        <View className="gap-2">
          {items.map((item) => (
            <React.Fragment key={getKey(item)}>{renderItem(item)}</React.Fragment>
          ))}
        </View>
      );
    }
    return (
      <Pressable
        onPress={onAction}
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        className="min-h-[72px] items-center justify-center gap-1 rounded-2xl border border-dashed border-border px-4 py-3 active:opacity-80"
      >
        <Text className="text-center font-body text-sm text-muted-foreground">{description}</Text>
        <Text className="font-body-semibold text-sm text-ring">+ {actionLabel}</Text>
      </Pressable>
    );
  })();

  return (
    <View className="mb-3 rounded-3xl border border-border bg-card p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-accent">
            <Ionicons name={icon} size={20} className="text-accent-foreground" />
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
            <Ionicons name="arrow-forward-circle" size={26} className="text-ring" />
          </Pressable>
        )}
      </View>

      {body}

      {(hasItems || loading || error) && (
        <View className="mt-3 flex-row justify-end">
          <IconButton iconName="plus" label={actionLabel} variant="accent" onPress={onAction} />
        </View>
      )}
    </View>
  );
}

export default LogCard;
