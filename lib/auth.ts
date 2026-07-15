import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface AppTokenCache {
    getToken: (key: string) => Promise<string | null>;
    saveToken: (key: string, token: string) => Promise<void>;
    deleteToken?: (key: string) => Promise<void>;
}

// In-memory cache so N parallel authenticated requests (e.g. 4+ queries firing
// together on tab mount) share one SecureStore read instead of each hitting
// the native bridge independently — SecureStore reads are not free.
const memoryCache = new Map<string, string | null>();
let inFlightRead: Promise<string | null> | null = null;

const createAppTokenCache = (): AppTokenCache => ({
    getToken: async (key: string) => {
        if (memoryCache.has(key)) {
            return memoryCache.get(key) ?? null;
        }

        if (inFlightRead) {
            return inFlightRead;
        }

        inFlightRead = (async () => {
            try {
                const item = await SecureStore.getItemAsync(key);
                memoryCache.set(key, item);
                return item;
            } catch (error) {
                console.error(`[SecureStore] Error retrieving token for key ${key}:`, error);
                await SecureStore.deleteItemAsync(key);
                memoryCache.set(key, null);
                return null;
            } finally {
                inFlightRead = null;
            }
        })();

        return inFlightRead;
    },

    saveToken: async (key: string, token: string) => {
        try {
            await SecureStore.setItemAsync(key, token);
            memoryCache.set(key, token);
        } catch (error) {
            console.error(`[SecureStore] Error saving token for key ${key}:`, error);
        }
    },

    deleteToken: async (key: string) => {
        try {
            await SecureStore.deleteItemAsync(key);
            memoryCache.delete(key);
        } catch (error) {
            console.error(`[SecureStore] Error deleting token for key ${key}:`, error);
        }
    },
});

// Export usable instance
export const appTokenCache: AppTokenCache | undefined =
    Platform.OS !== 'web' ? createAppTokenCache() : undefined;
