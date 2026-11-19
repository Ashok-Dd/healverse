import { useReminderStore } from "@/store/reminderStore";
import { NotificationService } from "@/utils/notifications";
import * as Notifications from "expo-notifications";
import React, { ReactNode, useEffect } from "react";

/**
 * Restores the saved meal reminders and opens the right screen when one is tapped. It never asks
 * for permission: that happens when the user turns a reminder on (see reminderStore).
 */
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const hydrate = useReminderStore((s) => s.hydrate);
  // Also covers a tap that launched the app from a closed state.
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (response) NotificationService.handleNotificationResponse(response);
  }, [response]);

  return <>{children}</>;
};
