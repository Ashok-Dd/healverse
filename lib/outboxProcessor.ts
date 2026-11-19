import { ApiError, fetchApi } from "@/lib/fetchApi";
import type { ExerciseLog, FoodLog, Message, WaterLog } from "@/types/type";
import { onlineManager, type QueryClient } from "@tanstack/react-query";
import { applyExerciseLog, applyFoodLog, applyWaterLog } from "./healthCache";
import { type ChatEntry, type OutboxEntry, type OutboxKind, useOutboxStore } from "./outbox";
import { keepMealPhoto } from "./mealPhotos";
import { deleteOutboxImage } from "./outboxFiles";

// After this many server-side failures (5xx, 429) in a row an entry is parked as failed, so the
// user can see it and retry, instead of it being retried in the background forever.
const MAX_SERVER_FAILURES = 5;
const RETRY_BASE_DELAY_MS = 10_000;
const RETRY_MAX_DELAY_MS = 5 * 60_000;

const idempotencyHeader = (entry: OutboxEntry) => ({ "Idempotency-Key": entry.id });

async function sendChatMessage(
  entry: ChatEntry,
  queryClient: QueryClient,
  isCurrent: () => boolean
): Promise<void> {
  const { conversationId, content } = entry.payload;
  const reply = await fetchApi<Message>(`/api/conversations/${conversationId}/messages`, {
    method: "POST",
    requiresAuth: true,
    body: { sender: "USER", content },
    headers: idempotencyHeader(entry),
  });
  if (!isCurrent()) return;
  // The server stores the user's message too; show it (the next refetch swaps in the real one).
  // This copy stays in the cache, so its id must never repeat. `entry.seq` restarts at 1 whenever
  // the queue is empty, which made every second message share an id (and a list key) with an
  // earlier one. Negative ids cannot clash with the server's positive ones.
  const sent: Message = {
    id: -Date.now(),
    conversationId,
    content,
    sender: "USER",
    createdAt: entry.createdAt,
  };
  queryClient.setQueryData<Message[]>(["messages", conversationId], (old = []) => [
    ...old,
    sent,
    reply,
  ]);
  void queryClient.invalidateQueries({ queryKey: ["conversations"] });
}

/**
 * Uploads one entry and puts the confirmed result into the cache. `isCurrent` says whether the
 * session that queued the entry is still the active one: the upload can finish after a sign-out
 * (or after another user signed in), and its response must then be dropped, never written into
 * the new session's cache.
 */
async function sendEntry(
  entry: OutboxEntry,
  queryClient: QueryClient,
  isCurrent: () => boolean
): Promise<void> {
  switch (entry.kind) {
    case "water": {
      const log = await fetchApi<WaterLog>("/api/water-logs/log", {
        method: "POST",
        requiresAuth: true,
        body: entry.payload,
        headers: idempotencyHeader(entry),
      });
      if (isCurrent()) applyWaterLog(queryClient, log);
      break;
    }
    case "exercise": {
      const log = await fetchApi<ExerciseLog>("/api/exercise-logs/log", {
        method: "POST",
        requiresAuth: true,
        body: entry.payload,
        headers: idempotencyHeader(entry),
      });
      if (isCurrent()) applyExerciseLog(queryClient, log);
      break;
    }
    case "food-log": {
      const { imageUri, description, mealType, loggedAt } = entry.payload;
      const formData = new FormData();
      if (imageUri) {
        formData.append("image", {
          uri: imageUri,
          name: "meal.jpg",
          type: "image/jpeg",
        } as unknown as Blob);
      }
      if (description) formData.append("description", description);
      formData.append("mealType", mealType);
      formData.append("loggedAt", loggedAt);
      const log = await fetchApi<FoodLog>("/api/food-logs/log", {
        method: "POST",
        requiresAuth: true,
        body: formData,
        headers: idempotencyHeader(entry),
      });
      if (isCurrent()) {
        applyFoodLog(queryClient, log);
        const userId = useOutboxStore.getState().userId;
        if (imageUri && userId != null) await keepMealPhoto(userId, log.id, imageUri);
      }
      break;
    }
    case "chat":
      await sendChatMessage(entry, queryClient, isCurrent);
      break;
  }
  if (isCurrent()) void queryClient.invalidateQueries({ queryKey: ["gamification", "summary"] });
}

const nextMacrotask = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

let running = false;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleRetry = (attempts: number, queryClient: QueryClient): void => {
  if (retryTimer) clearTimeout(retryTimer);
  const delay = Math.min(RETRY_BASE_DELAY_MS * 2 ** (attempts - 1), RETRY_MAX_DELAY_MS);
  retryTimer = setTimeout(() => {
    retryTimer = null;
    void processOutbox(queryClient);
  }, delay);
};

/** Stops background retries (session ended). */
export function cancelOutboxRetry(): void {
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = null;
}

/**
 * Sends queued entries to the server, oldest first. Safe to call at any time: it does nothing
 * while offline or while another run is active.
 *
 * Order is kept per kind (water, exercise, chat, meal): if one entry cannot be sent for a
 * temporary reason, later entries of the same kind wait behind it, while other kinds go on.
 * - Offline / timeout: stays pending; the reconnect listener runs the queue again.
 * - Server error (5xx, 429): stays pending with a backoff, parked as failed after a few tries.
 * - Rejected (other 4xx): parked as failed with the server's reason, for the user to retry or discard.
 * - 401: the login expired; the global handler signs out and the queue waits for the next sign-in.
 */
export async function processOutbox(queryClient: QueryClient): Promise<void> {
  if (running || !onlineManager.isOnline()) return;
  running = true;
  try {
    const blockedKinds = new Set<OutboxKind>();
    const store = useOutboxStore.getState;

    for (;;) {
      const entry = store().entries.find(
        (candidate) => candidate.status === "pending" && !blockedKinds.has(candidate.kind)
      );
      if (!entry) return;

      store().update(entry.id, { status: "syncing" });
      const sessionUserId = store().userId;
      const isCurrent = () => store().userId === sessionUserId;
      try {
        await sendEntry(entry, queryClient, isCurrent);
        if (!isCurrent()) return;
        // Let the cache listeners render the confirmed log first, so the queued copy is not
        // dropped a moment before the real one appears.
        await nextMacrotask();
        store().remove(entry.id);
        if (entry.kind === "food-log" && entry.payload.imageUri) {
          await deleteOutboxImage(entry.payload.imageUri);
        }
      } catch (error) {
        const status = error instanceof ApiError ? error.status : 0;
        const message = error instanceof Error ? error.message : "Could not sync";
        blockedKinds.add(entry.kind);

        if (status === 401) {
          store().update(entry.id, { status: "pending" });
          return;
        }
        if (status === 0) {
          store().update(entry.id, { status: "pending", lastError: message });
        } else if (status >= 500 || status === 429) {
          const attempts = entry.attempts + 1;
          const exhausted = attempts >= MAX_SERVER_FAILURES;
          store().update(entry.id, {
            status: exhausted ? "failed" : "pending",
            attempts,
            lastError: message,
          });
          if (!exhausted) scheduleRetry(attempts, queryClient);
        } else {
          store().update(entry.id, { status: "failed", lastError: message });
        }
      }
    }
  } finally {
    running = false;
  }
}
