// components/chat/ChatMessages.tsx
import { Message } from "@/types/type";
import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import EmptyMessageState from "./EmptyMessageState";
import HealthQueriesHorizontalScroll from "./HealthQueriesHorizantalScroll";
import { MessageBubble } from "./MessageBubble";

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  error?: string | null;
  flatListRef: React.RefObject<FlatList<Message> | null>;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  error,
    flatListRef
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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

  if (messages.length === 0) {
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
      className="flex-1 px-4 "
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
      data={messages}
      keyExtractor={(item, index) => `${item.id ?? index}`} // fallback to index if id not available
      renderItem={({ item }) => (
        <MessageBubble
          message={item.content}
          isUser={item.sender === "USER"}
          timestamp={formatTimestamp(item.createdAt)}
        />
      )}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    />
  );
};
