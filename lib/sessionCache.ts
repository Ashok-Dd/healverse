import type { User } from "@/types/type";
import { getCacheStorage } from "./cacheStorage";

const USER_KEY = "session-user";

/**
 * The signed-in user, kept in the encrypted cache storage so the app can open offline.
 * It is removed together with the rest of the cache when the session ends
 * (clearLocalSessionData). The password is never stored.
 */
export function saveCachedUser(user: User): void {
  try {
    const { password: _password, ...safeUser } = user;
    getCacheStorage().set(USER_KEY, JSON.stringify(safeUser));
  } catch {
    // Storage unavailable: the app then needs the network to open, as before.
  }
}

export function loadCachedUser(): User | null {
  try {
    const raw = getCacheStorage().getString(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
