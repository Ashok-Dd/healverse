import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ContinueButtonProps {
  onPress?: () => void;
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  className?: string;
}

export default function Button({
  onPress,
  title = "Continue",
  disabled = false,
  loading = false,
  icon = "arrow-forward",
  className = "",
}: ContinueButtonProps) {
  const baseStyle = `
    flex w-full justify-center items-center 
    px-6 py-4 rounded-xl min-h-[56px] 
    flex-row
  `;

  const bgStyle = disabled
    ? "bg-gray-300  shadow-none"
    : loading
    ? "bg-lime-500 "
    : "bg-green-500";

  const textStyle = disabled ? "text-gray-500" : "text-white";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={`${baseStyle} ${bgStyle} ${className}`}
    >
      <View className="flex-row items-center justify-center">
        <Text className={`text-base font-semibold ${textStyle}`}>
          {loading ? "Please wait..." : title}
        </Text>

        {!loading && (
          <Ionicons
            name={icon}
            size={20}
            color={disabled ? "#A0A0A0" : "white"}
            style={{ marginLeft: 8 }}
          />
        )}

        {loading && (
          <View className="flex-row ml-2">
            <Text className="text-white opacity-60 text-lg mx-0.5">•</Text>
            <Text className="text-white opacity-60 text-lg mx-0.5">•</Text>
            <Text className="text-white opacity-60 text-lg mx-0.5">•</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
