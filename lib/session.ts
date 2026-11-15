import { getQueryClient } from "@/lib/react-query-client";
import { useUserProfileStore } from "@/store/userProfile";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";

const NOTIFICATION_SETTINGS_KEY = "notification_settings";

/**
 * Removes everything tied to the signed-in user from memory and device storage: cached API
 * responses (keys are not user-scoped), the onboarding profile (incl. password), scheduled
 * notifications and their settings. Call it on every way a session ends (sign out, expired
 * token), so the next person to sign in on this device never sees the previous user's data.
 * Best effort: a failure here must not stop the sign-out itself.
 */
export async function clearLocalSessionData(): Promise<void> {
  getQueryClient().clear();
  useUserProfileStore.getState().clearProfile();
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await SecureStore.deleteItemAsync(NOTIFICATION_SETTINGS_KEY);
  } catch {
    // Ignore: nothing scheduled, or storage unavailable.
  }
}
