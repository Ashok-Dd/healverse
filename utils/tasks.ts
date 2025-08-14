import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { NotificationService } from "./notifications"; // Your existing service
import { fetchApi } from "@/lib/fetchApi"; // Your API utility
import { Medication } from "@/types/type";

const MEDICATION_REMINDER_TASK = "MEDICATION_REMINDER_TASK";
const PENDING_REMINDERS_KEY = "PENDING_MEDICATION_REMINDERS";
const ACTIVE_REMINDER_KEY = "ACTIVE_MEDICATION_REMINDER";

// Task Manager definition
TaskManager.defineTask(MEDICATION_REMINDER_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Medication reminder task error:", error);
    return;
  }

  try {
    // Check for pending reminders
    const pendingReminders = await SecureStore.getItemAsync(
      PENDING_REMINDERS_KEY
    );
    const reminders = pendingReminders ? JSON.parse(pendingReminders) : [];

    const now = new Date().getTime();
    const dueReminders = reminders.filter(
      (reminder: any) => reminder.scheduledTime <= now && !reminder.triggered
    );

    for (const reminder of dueReminders) {
      await triggerFullScreenReminder(reminder);

      // Mark as triggered
      reminder.triggered = true;
    }

    // Update storage
    await SecureStore.setItemAsync(
      PENDING_REMINDERS_KEY,
      JSON.stringify(reminders)
    );
  } catch (error) {
    console.error("Background task execution error:", error);
  }
});

// Full-screen reminder trigger
async function triggerFullScreenReminder(reminderData: any) {
  try {
    // Get notification settings from your existing service
    const settings = await NotificationService.getNotificationSettings();

    if (!settings.enabled) return;

    // Trigger intensive vibration pattern if enabled
    if (settings.vibration) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      // Schedule repeated vibrations
      const vibrationInterval = setInterval(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 1000);

      reminderData.vibrationInterval = vibrationInterval;
    }

    // Play alarm sound if enabled
    let soundObject = null;
    if (settings.sound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/medication-alarm.mp3"), // Add your alarm sound file
          {
            shouldPlay: true,
            isLooping: true,
            volume: 1.0,
          }
        );
        soundObject = sound;
      } catch (soundError) {
        console.warn("Could not load alarm sound, using system sound");
      }
    }

    // Send high-priority notification using your existing channel
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💊 URGENT: Medication Reminder",
        body: `Time to take ${reminderData.medicationName} (${reminderData.dosage})`,
        sound: settings.sound ? "default" : false,
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: {
          type: "MEDICATION_REMINDER_FULLSCREEN",
          medicationId: reminderData.medicationId,
          scheduleId: reminderData.scheduleId,
          reminderTime: reminderData.scheduledTime,
          fullScreen: true,
        },
      },
      trigger: null, // Immediate
    });

    // Store active reminder data for the modal
    await SecureStore.setItemAsync(
      ACTIVE_REMINDER_KEY,
      JSON.stringify({
        ...reminderData,
        soundObject: soundObject ? "active" : null,
        startTime: new Date().getTime(),
      })
    );
  } catch (error) {
    console.error("Error triggering full-screen reminder:", error);
  }
}

export class MedicationReminderService {
  // Initialize the background task
  static async initialize() {
    try {
      // Initialize your existing notification service first
      await NotificationService.requestPermissions();

      // Register background task
      await BackgroundFetch.registerTaskAsync(MEDICATION_REMINDER_TASK, {
        minimumInterval: 60000, // Check every minute
        stopOnTerminate: false,
        startOnBoot: true,
      });

      console.log("Medication reminder service initialized");
    } catch (error) {
      console.error("Failed to initialize medication reminder service:", error);
    }
  }

