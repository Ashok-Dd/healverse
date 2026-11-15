import { useAuthStore } from "@/store/authStore";
import { useUserProfileStore } from "@/store/userProfile";
import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";
import { Alert } from "react-native";

const NOTIFICATION_SETTINGS_KEY = "notification_settings";

/** Returns a function that asks for confirmation, clears local data and signs the user out. */
export function useSignOut() {
  const logout = useAuthStore((s) => s.logout);
  const clearProfile = useUserProfileStore((s) => s.clearProfile);
  const queryClient = useQueryClient();

  const performLogout = useCallback(async () => {
    try {
      queryClient.clear();
      clearProfile();
      await Notifications.cancelAllScheduledNotificationsAsync();
      await SecureStore.deleteItemAsync(NOTIFICATION_SETTINGS_KEY);
    } catch {
      // Cleanup is best effort: the user must still be signed out below.
    }
    await logout();
    router.replace("/(auth)/welcome");
  }, [queryClient, clearProfile, logout]);

  return useCallback(() => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: performLogout },
    ]);
  }, [performLogout]);
}
