import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { MMKV } from "react-native-mmkv";

const CREDENTIALS_KEY = "cache_storage_credentials";
// MMKV accepts an encryption key of at most 16 bytes; 16 printable ASCII characters is the maximum.
const ENCRYPTION_KEY_LENGTH = 16;

interface StorageCredentials {
  /** MMKV file name. A fresh one is used whenever the key is regenerated, so an old file that can no longer be decrypted is never reopened. */
  id: string;
  key: string;
}

const randomEncryptionKey = (): string =>
  Array.from(Crypto.getRandomBytes(ENCRYPTION_KEY_LENGTH), (byte) =>
    String.fromCharCode(33 + (byte % 94))
  ).join("");

/**
 * The cache holds health data, so it is encrypted at rest. The key never touches the JS
 * bundle or the MMKV file: it is generated on first use and kept in the OS keystore
 * (expo-secure-store).
 */
function loadOrCreateCredentials(): StorageCredentials {
  try {
    const stored = SecureStore.getItem(CREDENTIALS_KEY);
    if (stored) return JSON.parse(stored) as StorageCredentials;
  } catch {
    // Unreadable or corrupted entry: fall through and create new credentials.
  }
  const credentials: StorageCredentials = {
    id: `hv-cache-${Crypto.randomUUID()}`,
    key: randomEncryptionKey(),
  };
  SecureStore.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  return credentials;
}

let storage: MMKV | null = null;

/** Encrypted, synchronous key-value storage for the persisted query cache. Throws if the keystore is unavailable. */
export function getCacheStorage(): MMKV {
  if (!storage) {
    const { id, key } = loadOrCreateCredentials();
    storage = new MMKV({ id, encryptionKey: key });
  }
  return storage;
}
