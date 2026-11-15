import { useThemeColors } from "@/constants/theme";
import { usePrefetchHome } from "@/hooks/usePrefetchHome";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;

/** Filled icon when the tab is active, outline otherwise. */
const tabIcon = (active: IconName, inactive: IconName) =>
  function TabBarIcon({ color, focused }: { color: string; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} size={24} color={color} />;
  };

// Cold starts and deep links land on the tracker, not on the first tab in the list.
export const unstable_settings = { initialRouteName: "tracker" };

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  usePrefetchHome();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Tabs that are not on screen stop re-rendering until they are focused again.
        freezeOnBlur: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: { fontFamily: "Nunito-SemiBold", fontSize: 12 },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="dietitian"
        options={{ title: "Dietitian", tabBarIcon: tabIcon("sparkles", "sparkles-outline") }}
      />
      <Tabs.Screen
        name="diet"
        options={{ title: "Diet", tabBarIcon: tabIcon("nutrition", "nutrition-outline") }}
      />
      <Tabs.Screen
        name="tracker"
        options={{ title: "Tracker", tabBarIcon: tabIcon("grid", "grid-outline") }}
      />
      <Tabs.Screen
        name="logging"
        options={{ title: "Logging", tabBarIcon: tabIcon("scan", "scan-outline") }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: tabIcon("person-circle", "person-circle-outline"),
        }}
      />
    </Tabs>
  );
}
