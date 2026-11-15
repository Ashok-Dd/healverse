import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import { Button } from "@/components/ui/Button";
import { ONBOARDING_TOTAL_STEPS, onboardingPath } from "@/constants/onboarding";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StepProgress } from "./StepProgress";

interface OnboardingScreenProps {
  /** 1-based position in the flow. */
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Disable "Continue" until the step's data is valid. */
  canContinue?: boolean;
  /**
   * Runs when "Continue" is pressed. Return `false` to stay on the step (e.g. validation failed).
   * By default the next step opens; the last step must navigate itself.
   */
  onContinue?: () => boolean | void;
  continueLabel?: string;
  /** Set false for steps whose content manages its own height (pickers, rulers). */
  scrollable?: boolean;
}

export function OnboardingScreen({
  step,
  title,
  subtitle,
  children,
  canContinue = true,
  onContinue,
  continueLabel = "Continue",
  scrollable = true,
}: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardInset({ bottomOffset: insets.bottom });
  const isLast = step === ONBOARDING_TOTAL_STEPS;

  const handleContinue = () => {
    if (onContinue?.() === false) return;
    if (!isLast) router.push(onboardingPath(step + 1) as any);
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/welcome" as any);
  };

  const heading = (
    <View className="mb-6">
      <Text accessibilityRole="header" className="font-display-bold text-3xl text-foreground">
        {title}
      </Text>
      {subtitle && (
        <Text className="mt-2 font-body text-base text-muted-foreground">{subtitle}</Text>
      )}
    </View>
  );

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView className="flex-1 bg-background">
        <Animated.View ref={keyboard.ref} style={keyboard.style}>
          <View className="flex-row items-center gap-4 px-6 pb-2 pt-3">
            <Pressable
              onPress={handleBack}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-11 w-11 items-center justify-center rounded-full border border-border bg-card"
            >
              <Ionicons name="chevron-back" size={22} className="text-foreground" />
            </Pressable>
            <StepProgress step={step} total={ONBOARDING_TOTAL_STEPS} />
          </View>

          {scrollable ? (
            <ScrollView
              className="flex-1"
              contentContainerClassName="flex-grow px-6 pb-4 pt-6"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {heading}
              {children}
            </ScrollView>
          ) : (
            <View className="flex-1 px-6 pb-4 pt-6">
              {heading}
              <View className="flex-1">{children}</View>
            </View>
          )}

          <View className="px-6 pb-4 pt-2">
            <Button
              title={continueLabel}
              onPress={handleContinue}
              disabled={!canContinue}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </>
  );
}
