import * as FileSystem from "expo-file-system";

/**
 * Photos of logged meals, kept on this device only (the server does not store images). They live in
 * the app's private storage under the signed-in user's folder, named after the food log, so a log
 * shows its photo again after the upload. Anything here can disappear (the user clears the app's
 * storage, a backup restore), so callers must treat a missing file as "no photo".
 */
const ROOT = `${FileSystem.documentDirectory}meal-photos/`;

const userDir = (userId: number) => `${ROOT}${userId}/`;
const photoPath = (userId: number, logId: number) => `${userDir(userId)}${logId}.jpg`;

/** Moves an uploaded photo from the outbox to its permanent place. Best effort: the log already exists. */
export async function keepMealPhoto(userId: number, logId: number, sourceUri: string): Promise<void> {
  try {
    await FileSystem.makeDirectoryAsync(userDir(userId), { intermediates: true });
    await FileSystem.moveAsync({ from: sourceUri, to: photoPath(userId, logId) });
  } catch {
    // The source is gone (an earlier attempt already moved it) or storage is unavailable.
  }
}

/** The local photo of a food log, or null when there is none (never taken here, or deleted). */
export async function findMealPhoto(userId: number, logId: number): Promise<string | null> {
  try {
    const path = photoPath(userId, logId);
    const info = await FileSystem.getInfoAsync(path);
    return info.exists ? path : null;
  } catch {
    return null;
  }
}

export async function deleteMealPhoto(userId: number, logId: number): Promise<void> {
  await FileSystem.deleteAsync(photoPath(userId, logId), { idempotent: true });
}

/** Removes every kept photo (sign-out). */
export async function deleteAllMealPhotos(): Promise<void> {
  await FileSystem.deleteAsync(ROOT, { idempotent: true });
}

/** Another account signed in on this device: its predecessor's photos are deleted, never shown. */
export async function purgeOtherUsersMealPhotos(currentUserId: number): Promise<void> {
  try {
    const folders = await FileSystem.readDirectoryAsync(ROOT);
    await Promise.all(
      folders
        .filter((folder) => folder !== String(currentUserId))
        .map((folder) => FileSystem.deleteAsync(`${ROOT}${folder}`, { idempotent: true }))
    );
  } catch {
    // No photos were ever kept on this device.
  }
}
