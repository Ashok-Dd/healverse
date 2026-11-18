import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { ACTIVITY_LABELS } from "@/constants/onboarding";
import { useThemeColors } from "@/constants/theme";
import { useLocation, type RegionData } from "@/hooks/useLocation";
import { formatFeetInches } from "@/lib/body";
import { getDeviceTimeZone } from "@/lib/timeZone";
import { useAuthStore } from "@/store/authStore";
import { useUserProfileStore } from "@/store/userProfile";
import type { ApiError } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const titleCase = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

const formatAddress = (region: RegionData | null) =>
  region
    ? [region.street, region.name, region.city, region.region, region.postalCode, region.country]
        .filter(Boolean)
        .join(", ")
    : "";

/** Flattens the server's per-field 400 errors into readable lines. */
const fieldErrorLines = (errors?: Record<string, string[]>) =>
  errors ? Object.values(errors).flat() : undefined;

const Row = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row items-center justify-between gap-4 border-b border-border py-3">
    <Text className="font-body text-base text-muted-foreground">{label}</Text>
    <Text className="flex-1 text-right font-body-semibold text-base text-foreground">{value}</Text>
  </View>
);

export default function Register() {
  const colors = useThemeColors();
  const profile = useUserProfileStore();
  const clearProfile = useUserProfileStore((s) => s.clearProfile);
  const register = useAuthStore((s) => s.register);
  const isSubmitting = useAuthStore((s) => s.isLoading);
  const { region, isLoading: locating, error: locationError, getLocation } = useLocation();

  const [formError, setFormError] = useState<{ message: string; details?: string[] } | null>(null);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleSubmit = async () => {
    setFormError(null);
    const address = formatAddress(region);
    const timeZone = getDeviceTimeZone();

    try {
      await register({
        user: { username: profile.username, password: profile.password },
        profile: {
          gender: profile.gender,
          age: profile.age,
          heightCm: profile.heightCm,
          currentWeightKg: profile.currentWeightKg,
          targetWeightKg: profile.targetWeightKg,
          activityLevel: profile.activityLevel,
          goal: profile.goal,
          weightLossSpeed: profile.weightLossSpeed,
          dietaryRestriction: profile.dietaryRestriction,
          healthCondition: profile.healthCondition,
          otherHealthConditionDescription: profile.otherHealthConditionDescription,
          ...(address ? { address } : {}),
        },
        ...(timeZone ? { timeZone } : {}),
      });

      // The password must not linger in memory once the account exists.
      clearProfile();
      router.replace("/(root)/(tabs)/tracker" as any);
    } catch (e) {
      const apiError = e as Partial<ApiError>;
      setFormError({
        message: apiError.message || "We couldn't create your account. Please try again.",
        details: fieldErrorLines(apiError.errors),
      });
    }
  };

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 pb-6 pt-3"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-11 w-11 items-center justify-center rounded-full border border-border bg-card"
          >
            <Ionicons name="chevron-back" size={22} className="text-foreground" />
          </Pressable>

          <Text
            accessibilityRole="header"
            className="mt-6 font-display-bold text-3xl text-foreground"
          >
            Looks good, {profile.username}?
          </Text>
          <Text className="mb-6 mt-2 font-body text-base text-muted-foreground">
            Check your details, then create your account.
          </Text>

          <View className="rounded-3xl border border-border bg-card px-5 py-1">
            <Row label="Gender" value={titleCase(profile.gender)} />
            <Row label="Age" value={`${profile.age} years`} />
            <Row
              label="Height"
              value={`${profile.heightCm} cm (${formatFeetInches(profile.heightCm)})`}
            />
            <Row label="Current weight" value={`${profile.currentWeightKg} kg`} />
            <Row label="Target weight" value={`${profile.targetWeightKg} kg`} />
            <Row label="Goal" value={titleCase(profile.goal)} />
            <Row label="Activity" value={ACTIVITY_LABELS[profile.activityLevel]} />
            <Row label="Diet" value={titleCase(profile.dietaryRestriction)} />
            <Row
              label="Health"
              value={
                profile.healthCondition === "OTHER" && profile.otherHealthConditionDescription
                  ? profile.otherHealthConditionDescription
                  : titleCase(profile.healthCondition)
              }
            />
          </View>

          <View className="mt-4 rounded-3xl border border-border bg-card px-5 py-4">
            <Text className="font-body-semibold text-sm text-secondary-foreground">
              Location (optional)
            </Text>
            {locating ? (
              <View className="mt-2 flex-row items-center gap-3">
                <ActivityIndicator size="small" color={colors.ring} />
                <Text className="font-body text-base text-muted-foreground">
                  Finding your location...
                </Text>
              </View>
            ) : region ? (
              <Text className="mt-1 font-body text-base text-foreground">
                {formatAddress(region)}
              </Text>
            ) : (
              <View className="mt-1">
                <Text className="font-body text-base text-muted-foreground">
                  {locationError ?? "No location found."} You can still continue without it.
                </Text>
                <Button
                  title="Try again"
                  variant="soft"
                  size="sm"
                  onPress={getLocation}
                  className="mt-3 self-start"
                />
              </View>
            )}
          </View>

          <View className="mt-6">
            <FormError message={formError?.message} details={formError?.details} />
            <Button
              title={isSubmitting ? "Creating account..." : "Create account"}
              onPress={handleSubmit}
              loading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
