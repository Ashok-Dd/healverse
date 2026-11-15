import { useIsOnline } from "@/lib/network";
import { Ionicons } from "@expo/vector-icons";
import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Quick refetches finish before this, so the hint does not flicker on every screen change.
const UPDATING_HINT_DELAY_MS = 800;

/**
 * Small pill at the top of the screen: "Offline" while there is no connection, and a quiet
 * "Updating" while a background refresh is running for longer than a moment.
 */
export function NetworkBanner() {
  const insets = useSafeAreaInsets();
  const isOnline = useIsOnline();
  const isFetching = useIsFetching() > 0;
  const [showUpdating, setShowUpdating] = useState(false);

  useEffect(() => {
    if (!isFetching) {
      setShowUpdating(false);
      return;
    }
    const timer = setTimeout(() => setShowUpdating(true), UPDATING_HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isFetching]);

  if (isOnline && !showUpdating) return null;

  return (
    <View
      pointerEvents="none"
      className="absolute inset-x-0 items-center"
      style={{ top: insets.top + 4 }}
      accessibilityLiveRegion="polite"
    >
      <View className="flex-row items-center rounded-full border border-border bg-card px-3 py-1">
        <Ionicons
          name={isOnline ? "sync" : "cloud-offline-outline"}
          size={14}
          className={isOnline ? "text-muted-foreground" : "text-warning"}
        />
        <Text className="ml-1.5 font-body-semibold text-xs text-foreground">
          {isOnline ? "Updating" : "Offline - showing saved data"}
        </Text>
      </View>
    </View>
  );
}
