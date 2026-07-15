import Constants from 'expo-constants';
import * as Device from 'expo-device';
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
        await Notifications.setNotificationChannelAsync("default", {
          name: "General Notifications",
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
          description: "General notification channel",
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
      // No-op for unknown/unhandled notification types.
      // Future features (e.g. diet/meal reminders) can branch on data.type here.
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
