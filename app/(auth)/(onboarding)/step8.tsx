import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { dietaryLimitations } from "@/constants/data";
import { useUserProfileStore } from "@/store/userProfile";
import React from "react";
import { View } from "react-native";

export default function Step8() {
  const dietaryRestriction = useUserProfileStore((s) => s.dietaryRestriction);
  const setDietaryRestriction = useUserProfileStore((s) => s.setDietaryRestriction);

  return (
    <OnboardingScreen
      step={8}
      title="How do you like to eat?"
      subtitle="We'll only suggest meals that fit your diet."
    >
      <View accessibilityRole="radiogroup">
        {dietaryLimitations.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.name}
            icon={option.icon}
            selected={dietaryRestriction === option.value}
            onPress={() => setDietaryRestriction(option.value)}
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}
