import { getCacheStorage } from "@/lib/cacheStorage";
import { fetchApi } from "@/lib/fetchApi";
import { getQueryClient } from "@/lib/react-query-client";

const SYNCED_KEY = "time-zone-synced";

/** IANA id of the device's time zone (e.g. `Asia/Kolkata`), or null when the runtime cannot tell. */
export const getDeviceTimeZone = (): string | null => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    return null;
  }
};

/**
 * Tells the server which zone this user's day is measured in. Sent once per user and zone
 * (remembered in the session cache, so a new sign-in sends it again). When it goes out, cached
 * data is refetched, because it was grouped into days by the zone the server had before.
 * A failure is not reported: the next launch or return to the foreground tries again.
 */
export async function syncTimeZone(userId: number): Promise<void> {
  const zone = getDeviceTimeZone();
  if (!zone) return;

  const marker = `${userId}:${zone}`;
  try {
    if (getCacheStorage().getString(SYNCED_KEY) === marker) return;
    await fetchApi("/api/user/time-zone", {
      method: "PUT",
      body: { timeZone: zone },
      requiresAuth: true,
      suppressToasts: true,
    });
    getCacheStorage().set(SYNCED_KEY, marker);
    await getQueryClient().invalidateQueries();
  } catch {
    // Offline or the server is unreachable: retried on the next launch or foreground.
  }
}
