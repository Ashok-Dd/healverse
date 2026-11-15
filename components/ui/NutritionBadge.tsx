import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { Text, View } from "react-native";

interface NutrientBadgeProps {
  iconType?: "Entypo" | "MaterialCommunityIcons";
  iconName: ComponentProps<typeof Entypo>["name"] | ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconColor: string;
  value: number;
  unit: string;
  /** Tailwind text colour class for the value, e.g. `text-info`. */
  textColor: string;
}

/** Small pill showing one nutrient value with its icon. */
const NutrientBadge = ({
  iconType = "MaterialCommunityIcons",
  iconName,
  iconColor,
  value,
  unit,
  textColor,
}: NutrientBadgeProps) => {
  const Icon = iconType === "Entypo" ? Entypo : MaterialCommunityIcons;

  return (
    <View className="flex-row items-center gap-1 rounded-full bg-muted px-2 py-1">
      <Icon name={iconName as any} color={iconColor} size={12} />
      <Text className={`font-body-semibold text-xs ${textColor}`}>
        {value}
        {unit}
      </Text>
    </View>
  );
};

export default React.memo(NutrientBadge);
