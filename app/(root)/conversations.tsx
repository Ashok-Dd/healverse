import { useThemeColors } from "@/constants/theme";
import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import ErrorCard from "@/components/cards/ErrorCard";
import { useConversations } from "@/lib/tanstack";
import { Conversation } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchIcon = () => <Ionicons name="search" size={20} className="text-muted-foreground" />;

const ConversationSkeleton = () => (
  <View className="mx-4 my-2 bg-background rounded-xl h-[78px] p-4  border border-border">
    <View className="flex-row items-center space-x-3">
      <View className="w-12 h-12 bg-muted rounded-full" />
      <View className="flex-1 space-y-2">
        <View className="w-3/4 h-4 bg-muted rounded" />
        <View className="w-1/2 h-3 bg-border rounded" />
      </View>
      <View className="w-12 h-3 bg-border rounded" />
    </View>
  </View>
);

const EmptyStateIllustration = () => (
  <View className="items-center justify-center py-8">
    <View className="w-32 h-32 bg-accent rounded-full items-center justify-center mb-6">
      <Ionicons name="chatbubbles-outline" size={64} className="text-primary" />
    </View>
  </View>
);

const Conversations = () => {
  const colors = useThemeColors();
  const { data, isLoading, error, refetch, isRefetching } = useConversations();
  const [search, setSearch] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  // Fixed: Added multiple snap points and ensure proper indexing
  const snapPoints = useMemo(() => ["30%", "50%"], []);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    return data.filter((item) =>
      item.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const formatTime = useCallback((dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 2 * 86400) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }, []);

  const handleLongPress = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation);
    // console.log("Selected conversation:", conversation);
    // Fixed: Use correct index (0 for first snap point)
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedConversation) {
      // Add your delete logic here
      console.log("Deleting conversation:", selectedConversation.id);
      // Example: deleteConversation(selectedConversation.id);
    }
    bottomSheetRef.current?.close();
    setSelectedConversation(null);
  }, [selectedConversation]);

  const handleRename = useCallback(() => {
    if (selectedConversation) {
      // Add your rename logic here
      console.log("Renaming conversation:", selectedConversation.id);
      // Example: showRenameDialog(selectedConversation);
    }
    bottomSheetRef.current?.close();
    setSelectedConversation(null);
  }, [selectedConversation]);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedConversation(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Conversation }) => (
      <Pressable
        className="mx-4 my-2 bg-card rounded-xl p-4  border border-border active:bg-background"
        onPress={() => router.push(`/(root)/conversation/${item.id}` as any)}
        onLongPress={() => handleLongPress(item)}
        android_ripple={{ color: colors.muted, borderless: false }}
        accessibilityLabel={`Open conversation "${item.title || "New Chat"}"`}
      >
        <View className="flex-row items-center space-x-4">
          <View className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full items-center justify-center ">
            <Ionicons
              name="chatbubble-ellipses"
              size={20}
              className="text-primary-foreground"
            />
          </View>
          <View className="flex-1 space-y-1">
            <Text
              className="text-base font-body-semibold text-foreground"
              numberOfLines={1}
            >
              {item.title || "New Chat"}
            </Text>
            <View className="flex-row items-center space-x-2">
              <Ionicons name="time-outline" size={12} className="text-muted-foreground" />
              <Text className="text-sm font-body text-muted-foreground" numberOfLines={1}>
                {formatTime(item.updatedAt) || "Tap to continue"}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="w-2 h-2 bg-primary rounded-full" />
            <TouchableOpacity
              className="p-2 bg-background rounded-lg"
              onPress={() => handleLongPress(item)}
            >
              <Ionicons name="ellipsis-horizontal" size={16} className="text-muted-foreground" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    ),
    [handleLongPress, formatTime, colors.muted]
  );

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView className="flex-1 bg-background">
        {/* Custom Header */}
        <View className="bg-card px-6 py-4  border-b border-border">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center space-x-3">
              <View className="w-10 h-10 bg-primary rounded-full items-center justify-center">
                <Ionicons name="chatbubbles" size={20} className="text-primary-foreground" />
              </View>
              <View>
                <Text className="text-2xl font-body-bold text-foreground">
                  Heal<Text className="text-primary">Chat</Text>
                </Text>
                <Text className="text-sm font-body text-muted-foreground">
                  Your wellness conversations
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="w-10 h-10 bg-accent rounded-full items-center justify-center"
              onPress={() => router.push("/(root)/(tabs)/dietitian" as any)}
              accessibilityLabel="Start new conversation"
            >
              <Ionicons name="add" size={22} className="text-primary" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="relative">
            <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <SearchIcon />
            </View>
            <TextInput
              placeholder="Search your conversations..."
              placeholderTextColor={colors.mutedForeground}
              value={search}
              onChangeText={setSearch}
              className="bg-background rounded-xl pl-12 pr-12 py-3 text-foreground font-body border border-border focus:border-primary"
              returnKeyType="search"
              clearButtonMode="while-editing"
              accessibilityLabel="Search conversations"
            />
            {search.length > 0 && (
              <Pressable
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-muted rounded-full items-center justify-center"
                onPress={() => setSearch("")}
                accessibilityLabel="Clear search"
              >
                <Ionicons name="close" size={14} className="text-muted-foreground" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Content Area */}
        <View className="flex-1 bg-background">
          {isLoading && (
            <View className="flex-1 pt-4">
              <ConversationSkeleton />
              <ConversationSkeleton />
              <ConversationSkeleton />
              <ConversationSkeleton />
              <ConversationSkeleton />
            </View>
          )}

          {error && !isLoading && (
            <View className="flex-1 px-4 pt-8">
              <ErrorCard
                message={error.message}
                onPress={() => refetch()}
              />
            </View>
          )}

          {!isLoading && !error && (
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) =>
                item.id?.toString() ?? Math.random().toString()
              }
              contentContainerStyle={{
                paddingTop: 8,
                paddingBottom: 120,
                flexGrow: 1
              }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  progressBackgroundColor={colors.card}
                />
              }
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center px-8 py-12">
                  <EmptyStateIllustration />
                  <Text className="text-xl font-body-bold text-foreground text-center mb-2">
                    {search.length > 0 ? "No Results Found" : "Start Your Wellness Journey"}
                  </Text>
                  <Text className="text-base font-body text-muted-foreground text-center mb-8 leading-6">
                    {search.length > 0
                      ? "Try adjusting your search terms or start a new conversation about your health goals."
                      : "Ready to chat about nutrition, fitness, or mental wellness? Let's get started! 🌿"}
                  </Text>

                  {search.length > 0 ? (
                    <View className="flex-row space-x-3">
                      <Pressable
                        className="bg-muted border border-border px-6 py-3 rounded-xl "
                        onPress={() => setSearch("")}
                        accessibilityLabel="Clear Search"
                      >
                        <Text className="text-muted-foreground font-body-semibold text-base">
                          Clear Search
                        </Text>
                      </Pressable>
                      <Pressable
                        className="bg-primary px-6 py-3 rounded-xl "
                        onPress={() => router.push("/(root)/(tabs)/dietitian" as any)}
                        accessibilityLabel="Start New Chat"
                      >
                        <Text className="text-primary-foreground font-body-semibold text-base">
                          New Chat
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      className="bg-primary px-8 py-4 rounded-xl  flex-row items-center space-x-2"
                      onPress={() => router.push("/(root)/conversation" as any)}
                      accessibilityLabel="Start Your First Chat"
                    >
                      <Ionicons name="chatbubble-ellipses" size={20} className="text-primary-foreground" />
                      <Text className="text-primary-foreground font-body-semibold text-base">
                        Start Chatting
                      </Text>
                    </Pressable>
                  )}
                </View>
              }
            />
          )}
        </View>

        {/* Enhanced Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={-1}
          enablePanDownToClose={true}
          backgroundStyle={{ backgroundColor: colors.card }}
          handleIndicatorStyle={{ backgroundColor: colors.border, width: 40 }}
          onChange={(index) => {
            if (index === -1) {
              setSelectedConversation(null);
            }
          }}
        >
          <BottomSheetView className="flex-1 bg-background px-6 py-4">
            {/* Header */}
            <View className="mb-6">
              <Text className="text-lg font-body-bold text-foreground mb-1">
                {selectedConversation?.title || "Untitled Chat"}
              </Text>
              <Text className="text-sm font-body text-muted-foreground">
                Choose an action for this conversation
              </Text>
            </View>

            {/* Actions */}
            <View className="space-y-2">
              <Pressable
                className="flex-row items-center p-4 bg-secondary border border-border rounded-xl active:bg-secondary"
                onPress={handleRename}
              >
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center">
                  <Ionicons name="create-outline" size={20} className="text-primary-foreground" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-primary font-body-semibold text-base">
                    Rename Conversation
                  </Text>
                  <Text className="text-primary font-body text-sm">
                    Give this chat a custom name
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} className="text-primary" />
              </Pressable>

              <Pressable
                className="flex-row items-center p-4 bg-destructive/10 border border-destructive/30 rounded-xl active:bg-destructive/10"
                onPress={handleDelete}
              >
                <View className="w-10 h-10 bg-destructive rounded-full items-center justify-center">
                  <Ionicons name="trash-outline" size={20} className="text-primary-foreground" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-destructive font-body-semibold text-base">
                    Delete Conversation
                  </Text>
                  <Text className="text-destructive font-body text-sm">
                    This action cannot be undone
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} className="text-destructive" />
              </Pressable>

              <Pressable
                className="flex-row items-center p-4 bg-background border border-border rounded-xl active:bg-muted mt-2"
                onPress={handleCloseBottomSheet}
              >
                <View className="w-10 h-10 bg-muted-foreground rounded-full items-center justify-center">
                  <Ionicons name="close-outline" size={20} className="text-primary-foreground" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-muted-foreground font-body-semibold text-base">
                    Cancel
                  </Text>
                  <Text className="text-muted-foreground font-body text-sm">
                    Close this menu
                  </Text>
                </View>
              </Pressable>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </>
  );
};

export default Conversations;
