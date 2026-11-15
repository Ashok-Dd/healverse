import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

/** Shown in an empty chat. Suggested questions live above the input box. */
const EmptyMessageState = () => (
  <View className="flex-1 items-center justify-center px-8">
    <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-accent">
      <Ionicons name="sparkles" size={30} color={colors.accentForeground} />
    </View>
    <Text accessibilityRole="header" className="mb-2 text-center font-display-bold text-2xl text-foreground">
      Ask your dietitian
    </Text>
    <Text className="text-center font-body text-base text-muted-foreground">
      Get advice on meals, nutrition and your goals. Pick a question below or write your own.
    </Text>
  </View>
);

export default React.memo(EmptyMessageState);
