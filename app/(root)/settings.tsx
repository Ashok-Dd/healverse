import { BackHeader } from "@/components/headers/BackHeader";
import { SettingsRow, SettingsSection } from "@/components/settings/SettingsSection";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import { useSignOut } from "@/hooks/useSignOut";
import { useAuthStore } from "@/store/authStore";
import { useReminderStore } from "@/store/reminderStore";
import { useThemeStore, type ThemePreference } from "@/store/themeStore";
import { MEAL_REMINDERS, MEALS, type Meal } from "@/utils/notifications";
import Constants from "expo-constants";
import React from "react";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const THEME_HINT: Record<ThemePreference, string> = {
  system: "Matches your phone's light or dark setting.",
  light: "Always use the light theme.",
  dark: "Always use the dark theme.",
};

const MEAL_ICONS: Record<Meal, React.ComponentProps<typeof SettingsRow>["icon"]> = {
  breakfast: "sunny-outline",
  lunch: "restaurant-outline",
  dinner: "moon-outline",
};

const formatTime = ({ hour, minute }: { hour: number; minute: number }) =>
  new Date(2000, 0, 1, hour, minute).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

/**
 * Only settings that work today live here. Ideas that need more work (profile editing, units,
 * ...) are listed in docs/settings-backlog.md.
 */
export default function Settings() {
  const username = useAuthStore((s) => s.user?.username);
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const reminders = useReminderStore((s) => s.enabled);
  const setReminder = useReminderStore((s) => s.setEnabled);
  const signOut = useSignOut();

  const toggleReminder = async (meal: Meal, on: boolean) => {
    if (await setReminder(meal, on)) return;
    Alert.alert(
      "Notifications are off",
      "Allow notifications for HealVerse in your phone settings to get meal reminders.",
      [
        { text: "Not now", style: "cancel" },
        { text: "Open settings", onPress: () => Linking.openSettings() },
      ]
    );
  };

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
        <BackHeader title="Settings" />
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-8 pt-2"
          showsVerticalScrollIndicator={false}
        >
          <SettingsSection title="Appearance">
            <View className="p-4">
              <Text className="mb-3 font-body-semibold text-base text-foreground">Theme</Text>
              <SegmentedControl
                options={THEME_OPTIONS}
                value={preference}
                onChange={setPreference}
              />
              <Text className="mt-3 font-body text-sm text-muted-foreground">
                {THEME_HINT[preference]}
              </Text>
            </View>
          </SettingsSection>

          <SettingsSection title="Meal reminders">
            {MEALS.map((meal, index) => (
              <SettingsRow
                key={meal}
                icon={MEAL_ICONS[meal]}
                label={`${MEAL_REMINDERS[meal].label} · ${formatTime(MEAL_REMINDERS[meal])}`}
                divider={index < MEALS.length - 1}
                toggle={{ value: reminders[meal], onChange: (on) => toggleReminder(meal, on) }}
              />
            ))}
          </SettingsSection>

          <SettingsSection title="Account">
            <SettingsRow
              icon="person-outline"
              label="Signed in as"
              value={username}
              divider
            />
            <SettingsRow icon="log-out-outline" label="Sign out" destructive onPress={signOut} />
          </SettingsSection>

          <SettingsSection title="About">
            <SettingsRow
              icon="information-circle-outline"
              label="Version"
              value={Constants.expoConfig?.version ?? "-"}
            />
          </SettingsSection>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
