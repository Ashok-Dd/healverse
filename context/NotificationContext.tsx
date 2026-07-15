import { NotificationService } from "@/utils/notifications";
import * as Notifications from "expo-notifications";
import React, { createContext, ReactNode, useContext, useEffect, useMemo } from "react";

interface NotificationContextType {}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  useEffect(() => {
    NotificationService.requestPermissions();

    // Set up notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener(
      NotificationService.handleNotificationReceived
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        NotificationService.handleNotificationResponse
      );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const value = useMemo<NotificationContextType>(() => ({}), []);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
