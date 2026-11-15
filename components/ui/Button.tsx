import { useThemeColors, type ThemeColors } from "@/constants/theme";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

type Variant = "default" | "soft" | "outline" | "ghost" | "destructive";
type Size = "default" | "sm";

interface ButtonProps extends Omit<TouchableOpacityProps, "children"> {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  /** Icon shown before the label. */
  leftIcon?: React.ReactNode;
  /** Icon shown after the label. */
  rightIcon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

const base = "flex-row items-center justify-center rounded-full";

const sizes: Record<Size, string> = {
  default: "min-h-[56px] px-6",
  sm: "min-h-[44px] px-5",
};

const variants: Record<Variant, { container: string; text: string; spinner: keyof ThemeColors }> = {
  default: {
    container: "bg-primary",
    text: "font-display text-primary-foreground",
    spinner: "primaryForeground",
  },
  soft: {
    container: "bg-secondary",
    text: "font-display text-secondary-foreground",
    spinner: "foreground",
  },
  outline: {
    container: "border border-border bg-card",
    text: "font-display text-foreground",
    spinner: "foreground",
  },
  ghost: {
    container: "bg-transparent",
    text: "font-body-semibold text-secondary-foreground",
    spinner: "foreground",
  },
  destructive: {
    container: "bg-destructive",
    text: "font-display text-destructive-foreground",
    spinner: "primaryForeground",
  },
};

const textSizes: Record<Size, string> = {
  default: "text-lg",
  sm: "text-base",
};

export function Button({
  title,
  variant = "default",
  size = "default",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  textClassName = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const v = variants[variant];
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      className={`${base} ${sizes[size]} ${v.container} ${isDisabled ? "opacity-50" : ""} ${className}`}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      {...props}
    >
      {loading && (
        <ActivityIndicator size="small" color={colors[v.spinner]} style={{ marginRight: 8 }} />
      )}
      {leftIcon && !loading && <View className="mr-2">{leftIcon}</View>}
      <Text className={`${textSizes[size]} text-center ${v.text} ${textClassName}`}>
        {title}
      </Text>
      {rightIcon && !loading && <View className="ml-2">{rightIcon}</View>}
    </TouchableOpacity>
  );
}
