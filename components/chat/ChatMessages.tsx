import { Message } from "@/types/type";
import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import EmptyMessageState from "./EmptyMessageState";
import { MessageBubble } from "./MessageBubble";

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  error?: string | null;
  flatListRef: React.RefObject<FlatList<Message> | null>;
  isSending?: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  error,
  flatListRef,
  isSending
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Create data array that includes messages and thinking indicator
  const dataWithThinking = React.useMemo(() => {
    const data = [...messages];
    if (isSending) {
      data.push({
        id: 'thinking-indicator',
        content: 'Thinking...',
        sender: 'BOT',
        createdAt: new Date().toISOString(),
        isThinking: true
      } as unknown as Message & { isThinking: boolean });
    }
    return data;
  }, [messages, isSending]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-red-500 text-center mb-2">
          Error loading messages
        </Text>
        <Text className="text-gray-500 text-center">{error}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 py-5 gap-3">
        <View
          className={"mx-auto bg-gray-300 w-full h-7 rounded-xl animate-pulse max-w-xs"}
        />
        <View
          className={"mx-auto bg-gray-300 w-full h-7 rounded-xl animate-pulse max-w-[80%]"}
        />
      </View>
    );
  }

  if (messages.length === 0 && !isSending) {
    return (
      <View className="flex-1">
        <View className="flex-1 justify-center items-center">
          <EmptyMessageState />
        </View>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      className="flex-1 px-4"
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
      data={dataWithThinking}
      keyExtractor={(item, index) => `${item.id ?? index}`}
      renderItem={({ item }) => {
        const isThinking = (item as any).isThinking;
        
        if (isThinking) {
          return (
            <View className="flex-row justify-start mb-4">
              <View className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                <View className="flex-row items-center">
                  <Text className="text-gray-600 animate-pulse">Thinking</Text>
                  <View className="ml-1 flex-row">
                    <Text className="text-gray-600 animate-pulse" style={{ animationDelay: '0ms' }}>.</Text>
                    <Text className="text-gray-600 animate-pulse" style={{ animationDelay: '200ms' }}>.</Text>
                    <Text className="text-gray-600 animate-pulse" style={{ animationDelay: '400ms' }}>.</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }

        return (
          <MessageBubble
            message={item.content}
            isUser={item.sender === "USER"}
            timestamp={formatTimestamp(item.createdAt)}
          />
        );
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    />
  );
};