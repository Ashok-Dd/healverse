import { dayOf } from "@/lib/day";
import { type FoodLogEntry, useOutboxStore } from "@/lib/outbox";
import { useMemo } from "react";

/** Meals that are queued or being analysed for one day, oldest first. */
export function useQueuedFoodEntries(date: string): FoodLogEntry[] {
  const entries = useOutboxStore((state) => state.entries);
  return useMemo(
    () =>
      entries.filter(
        (entry): entry is FoodLogEntry =>
          entry.kind === "food-log" && dayOf(entry.payload.loggedAt) === date
      ),
    [entries, date]
  );
}
