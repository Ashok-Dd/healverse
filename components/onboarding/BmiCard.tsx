import { bmiCategory, calculateBmi, healthyWeightRangeKg, type BmiCategory } from "@/lib/body";
import React from "react";
import { Text, View } from "react-native";

const BMI_MIN = 15;
const BMI_MAX = 40;

const CATEGORY: Record<BmiCategory, { label: string; text: string; chip: string }> = {
  underweight: { label: "Underweight", text: "text-info", chip: "bg-info/10" },
  normal: { label: "Healthy", text: "text-success", chip: "bg-success/10" },
  overweight: { label: "Overweight", text: "text-warning", chip: "bg-warning/10" },
  obese: { label: "Obese", text: "text-destructive", chip: "bg-destructive/10" },
};

interface BmiCardProps {
  weightKg: number;
  heightCm: number;
  /** Shown under the bar, e.g. a healthy range hint. */
  showRange?: boolean;
}

/** BMI readout with a four-band scale and a marker. */
export function BmiCard({ weightKg, heightCm, showRange = false }: BmiCardProps) {
  const bmi = calculateBmi(weightKg, heightCm);
  const category = CATEGORY[bmiCategory(bmi)];
  const position = Math.min(1, Math.max(0, (bmi - BMI_MIN) / (BMI_MAX - BMI_MIN))) * 100;
  const range = healthyWeightRangeKg(heightCm);

  return (
    <View
      accessible
      accessibilityLabel={`BMI ${bmi.toFixed(1)}, ${category.label}`}
      className="rounded-2xl border border-border bg-card p-4"
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="font-body-semibold text-sm text-muted-foreground">BMI</Text>
          <Text className="font-display-bold text-3xl text-foreground">{bmi.toFixed(1)}</Text>
        </View>
        <View className={`rounded-full px-3 py-1 ${category.chip}`}>
          <Text className={`font-body-semibold text-sm ${category.text}`}>{category.label}</Text>
        </View>
      </View>

      <View className="mt-4 h-2 flex-row overflow-hidden rounded-full">
        <View className="bg-info" style={{ flex: 3.5 }} />
        <View className="bg-success" style={{ flex: 6.5 }} />
        <View className="bg-warning" style={{ flex: 5 }} />
        <View className="bg-destructive" style={{ flex: 10 }} />
      </View>
      <View className="relative h-3">
        <View
          className="absolute -top-2.5 h-3 w-3 rounded-full border-2 border-card bg-foreground"
          style={{ left: `${position}%`, marginLeft: -6 }}
        />
      </View>

      {showRange && (
        <Text className="mt-2 font-body text-sm text-muted-foreground">
          A healthy weight for your height is {range.min}-{range.max} kg.
        </Text>
      )}
    </View>
  );
}
