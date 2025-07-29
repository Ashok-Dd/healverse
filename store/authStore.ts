import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { fetchApi } from '@/lib/fetchApi';
import type {
    User,
    AuthTokens,
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
    ApiError
} from '@/types/type';
import {appTokenCache} from "@/lib/auth";

interface AuthState {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitializing: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
    loadUserFromStorage: () => Promise<void>;
    clearError: () => void;
    updateUser: (userData: Partial<User>) => void;
}

// Secure storage keys
const STORAGE_KEYS = {
    TOKEN: 'token',
    USER_DATA: 'userData'
} as const;

// Helper functions for secure storage
const storeToken = async (token: string): Promise<void> => {
    await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
};

const storeUserData = async (user: User): Promise<void> => {
    await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
};

const clearStorage = async (): Promise<void> => {
    await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA)
    ]);
};

const getStoredUserData = async (): Promise<User | null> => {
    try {
        const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    } catch {
        return null;
    }
};

export const useAuthStore = create<AuthState>()(
    subscribeWithSelector((set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializing: true,
        error: null,

        // Login action
        login: async (credentials: LoginCredentials) => {
            set({ isLoading: true, error: null });

            try {
                const response = await fetchApi<AuthResponse>('/auth/login', {
                    method: 'POST',
                    body: credentials
                });

                // Store token and user data
                await storeToken(response.token);
                await storeUserData(response.user);

                set({
                    user: response.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
            } catch (error) {
                const apiError = error as ApiError;
                set({
                    isLoading: false,
                    error: apiError.message || 'Login failed'
                });
                throw error;
            }
        },

        // Register action
        register: async (credentials: RegisterCredentials) => {
            set({ isLoading: true, error: null });

            try {
                const response = await fetchApi<AuthResponse>('/auth/register', {
                    method: 'POST',
                    body: credentials
                });

                // Store token and user data
                await storeToken(response.token);
                await storeUserData(response.user);

                set({
                    user: response.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
            } catch (error) {
                const apiError = error as ApiError;
                set({
                    isLoading: false,
                    error: apiError.message || 'Registration failed'
                });
                throw error;
            }
        },

        // Logout action
        logout: async () => {
            set({ isLoading: true });

            try {
                // Call logout endpoint to invalidate tokens on server
                await fetchApi('/auth/logout', {
                    method: 'POST',
                    requiresAuth: true
                });
            } catch (error) {
                console.warn('Logout request failed:', error);
                // Continue with local logout even if server request fails
            }

            // Clear local storage and state
            await clearStorage();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        },

        // Refresh token action
        refreshToken: async (): Promise<boolean> => {
            try {
                const token = await appTokenCache?.getToken(STORAGE_KEYS.TOKEN);

                if (!token) {
                    return false;
                }

                const response = await fetchApi<AuthResponse>('/auth/refresh', {
                    method: 'POST',
                    isRefreshRequest: true
                });

                // Store new token and user data
                await storeToken(response.token);
                await storeUserData(response.user);

                // Update state with refreshed user data
                set({
                    user: response.user,
                    isAuthenticated: true
                });

                return true;
            } catch (error) {
                console.warn('Token refresh failed:', error);
                // Clear invalid token
                await clearStorage();
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null
                });
                return false;
            }
        },

        // Load user from storage (called on app start)
        loadUserFromStorage: async () => {
            set({ isInitializing: true });

            try {
                const [token, storedUser] = await Promise.all([
                    appTokenCache?.getToken(STORAGE_KEYS.TOKEN),
                    getStoredUserData()
                ]);

                if (!token || !storedUser) {
                    set({ isInitializing: false });
                    return;
                }

                // Try to refresh token and get fresh user data
                try {
                    const refreshSuccess = await get().refreshToken();

                    if (refreshSuccess) {
                        // Token refresh successful, user data is already updated in refreshToken()
                        set({ isInitializing: false });
                    } else {
                        // Refresh failed, clear storage and require login
                        await clearStorage();
                        set({ isInitializing: false });
                    }
                } catch (error) {
                    console.error('Error refreshing token on app start:', error);
                    // Use cached user data if refresh fails but token exists
                    set({
                        user: storedUser,
                        isAuthenticated: true,
                        isInitializing: false
                    });
                }
            } catch (error) {
                console.error('Error loading user from storage:', error);
                await clearStorage();
                set({ isInitializing: false });
            }
        },

        // Clear error
        clearError: () => set({ error: null }),

        // Update user data
        updateUser: (userData: Partial<User>) => {
            const { user } = get();
            if (user) {
                const updatedUser = { ...user, ...userData };
                storeUserData(updatedUser);
                set({ user: updatedUser });
            }
        }
    }))
);