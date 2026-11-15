import { MutationCache, QueryClient } from "@tanstack/react-query";
import "./network";
import { CACHE_MAX_AGE_MS } from "./queryPersistence";
import { showToast } from "./toast";

let queryClient: QueryClient;

export function getQueryClient() {
    if(!queryClient) {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    // TanStack Query's own default is retry: 3 with exponential
                    // backoff (up to ~30s) and isLoading stays true through all
                    // of it — every failing query on a tab (expired token, 5xx,
                    // network blip) was silently retrying for tens of seconds
                    // before ever showing an error, which read as "stuck."
                    retry: (failureCount, error) => {
                        const status = (error as any)?.status;
                        if (status === 401 || status === 403 || status === 404 || status === 429 || status === 502) {
                            return false; // same bad token/URL, or rate limit / AI provider failure: retrying only makes it worse
                        }
                        return failureCount < 1;
                    },
                    retryDelay: 500,
                    // Cached data must outlive the screen that loaded it, or there is nothing
                    // to show (or persist) the next time the app opens. Same as the disk max age.
                    gcTime: CACHE_MAX_AGE_MS,
                },
            },
            // Runs for every mutation across the app (add/update/delete food,
            // water, exercise logs, etc.) even when a hook defines its own
            // onSuccess with no onError — without this, failed mutations were
            // failing silently with zero feedback to the user.
            mutationCache: new MutationCache({
                onError: (error) => {
                    showToast(error instanceof Error ? error.message : "Something went wrong", {
                        type: "error",
                    });
                },
            }),
        });
    }
    return queryClient;
};