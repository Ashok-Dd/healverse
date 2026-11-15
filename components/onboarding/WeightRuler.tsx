import { kgToLbs, lbsToKg, type WeightUnit } from "@/lib/body";
import React, { useCallback, useMemo } from "react";
import { RulerInput } from "./RulerInput";

interface WeightRulerProps {
  unit: WeightUnit;
  /** Current value in kg. Only read when the ruler mounts or the unit changes. */
  valueKg: number;
  /** Always reports kg, whatever unit the ruler displays. */
  onChangeKg: (kg: number) => void;
}

const KG = { min: 30, max: 250, step: 0.1 } as const;
const LBS = { min: 66, max: 550, step: 1 } as const;

/** Weight ruler that shows kg or lbs but speaks kg to its parent. */
export function WeightRuler({ unit, valueKg, onChangeKg }: WeightRulerProps) {
  const initialValue = useMemo(
    () => (unit === "kg" ? valueKg : kgToLbs(valueKg)),
    // Deliberately not tracking valueKg: it changes on every scroll tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unit]
  );

  const handleChange = useCallback(
    (value: number) => onChangeKg(unit === "kg" ? Math.round(value * 10) / 10 : lbsToKg(value)),
    [unit, onChangeKg]
  );

  const format = useCallback(
    (value: number) => (unit === "kg" ? `${value.toFixed(1)} kg` : `${Math.round(value)} lbs`),
    [unit]
  );

  const range = unit === "kg" ? KG : LBS;

  return (
    <RulerInput
      key={unit}
      min={range.min}
      max={range.max}
      step={range.step}
      fractionDigits={unit === "kg" ? 1 : 0}
      initialValue={initialValue}
      format={format}
      onChange={handleChange}
    />
  );
}
