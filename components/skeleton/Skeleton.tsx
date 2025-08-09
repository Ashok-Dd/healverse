import React from "react";
import { View, ViewStyle } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: ViewStyle;
  className?: string;
}

const Skeleton = ({
  width = "100%",
  height = 20,
  radius = 6,
  style,
  className = "",
}: SkeletonProps) => {
  return (
    <View
      className={`bg-gray-300 animate-pulse ${className}`}
      style={[{ width, height, borderRadius: radius } as ViewStyle, style]}
    />
  );
};

export default Skeleton;
