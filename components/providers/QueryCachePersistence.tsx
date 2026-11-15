import { getQueryClient } from "@/lib/react-query-client";
import {
  buildPersistOptions,
  createCachePersister,
} from "@/lib/queryPersistence";
import { useAuthStore } from "@/store/authStore";
import {
  persistQueryClientRestore,
  persistQueryClientSubscribe,
} from "@tanstack/query-persist-client-core";
import { useEffect, useState } from "react";

/**
 * Keeps the query cache on disk for the signed-in user: restores it when a session starts
 * and saves every change. If the encrypted storage cannot be opened, the app simply runs
 * without persistence.
 *
 * Returns true once the first restore has finished (or there was nothing to restore, because
 * nobody is signed in). The root layout holds the splash screen until then, so the first
 * screen already has its data. It must be the root layout that waits, not a wrapper that
 * renders nothing: the layout navigates as soon as it is ready, and that needs <Slot /> to be
 * mounted. After the first restore it stays true, so signing in or out later never brings the
 * splash back.
 */
export function useQueryCachePersistence(): boolean {
  const queryClient = getQueryClient();
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const userId = useAuthStore((s) => s.user?.id);
  // undefined = the first restore has not finished yet.
  const [settledFor, setSettledFor] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    // The launch-time auth check decides who (if anyone) is signed in.
    if (isInitializing) return;
    if (userId == null) {
      setSettledFor(null);
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    const options = buildPersistOptions(queryClient, createCachePersister(userId));

    persistQueryClientRestore(options)
      .catch(() => undefined)
      .finally(() => {
        if (cancelled) return;
        unsubscribe = persistQueryClientSubscribe(options);
        setSettledFor(userId);
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [queryClient, isInitializing, userId]);

  return settledFor !== undefined;
}