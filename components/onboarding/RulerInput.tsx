import { useThemeColors } from "@/constants/theme";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { RulerPicker } from "react-native-ruler-picker";

const RULER_HEIGHT = 120;
const SCREEN_PADDING = 48; // px-6 on each side

interface RulerInputProps {
  min: number;
  max: number;
  step: number;
  /** Read once on mount. To start from another value (e.g. after a unit switch) change `key`. */
  initialValue: number;
  fractionDigits?: number;
  /** Text shown in the big readout, e.g. `${v} kg`. */
  format: (value: number) => string;
  /** Called on every scroll tick. Keep it cheap (a store setter is fine). */
  onChange: (value: number) => void;
}

/** Horizontal ruler with a large formatted readout above it. */
export function RulerInput({
  min,
  max,
  step,
  initialValue,
  fractionDigits = 0,
  format,
  onChange,
}: RulerInputProps) {
  const { width } = useWindowDimensions();
  const colors = useThemeColors();
  const [live, setLive] = useState(initialValue);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleChange = useCallback((raw: string) => {
    const value = parseFloat(raw);
    if (Number.isNaN(value)) return;
    setLive(value);
    onChangeRef.current(value);
  }, []);

  // The ruler is memoised so the readout re-rendering on every tick does not re-render it.
  const ruler = useMemo(
    () => (
      <RulerPicker
        width={width - SCREEN_PADDING}
        height={RULER_HEIGHT}
        min={min}
        max={max}
        step={step}
        // Nudged up by a hair: the library floors (initial - min) / step, which float
        // rounding can leave one tick short (64.9 instead of 65.0).
        initialValue={initialValue + step * 0.01}
        fractionDigits={fractionDigits}
        unit=""
        indicatorHeight={56}
        indicatorColor={colors.primary}
        shortStepHeight={14}
        longStepHeight={28}
        stepWidth={2}
        gapBetweenSteps={8}
        shortStepColor={colors.border}
        longStepColor={colors.mutedForeground}
        // The built-in readout cannot format 5' 9", so it is hidden and replaced by ours.
        valueTextStyle={{ fontSize: 1, color: "transparent" }}
        decelerationRate="fast"
        onValueChange={handleChange}
        onValueChangeEnd={handleChange}
      />
    ),
    // initialValue is intentionally read once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, colors, min, max, step, fractionDigits, handleChange]
  );

  return (
    <View className="items-center">
      <Text
        accessibilityLiveRegion="polite"
        className="mb-6 font-display-bold text-6xl text-foreground"
      >
        {format(live)}
      </Text>
      <View style={{ height: RULER_HEIGHT }}>{ruler}</View>
    </View>
  );
}
