import { useThemeColors } from "@/constants/theme";
import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { useColorScheme } from "react-native";

/**
 * React Navigation paints screen and tab-bar backgrounds from its own theme, which is light by
 * default. Without this, dark mode shows light strips (e.g. above the tab bar).
 */
export function NavigationThemeProvider({ children }: { children: React.ReactNode }) {
  const colors = useThemeColors();
  const dark = useColorScheme() === "dark";

  const theme = useMemo<Theme>(() => {
    const base = dark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      dark,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.foreground,
        border: colors.border,
        notification: colors.primary,
      },
    };
  }, [dark, colors]);

  return <ThemeProvider value={theme}>{children}</ThemeProvider>;
}
