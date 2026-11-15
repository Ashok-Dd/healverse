import type { CreateExerciseLogData, MealType } from "@/types/type";
import { type OutboxKind, type PayloadOf, useOutboxStore } from "./outbox";
import { copyImageToOutbox } from "./outboxFiles";
import { processOutbox } from "./outboxProcessor";
import { getQueryClient } from "./react-query-client";

/**
 * Every log the user creates goes through here: it is saved and shown at once, then uploaded
 * right away if there is a connection, or later when there is. Online and offline behave the
 * same for the caller.
 */
function queueAndSend<K extends OutboxKind>(kind: K, payload: PayloadOf<K>): void {
  useOutboxStore.getState().enqueue(kind, payload);
  void processOutbox(getQueryClient());
}

export const logWater = (amountMl: number): void =>
  queueAndSend("water", { amountMl, loggedAt: new Date().toISOString() });

export const logExercise = (data: CreateExerciseLogData): void => queueAndSend("exercise", data);

export const sendChatMessage = (conversationId: string, content: string): void =>
  queueAndSend("chat", { conversationId, content });

export async function logFoodPhoto(imageUri: string, mealType: MealType): Promise<void> {
  const storedUri = await copyImageToOutbox(imageUri);
  queueAndSend("food-photo", { imageUri: storedUri, mealType, loggedAt: new Date().toISOString() });
}
