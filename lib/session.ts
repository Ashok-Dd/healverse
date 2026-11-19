import { useOutboxStore } from "@/lib/outbox";
import { deleteAllMealPhotos } from "@/lib/mealPhotos";
import { deleteAllOutboxImages } from "@/lib/outboxFiles";
import { cancelOutboxRetry } from "@/lib/outboxProcessor";
import { wipePersistedCache } from "@/lib/queryPersistence";
import { getQueryClient } from "@/lib/react-query-client";
import { useReminderStore } from "@/store/reminderStore";
import { useUserProfileStore } from "@/store/userProfile";
import * as Notifications from "expo-notifications";

/**
 * - `sign-out`: the user left on purpose. Everything goes, including logs that were still
 *   waiting to upload, so the next person on this device never sees any of it.
 * - `expired`: the server rejected the login (token past its 7 days). The cache goes, but the
 *   encrypted queue of unsent logs and its photos stay, so they upload when the same user signs
 *   in again. Another user signing in deletes them instead (see outbox.hydrate).
 */
export type SessionEnd = "sign-out" | "expired";

/**
 * Removes everything tied to the signed-in user from memory and device storage: cached API
 * responses (in memory and the encrypted copy on disk), the onboarding profile (incl. password),
 * scheduled notifications and their settings. Call it on every way a session ends.
 * Best effort: a failure here must not stop the sign-out itself.
 */
export async function clearLocalSessionData(reason: SessionEnd = "sign-out"): Promise<void> {
  const keepOutbox = reason === "expired";
  cancelOutboxRetry();
  useOutboxStore.getState().reset();
  const queryClient = getQueryClient();
  // A request still in flight would otherwise write the old user's data back after the wipe.
  await queryClient.cancelQueries();
  queryClient.clear();
  useUserProfileStore.getState().clearProfile();
  try {
    wipePersistedCache({ keepOutbox });
    if (!keepOutbox) {
      await deleteAllOutboxImages();
      await deleteAllMealPhotos();
    }
  } catch {
    // Encrypted storage unavailable: there is no persisted copy to remove.
  }
  useReminderStore.getState().reset();
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Ignore: nothing scheduled.
  }
}
