import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { WheelPicker } from "@/components/onboarding/WheelPicker";
import { useUserProfileStore } from "@/store/userProfile";
import React from "react";
import { Text, View } from "react-native";

const MIN_AGE = 13;
const MAX_AGE = 100;
const AGES = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i);

export default function Step2() {
  const age = useUserProfileStore((s) => s.age);
  const setAge = useUserProfileStore((s) => s.setAge);

  return (
    <OnboardingScreen
      step={2}
      title="How old are you?"
      subtitle="Age changes how many calories you burn at rest."
      scrollable={false}
    >
      <View className="flex-1 items-center justify-center">
        <WheelPicker data={AGES} value={age} onChange={setAge} />
        <Text className="mt-6 font-body-semibold text-base text-muted-foreground">
          {age} years old
        </Text>
      </View>
    </OnboardingScreen>
  );
}
