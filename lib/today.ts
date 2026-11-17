import { getCurrentDate } from "@/store/dietPlan";
import { useEffect, useState } from "react";
import { AppState } from "react-native";

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
