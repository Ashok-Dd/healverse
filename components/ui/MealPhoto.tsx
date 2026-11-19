import { findMealPhoto } from "@/lib/mealPhotos";
import { useAuthStore } from "@/store/authStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";

interface MealPhotoProps {
  logId: number;
  /** Photo URL from the server, if it ever stores one. The local copy wins. */
  imageUrl?: string | null;
  /** Tailwind size and shape, e.g. "h-[72px] w-[72px] rounded-xl". */
  className: string;
  iconSize?: number;
}

/**
 * The photo of a logged meal from this device, with an icon when there is none: the meal was
 * logged from text or on another phone, or the file was removed from the device's storage.
 */
export function MealPhoto({ logId, imageUrl, className, iconSize = 28 }: MealPhotoProps) {
  const userId = useAuthStore((state) => state.user?.id);
  const [uri, setUri] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let current = true;
    setFailed(false);
    if (userId == null) return;
    findMealPhoto(userId, logId).then((found) => {
      if (current) setUri(found);
    });
    return () => {
      current = false;
    };
  }, [userId, logId]);

  const source = failed ? null : (uri ?? imageUrl ?? null);

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        className={`${className} border border-border`}
        resizeMode="cover"
        onError={() => setFailed(true)}
        accessibilityLabel="Photo of the meal"
      />
    );
  }
  return (
    <View className={`${className} items-center justify-center bg-secondary`}>
      <MaterialCommunityIcons
        name="silverware-fork-knife"
        size={iconSize}
        className="text-secondary-foreground"
      />
    </View>
  );
}
