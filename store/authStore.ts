import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { fetchApi } from '@/lib/fetchApi';
import type {
    User,
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
    ApiError
} from '@/types/type';
import { appTokenCache } from "@/lib/auth";

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
    checkAuth: () => Promise<boolean>;
    logout: () => Promise<void>;
    clearError: () => void;
    updateUser: (userData: Partial<User>) => void;
}

// Secure storage key - only for token
const TOKEN_KEY = 'token';

// Helper functions for secure storage (only token)
const storeToken = async (token: string): Promise<void> => {
    await appTokenCache?.saveToken(TOKEN_KEY, token);
};

const clearTokenStorage = async (): Promise<void> => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
};

const getStoredToken = async (): Promise<string | null> => {
    try {
        return await appTokenCache?.getToken(TOKEN_KEY) || null;
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

                // Store only token in secure storage
                await storeToken(response.token);

                // Store user data only in state
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

                // Store only token in secure storage
                await storeToken(response.token);

                // Store user data only in state
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

        // Check auth action (replaces refresh token)
        checkAuth: async (): Promise<boolean> => {
            try {
                const token = await getStoredToken();

                if (!token) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isInitializing: false
                    });
                    return false;
                }

                const response = await fetchApi<AuthResponse>('/auth/check-auth', {
                    method: 'GET',
                    requiresAuth: true,
                });

                // Store new token in secure storage
                await storeToken(response.token);

                // Update state with fresh user data
                set({
                    user: response.user,
                    isAuthenticated: true,
                    isInitializing: false
                });

                return true;
            } catch (error) {
                console.warn('Auth check failed:', error);
                // Clear invalid token and reset state
                await clearTokenStorage();
                set({
                    user: null,
                    isAuthenticated: false,
                    isInitializing: false,
                    error: null
                });
                return false;
            }
        },

        // Logout action
        logout: async () => {
            set({ isLoading: true });

            try {
                // Optional: Call logout endpoint if you have one
                // await fetchApi('/auth/logout', {
                //     method: 'POST',
                //     requiresAuth: true
                // });
            } catch (error) {
                console.warn('Logout request failed:', error);
                // Continue with local logout even if server request fails
            }

            // Clear token storage and reset state
            await clearTokenStorage();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        },

        // Initialize auth (called on app start)
        initializeAuth: async () => {
            set({ isInitializing: true });
            await get().checkAuth();
        },

        // Clear error
        clearError: () => set({ error: null }),

        // Update user data (only in state, not in storage)
        updateUser: (userData: Partial<User>) => {
            const { user } = get();
            if (user) {
                const updatedUser = { ...user, ...userData };
                set({ user: updatedUser });
            }
        }
    }))
);

