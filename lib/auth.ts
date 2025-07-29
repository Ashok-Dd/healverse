import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface AppTokenCache {
    getToken: (key: string) => Promise<string | null>;
    saveToken: (key: string, token: string) => Promise<void>;
    deleteToken?: (key: string) => Promise<void>;
}

const createAppTokenCache = (): AppTokenCache => ({
    getToken: async (key: string) => {
        try {
            const item = await SecureStore.getItemAsync(key);
            if (item) {
                console.log(`[SecureStore] Retrieved token for key: ${key}`);
            } else {
                console.log(`[SecureStore] No token found under key: ${key}`);
            }
            return item;
        } catch (error) {
            console.error(`[SecureStore] Error retrieving token for key ${key}:`, error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },

    saveToken: async (key: string, token: string) => {
        try {
            await SecureStore.setItemAsync(key, token);
            console.log(`[SecureStore] Token saved for key: ${key}`);
        } catch (error) {
            console.error(`[SecureStore] Error saving token for key ${key}:`, error);
        }
    },

    deleteToken: async (key: string) => {
        try {
            await SecureStore.deleteItemAsync(key);
            console.log(`[SecureStore] Token deleted for key: ${key}`);
        } catch (error) {
            console.error(`[SecureStore] Error deleting token for key ${key}:`, error);
        }
    },
});

// Export usable instance
export const appTokenCache: AppTokenCache | undefined =
    Platform.OS !== 'web' ? createAppTokenCache() : undefined;
