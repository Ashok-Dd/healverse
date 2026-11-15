import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";

const OUTBOX_DIR = `${FileSystem.documentDirectory}outbox/`;

/**
 * Copies a picked or captured photo into the app's own storage. The original lives in a cache
 * or gallery location that can vanish before the queued upload runs (after a restart).
 */
export async function copyImageToOutbox(sourceUri: string): Promise<string> {
  await FileSystem.makeDirectoryAsync(OUTBOX_DIR, { intermediates: true });
  const target = `${OUTBOX_DIR}${Crypto.randomUUID()}.jpg`;
  await FileSystem.copyAsync({ from: sourceUri, to: target });
  return target;
}

export async function deleteOutboxImage(uri: string): Promise<void> {
  await FileSystem.deleteAsync(uri, { idempotent: true });
}

/** Removes every queued photo (sign-out / expired session). */
export async function deleteAllOutboxImages(): Promise<void> {
  await FileSystem.deleteAsync(OUTBOX_DIR, { idempotent: true });
}
