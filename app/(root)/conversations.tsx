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
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchIcon = () => <Ionicons name="search" size={20} color="#6B7280" />;

const ConversationSkeleton = () => (
  <View className="mx-4 my-2 bg-gray-50 rounded-xl h-[78px] p-4 shadow-sm border border-gray-100">
    <View className="flex-row items-center space-x-3">
      <View className="w-12 h-12 bg-gray-200 rounded-full" />
      <View className="flex-1 space-y-2">
        <View className="w-3/4 h-4 bg-gray-200 rounded" />
        <View className="w-1/2 h-3 bg-gray-150 rounded" />
      </View>
      <View className="w-12 h-3 bg-gray-150 rounded" />
    </View>
  </View>
);

const EmptyStateIllustration = () => (
  <View className="items-center justify-center py-8">
    <View className="w-32 h-32 bg-primary-50 rounded-full items-center justify-center mb-6">
      <Ionicons name="chatbubbles-outline" size={64} color="#22C55E" />
    </View>
  </View>
);

const Conversations = () => {
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
        className="mx-4 my-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50"
        onPress={() => router.push(`/(root)/conversation/${item.id}` as any)}
        onLongPress={() => handleLongPress(item)}
        android_ripple={{ color: "#F3F4F6", borderless: false }}
        accessibilityLabel={`Open conversation "${item.title || "New Chat"}"`}
      >
        <View className="flex-row items-center space-x-4">
          <View className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full items-center justify-center shadow-sm">
            <Ionicons
              name="chatbubble-ellipses"
              size={20}
              color="#FFFFFF"
            />
          </View>
          <View className="flex-1 space-y-1">
            <Text
              className="text-base font-jakarta-semi-bold text-secondary-800"
              numberOfLines={1}
            >
              {item.title || "New Chat"}
            </Text>
            <View className="flex-row items-center space-x-2">
              <Ionicons name="time-outline" size={12} color="#9CA3AF" />
              <Text className="text-sm font-jakarta-regular text-secondary-500" numberOfLines={1}>
                {formatTime(item.updatedAt) || "Tap to continue"}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="w-2 h-2 bg-primary-400 rounded-full" />
            <TouchableOpacity
              className="p-2 bg-gray-50 rounded-lg"
              onPress={() => handleLongPress(item)}
            >
              <Ionicons name="ellipsis-horizontal" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    ),
    [handleLongPress, formatTime]
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Custom Header */}
        <View className="bg-white px-6 py-4 shadow-sm border-b border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center space-x-3">
              <View className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center">
                <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text className="text-2xl font-jakarta-bold text-secondary-800">
                  Heal<Text className="text-primary-500">Chat</Text>
                </Text>
                <Text className="text-sm font-jakarta-regular text-secondary-500">
                  Your wellness conversations
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="w-10 h-10 bg-primary-50 rounded-full items-center justify-center"
              onPress={() => router.push("/(root)/(tabs)/dietitian" as any)}
              accessibilityLabel="Start new conversation"
            >
              <Ionicons name="add" size={22} color="#22C55E" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="relative">
            <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <SearchIcon />
            </View>
            <TextInput
              placeholder="Search your conversations..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
              className="bg-gray-50 rounded-xl pl-12 pr-12 py-3 text-secondary-800 font-jakarta-regular border border-gray-200 focus:border-primary-300"
              returnKeyType="search"
              clearButtonMode="while-editing"
              accessibilityLabel="Search conversations"
            />
            {search.length > 0 && (
              <Pressable
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-300 rounded-full items-center justify-center"
                onPress={() => setSearch("")}
                accessibilityLabel="Clear search"
              >
                <Ionicons name="close" size={14} color="#6B7280" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Content Area */}
        <View className="flex-1 bg-gray-50">
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
                  colors={["#22C55E"]}
                  tintColor="#22C55E"
                  progressBackgroundColor="#F9FAFB"
                />
              }
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center px-8 py-12">
                  <EmptyStateIllustration />
                  <Text className="text-xl font-jakarta-bold text-secondary-700 text-center mb-2">
                    {search.length > 0 ? "No Results Found" : "Start Your Wellness Journey"}
                  </Text>
                  <Text className="text-base font-jakarta-regular text-secondary-500 text-center mb-8 leading-6">
                    {search.length > 0
                      ? "Try adjusting your search terms or start a new conversation about your health goals."
                      : "Ready to chat about nutrition, fitness, or mental wellness? Let's get started! 🌿"}
                  </Text>

                  {search.length > 0 ? (
                    <View className="flex-row space-x-3">
                      <Pressable
                        className="bg-gray-100 border border-gray-200 px-6 py-3 rounded-xl shadow-sm"
                        onPress={() => setSearch("")}
                        accessibilityLabel="Clear Search"
                      >
                        <Text className="text-secondary-600 font-jakarta-semi-bold text-base">
                          Clear Search
                        </Text>
                      </Pressable>
                      <Pressable
                        className="bg-primary-500 px-6 py-3 rounded-xl shadow-medium"
                        onPress={() => router.push("/(root)/(tabs)/dietitian" as any)}
                        accessibilityLabel="Start New Chat"
                      >
                        <Text className="text-white font-jakarta-semi-bold text-base">
                          New Chat
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      className="bg-primary-500 px-8 py-4 rounded-xl shadow-medium flex-row items-center space-x-2"
                      onPress={() => router.push("/(root)/conversation" as any)}
                      accessibilityLabel="Start Your First Chat"
                    >
                      <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
                      <Text className="text-white font-jakarta-semi-bold text-base">
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
          backgroundStyle={{ backgroundColor: "#ffffff" }}
          handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
          onChange={(index) => {
            if (index === -1) {
              setSelectedConversation(null);
            }
          }}
        >
          <BottomSheetView className="flex-1 bg-white px-6 py-4">
            {/* Header */}
            <View className="mb-6">
              <Text className="text-lg font-jakarta-bold text-secondary-800 mb-1">
                {selectedConversation?.title || "Untitled Chat"}
              </Text>
              <Text className="text-sm font-jakarta-regular text-secondary-500">
                Choose an action for this conversation
              </Text>
            </View>

            {/* Actions */}
            <View className="space-y-2">
              <Pressable
                className="flex-row items-center p-4 bg-blue-50 border border-blue-100 rounded-xl active:bg-blue-100"
                onPress={handleRename}
              >
                <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center">
                  <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-blue-600 font-jakarta-semi-bold text-base">
                    Rename Conversation
                  </Text>
                  <Text className="text-blue-500 font-jakarta-regular text-sm">
                    Give this chat a custom name
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
              </Pressable>

              <Pressable
                className="flex-row items-center p-4 bg-red-50 border border-red-100 rounded-xl active:bg-red-100"
                onPress={handleDelete}
              >
                <View className="w-10 h-10 bg-red-500 rounded-full items-center justify-center">
                  <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-red-600 font-jakarta-semi-bold text-base">
                    Delete Conversation
                  </Text>
                  <Text className="text-red-500 font-jakarta-regular text-sm">
                    This action cannot be undone
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#EF4444" />
              </Pressable>

              <Pressable
                className="flex-row items-center p-4 bg-gray-50 border border-gray-100 rounded-xl active:bg-gray-100 mt-2"
                onPress={handleCloseBottomSheet}
              >
                <View className="w-10 h-10 bg-gray-400 rounded-full items-center justify-center">
                  <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-gray-600 font-jakarta-semi-bold text-base">
                    Cancel
                  </Text>
                  <Text className="text-gray-500 font-jakarta-regular text-sm">
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
