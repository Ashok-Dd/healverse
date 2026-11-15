import {
  buildPersistOptions,
  createCachePersister,
} from "@/lib/queryPersistence";
import { useAuthStore } from "@/store/authStore";
import {
  persistQueryClientRestore,
  persistQueryClientSubscribe,
} from "@tanstack/query-persist-client-core";
import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";

/**
 * Keeps the query cache on disk for the signed-in user: restores it when a session starts
 * and saves every change. Children wait for the first restore, so the first screen already
 * has its data instead of showing a spinner. If the encrypted storage cannot be opened,
 * the app simply runs without persistence.
 */
export function QueryCachePersistence({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  const [ready, setReady] = useState(userId == null);

  useEffect(() => {
    if (userId == null) return;

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    const options = buildPersistOptions(queryClient, createCachePersister(userId));

    persistQueryClientRestore(options)
      .catch(() => undefined)
      .finally(() => {
        if (cancelled) return;
        unsubscribe = persistQueryClientSubscribe(options);
        setReady(true);
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [queryClient, userId]);

  return ready ? <>{children}</> : null;
}
