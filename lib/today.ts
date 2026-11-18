import { useEffect, useState } from "react";
import { AppState } from "react-native";

const pad = (value: number): string => String(value).padStart(2, "0");

/** A date as `YYYY-MM-DD` in the device's local time zone. */
export const formatLocalDate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * "Today" as `YYYY-MM-DD` in the device's time zone. The server is told that zone (see
 * lib/timeZone.ts) and files each log under the user's local day, so both sides agree on where
 * a day starts and ends.
 */
export const getCurrentDate = (): string => formatLocalDate(new Date());

/** A `YYYY-MM-DD` date moved by whole days. Pure calendar arithmetic, so no time zone applies. */
export const shiftDate = (date: string, days: number): string => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().split("T")[0];
};

const msUntilNextLocalDay = (): number => {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return nextMidnight.getTime() - now.getTime() + 1000;
};

/**
 * Today's date (the user's local day), kept current: it changes when the day rolls over and
 * when the app returns to the foreground. A screen that read the date once when it mounted
 * would keep showing yesterday after the app had been open overnight.
 */
export function useToday(): string {
  const [today, setToday] = useState(getCurrentDate);

  useEffect(() => {
    const refresh = () => setToday(getCurrentDate());
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    const timer = setTimeout(refresh, msUntilNextLocalDay());
    return () => {
      subscription.remove();
      clearTimeout(timer);
    };
  }, [today]);

  return today;
}
