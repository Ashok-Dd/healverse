import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { Input } from "@/components/ui/Input";
import { healthConditions } from "@/constants/data";
import { useUserProfileStore } from "@/store/userProfile";
import React from "react";
import { View } from "react-native";

export default function Step9() {
  const healthCondition = useUserProfileStore((s) => s.healthCondition);
  const note = useUserProfileStore((s) => s.otherHealthConditionDescription ?? "");
  const setHealthCondition = useUserProfileStore((s) => s.setHealthCondition);
  const setNote = useUserProfileStore((s) => s.setOtherHealthConditionDescription);

  const isOther = healthCondition === "OTHER";

  return (
    <OnboardingScreen
      step={9}
      title="Any health conditions?"
      subtitle="This helps us avoid foods that don't suit you."
      canContinue={!isOther || note.trim().length >= 3}
    >
      <View accessibilityRole="radiogroup">
        {healthConditions.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.name}
            description={option.info ?? undefined}
            icon={option.icon}
            selected={healthCondition === option.value}
            onPress={() => setHealthCondition(option.value)}
          />
        ))}
      </View>

      {isOther && (
        <Input
          label="Tell us about it"
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Celiac disease"
          maxLength={120}
          autoCapitalize="sentences"
          returnKeyType="done"
          containerClassName="mt-2"
        />
      )}
    </OnboardingScreen>
  );
}
