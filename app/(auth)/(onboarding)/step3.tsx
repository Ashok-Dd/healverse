import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { RulerInput } from "@/components/onboarding/RulerInput";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { HEIGHT_UNIT_OPTIONS } from "@/constants/onboarding";
import { cmToInches, formatFeetInches, inchesToCm, type HeightUnit } from "@/lib/body";
import { useUserProfileStore } from "@/store/userProfile";
import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";

export default function Step3() {
  const setHeightCm = useUserProfileStore((s) => s.setHeightCm);
  const [unit, setUnit] = useState<HeightUnit>("cm");

  // Read once per unit switch: the ruler only uses it when it (re)mounts.
  const initialValue = useMemo(() => {
    const cm = useUserProfileStore.getState().heightCm;
    return unit === "cm" ? cm : cmToInches(cm);
  }, [unit]);

  // The ft/in ruler works in whole inches; the store always holds centimetres.
  const handleChange = useCallback(
    (value: number) => setHeightCm(unit === "cm" ? value : inchesToCm(value)),
    [unit, setHeightCm]
  );

  const format = useCallback(
    (value: number) => (unit === "cm" ? `${Math.round(value)} cm` : formatFeetInches(inchesToCm(value))),
    [unit]
  );

  return (
    <OnboardingScreen
      step={3}
      title="How tall are you?"
      subtitle="Scroll the ruler to set your height."
      scrollable={false}
    >
      <View className="flex-1 justify-center gap-10">
        <SegmentedControl options={HEIGHT_UNIT_OPTIONS} value={unit} onChange={setUnit} />
        <RulerInput
          key={unit}
          min={unit === "cm" ? 100 : 40}
          max={unit === "cm" ? 250 : 100}
          step={1}
          initialValue={initialValue}
          format={format}
          onChange={handleChange}
        />
      </View>
    </OnboardingScreen>
  );
}
