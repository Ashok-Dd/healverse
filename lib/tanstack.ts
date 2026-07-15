import { fetchApi } from "@/lib/fetchApi";
import { ApiResponse, Conversation, GamificationSummary, InsightsData } from "@/types/type";
import { useQuery } from "@tanstack/react-query";


export const useConversations = () => {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: () => fetchApi<Conversation[]>("/api/conversations/" , {method: 'GET' , requiresAuth : true}),
    });
};

export const useGamificationSummary = () => {
    return useQuery({
        queryKey: ['gamification', 'summary'],
        queryFn: () => fetchApi<GamificationSummary>("/api/gamification/summary", {method: 'GET', requiresAuth: true}),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });
};

export const useInsights = () => {
    return useQuery({
        queryKey: ['insights'],
        queryFn: () => fetchApi<InsightsData>("/api/insights", {method: 'GET', requiresAuth: true}),
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes (formerly cacheTime)
    });
};