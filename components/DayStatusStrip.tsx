import { useIsOnline } from "@/lib/network";
import { useOutboxStore } from "@/lib/outbox";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface DayStatusStripProps {
  /** A refresh failed while older data is on screen. */
  hasRefreshError: boolean;
  onRetry: () => void;
}

/**
 * The one place the Logging tab talks about connection and sync, instead of an error card per
 * section. Offline is already shown by the global banner, so it is not repeated here.
 */
const DayStatusStrip = ({ hasRefreshError, onRetry }: DayStatusStripProps) => {
  const isOnline = useIsOnline();
  const waiting = useOutboxStore(
    (state) =>
      state.entries.filter(
        (entry) => entry.kind !== "chat" && (entry.status === "pending" || entry.status === "syncing")
      ).length
  );

  if (isOnline && hasRefreshError) {
    return (
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Couldn't refresh. Retry."
        className="mb-3 min-h-[44px] flex-row items-center self-start rounded-full bg-muted px-4 active:opacity-80"
      >
        <Ionicons name="refresh-outline" size={16} className="text-warning" />
        <Text className="ml-2 font-body-semibold text-xs text-foreground">
          {"Couldn't refresh · "}
          <Text className="text-primary">Retry</Text>
        </Text>
      </Pressable>
    );
  }

  if (waiting > 0) {
    return (
      <View
        accessibilityLiveRegion="polite"
        className="mb-3 min-h-[36px] flex-row items-center self-start rounded-full bg-muted px-4"
      >
        <Ionicons name="cloud-upload-outline" size={16} className="text-warning" />
        <Text className="ml-2 font-body-semibold text-xs text-foreground">
          {waiting === 1 ? "1 entry waiting to sync" : `${waiting} entries waiting to sync`}
        </Text>
      </View>
    );
  }

  return null;
};

export default DayStatusStrip;
