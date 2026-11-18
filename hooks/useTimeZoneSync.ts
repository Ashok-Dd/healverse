import { syncTimeZone } from "@/lib/timeZone";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { AppState } from "react-native";

/** Keeps the server's idea of the user's time zone equal to the device's, e.g. after travelling. */
export function useTimeZoneSync(): void {
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (userId == null) return;
    void syncTimeZone(userId);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void syncTimeZone(userId);
    });
    return () => subscription.remove();
  }, [userId]);
}
