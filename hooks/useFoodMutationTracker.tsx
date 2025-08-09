import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { FoodLog } from "@/types/type";

export function useFoodLogMutationTracker() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [variables, setVariables] = useState<FormData | null>(null);
    const [result, setResult] = useState<FoodLog | null>(null);

    useEffect(() => {
        const unsubscribe = queryClient.getMutationCache().subscribe(() => {
            const mutations = queryClient.getMutationCache().getAll();

            // Find any pending or completed "addFoodLog" mutations
            const foodLogMutation = mutations.find((m) =>
                Array.isArray(m.options.mutationKey) &&
                m.options.mutationKey.includes("addFoodLog")
            );

            if (foodLogMutation) {
                const status = foodLogMutation.state.status;

                queueMicrotask(() => {
                    if (status === "pending") {
                        setLoading(true);
                        setVariables(foodLogMutation.state.variables as FormData);
                        setResult(null);
                    } else if (status === "success") {
                        setLoading(false);
                        setResult(foodLogMutation.state.data as FoodLog);
                    } else if (status === "error") {
                        setLoading(false);
                        setResult(null);
                    }
                });
            } else {
                queueMicrotask(() => {
                    setLoading(false);
                    setVariables(null);
                    setResult(null);
                });
            }

        });

        return unsubscribe;
    }, [queryClient]);

    return { loading, variables, result };
}
