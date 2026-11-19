import { MEALS, NotificationService, type Meal } from "@/utils/notifications";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const STORAGE_KEY = "meal_reminders";

type EnabledMeals = Record<Meal, boolean>;

const ALL_OFF: EnabledMeals = { breakfast: false, lunch: false, dinner: false };

const parse = (raw: string | null): EnabledMeals => {
  const saved = raw ? JSON.parse(raw) : {};
  return {
    breakfast: saved.breakfast === true,
    lunch: saved.lunch === true,
    dinner: saved.dinner === true,
  };
};

interface ReminderState {
  enabled: EnabledMeals;
  /** Reads the saved switches and restores the schedule. Safe to call on every launch. */
  hydrate: () => Promise<void>;
  /** Resolves false when the user refused the notification permission; the switch stays off. */
  setEnabled: (meal: Meal, on: boolean) => Promise<boolean>;
  /** Turns everything off in memory and on disk. Scheduled notifications are cancelled by the caller. */
  reset: () => void;
}

const persist = (enabled: EnabledMeals) =>
  SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(enabled)).catch(() => {});

export const useReminderStore = create<ReminderState>((set, get) => ({
  enabled: ALL_OFF,

  hydrate: async () => {
    try {
      const saved = parse(await SecureStore.getItemAsync(STORAGE_KEY));
      const wanted = MEALS.filter((meal) => saved[meal]);
      if (wanted.length === 0) return;

      // The user can revoke the permission in system settings: then the switches must show off.
      if (!(await NotificationService.hasPermission())) {
        persist(ALL_OFF);
        return;
      }
      await Promise.all(wanted.map(NotificationService.scheduleMealReminder));
      set({ enabled: saved });
    } catch {
      // Unreadable storage or a scheduling failure leaves the reminders off.
    }
  },

  setEnabled: async (meal, on) => {
    if (on) {
      if (!(await NotificationService.requestPermission())) return false;
      await NotificationService.scheduleMealReminder(meal);
    } else {
      await NotificationService.cancelMealReminder(meal);
    }
    const enabled = { ...get().enabled, [meal]: on };
    set({ enabled });
    persist(enabled);
    return true;
  },

  reset: () => {
    set({ enabled: ALL_OFF });
    SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {});
  },
}));
