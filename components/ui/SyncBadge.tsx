import type { OutboxStatus } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

/** Small marker for something made on this device that the server does not have yet. */
export function SyncBadge({ status }: { status?: OutboxStatus }) {
  if (status !== "pending" && status !== "failed") return null;
  const failed = status === "failed";
  return (
    <View className="flex-row items-center">
      <Ionicons
        name={failed ? "alert-circle-outline" : "cloud-upload-outline"}
        size={12}
        className={failed ? "text-destructive" : "text-warning"}
      />
      <Text
        className={`ml-1 font-body-semibold text-xs ${failed ? "text-destructive" : "text-warning"}`}
      >
        {failed ? "Not synced" : "Waiting to sync"}
      </Text>
    </View>
  );
}
