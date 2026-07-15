import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

interface ButtonProps extends Omit<TouchableOpacityProps, "children"> {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "gray";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode; // Right icon
  leftIcon?: React.ReactNode; // Left icon
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-2",
  md: "px-4 py-4",
  lg: "px-6 py-5",
};

const sizeTextClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary-600",
  secondary: "bg-secondary-100",
  outline: "bg-transparent border-2 border-primary-600",
  danger: "bg-red-500",
  gray: "bg-white border border-gray-300",
};

const variantTextClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "text-white",
  secondary: "text-secondary-800",
  outline: "text-primary-600",
  danger: "text-white",
  gray: "text-gray-600",
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  leftIcon,
  fullWidth = false,
  disabled,
  className = "",
  textClassName = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center rounded-xl ${sizeClasses[size]} ${
        variantClasses[variant]
      } ${fullWidth ? "flex-1" : ""} ${isDisabled ? "opacity-60" : ""} ${className}`}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "danger" ? "#ffffff" : "#16a34a"}
          style={{ marginRight: 8 }}
        />
      )}
      {leftIcon && !loading && <View style={{ marginRight: 4 }}>{leftIcon}</View>}
      <Text
        className={`font-jakarta-semi-bold ${sizeTextClasses[size]} ${
          variantTextClasses[variant]
        } text-center ${textClassName}`}
      >
        {title}
      </Text>
      {icon && !loading && <View style={{ marginLeft: 4 }}>{icon}</View>}
    </TouchableOpacity>
  );
}
