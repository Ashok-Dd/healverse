import { Medication } from '@/types/type';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import * as SecureStore from "expo-secure-store";
import { Platform } from 'react-native';



// function handleRegistrationError(errorMessage: string) {
//   alert(errorMessage);
//   throw new Error(errorMessage);
// }

// export async function registerForPushNotificationsAsync() {
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       handleRegistrationError('Permission not granted to get push token for push notification!');
//       return;
//     }
//     const projectId =
//       Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
//     if (!projectId) {
//       handleRegistrationError('Project ID not found');
//     }
//     try {
//       const pushTokenString = (
//         await Notifications.getExpoPushTokenAsync({
//           projectId,
//         })
//       ).data;
//       console.log(pushTokenString);
//       return pushTokenString;
//     } catch (e: unknown) {
//       handleRegistrationError(`${e}`);
//     }
//   } else {
//     handleRegistrationError('Must use physical device for push notifications');
//   }
// }


// Configure notifications globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,
  }),
});


export class NotificationService {
  private static STORAGE_KEY = "notification_settings";

  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("medication-reminders", {
          name: "Medication Reminders",
          importance: Notifications.AndroidImportance.HIGH,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#4CAF50",
          description: "Reminders for taking your medications",
        });

        await Notifications.setNotificationChannelAsync("follow-ups", {
          name: "Follow-up Reminders",
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: "default",
          vibrationPattern: [0, 100, 100, 100],
          lightColor: "#FF9800",
          description: "Follow-up reminders for missed medications",
        });
      }

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.log("Notification permissions not granted");
          return false;
        }

        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        if (projectId) {
          const token = await Notifications.getExpoPushTokenAsync({ projectId });
          console.log("Push token:", token.data);
        }

        return true;
      } else {
        console.log("Must use physical device for Push Notifications");
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  static async scheduleMedicationReminders(medication: Medication): Promise<void> {
    try {
      const settings = await this.getNotificationSettings();
      if (!settings.enabled) return;

      for (const schedule of medication.schedules) {
        if (!schedule.isActive) continue;

        const [hours, minutes] = schedule.time.split(":").map(Number);
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);

        if (scheduledTime <= now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const trigger: Notifications.NotificationTriggerInput = {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hours,
          minute: minutes,
        };

        await Notifications.scheduleNotificationAsync({
          identifier: `medication-${medication.id}-${schedule.id}`,
          content: {
            title: "💊 Medication Reminder",
            body: `Time to take ${medication.name} (${medication.dosage})`,
            data: {
              medicationId: medication.id,
              scheduleId: schedule.id,
              type: "medication_reminder",
            },
            sound: "default",
            categoryIdentifier: "MEDICATION_REMINDER",
          },
          trigger,
        });

        if (settings.followUpEnabled && settings.followUpDelay > 0) {
          const followUpTrigger: Notifications.NotificationTriggerInput = {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: hours,
            minute: minutes + settings.followUpDelay,
          };

          await Notifications.scheduleNotificationAsync({
            identifier: `followup-${medication.id}-${schedule.id}`,
            content: {
              title: "⏰ Missed Medication?",
              body: `Did you take your ${medication.name}? Tap to log it.`,
              data: {
                medicationId: medication.id,
                scheduleId: schedule.id,
                type: "follow_up",
              },
              sound: "default",
              categoryIdentifier: "FOLLOW_UP",
            },
            trigger: followUpTrigger,
          });
        }
      }
    } catch (error) {
      console.error("Error scheduling medication reminders:", error);
    }
  }

  static async cancelMedicationReminders(medicationId: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const toCancel = scheduledNotifications
        .filter(
          (notification) =>
            notification.identifier.includes(`medication-${medicationId}`) ||
            notification.identifier.includes(`followup-${medicationId}`)
        )
        .map((notification) => notification.identifier);

      for (const id of toCancel) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    } catch (error) {
      console.error("Error canceling medication reminders:", error);
    }
  }

  // ✅ Using SecureStore instead of AsyncStorage
  static async getNotificationSettings() {
    try {
      const stored = await SecureStore.getItemAsync(this.STORAGE_KEY);
      return stored
        ? JSON.parse(stored)
        : {
            enabled: true,
            sound: true,
            vibration: true,
            followUpEnabled: true,
            followUpDelay: 15,
          };
    } catch (error) {
      console.error("Error getting notification settings:", error);
      return {
        enabled: true,
        sound: true,
        vibration: true,
        followUpEnabled: true,
        followUpDelay: 15,
      };
    }
  }

  static async updateNotificationSettings(settings: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  }

  static async handleNotificationReceived(notification: Notifications.Notification) {
    try {
      const { data } = notification.request.content;
      console.log("Notification received:", data);

      if (data.type === "medication_reminder") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  }

  static async handleNotificationResponse(response: Notifications.NotificationResponse) {
    try {
      const { data } = response.notification.request.content;
      console.log("Notification tapped:", data);
    } catch (error) {
      console.error("Error handling notification response:", error);
    }
  }
}
