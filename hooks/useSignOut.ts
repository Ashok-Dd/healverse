import { clearLocalSessionData } from "@/lib/session";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

/** Returns a function that asks for confirmation, clears local data and signs the user out. */
export function useSignOut() {
  const logout = useAuthStore((s) => s.logout);

  const performLogout = useCallback(async () => {
    await clearLocalSessionData();
    await logout();
    router.replace("/(auth)/welcome");
  }, [logout]);

  return useCallback(() => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: performLogout },
    ]);
  }, [performLogout]);
}
