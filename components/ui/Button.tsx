// src/components/ui/Button.tsx
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "teal" | "gray";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode; // Right icon
  leftIcon?: React.ReactNode; // Left icon
  fullWidth?: boolean;
  className?: string; // For additional Tailwind-like styling
}

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  leftIcon,
  fullWidth = false,
  disabled,
  style,
  className,
  ...props
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16, // rounded-2xl equivalent
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16, // py-4 equivalent
      paddingHorizontal: 16,
      opacity: disabled || loading ? 0.6 : 1,
    };

    const sizeStyles = {
      sm: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 36 },
      md: { paddingVertical: 16, paddingHorizontal: 16, minHeight: 44 }, // py-4
      lg: { paddingVertical: 20, paddingHorizontal: 24, minHeight: 52 },
    };

    if (fullWidth) {
      baseStyle.flex = 1; // flex-1 equivalent
    }

    return { ...baseStyle, ...sizeStyles[size] };
  };

  const getBackgroundStyle = (): ViewStyle => {
    const variantStyles = {
      primary: { backgroundColor: "#4CAF50" },
      secondary: { backgroundColor: "#2196F3" },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#4CAF50",
      },
      danger: { backgroundColor: "#F44336" },
      teal: { backgroundColor: disabled || loading ? "#D1D5DB" : "#14B8A6" }, // bg-teal-500 or bg-gray-300
      gray: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D1D5DB",
      },
    };

    return variantStyles[variant] || variantStyles.primary;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: "600", // font-semibold
      textAlign: "center",
    };

    const sizeStyles = {
      sm: { fontSize: 14 },
      md: { fontSize: 16 },
      lg: { fontSize: 18 },
    };

    const getTextColor = () => {
      if (variant === "teal") {
        return disabled || loading ? "#6B7280" : "#FFFFFF"; // text-gray-500 or text-white
      }
      if (variant === "gray") {
        return "#4B5563"; // text-gray-600
      }
      if (variant === "outline") {
        return "#4CAF50";
      }
      return "#FFFFFF";
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      color: getTextColor(),
    };
  };

  const getIconColor = () => {
    if (variant === "teal") {
      return disabled || loading ? "#6B7280" : "#FFFFFF";
    }
    if (variant === "gray") {
      return "#6B7280";
    }
    if (variant === "outline") {
      return "#4CAF50";
    }
    return "#FFFFFF";
  };

  const renderContent = () => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={getIconColor()}
          style={{ marginRight: 8 }}
        />
      )}
      {leftIcon && !loading && (
        <View style={{ marginRight: 4 }}>{leftIcon}</View>
      )}
      <Text style={getTextStyle()}>{title}</Text>
      {icon && !loading && <View style={{ marginLeft: 4 }}>{icon}</View>}
    </View>
  );

  const buttonStyle = [getButtonStyle(), getBackgroundStyle(), style];

  // For gradient variants (primary and secondary)
  if (variant === "primary") {
    return (
      <LinearGradient
        colors={["#4CAF50", "#45A049"]}
        style={buttonStyle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 0, // Remove padding since gradient handles it
            paddingHorizontal: 0,
          }}
          disabled={disabled || loading}
          activeOpacity={0.8}
          {...props}
        >
          {renderContent()}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (variant === "secondary") {
    return (
      <LinearGradient
        colors={["#2196F3", "#1976D2"]}
        style={buttonStyle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 0,
            paddingHorizontal: 0,
          }}
          disabled={disabled || loading}
          activeOpacity={0.8}
          {...props}
        >
          {renderContent()}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // For non-gradient variants
  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
