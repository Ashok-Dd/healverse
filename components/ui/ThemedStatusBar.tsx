import { useThemeColors } from "@/constants/theme";
import React from "react";
import { StatusBar } from "react-native";

/** Status bar that matches the screen background in both light and dark mode. */
export function ThemedStatusBar() {
  const colors = useThemeColors();
  return <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />;
}
