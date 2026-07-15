import React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: number;
  shadow?: boolean;
}

export function Card({
  children,
  style,
  padding = 16,
  shadow = true,
  ...props
}: CardProps) {
  const cardStyle: ViewStyle = {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding,
    ...(shadow && {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }),
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
}