  // Enhanced scheduling that works with your existing service
  static async scheduleMedicationReminders(medication: Medication) {
    try {
      // First, use your existing notification service
      await NotificationService.scheduleMedicationReminders(medication);

      // Then add our enhanced full-screen reminders
      const reminders = [];

      for (const schedule of medication.schedules) {
        if (!schedule.isActive) continue;

        const [hours, minutes] = schedule.time.split(":").map(Number);
        const reminderTime = this.calculateNextReminderTime(schedule.time);

        // Add to background task queue for full-screen alerts
        reminders.push({
          medicationId: medication.id,
          scheduleId: schedule.id,
          medicationName: medication.name,
          dosage: medication.dosage,
          scheduledTime: reminderTime,
          triggered: false,
          instructions: medication.notes || null,
        });
      }

      // Store reminders for background processing
      const existingReminders = await SecureStore.getItemAsync(
        PENDING_REMINDERS_KEY
      );
      const allReminders = existingReminders
        ? JSON.parse(existingReminders)
        : [];

      // Remove old reminders for this medication
      const filteredReminders = allReminders.filter(
        (r: any) => r.medicationId !== medication.id
      );

      filteredReminders.push(...reminders);
      await SecureStore.setItemAsync(
        PENDING_REMINDERS_KEY,
        JSON.stringify(filteredReminders)
      );
    } catch (error) {
      console.error("Error scheduling enhanced medication reminders:", error);
    }
  }

  // Calculate next reminder time
  static calculateNextReminderTime(timeString: string): number {
    const [hours, minutes] = timeString.split(":").map(Number);
    const now = new Date();
    const reminderTime = new Date();

    reminderTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    return reminderTime.getTime();
  }

  // Handle medication logging using your API
  static async logMedication(
    medicationId: string,
    scheduleId: string,
    taken: boolean = true
  ) {
    try {
      const logData = {
        medicationId,
        scheduleId,
        timestamp: new Date().toISOString(),
        taken,
        loggedAt: new Date().getTime(),
      };

      // Use your existing API endpoint
      const response = await fetchApi<any>("/api/medication-logs", {
        method: "POST",
        body: logData,
        requiresAuth: true,
      });

      // Clear active reminder
      await this.clearActiveReminder();

      return response;
    } catch (error) {
      console.error("Error logging medication:", error);
      throw error;
    }
  }

  // Snooze medication (reschedule for 5 minutes later)
  static async snoozeMedication(medicationId: string, scheduleId: string) {
    try {
      const snoozeTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes

      // Add snooze reminder
      const snoozeReminder = {
        medicationId,
        scheduleId,
        medicationName: "Snoozed Medication",
        dosage: "",
        scheduledTime: snoozeTime,
        triggered: false,
        isSnooze: true,
      };

      const existingReminders = await SecureStore.getItemAsync(
        PENDING_REMINDERS_KEY
      );
      const reminders = existingReminders ? JSON.parse(existingReminders) : [];
      reminders.push(snoozeReminder);

      await SecureStore.setItemAsync(
        PENDING_REMINDERS_KEY,
        JSON.stringify(reminders)
      );

      // Clear current active reminder
      await this.clearActiveReminder();

      return true;
    } catch (error) {
      console.error("Error snoozing medication:", error);
      throw error;
    }
  }

  // Clear active reminder (stop sounds, vibrations)
  static async clearActiveReminder() {
    try {
      const activeReminderData = await SecureStore.getItemAsync(
        ACTIVE_REMINDER_KEY
      );
      if (activeReminderData) {
        const reminder = JSON.parse(activeReminderData);

        // Stop vibration
        if (reminder.vibrationInterval) {
          clearInterval(reminder.vibrationInterval);
        }

        // Clear storage
        await SecureStore.deleteItemAsync(ACTIVE_REMINDER_KEY);
      }
    } catch (error) {
      console.error("Error clearing active reminder:", error);
    }
  }

  // Get active reminder data
  static async getActiveReminder() {
    try {
      const activeReminderData = await SecureStore.getItemAsync(
        ACTIVE_REMINDER_KEY
      );
      return activeReminderData ? JSON.parse(activeReminderData) : null;
    } catch (error) {
      console.error("Error getting active reminder:", error);
      return null;
    }
  }

  // Cancel reminders for a medication
  static async cancelMedicationReminders(medicationId: string) {
    try {
      // Use your existing service to cancel notifications
      await NotificationService.cancelMedicationReminders(medicationId);

      // Remove from our background tasks
      const existingReminders = await SecureStore.getItemAsync(
        PENDING_REMINDERS_KEY
      );
      if (existingReminders) {
        const reminders = JSON.parse(existingReminders);
        const filteredReminders = reminders.filter(
          (r: any) => r.medicationId !== medicationId
        );
        await SecureStore.setItemAsync(
          PENDING_REMINDERS_KEY,
          JSON.stringify(filteredReminders)
        );
      }
    } catch (error) {
      console.error("Error canceling medication reminders:", error);
    }
  }
}
