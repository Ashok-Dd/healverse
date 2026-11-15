import { BmiCard } from "@/components/onboarding/BmiCard";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { WeightRuler } from "@/components/onboarding/WeightRuler";
import { FormError } from "@/components/ui/FormError";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import {
  PACE_OPTIONS,
  WEIGHT_GAIN_GOALS,
  WEIGHT_LOSS_GOALS,
  WEIGHT_UNIT_OPTIONS,
} from "@/constants/onboarding";
import { calculateBmi, type WeightUnit } from "@/lib/body";
import { useUserProfileStore } from "@/store/userProfile";
import React, { useState } from "react";
import { Text, View } from "react-native";

export default function Step6() {
  const currentWeightKg = useUserProfileStore((s) => s.currentWeightKg);
  const targetWeightKg = useUserProfileStore((s) => s.targetWeightKg);
  const heightCm = useUserProfileStore((s) => s.heightCm);
  const goal = useUserProfileStore((s) => s.goal);
  const pace = useUserProfileStore((s) => s.weightLossSpeed);
  const setTargetWeightKg = useUserProfileStore((s) => s.setTargetWeightKg);
  const setPace = useUserProfileStore((s) => s.setWeightLossSpeed);
  const [unit, setUnit] = useState<WeightUnit>("kg");

  const diffKg = Math.round((targetWeightKg - currentWeightKg) * 10) / 10;
  const wantsLoss = WEIGHT_LOSS_GOALS.includes(goal);
  const wantsGain = WEIGHT_GAIN_GOALS.includes(goal);

  // The target has to agree with the goal picked on the previous step.
  const mismatch =
    wantsLoss && diffKg >= 0
      ? `You chose to lose weight, so pick a target below your current ${currentWeightKg} kg.`
      : wantsGain && diffKg <= 0
        ? `You chose to gain weight, so pick a target above your current ${currentWeightKg} kg.`
        : null;

  const targetBmi = calculateBmi(targetWeightKg, heightCm);
  const lowTarget = !mismatch && targetBmi < 18.5;

  const showPace = (wantsLoss || wantsGain) && !mismatch;
  const selectedPace = PACE_OPTIONS.find((p) => p.value === pace) ?? PACE_OPTIONS[1];
  const weeks = Math.max(1, Math.round(Math.abs(diffKg) / selectedPace.kgPerWeek));

  return (
    <OnboardingScreen
      step={6}
      title="What's your target weight?"
      subtitle="Pick a weight you'd be happy to reach."
      canContinue={!mismatch}
    >
      <View className="gap-6">
        <SegmentedControl options={WEIGHT_UNIT_OPTIONS} value={unit} onChange={setUnit} />
        <WeightRuler unit={unit} valueKg={targetWeightKg} onChangeKg={setTargetWeightKg} />

        <View>
          <FormError message={mismatch} />
          <FormError
            tone="warning"
            message={lowTarget ? "This target is below the healthy range for your height." : null}
          />
          <BmiCard weightKg={targetWeightKg} heightCm={heightCm} showRange />
        </View>

        {showPace && (
          <View>
            <Text className="mb-2 font-body-semibold text-sm text-secondary-foreground">
              How fast do you want to get there?
            </Text>
            <SegmentedControl
              options={PACE_OPTIONS.map(({ value, label }) => ({ value, label }))}
              value={selectedPace.value}
              onChange={setPace}
            />
            <Text className="mt-2 font-body text-sm text-muted-foreground">
              About {selectedPace.kgPerWeek} kg a week, so roughly {weeks}{" "}
              {weeks === 1 ? "week" : "weeks"}.
            </Text>
          </View>
        )}
      </View>
    </OnboardingScreen>
  );
}
