import GamificationSection from "@/components/GamificationSection";
import GlobalHeader from "@/components/headers/GlobalHeader";
import { Button } from "@/components/ui/Button";
import { ACTIVITY_LABELS } from "@/constants/onboarding";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import { useUserProfileStore } from "@/store/userProfile";
import type { UserProfile } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback } from "react";
import { Alert, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NOTIFICATION_SETTINGS_KEY = "notification_settings";

const titleCase = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-1 items-center rounded-2xl bg-muted px-2 py-3">
    <Text className="font-display text-lg text-foreground">{value}</Text>
    <Text className="mt-0.5 text-center font-body text-xs text-muted-foreground">{label}</Text>
  </View>
);

const ProfileCard = ({ username, profile }: { username: string; profile: UserProfile }) => (
  <View className="mb-4 rounded-3xl border border-border bg-card p-5">
    <View className="mb-4 flex-row items-center gap-4">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
        <Text className="font-display-bold text-2xl uppercase text-primary-foreground">
          {username.charAt(0)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="font-display text-xl text-foreground" numberOfLines={1}>
          {username}
        </Text>
        <Text className="font-body text-sm text-muted-foreground">
          {profile.age} years · {ACTIVITY_LABELS[profile.activityLevel] ?? titleCase(profile.activityLevel)}
        </Text>
      </View>
    </View>

    <View className="flex-row gap-3">
      <Stat label="Current weight" value={`${profile.currentWeightKg} kg`} />
      <Stat label="Target weight" value={`${profile.targetWeightKg} kg`} />
      <Stat label="Goal" value={titleCase(profile.goal)} />
    </View>
  </View>
);

const Row = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    className="min-h-[56px] flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 active:opacity-80"
  >
    <Ionicons name={icon} size={22} color={colors.foreground} />
    <Text className="flex-1 font-body-semibold text-base text-foreground">{label}</Text>
    <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
  </Pressable>
);

export default function Account() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const clearProfile = useUserProfileStore((s) => s.clearProfile);
  const queryClient = useQueryClient();

  const performLogout = useCallback(async () => {
    try {
      queryClient.clear();
      clearProfile();
      await Notifications.cancelAllScheduledNotificationsAsync();
      await SecureStore.deleteItemAsync(NOTIFICATION_SETTINGS_KEY);
    } catch {
      // Cleanup is best effort: the user must still be signed out below.
    }
    await logout();
    router.replace("/(auth)/welcome");
  }, [queryClient, clearProfile, logout]);

  const confirmLogout = useCallback(() => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: performLogout },
    ]);
  }, [performLogout]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-3 pb-8"
          showsVerticalScrollIndicator={false}
        >
          <GlobalHeader />

          {user?.profile ? (
            <ProfileCard username={user.username} profile={user.profile} />
          ) : (
            <View className="mb-4 rounded-3xl border border-border bg-card p-5">
              <Text className="font-display text-lg text-foreground">
                {user?.username ?? "Your profile"}
              </Text>
              <Text className="mt-1 font-body text-sm text-muted-foreground">
                Your health profile is not available right now.
              </Text>
            </View>
          )}

          <GamificationSection />

          <View className="mt-4 gap-3">
            <Row
              icon="settings-outline"
              label="Settings"
              onPress={() => router.push("/(root)/settings" as any)}
            />
            <Button variant="outline" title="Sign out" onPress={confirmLogout} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
