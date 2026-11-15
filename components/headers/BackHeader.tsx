import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface BackHeaderProps {
  title: string;
  /** Optional action on the right, e.g. an icon button. */
  right?: React.ReactNode;
}

/** Back arrow + title row for pushed screens. */
export function BackHeader({ title, right }: BackHeaderProps) {
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(root)/(tabs)/tracker" as any);
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="flex-1 flex-row items-center gap-3">
        <Pressable
          onPress={goBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-11 w-11 items-center justify-center rounded-full border border-border bg-card"
        >
          <Ionicons name="chevron-back" size={22} className="text-foreground" />
        </Pressable>
        <Text accessibilityRole="header" className="font-display-bold text-2xl text-foreground">
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}
