import { useThemeColors } from "@/constants/theme";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { Ruler } from "./Ruler";

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

  const handleChange = useCallback((value: number) => {
    setLive(value);
    onChangeRef.current(value);
  }, []);

  // The ruler is memoised so the readout re-rendering on every tick does not re-render it.
  const ruler = useMemo(
    () => (
      <Ruler
        width={width - SCREEN_PADDING}
        height={RULER_HEIGHT}
        min={min}
        max={max}
        step={step}
        initialValue={initialValue}
        fractionDigits={fractionDigits}
        shortTickColor={colors.border}
        longTickColor={colors.mutedForeground}
        indicatorColor={colors.primary}
        onChange={handleChange}
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
      {ruler}
    </View>
  );
}
