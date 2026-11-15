import { Button } from "@/components/ui/Button";
import { type OutboxEntry, useOutboxStore } from "@/lib/outbox";
import { deleteOutboxImage } from "@/lib/outboxFiles";
import { processOutbox } from "@/lib/outboxProcessor";
import { getQueryClient } from "@/lib/react-query-client";
import { useMemo } from "react";
import { Text, View } from "react-native";

const describe = (entry: OutboxEntry): string => {
  switch (entry.kind) {
    case "water":
      return `Water, ${entry.payload.amountMl} mL`;
    case "exercise":
      return `Exercise, ${entry.payload.exerciseName}`;
    case "chat":
      return `Message: ${entry.payload.content.slice(0, 40)}`;
    case "food-photo":
      return `Meal photo (${entry.payload.mealType.toLowerCase()})`;
  }
};

/** Entries the server refused or that kept failing. They are never dropped silently: retry or discard. */
export function OutboxFailures() {
  const entries = useOutboxStore((state) => state.entries);
  const failed = useMemo(() => entries.filter((entry) => entry.status === "failed"), [entries]);
  if (failed.length === 0) return null;

  const retry = (id: string) => {
    useOutboxStore.getState().retry(id);
    void processOutbox(getQueryClient());
  };
  const discard = (entry: OutboxEntry) => {
    useOutboxStore.getState().remove(entry.id);
    if (entry.kind === "food-photo") void deleteOutboxImage(entry.payload.imageUri);
  };

  return (
    <View className="mb-3 gap-2 rounded-2xl border border-destructive bg-card p-3">
      <Text className="font-body-bold text-sm text-destructive">
        Some entries could not be synced
      </Text>
      {failed.map((entry) => (
        <View key={entry.id} className="gap-1">
          <Text className="font-body-semibold text-sm text-foreground">{describe(entry)}</Text>
          {entry.lastError ? (
            <Text className="font-body text-xs text-muted-foreground">{entry.lastError}</Text>
          ) : null}
          <View className="flex-row gap-2">
            <Button title="Retry" size="sm" onPress={() => retry(entry.id)} />
            <Button title="Discard" size="sm" variant="outline" onPress={() => discard(entry)} />
          </View>
        </View>
      ))}
    </View>
  );
}
