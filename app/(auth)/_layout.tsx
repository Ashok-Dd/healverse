import { useThemeColors } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const colors = useThemeColors();
  // Already signed in (e.g. the token check finished after this screen mounted): skip auth.
  useEffect(() => {
    if (useAuthStore.getState().isAuthenticated) {
      router.replace("/(root)/(tabs)/tracker");
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Matches the screens' background so there is no white flash between screens.
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
