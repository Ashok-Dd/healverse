import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetchApi";
import { Message, Role } from "@/types/type";
import { useCallback, useMemo, useRef, useEffect } from "react";
import { Alert, FlatList } from "react-native";

interface ChatInterface {
    messages: Message[];
    isMessagesLoading: boolean;
    errorLoadingMessages: Error | null;
    sendMessage: (message: string) => void;
    isSendingMessage: boolean;
    sendMessageError: Error | null;
    refetchMessages: () => void;
    isRefetching: boolean;
    retryFailedMessage: () => void;
    clearError: () => void;
    flatListRef: React.RefObject<FlatList<Message> | null>;
}

interface SendMessagePayload {
    sender: Role;
    content: string;
}

interface UseChatOptions {
    isExistingConversation?: boolean;
}

export const useChat = (
    conversationId: string,
    options: UseChatOptions = {}
): ChatInterface => {
    const queryClient = useQueryClient();
    const { isExistingConversation = false } = options;

    const flatListRef = useRef<FlatList<Message> | null>(null);

    const queryKey = useMemo(
        () => ["messages", conversationId],
        [conversationId]
    );

    const {
        data: messages = [],
        isLoading: isMessagesLoading,
        error: errorLoadingMessages,
        refetch: refetchMessages,
        isRefetching,
    } = useQuery<Message[]>({
        queryKey,
        queryFn: async () => {
            if (!conversationId) {
                throw new Error("Conversation ID is required");
            }
            return await fetchApi<Message[]>(
                `/api/conversations/${conversationId}/messages`,
                {
                    method: "GET",
                    requiresAuth: true,
                }
            );
        },
        enabled: !!conversationId && isExistingConversation,
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, error) => {
            if (
                error?.message?.includes("401") ||
                error?.message?.includes("403") ||
                error?.message?.includes("500")
            ) {
                return false;
            }
            return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });

    const sendMessageMutation = useMutation<Message, Error, string>({
        mutationFn: async (userMessage: string) => {
            if (!userMessage.trim()) {
                throw new Error("Message cannot be empty");
            }
            const response = await fetchApi<Message>(
                `/api/conversations/${conversationId}/messages`,
                {
                    body: {
                        sender: "USER",
                        content: userMessage.trim(),
                    },
                    method: "POST",
                    requiresAuth: true,
                }
            );
            return response;
        },
        onMutate: async (userMessage: string) => {
            await queryClient.cancelQueries({ queryKey });

            const previousMessages = queryClient.getQueryData<Message[]>(queryKey);

            const tempId = `temp-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`;

            const tempUserMessage: Partial<Message> = {
                id: tempId as any,
                sender: "USER",
                content: userMessage.trim(),
                conversationId,
            };

            queryClient.setQueryData<Message[]>(queryKey, (old = []) => [
                ...old,
                tempUserMessage as Message,
            ]);

            // Scroll immediately after optimistic update
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 500);

            return { previousMessages, tempId };
        },
        onSuccess: (response) => {
            queryClient.setQueryData<Message[]>(queryKey, (old = []) => [
                ...old.filter((m) => m.id !== (response as any).tempId),
                response,
            ]);

            // Scroll when server message arrives
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 500);
        },
        onError: (error, userMessage, context) => {
            console.error("Failed to send message:", error.message);
            queryClient.setQueryData(queryKey, context?.previousMessages);
            Alert.alert(
                "Message Failed",
                "Failed to send message. Please try again.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Retry", onPress: () => sendMessage(userMessage) },
                ]
            );
        },
    });

    const sendMessage = useCallback(
        (message: string) => {
            if (!conversationId) {
                Alert.alert("Error", "No conversation selected");
                return;
            }
            sendMessageMutation.mutate(message);
        },
        [conversationId, sendMessageMutation]
    );

    const retryFailedMessage = useCallback(() => {
        if (sendMessageMutation.variables) {
            sendMessageMutation.mutate(sendMessageMutation.variables);
        }
    }, [sendMessageMutation]);

    const clearError = useCallback(() => {
        sendMessageMutation.reset();
    }, [sendMessageMutation]);

    // Auto-scroll when messages are first loaded or change
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
            }, 50);
        }
    }, [messages.length]);

    return {
        messages,
        isMessagesLoading,
        errorLoadingMessages: errorLoadingMessages as Error | null,
        sendMessage,
        isSendingMessage: sendMessageMutation.isPending,
        sendMessageError: sendMessageMutation.error,
        refetchMessages,
        isRefetching,
        retryFailedMessage,
        clearError,
        flatListRef,
    };
};
