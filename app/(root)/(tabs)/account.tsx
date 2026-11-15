import GamificationSection from "@/components/GamificationSection";
import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import { ACTIVITY_LABELS } from "@/constants/onboarding";
import { useAuthStore } from "@/store/authStore";
import type { UserProfile } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const titleCase = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

const SectionTitle = ({ children }: { children: string }) => (
  <Text
    accessibilityRole="header"
    className="mb-3 mt-6 px-1 font-display text-lg text-foreground"
  >
    {children}
  </Text>
);

const ProfileCard = ({ username, profile }: { username: string; profile: UserProfile }) => {
  const change = Math.round((profile.targetWeightKg - profile.currentWeightKg) * 10) / 10;

  return (
    <View className="rounded-3xl border border-border bg-card p-5">
      <View className="flex-row items-center gap-4">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
          <Text className="font-display-bold text-3xl uppercase text-primary-foreground">
            {username.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-display-bold text-2xl text-foreground" numberOfLines={1}>
            {username}
          </Text>
          <Text className="font-body text-sm text-muted-foreground">
            {profile.age} years · {titleCase(profile.gender)}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row items-center rounded-2xl bg-muted p-4">
        <View className="flex-1 items-center">
          <Text className="font-display text-xl text-foreground">{profile.currentWeightKg} kg</Text>
          <Text className="font-body text-xs text-muted-foreground">Now</Text>
        </View>
        <View className="items-center px-2">
          <Ionicons name="arrow-forward" size={18} className="text-muted-foreground" />
          <Text className="mt-0.5 font-body-semibold text-xs text-muted-foreground">
            {change === 0 ? "maintain" : `${change > 0 ? "+" : ""}${change} kg`}
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="font-display text-xl text-primary">{profile.targetWeightKg} kg</Text>
          <Text className="font-body text-xs text-muted-foreground">Target</Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center gap-2 self-start rounded-full bg-accent px-4 py-2">
        <Ionicons name="flag-outline" size={16} className="text-accent-foreground" />
        <Text className="font-body-bold text-sm text-accent-foreground">
          {titleCase(profile.goal)}
        </Text>
      </View>
    </View>
  );
};

const PlanRow = ({ label, value, divider }: { label: string; value: string; divider?: boolean }) => (
  <View
    className={`flex-row items-center justify-between gap-4 py-3 ${
      divider ? "border-b border-border" : ""
    }`}
  >
    <Text className="font-body text-base text-muted-foreground">{label}</Text>
    <Text className="flex-1 text-right font-body-semibold text-base text-foreground">{value}</Text>
  </View>
);

export default function Account() {
  const user = useAuthStore((s) => s.user);
  const profile = user?.profile;

  const health =
    profile?.healthCondition === "OTHER" && profile.otherHealthConditionDescription
      ? profile.otherHealthConditionDescription
      : titleCase(profile?.healthCondition ?? "NONE");

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-10"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between py-3">
            <Text accessibilityRole="header" className="font-display-bold text-3xl text-foreground">
              Account
            </Text>
            <Pressable
              onPress={() => router.push("/(root)/settings" as any)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              className="h-11 w-11 items-center justify-center rounded-full border border-border bg-card"
            >
              <Ionicons name="settings-outline" size={22} className="text-foreground" />
            </Pressable>
          </View>

          {profile && user ? (
            <ProfileCard username={user.username} profile={profile} />
          ) : (
            <View className="rounded-3xl border border-border bg-card p-5">
              <Text className="font-display text-lg text-foreground">
                {user?.username ?? "Your profile"}
              </Text>
              <Text className="mt-1 font-body text-sm text-muted-foreground">
                Your health profile is not available right now.
              </Text>
            </View>
          )}

          <SectionTitle>Your progress</SectionTitle>
          <GamificationSection />

          {profile && (
            <>
              <SectionTitle>Your plan</SectionTitle>
              <View className="rounded-3xl border border-border bg-card px-5 py-1">
                <PlanRow
                  label="Activity"
                  value={ACTIVITY_LABELS[profile.activityLevel] ?? titleCase(profile.activityLevel)}
                  divider
                />
                <PlanRow label="Diet" value={titleCase(profile.dietaryRestriction)} divider />
                <PlanRow label="Health" value={health} />
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
