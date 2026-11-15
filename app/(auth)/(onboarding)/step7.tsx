import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { BOY_OPTIONS, GIRL_OPTIONS } from "@/constants/data";
import { useUserProfileStore } from "@/store/userProfile";
import React from "react";
import { View } from "react-native";

export default function Step7() {
  const gender = useUserProfileStore((s) => s.gender);
  const activityLevel = useUserProfileStore((s) => s.activityLevel);
  const setActivityLevel = useUserProfileStore((s) => s.setActivityLevel);

  const options = gender === "FEMALE" ? GIRL_OPTIONS : BOY_OPTIONS;

  return (
    <OnboardingScreen
      step={7}
      title="How active are you?"
      subtitle="Think about a typical week, including work and exercise."
    >
      <View accessibilityRole="radiogroup">
        {options.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.label}
            icon={option.icon}
            image={option.image}
            selected={activityLevel === option.value}
            onPress={() => setActivityLevel(option.value)}
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}
