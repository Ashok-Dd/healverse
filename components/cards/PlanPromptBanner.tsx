import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

/** Tracker hint shown while today's targets come from the profile because no meal plan exists yet. */
const PlanPromptBanner = () => (
  <Pressable
    onPress={() => router.push("/(root)/(tabs)/diet" as any)}
    accessibilityRole="button"
    accessibilityLabel="Your targets come from your profile. Open the Diet tab to get a meal plan."
    className="mb-3 min-h-[44px] flex-row items-center justify-between rounded-2xl bg-accent px-4 py-3"
  >
    <Text className="mr-3 flex-1 font-body text-sm text-accent-foreground">
      Targets are based on your profile. Get a meal plan
    </Text>
    <Ionicons name="arrow-forward" size={18} className="text-accent-foreground" />
  </Pressable>
);

export default PlanPromptBanner;
