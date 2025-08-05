import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetchApi";
import {Message, Role} from "@/types/type";
import { useCallback, useMemo } from "react";
import { Alert } from "react-native";

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
}

interface SendMessagePayload {
    sender: Role;
    content: string;
}

interface UseChatOptions {
    isExistingConversation?: boolean; // Flag to indicate if this is an existing conversation
}

export const useChat = (conversationId: string, options: UseChatOptions = {}): ChatInterface => {
    const queryClient = useQueryClient();
    const { isExistingConversation = false } = options;

    // Memoize query key to prevent unnecessary re-renders
    const queryKey = useMemo(() => ["messages", conversationId], [conversationId]);

    // Fetch messages query
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

            return await fetchApi<Message[]>(`/api/conversations/${conversationId}/messages`, {
                method: "GET",
                requiresAuth: true,
            });
        },
        enabled: !!conversationId && isExistingConversation, // Only fetch if it's an existing conversation
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        retry: (failureCount, error) => {
            // Retry up to 3 times, but not for auth errors
            if (error?.message?.includes('401') || error?.message?.includes('403') || error?.message?.includes('500')) {
                return false;
            }
            return failureCount < 3;
        },
        refetchOnWindowFocus: false, // Disable for mobile
        refetchOnReconnect: true, // Re-fetch when network reconnects
    });

    // Send message mutation
    const sendMessageMutation = useMutation<Message, Error, string>({
        mutationFn: async (userMessage: string) => {
            if (!userMessage.trim()) {
                throw new Error("Message cannot be empty");
            }

            // For new conversations, you might want to create the conversation first
            // Then send the message
            const response = await fetchApi<Message>(
                `/api/conversations/${conversationId}/messages`,
                {
                    body: {
                        sender: 'USER',
                        content: userMessage.trim(),
                    },
                    method: "POST",
                    requiresAuth: true,
                }
            );

            return response;
        },
        onMutate: async (userMessage: string) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey });

            // Snapshot the previous value
            const previousMessages = queryClient.getQueryData<Message[]>(queryKey);

            // Create unique temporary ID using timestamp + random number
            const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Optimistically update to the new value
            // @ts-ignore
            const tempUserMessage: Partial<Message> = {
                id: tempId,
                sender: 'USER',
                content: userMessage.trim(),
                conversationId,
            };

            queryClient.setQueryData<Message[]>(queryKey, (old = []) => [
                ...old,
                tempUserMessage,
            ]);

            // Return a context object with the snapshotted value and temp ID
            return { previousMessages, tempId };
        },
        onSuccess: (response) => {
            queryClient.setQueryData<Message[]>(queryKey, (old = []) => [...old, response]);
        },
        onError: (error, userMessage, context) => {
            console.error("Failed to send message:", error.message);
            // If the mutation fails, use the context returned from onMutate to roll back
            queryClient.setQueryData(queryKey, context?.previousMessages);

            // Show error alert (React Native specific)
            Alert.alert(
                "Message Failed",
                "Failed to send message. Please try again.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Retry", onPress: () => sendMessage(userMessage) }
                ]
            );
        },
        onSettled: () => {
            // Remove invalidateQueries to prevent unnecessary refetches
            // The optimistic update should handle the UI state
        },
    });

    // Memoized send message function
    const sendMessage = useCallback((message: string) => {
        if (!conversationId) {
            Alert.alert("Error", "No conversation selected");
            return;
        }
        sendMessageMutation.mutate(message);
    }, [conversationId, sendMessageMutation]);

    // Retry failed message
    const retryFailedMessage = useCallback(() => {
        if (sendMessageMutation.variables) {
            sendMessageMutation.mutate(sendMessageMutation.variables);
        }
    }, [sendMessageMutation]);

    // Clear errors
    const clearError = useCallback(() => {
        sendMessageMutation.reset();
    }, [sendMessageMutation]);

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
    };
};