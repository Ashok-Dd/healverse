import { useOutboxEntries } from "@/hooks/useOutboxEntries";
import { fetchApi } from "@/lib/fetchApi";
import { sendChatMessage } from "@/lib/outboxActions";
import { withPausedAsLoading } from "@/lib/queryStatus";
import { Message } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { FlatList } from "react-native";

interface ChatInterface {
    messages: Message[];
    isMessagesLoading: boolean;
    errorLoadingMessages: Error | null;
    sendMessage: (message: string) => void;
    /** True while the dietitian's reply is being generated. */
    isSendingMessage: boolean;
    refetchMessages: () => void;
    isRefetching: boolean;
    flatListRef: React.RefObject<FlatList<Message> | null>;
}

interface UseChatOptions {
    isExistingConversation?: boolean;
}

/**
 * Messages are queued the moment they are sent and shown right away. Offline they wait with a
 * "Waiting to sync" marker, and the dietitian's reply arrives once the queue has been uploaded
 * (a reply needs the AI service, so it cannot be produced offline).
 */
export const useChat = (
    conversationId: string,
    options: UseChatOptions = {}
): ChatInterface => {
    const { isExistingConversation = false } = options;
    const flatListRef = useRef<FlatList<Message> | null>(null);

    const query = withPausedAsLoading(
        useQuery<Message[]>({
            queryKey: ["messages", conversationId],
            queryFn: () =>
                fetchApi<Message[]>(`/api/conversations/${conversationId}/messages`, {
                    method: "GET",
                    requiresAuth: true,
                }),
            enabled: !!conversationId && isExistingConversation,
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        })
    );

    const queued = useOutboxEntries("chat");
    const queuedForChat = useMemo(
        () => queued.filter((entry) => entry.payload.conversationId === conversationId),
        [queued, conversationId]
    );

    const messages = useMemo<Message[]>(
        () => [
            ...(query.data ?? []),
            ...queuedForChat.map((entry) => ({
                id: -entry.seq,
                conversationId,
                content: entry.payload.content,
                sender: "USER" as const,
                createdAt: entry.createdAt,
                outboxStatus: entry.status,
            })),
        ],
        [query.data, queuedForChat, conversationId]
    );

    const sendMessage = useCallback(
        (message: string) => {
            const content = message.trim();
            if (!conversationId || !content) return;
            sendChatMessage(conversationId, content);
        },
        [conversationId]
    );

    // Keep the latest message in view when messages first load or change.
    useEffect(() => {
        if (messages.length > 0) {
            const timer = setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            return () => clearTimeout(timer);
        }
    }, [messages.length]);

    return {
        messages,
        isMessagesLoading: query.isLoading && queuedForChat.length === 0,
        errorLoadingMessages: query.error,
        sendMessage,
        isSendingMessage: queuedForChat.some((entry) => entry.status === "syncing"),
        refetchMessages: query.refetch,
        isRefetching: query.isRefetching,
        flatListRef,
    };
};
