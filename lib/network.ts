import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";

/**
 * Feeds the device's connectivity into TanStack Query. While offline, queries pause instead
 * of failing, and everything refetches by itself when the connection returns.
 *
 * `isInternetReachable` is null until the first probe finishes; only an explicit `false`
 * counts as offline, so the app is never wrongly locked out at startup.
 */
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected && state.isInternetReachable !== false);
  })
);

/** Re-renders the caller whenever the device goes online or offline. */
export function useIsOnline(): boolean {
  return useSyncExternalStore(onlineManager.subscribe, () => onlineManager.isOnline());
}
