import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

/** App wordmark shown at the top of the main tabs. */
const GlobalHeader = () => (
  <View className="flex-row items-center gap-2 py-3">
    <View className="h-9 w-9 items-center justify-center rounded-full bg-accent">
      <Ionicons name="leaf" size={18} color={colors.accentForeground} />
    </View>
    <Text accessibilityRole="header" className="font-display-bold text-xl text-foreground">
      HealVerse
    </Text>
  </View>
);

export default React.memo(GlobalHeader);
