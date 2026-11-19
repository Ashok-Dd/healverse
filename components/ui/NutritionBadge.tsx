import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { Text, View } from "react-native";

type Tone = "destructive" | "info" | "warning" | "success";

const TONES: Record<Tone, { icon: string; text: string }> = {
  destructive: { icon: "text-destructive", text: "text-destructive" },
  info: { icon: "text-info", text: "text-info" },
  warning: { icon: "text-warning", text: "text-warning" },
  success: { icon: "text-success", text: "text-success" },
};

interface NutrientBadgeProps {
  iconType?: "Entypo" | "MaterialCommunityIcons";
  iconName: ComponentProps<typeof Entypo>["name"] | ComponentProps<typeof MaterialCommunityIcons>["name"];
  value: number;
  unit: string;
  tone: Tone;
}

/** Small pill showing one nutrient value with its icon. */
const NutrientBadge = ({
  iconType = "MaterialCommunityIcons",
  iconName,
  value,
  unit,
  tone,
}: NutrientBadgeProps) => {
  const Icon = iconType === "Entypo" ? Entypo : MaterialCommunityIcons;
  const t = TONES[tone];

  return (
    <View className="flex-row items-center gap-1 rounded-full border border-border bg-card px-2 py-1">
      <Icon name={iconName as any} className={t.icon} size={12} />
      <Text className={`font-body-semibold text-xs ${t.text}`}>
        {value}
        {unit}
      </Text>
    </View>
  );
};

export default React.memo(NutrientBadge);
