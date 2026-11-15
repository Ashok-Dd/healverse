import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface ChatHeaderProps {
  title: string;
  /** Shows a back arrow (used when a past conversation is open). */
  onBackPress?: () => void;
}

export const ChatHeader = React.memo(function ChatHeader({ title, onBackPress }: ChatHeaderProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-border bg-card px-4 py-2">
      <View className="flex-1 flex-row items-center gap-2">
        {onBackPress && (
          <Pressable
            onPress={onBackPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-11 w-11 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} className="text-foreground" />
          </Pressable>
        )}
        <View className="h-9 w-9 items-center justify-center rounded-full bg-accent">
          <Ionicons name="sparkles" size={18} className="text-accent-foreground" />
        </View>
        <Text accessibilityRole="header" className="font-display-bold text-xl text-foreground">
          {title}
        </Text>
      </View>

      <Pressable
        onPress={() => router.push("/(root)/conversations" as any)}
        accessibilityRole="button"
        accessibilityLabel="Conversation history"
        className="min-h-[44px] flex-row items-center gap-1 rounded-full bg-secondary px-4 active:opacity-80"
      >
        <Ionicons name="time-outline" size={16} className="text-foreground" />
        <Text className="font-body-semibold text-sm text-secondary-foreground">History</Text>
      </Pressable>
    </View>
  );
});
