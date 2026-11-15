import { useOutboxStore } from "@/lib/outbox";
import { processOutbox } from "@/lib/outboxProcessor";
import { useAuthStore } from "@/store/authStore";
import { onlineManager, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState } from "react-native";

/**
 * Loads the saved queue of the signed-in user and keeps it moving: it runs the queue at start,
 * when the connection returns and when the app comes back to the foreground.
 */
export function OutboxSync() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    if (userId == null) return;

    useOutboxStore.getState().hydrate(userId);
    const run = () => void processOutbox(queryClient);
    run();

    const unsubscribeOnline = onlineManager.subscribe((online) => {
      if (online) run();
    });
    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") run();
    });

    return () => {
      unsubscribeOnline();
      appStateSubscription.remove();
    };
  }, [queryClient, userId]);

  return null;
}
