import { colors } from "@/constants/theme";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        // Matches the screens' background so there is no white flash between steps.
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
