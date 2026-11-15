import { Button } from "@/components/ui/Button";
import { useThemeColors } from "@/constants/theme";
import type { Message } from "@/types/type";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
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

const formatTime = (timestamp: string) =>
  new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Server ids are unique and positive. Messages made on this device have negative ids that are
// only unique within their own kind, and older saved chats may contain repeats, so the position
// is added for those. The list only grows at the end, so positions of existing messages hold.
const keyExtractor = (item: Message, index: number) =>
  item.id > 0 ? String(item.id) : `${item.outboxStatus ? "queued" : "local"}-${item.id}-${index}`;

const ThinkingBubble = () => {
  const colors = useThemeColors();
  return (
  <View
    accessible
    accessibilityLabel="The dietitian is thinking"
    accessibilityLiveRegion="polite"
    className="flex-row items-center gap-2 self-start px-2 py-3"
  >
    <ActivityIndicator size="small" color={colors.ring} />
    <Text className="font-body text-sm text-muted-foreground">Thinking...</Text>
  </View>
  );
};

export const ChatMessages = ({
  messages,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  error,
  flatListRef,
  isSending = false,
}: ChatMessagesProps) => {
  const colors = useThemeColors();
  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble
        message={item.content}
        isUser={item.sender === "USER"}
        timestamp={formatTime(item.createdAt)}
        outboxStatus={item.outboxStatus}
      />
    ),
    []
  );

  const footer = useMemo(() => (isSending ? <ThinkingBubble /> : null), [isSending]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-1 font-display text-lg text-foreground">Could not load messages</Text>
        <Text className="mb-4 text-center font-body text-sm text-muted-foreground">{error}</Text>
        {onRefresh && <Button title="Try again" variant="soft" size="sm" onPress={onRefresh} />}
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 gap-3 px-4 py-5" accessible accessibilityLabel="Loading messages">
        <View className="h-12 w-3/5 animate-pulse self-end rounded-3xl bg-border" />
        <View className="h-20 w-4/5 animate-pulse rounded-3xl bg-border" />
        <View className="h-12 w-1/2 animate-pulse self-end rounded-3xl bg-border" />
      </View>
    );
  }

  if (messages.length === 0 && !isSending) return <EmptyMessageState />;

  return (
    <FlatList
      ref={flatListRef}
      className="flex-1 px-2"
      contentContainerClassName="py-4"
      data={messages}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListFooterComponent={footer}
      initialNumToRender={12}
      maxToRenderPerBatch={8}
      windowSize={7}
      removeClippedSubviews
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    />
  );
};
