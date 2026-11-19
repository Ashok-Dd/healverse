import type { CreateExerciseLogData, MealType, OutboxStatus } from "@/types/type";
import * as Crypto from "expo-crypto";
import { create } from "zustand";
import { getCacheStorage } from "./cacheStorage";
import { purgeOtherUsersMealPhotos } from "./mealPhotos";
import { deleteOutboxImage } from "./outboxFiles";

/**
 * Writes made on this device that still have to reach the server. Each entry is stored
 * (encrypted, per user) the moment the user acts, shown right away in the UI, and replayed in
 * order by outboxProcessor. `id` doubles as the Idempotency-Key, so a replay after a timeout
 * or a crash cannot create a duplicate.
 */
interface EntryBase {
  id: string;
  /** Increasing number; the UI derives a unique negative id from it for not-yet-synced rows. */
  seq: number;
  createdAt: string;
  status: OutboxStatus;
  attempts: number;
  lastError?: string;
}

export interface WaterEntry extends EntryBase {
  kind: "water";
  payload: { amountMl: number; loggedAt: string };
}
export interface ExerciseEntry extends EntryBase {
  kind: "exercise";
  payload: CreateExerciseLogData;
}
export interface ChatEntry extends EntryBase {
  kind: "chat";
  payload: { conversationId: string; content: string };
}
/** A meal from a photo, a description, or both (at least one is always set). */
export interface FoodLogEntry extends EntryBase {
  kind: "food-log";
  payload: {
    /** Points at a copy inside the app's own storage, so it survives a restart. */
    imageUri?: string;
    description?: string;
    mealType: MealType;
    loggedAt: string;
  };
}

export type OutboxEntry = WaterEntry | ExerciseEntry | ChatEntry | FoodLogEntry;
export type OutboxKind = OutboxEntry["kind"];
export type PayloadOf<K extends OutboxKind> = Extract<OutboxEntry, { kind: K }>["payload"];

export const OUTBOX_KEY_PREFIX = "outbox-user-";
const storageKey = (userId: number) => `${OUTBOX_KEY_PREFIX}${userId}`;

/**
 * An expired login keeps its queue for the next sign-in of the same user. When someone else
 * signs in, those leftovers (and their photos) are deleted, so they are never visible to or
 * uploaded by another account.
 */
function purgeOtherUsersQueues(currentUserId: number): void {
  try {
    const storage = getCacheStorage();
    for (const key of storage.getAllKeys()) {
      if (!key.startsWith(OUTBOX_KEY_PREFIX) || key === storageKey(currentUserId)) continue;
      const leftovers = JSON.parse(storage.getString(key) ?? "[]") as OutboxEntry[];
      for (const entry of leftovers) {
        if (entry.kind === "food-log" && entry.payload.imageUri) {
          void deleteOutboxImage(entry.payload.imageUri);
        }
      }
      storage.delete(key);
    }
  } catch {
    // Storage unavailable: nothing was saved to purge.
  }
}

/** Queues saved by app 1.0.1 hold meal photos as `food-photo`; the payload is the same shape. */
function upgradeLegacyEntry(entry: OutboxEntry): OutboxEntry {
  return (entry.kind as string) === "food-photo" ? { ...entry, kind: "food-log" } as OutboxEntry : entry;
}

interface OutboxState {
  userId: number | null;
  entries: OutboxEntry[];
  /** Loads the saved queue of this user. Anything that was mid-send when the app closed goes back to pending. */
  hydrate: (userId: number) => void;
  /** Forgets the in-memory queue (the saved copy is removed by the session wipe). */
  reset: () => void;
  enqueue: <K extends OutboxKind>(kind: K, payload: PayloadOf<K>) => OutboxEntry;
  update: (id: string, patch: Partial<Pick<OutboxEntry, "status" | "attempts" | "lastError">>) => void;
  remove: (id: string) => void;
  /** Puts a failed entry back in the queue. */
  retry: (id: string) => void;
}

export const useOutboxStore = create<OutboxState>()((set, get) => {
  const commit = (entries: OutboxEntry[]) => {
    set({ entries });
    const { userId } = get();
    if (userId == null) return;
    try {
      getCacheStorage().set(storageKey(userId), JSON.stringify(entries));
    } catch {
      // Storage unavailable: the queue still works for this session, it just cannot survive a restart.
    }
  };

  return {
    userId: null,
    entries: [],

    hydrate: (userId) => {
      purgeOtherUsersQueues(userId);
      void purgeOtherUsersMealPhotos(userId);
      let saved: OutboxEntry[] = [];
      try {
        const raw = getCacheStorage().getString(storageKey(userId));
        saved = raw ? (JSON.parse(raw) as OutboxEntry[]).map(upgradeLegacyEntry) : [];
      } catch {
        saved = [];
      }
      set({
        userId,
        entries: saved.map((entry) =>
          entry.status === "syncing" ? { ...entry, status: "pending" as const } : entry
        ),
      });
    },

    reset: () => set({ userId: null, entries: [] }),

    enqueue: (kind, payload) => {
      const lastSeq = get().entries.reduce((max, entry) => Math.max(max, entry.seq), 0);
      const entry = {
        id: Crypto.randomUUID(),
        seq: lastSeq + 1,
        createdAt: new Date().toISOString(),
        status: "pending",
        attempts: 0,
        kind,
        payload,
      } as OutboxEntry;
      commit([...get().entries, entry]);
      return entry;
    },

    update: (id, patch) =>
      commit(get().entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry))),

    remove: (id) => commit(get().entries.filter((entry) => entry.id !== id)),

    retry: (id) =>
      commit(
        get().entries.map((entry) =>
          entry.id === id
            ? { ...entry, status: "pending" as const, attempts: 0, lastError: undefined }
            : entry
        )
      ),
  };
});
