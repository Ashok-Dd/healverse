import ErrorCard from "@/components/cards/ErrorCard";
import { BackHeader } from "@/components/headers/BackHeader";
import { Button } from "@/components/ui/Button";
import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import { useThemeColors } from "@/constants/theme";
import { useConversations } from "@/lib/tanstack";
import type { Conversation } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Row =
  | { kind: "header"; id: string; label: string }
  | { kind: "item"; id: string; conversation: Conversation };

const DAY = 86_400_000;

const groupLabel = (dateString: string) => {
  const age = Date.now() - new Date(dateString).getTime();
  if (age < DAY) return "Today";
  if (age < 2 * DAY) return "Yesterday";
  if (age < 7 * DAY) return "This week";
  return "Earlier";
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  if (Date.now() - date.getTime() < DAY) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const startNewChat = () =>
  router.navigate({ pathname: "/(root)/(tabs)/dietitian", params: { fresh: String(Date.now()) } } as any);

const ConversationRow = memo(function ConversationRow({
  conversation,
}: {
  conversation: Conversation;
}) {
  const title = conversation.title || "New chat";
  return (
    <Pressable
      onPress={() => router.push(`/(root)/conversation/${conversation.id}` as any)}
      accessibilityRole="button"
      accessibilityLabel={`Open conversation ${title}`}
      className="mb-2 min-h-[64px] flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 active:opacity-80"
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-accent">
        <Ionicons name="chatbubble-ellipses-outline" size={20} className="text-accent-foreground" />
      </View>
      <View className="flex-1">
        <Text className="font-body-semibold text-base text-foreground" numberOfLines={1}>
          {title}
        </Text>
        <Text className="font-body text-xs text-muted-foreground">
          {formatTime(conversation.updatedAt)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} className="text-muted-foreground" />
    </Pressable>
  );
});

const SkeletonRows = () => (
  <View accessible accessibilityLabel="Loading conversations" className="px-4 pt-2">
    {[0, 1, 2, 3, 4].map((i) => (
      <View key={i} className="mb-2 h-16 animate-pulse rounded-2xl bg-muted" />
    ))}
  </View>
);

export default function Conversations() {
  const colors = useThemeColors();
  const { data, isLoading, error, refetch, isRefetching } = useConversations();
  const [search, setSearch] = useState("");

  // Newest first, grouped under Today / Yesterday / This week / Earlier.
  const rows = useMemo<Row[]>(() => {
    const term = search.trim().toLowerCase();
    const sorted = [...(data ?? [])]
      .filter((c) => !term || (c.title ?? "new chat").toLowerCase().includes(term))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const out: Row[] = [];
    let current = "";
    for (const conversation of sorted) {
      const label = groupLabel(conversation.updatedAt);
      if (label !== current) {
        current = label;
        out.push({ kind: "header", id: `h-${label}`, label });
      }
      out.push({ kind: "item", id: String(conversation.id), conversation });
    }
    return out;
  }, [data, search]);

  const renderItem = useCallback(({ item }: { item: Row }) => {
    if (item.kind === "header") {
      return (
        <Text
          accessibilityRole="header"
          className="mb-2 mt-3 px-1 font-body-bold text-xs uppercase tracking-wide text-muted-foreground"
        >
          {item.label}
        </Text>
      );
    }
    return <ConversationRow conversation={item.conversation} />;
  }, []);

  const hasConversations = (data?.length ?? 0) > 0;

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
        <BackHeader
          title="History"
          right={
            <Pressable
              onPress={startNewChat}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Start a new chat"
              className="h-11 w-11 items-center justify-center rounded-full bg-primary"
            >
              <Ionicons name="add" size={24} className="text-primary-foreground" />
            </Pressable>
          }
        />

        {hasConversations && (
          <View className="mx-4 mb-2 min-h-[48px] flex-row items-center gap-2 rounded-2xl border border-border bg-card px-4">
            <Ionicons name="search-outline" size={18} className="text-muted-foreground" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search chats"
              placeholderTextColor={colors.mutedForeground}
              returnKeyType="search"
              autoCorrect={false}
              accessibilityLabel="Search conversations"
              className="flex-1 py-3 font-body text-base text-foreground"
            />
            {search.length > 0 && (
              <Pressable
                onPress={() => setSearch("")}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Ionicons name="close-circle" size={20} className="text-muted-foreground" />
              </Pressable>
            )}
          </View>
        )}

        {isLoading ? (
          <SkeletonRows />
        ) : error ? (
          <ErrorCard message={error.message} onPress={() => refetch()} />
        ) : (
          <FlatList
            data={rows}
            renderItem={renderItem}
            keyExtractor={(row) => row.id}
            contentContainerClassName="flex-grow px-4 pb-8"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={12}
            windowSize={7}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center px-8 py-16">
                <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-accent">
                  <Ionicons name="chatbubbles-outline" size={36} className="text-accent-foreground" />
                </View>
                <Text className="mb-2 text-center font-display text-xl text-foreground">
                  {search ? "No chats found" : "No chats yet"}
                </Text>
                <Text className="mb-6 text-center font-body text-base text-muted-foreground">
                  {search
                    ? "Try a different word."
                    : "Ask your dietitian about meals, nutrition or your goals."}
                </Text>
                {!search && <Button title="Start a chat" onPress={startNewChat} />}
              </View>
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}
