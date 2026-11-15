import {
  type PersistedClient,
  type PersistQueryClientOptions,
  type Persister,
} from "@tanstack/query-persist-client-core";
import type { Query, QueryClient } from "@tanstack/react-query";
import { getCacheStorage } from "./cacheStorage";
import { OUTBOX_KEY_PREFIX } from "./outbox";

/** Cached data older than this is dropped on restore. */
export const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Bump when the shape of cached data changes (a type, a query key): every device then
 * discards its old cache instead of rendering stale data that no longer matches the code.
 */
export const CACHE_BUSTER = "1";

const WRITE_DELAY_MS = 1000;

// Only data worth showing offline. Everything else (and every mutation) stays in memory.
const PERSISTED_KEY_ROOTS = new Set([
  "health",
  "dietPlans",
  "gamification",
  "insights",
  "conversations",
  "messages",
]);

const shouldPersistQuery = (query: Query): boolean =>
  query.state.status === "success" && PERSISTED_KEY_ROOTS.has(String(query.queryKey[0]));

let pendingWrite: ReturnType<typeof setTimeout> | null = null;

const cancelPendingWrite = (): void => {
  if (pendingWrite) {
    clearTimeout(pendingWrite);
    pendingWrite = null;
  }
};

/**
 * Persister for one user. The storage key contains the user id, so another account on the
 * same device can never read this cache, even if a wipe were missed.
 * Writes are debounced: a burst of cache updates produces one write.
 */
export function createCachePersister(userId: number): Persister {
  const storageKey = `query-cache-user-${userId}`;

  return {
    persistClient: (client: PersistedClient) => {
      cancelPendingWrite();
      pendingWrite = setTimeout(() => {
        pendingWrite = null;
        try {
          getCacheStorage().set(storageKey, JSON.stringify(client));
        } catch {
          // Storage unavailable: the app keeps working from memory, just without persistence.
        }
      }, WRITE_DELAY_MS);
    },
    restoreClient: () => {
      const raw = getCacheStorage().getString(storageKey);
      return raw ? (JSON.parse(raw) as PersistedClient) : undefined;
    },
    removeClient: () => {
      cancelPendingWrite();
      getCacheStorage().delete(storageKey);
    },
  };
}

export const buildPersistOptions = (
  queryClient: QueryClient,
  persister: Persister
): PersistQueryClientOptions => ({
  queryClient,
  persister,
  maxAge: CACHE_MAX_AGE_MS,
  buster: CACHE_BUSTER,
  dehydrateOptions: {
    shouldDehydrateQuery: shouldPersistQuery,
    shouldDehydrateMutation: () => false,
  },
});

/**
 * Deletes the persisted cache and cancels any write still waiting. `keepOutbox` leaves the
 * saved queue of unsent logs in place (the login merely expired; the same user signs in again).
 */
export function wipePersistedCache({ keepOutbox }: { keepOutbox: boolean }): void {
  cancelPendingWrite();
  const storage = getCacheStorage();
  if (!keepOutbox) {
    storage.clearAll();
    return;
  }
  for (const key of storage.getAllKeys()) {
    if (!key.startsWith(OUTBOX_KEY_PREFIX)) storage.delete(key);
  }
}
