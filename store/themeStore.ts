import * as SecureStore from "expo-secure-store";
import { Appearance } from "react-native";
import { create } from "zustand";

export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "theme_preference";

const isPreference = (value: string | null): value is ThemePreference =>
  value === "system" || value === "light" || value === "dark";

/** Appearance drives both React Native's useColorScheme and NativeWind's dark classes. */
const apply = (preference: ThemePreference) =>
  Appearance.setColorScheme(preference === "system" ? null : preference);

interface ThemeState {
  preference: ThemePreference;
  /** False until the saved choice has been read, so the first frame uses the right theme. */
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setPreference: (preference: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  preference: "system",
  hydrated: false,

  hydrate: async () => {
    try {
      const saved = await SecureStore.getItemAsync(STORAGE_KEY);
      if (isPreference(saved)) {
        apply(saved);
        set({ preference: saved });
      }
    } catch {
      // Unreadable storage just means the default (follow the system).
    }
    set({ hydrated: true });
  },

  setPreference: (preference) => {
    apply(preference);
    set({ preference });
    SecureStore.setItemAsync(STORAGE_KEY, preference).catch(() => {});
  },
}));
