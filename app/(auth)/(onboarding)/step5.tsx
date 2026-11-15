import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { DIET_BOY_OPTIONS, DIET_GIRL_OPTIONS } from "@/constants/data";
import { useUserProfileStore } from "@/store/userProfile";
import React from "react";
import { View } from "react-native";

export default function Step5() {
  const gender = useUserProfileStore((s) => s.gender);
  const goal = useUserProfileStore((s) => s.goal);
  const setGoal = useUserProfileStore((s) => s.setGoal);

  const options = gender === "FEMALE" ? DIET_GIRL_OPTIONS : DIET_BOY_OPTIONS;

  return (
    <OnboardingScreen
      step={5}
      title="What's your main goal?"
      subtitle="Your meal plans are built around this."
    >
      <View accessibilityRole="radiogroup">
        {options.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.label}
            icon={option.icon}
            image={option.image}
            selected={goal === option.value}
            onPress={() => setGoal(option.value)}
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}
