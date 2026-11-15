import { colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

interface IconButtonProps {
  iconName: FeatherName;
  label: string;
  /** Label shown while `loading`. */
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "soft" | "accent";
  onPress: () => void;
}

const variants = {
  soft: { container: "bg-secondary", text: "text-secondary-foreground", icon: colors.foreground },
  accent: { container: "bg-accent", text: "text-accent-foreground", icon: colors.accentForeground },
};

/** Compact pill action with an icon, used inside cards and section headers. */
const IconButton = ({
  iconName,
  label,
  loadingLabel = "Working...",
  loading = false,
  disabled = false,
  variant = "soft",
  onPress,
}: IconButtonProps) => {
  const v = variants[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`min-h-[44px] flex-row items-center justify-center gap-2 rounded-full px-4 active:opacity-80 ${v.container} ${
        isDisabled ? "opacity-60" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.icon} />
      ) : (
        <Feather name={iconName} size={16} color={v.icon} />
      )}
      <Text className={`font-body-semibold text-sm ${v.text}`}>
        {loading ? loadingLabel : label}
      </Text>
    </Pressable>
  );
};

export default IconButton;
