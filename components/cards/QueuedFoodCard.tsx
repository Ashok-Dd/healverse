import Skeleton from "@/components/skeleton/Skeleton";
import { SyncBadge } from "@/components/ui/SyncBadge";
import type { FoodLogEntry } from "@/lib/outbox";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Image, Text, View } from "react-native";

/** A meal (photo, description or both) that is waiting to upload or being analysed. Nutrition appears once the server has analysed it. */
export function QueuedFoodCard({ entry }: { entry: FoodLogEntry }) {
  const analysing = entry.status === "syncing";
  const { mealType, imageUri, description } = entry.payload;

  return (
    <View className="mr-3 min-w-[310px] flex-row items-center gap-3 rounded-xl bg-muted p-3">
      <View className="h-[72px] w-[72px] items-center justify-center">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="h-[72px] w-[72px] rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="h-[72px] w-[72px] items-center justify-center rounded-xl bg-secondary">
            <MaterialCommunityIcons
              name="text-box-outline"
              size={28}
              className="text-secondary-foreground"
            />
          </View>
        )}
        {analysing && <ActivityIndicator className="absolute" />}
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-body-semibold text-base text-foreground">
          {analysing ? `Analysing ${mealType.toLowerCase()}...` : mealType}
        </Text>
        {description ? (
          <Text className="font-body text-xs text-muted-foreground" numberOfLines={2}>
            {description}
          </Text>
        ) : null}
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
