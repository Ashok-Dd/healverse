import { appTokenCache } from "@/lib/auth";
import { fetchApi, setUnauthorizedHandler } from "@/lib/fetchApi";
import type {
  ApiError,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/type";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  // True when the launch-time auth check could not reach the server (offline, 5xx, 429, timeout).
  // The token is kept in that case so the user is not logged out by a temporary problem.
  serverUnreachable: boolean;
  // Set when a 401 ended the session; the login screen shows a one-off notice and clears it.
  sessionExpired: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearSessionExpired: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Secure storage key - only for token
const TOKEN_KEY = "token";

// Helper functions for secure storage (only token)
const storeToken = async (token: string): Promise<void> => {
  await appTokenCache?.saveToken(TOKEN_KEY, token);
};

const clearTokenStorage = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

const getStoredToken = async (): Promise<string | null> => {
  try {
    return (await appTokenCache?.getToken(TOKEN_KEY)) || null;
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
    serverUnreachable: false,
    sessionExpired: false,

    // Login action
    login: async (credentials: LoginCredentials) => {
      set({ isLoading: true, sessionExpired: false });

      try {
        const response = await fetchApi<AuthResponse>("/auth/login", {
          method: "POST",
          body: credentials,
        });

        // Store only token in secure storage
        await storeToken(response!.token);

        // Store user data only in state
        set({
          user: response!.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    // Register action
    register: async (credentials: RegisterCredentials) => {
      set({ isLoading: true });

      try {
        const response = await fetchApi<AuthResponse>("/auth/register", {
          method: "POST",
          body: credentials,
        });

        // Store only token in secure storage
        await storeToken(response!.token);

        // Store user data only in state
        set({
          user: response!.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    // Check auth action (replaces refresh token)
    checkAuth: async (): Promise<boolean> => {
      set({ serverUnreachable: false });
      try {
        const token = await getStoredToken();

        if (!token) {
          set({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
          });
          return false;
        }

        const response = await fetchApi<AuthResponse>("/auth/check-auth", {
          method: "GET",
          requiresAuth: true,
        });

        // Store new token in secure storage
        await storeToken(response!.token);

        // Update state with fresh user data
        set({
          user: response!.user,
          isAuthenticated: true,
          isInitializing: false,
        });

        return true;
      } catch (error) {
        console.warn("Auth check failed:", error);
        const status = (error as ApiError & { status?: number })?.status;

        // Only an explicit 401/403 means the token is bad. Network errors, timeouts,
        // 5xx and 429 are temporary: keep the token and let the user retry.
        if (status === 401 || status === 403) {
          await clearTokenStorage();
          set({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            serverUnreachable: false,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            serverUnreachable: true,
          });
        }
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
        console.warn("Logout request failed:", error);
        // Continue with local logout even if server request fails
      }

      // Clear token storage and reset state
      await clearTokenStorage();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },

    clearSessionExpired: () => set({ sessionExpired: false }),

    // Update user data (only in state, not in storage)
    updateUser: (userData: Partial<User>) => {
      const { user } = get();
      if (user) {
        const updatedUser = { ...user, ...userData };
        set({ user: updatedUser });
      }
    },
  }))
);

// Any authenticated request that returns 401 (e.g. the 7-day token expired mid-session)
// ends the session and sends the user to login. Ignored if already logged out, so several
// parallel 401s only trigger one redirect.
setUnauthorizedHandler(() => {
  if (!useAuthStore.getState().isAuthenticated) return;
  void clearTokenStorage().finally(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      sessionExpired: true,
    });
    router.replace("/(auth)/login");
  });
});
