import { useOutboxStore } from "@/lib/outbox";
import { clearLocalSessionData } from "@/lib/session";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

/** Returns a function that asks for confirmation, clears local data and signs the user out. */
export function useSignOut() {
  const logout = useAuthStore((s) => s.logout);

  const performLogout = useCallback(async () => {
    // Drop the token first: while it exists, mounted screens can refetch the old user's data
    // into the cache that is about to be cleared.
    await logout();
    await clearLocalSessionData();
    router.replace("/(auth)/welcome");
  }, [logout]);

  return useCallback(() => {
    const unsent = useOutboxStore.getState().entries.length;
    const warning =
      unsent > 0
        ? `

${unsent} ${unsent === 1 ? "entry has" : "entries have"} not been uploaded yet and will be lost.`
        : "";
    Alert.alert("Sign out", `Are you sure you want to sign out?${warning}`, [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: performLogout },
    ]);
  }, [performLogout]);
}
