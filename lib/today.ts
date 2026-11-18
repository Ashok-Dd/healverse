import { useEffect, useState } from "react";
import { AppState } from "react-native";

/**
 * "Today" as `YYYY-MM-DD` in UTC. This must match the server: it stores `loggedAt` as a UTC
 * wall-clock time and fetches a day by that UTC range, so a local date would miss logs made
 * between local midnight and the UTC day change (e.g. 00:00-05:30 in India).
 * TODO: switch to the user's local date once the server is told the user's time zone.
 */
export const getCurrentDate = (): string => new Date().toISOString().split("T")[0];

const msUntilNextUtcDay = (): number => {
  const now = new Date();
  const nextMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return nextMidnight - now.getTime() + 1000;
};

/**
 * Today's date (UTC, the day the server files logs under), kept current: it changes when the
 * UTC day rolls over and when the app returns to the foreground. A screen that read the date
 * once when it mounted would keep showing yesterday after the app had been open overnight.
 */
export function useToday(): string {
  const [today, setToday] = useState(getCurrentDate);

  useEffect(() => {
    const refresh = () => setToday(getCurrentDate());
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    const timer = setTimeout(refresh, msUntilNextUtcDay());
    return () => {
      subscription.remove();
      clearTimeout(timer);
    };
  }, [today]);

  return today;
}
