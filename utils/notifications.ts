import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Platform } from "react-native";

export type Meal = "breakfast" | "lunch" | "dinner";

export const MEALS: readonly Meal[] = ["breakfast", "lunch", "dinner"];

interface MealReminderConfig {
  label: string;
  hour: number;
  minute: number;
  body: string;
}

export const MEAL_REMINDERS: Record<Meal, MealReminderConfig> = {
  breakfast: {
    label: "Breakfast",
    hour: 8,
    minute: 0,
    body: "Time for breakfast. Log it to stay on track.",
  },
  lunch: {
    label: "Lunch",
    hour: 13,
    minute: 14,
    body: "Time for lunch. Log it to stay on track.",
  },
  dinner: {
    label: "Dinner",
    hour: 20,
    minute: 0,
    body: "Time for dinner. Log it to stay on track.",
  },
};

const MEAL_REMINDER_TYPE = "meal-reminder";
const MEAL_CHANNEL_ID = "meal-reminders";

const reminderId = (meal: Meal) => `${MEAL_REMINDER_TYPE}-${meal}`;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  /** Whether the user has already allowed notifications. Never shows a prompt. */
  static async hasPermission(): Promise<boolean> {
    const { granted } = await Notifications.getPermissionsAsync();
    return granted;
  }

  /** Asks for permission only when it was not decided yet; false if the user declined. */
  static async requestPermission(): Promise<boolean> {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const { granted } = await Notifications.requestPermissionsAsync();
    return granted;
  }

  /** Repeats every day at the meal's time. Scheduling again replaces the earlier one. */
  static async scheduleMealReminder(meal: Meal): Promise<void> {
    const { label, hour, minute, body } = MEAL_REMINDERS[meal];
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(MEAL_CHANNEL_ID, {
        name: "Meal reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    await Notifications.scheduleNotificationAsync({
      identifier: reminderId(meal),
      content: { title: label, body, data: { type: MEAL_REMINDER_TYPE, meal } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: MEAL_CHANNEL_ID,
      },
    });
  }

  static async cancelMealReminder(meal: Meal): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(reminderId(meal));
  }

  static handleNotificationResponse(response: Notifications.NotificationResponse) {
    const { data } = response.notification.request.content;
    if (data?.type === MEAL_REMINDER_TYPE) {
      router.push("/(root)/(tabs)/logging");
    }
  }
}