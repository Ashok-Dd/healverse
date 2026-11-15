import Skeleton from "@/components/skeleton/Skeleton";
import { SyncBadge } from "@/components/ui/SyncBadge";
import type { FoodPhotoEntry } from "@/lib/outbox";
import { ActivityIndicator, Image, Text, View } from "react-native";

/** A meal photo that is waiting to upload or being analysed. Nutrition appears once the server has analysed it. */
export function QueuedFoodCard({ entry }: { entry: FoodPhotoEntry }) {
  const analysing = entry.status === "syncing";
  return (
    <View className="mr-3 min-w-[310px] flex-row items-center gap-4 rounded-xl bg-muted p-4">
      <View className="h-20 w-20 items-center justify-center">
        <Image
          source={{ uri: entry.payload.imageUri }}
          className="h-20 w-20 rounded-lg"
          resizeMode="cover"
        />
        {analysing && <ActivityIndicator className="absolute" />}
      </View>
      <View className="flex-1 gap-2">
        <Text className="font-body-semibold text-base text-foreground">
          {analysing ? `Analysing ${entry.payload.mealType.toLowerCase()}...` : entry.payload.mealType}
        </Text>
        {analysing ? (
          <>
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            <SyncBadge status={entry.status} />
            <Text className="font-body text-xs text-muted-foreground">
              {entry.status === "failed"
                ? "Retry or discard it from the list at the top."
                : "It will be analysed when you are back online."}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
