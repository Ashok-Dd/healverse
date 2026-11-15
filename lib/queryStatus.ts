import type { FetchStatus } from "@tanstack/react-query";

/**
 * TanStack's `isLoading` is false for a query that is waiting for the network, so a screen
 * with no cached data and no connection would show an empty state instead of a skeleton.
 * This makes `isLoading` mean "no data yet and one is on its way (fetching or paused)".
 * A disabled query stays "not loading".
 */
export function withPausedAsLoading<
  T extends { isPending: boolean; fetchStatus: FetchStatus; isLoading: boolean },
>(query: T): T {
  return { ...query, isLoading: query.isPending && query.fetchStatus !== "idle" };
}
