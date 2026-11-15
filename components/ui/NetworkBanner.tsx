import { useIsOnline } from "@/lib/network";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Small pill at the top of the screen while there is no connection. Background refreshes are
 * silent: every reload refetches stale data (the AI insights take several seconds), so an
 * "Updating" hint there would show on every launch. Entries still waiting to upload carry
 * their own "Waiting to sync" marker.
 */
export function NetworkBanner() {
  const insets = useSafeAreaInsets();
  const isOnline = useIsOnline();

  if (isOnline) return null;

  return (
    <View
      pointerEvents="none"
      className="absolute inset-x-0 items-center"
      style={{ top: insets.top + 4 }}
      accessibilityLiveRegion="polite"
    >
      <View className="flex-row items-center rounded-full border border-border bg-card px-3 py-1">
        <Ionicons name="cloud-offline-outline" size={14} className="text-warning" />
        <Text className="ml-1.5 font-body-semibold text-xs text-foreground">
          Offline - showing saved data
        </Text>
      </View>
    </View>
  );
}