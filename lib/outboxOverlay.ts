import type { FetchStatus } from "@tanstack/react-query";
import type { ExerciseEntry, WaterEntry } from "./outbox";
import { dayOf } from "./day";
import { withPausedAsLoading } from "./queryStatus";
import type { ExerciseLog, WaterLog } from "@/types/type";

/**
 * Queued entries are shown next to the server's data at read time instead of being written
 * into the cache. The cache then only ever holds what the server confirmed, and an entry
 * disappears from the list exactly when it leaves the queue.
 */
export const waterLogFromEntry = (entry: WaterEntry): WaterLog => ({
  id: -entry.seq,
  amountMl: entry.payload.amountMl,
  loggedAt: entry.payload.loggedAt,
  createdAt: entry.createdAt,
  outboxStatus: entry.status,
});

export const exerciseLogFromEntry = (entry: ExerciseEntry): ExerciseLog => ({
  ...entry.payload,
  id: -entry.seq,
  createdAt: entry.createdAt,
  outboxStatus: entry.status,
});

export const isOnDay = (entry: WaterEntry | ExerciseEntry, date: string): boolean =>
  dayOf(entry.payload.loggedAt) === date;

/** Query result whose list also contains the queued items. With queued items there is always something to show, so it is never "loading". */
export function mergeQueued<
  T,
  R extends { data: T[] | undefined; isPending: boolean; fetchStatus: FetchStatus; isLoading: boolean },
>(query: R, queued: T[]): R {
  const base = withPausedAsLoading(query);
  if (queued.length === 0) return base;
  return { ...base, data: [...(query.data ?? []), ...queued], isLoading: false };
}
