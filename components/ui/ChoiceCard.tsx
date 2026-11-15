import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Image, ImageSourcePropType, Pressable, Text, View } from "react-native";

interface ChoiceCardProps {
  label: string;
  description?: string;
  /** Emoji or short glyph shown in a tinted tile. */
  icon?: string;
  /** Illustration shown on the right. */
  image?: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
}

/** Single-select option (radio semantics). */
export const ChoiceCard = memo(function ChoiceCard({
  label,
  description,
  icon,
  image,
  selected,
  onPress,
}: ChoiceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={description ? `${label}. ${description}` : label}
      className={`mb-3 min-h-[64px] flex-row items-center gap-3 rounded-2xl border-2 px-4 py-3 active:opacity-80 ${
        selected ? "border-primary bg-primary/5" : "border-border bg-card"
      }`}
    >
      {icon ? (
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-secondary">
          <Text className="text-2xl" importantForAccessibility="no">
            {icon}
          </Text>
        </View>
      ) : null}

      <View className="flex-1">
        <Text className="font-display text-base text-foreground">{label}</Text>
        {description ? (
          <Text className="mt-0.5 font-body text-sm text-muted-foreground">{description}</Text>
        ) : null}
      </View>

      {image ? (
        <Image source={image} className="h-20 w-20" resizeMode="contain" accessible={false} />
      ) : null}

      <Ionicons
        name={selected ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={selected ? colors.primary : colors.border}
      />
    </Pressable>
  );
});
