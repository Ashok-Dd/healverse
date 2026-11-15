/**
 * Raw colour values for places className cannot reach (icons, SVG, StatusBar, pickers).
 * These mirror the CSS variables in app/globals.css - change both together.
 */
export const colors = {
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
} as const;
