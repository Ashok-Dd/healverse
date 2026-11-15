import { type OutboxEntry, type OutboxKind, useOutboxStore } from "@/lib/outbox";
import { useMemo } from "react";

type EntryOf<K extends OutboxKind> = Extract<OutboxEntry, { kind: K }>;

/** The queued entries of one kind, oldest first. */
export function useOutboxEntries<K extends OutboxKind>(kind: K): EntryOf<K>[] {
  const entries = useOutboxStore((state) => state.entries);
  return useMemo(
    () => entries.filter((entry): entry is EntryOf<K> => entry.kind === kind),
    [entries, kind]
  );
}
