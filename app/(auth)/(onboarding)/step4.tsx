import { BmiCard } from "@/components/onboarding/BmiCard";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { WeightRuler } from "@/components/onboarding/WeightRuler";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { WEIGHT_UNIT_OPTIONS } from "@/constants/onboarding";
import type { WeightUnit } from "@/lib/body";
import { useUserProfileStore } from "@/store/userProfile";
import React, { useState } from "react";
import { View } from "react-native";

export default function Step4() {
  const currentWeightKg = useUserProfileStore((s) => s.currentWeightKg);
  const heightCm = useUserProfileStore((s) => s.heightCm);
  const setCurrentWeightKg = useUserProfileStore((s) => s.setCurrentWeightKg);
  const [unit, setUnit] = useState<WeightUnit>("kg");

  return (
    <OnboardingScreen
      step={4}
      title="What's your current weight?"
      subtitle="An estimate is fine. You can update it any time."
      scrollable={false}
    >
      <View className="flex-1 justify-center gap-8">
        <SegmentedControl options={WEIGHT_UNIT_OPTIONS} value={unit} onChange={setUnit} />
        <WeightRuler unit={unit} valueKg={currentWeightKg} onChangeKg={setCurrentWeightKg} />
        <BmiCard weightKg={currentWeightKg} heightCm={heightCm} />
      </View>
    </OnboardingScreen>
  );
}
