import { fetchApi } from "@/lib/fetchApi";
import { Conversation, GamificationSummary, InsightsData } from "@/types/type";
import { withPausedAsLoading } from "@/lib/queryStatus";
import { useQuery } from "@tanstack/react-query";


export const useConversations = () => {
    return withPausedAsLoading(
        useQuery({
            queryKey: ['conversations'],
            queryFn: () => fetchApi<Conversation[]>("/api/conversations/" , {method: 'GET' , requiresAuth : true}),
        })
    );
};

export const useGamificationSummary = () => {
    return withPausedAsLoading(
        useQuery({
            queryKey: ['gamification', 'summary'],
            queryFn: () => fetchApi<GamificationSummary>("/api/gamification/summary", {method: 'GET', requiresAuth: true}),
            staleTime: 5 * 60 * 1000, // 5 minutes
        })
    );
};

export const useInsights = () => {
    return withPausedAsLoading(
        useQuery({
            queryKey: ['insights'],
            queryFn: () => fetchApi<InsightsData>("/api/insights", {method: 'GET', requiresAuth: true}),
            staleTime: 10 * 60 * 1000, // 10 minutes
        })
    );
};