import { useColorScheme } from "react-native";

/**
 * Raw colour values for the few places className cannot reach (tab bar options, status bar,
 * RefreshControl, markdown styles). They mirror the CSS variables in app/globals.css, so
 * change both together. For everything else use semantic classes (`bg-background`,
 * `text-foreground`, ...), which follow the system light/dark setting on their own.
 */
const lightColors = {
  background: "#FBF7F0",
  foreground: "#3B1F3A",
  card: "#FFFFFF",
  primary: "#CF4632",
  primaryForeground: "#FFFFFF",
  secondary: "#EFE9FB",
  muted: "#F3EBDD",
  mutedForeground: "#7A6178",
  accent: "#DCE9DF",
  accentForeground: "#3F6A4C",
  destructive: "#B42525",
  success: "#3F6A4C",
  warning: "#9A5B0B",
  info: "#5B4AA8",
  border: "#E8DFD0",
  ring: "#4F7A5C",
  statusBar: "dark-content",
} as const;

const darkColors: Record<keyof typeof lightColors, string> = {
  background: "#1B1220",
  foreground: "#F7EFE6",
  card: "#261A2B",
  primary: "#F0795F",
  primaryForeground: "#1B1220",
  secondary: "#342739",
  muted: "#2E2233",
  mutedForeground: "#BBA9BF",
  accent: "#243A2D",
  accentForeground: "#A9D8B6",
  destructive: "#F0716A",
  success: "#8FD0A0",
  warning: "#F0B866",
  info: "#B9A9F2",
  border: "#3B2E41",
  ring: "#8FD0A0",
  statusBar: "light-content",
};

export type ThemeColors = {
  [K in keyof typeof lightColors]: K extends "statusBar" ? "dark-content" | "light-content" : string;
};

/** Colours for the current system scheme; re-renders the caller when the scheme changes. */
export function useThemeColors(): ThemeColors {
  return (useColorScheme() === "dark" ? darkColors : lightColors) as ThemeColors;
}
