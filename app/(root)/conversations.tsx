import { useConversations } from "@/lib/tanstack";
import { Conversation } from "@/types/type";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchIcon = () => <Ionicons name="search" size={20} color="#9CA3AF" />;

const EmptyStateIcon = () => (
  <Text className="text-gray-200 text-[76px] mt-7">💭</Text>
);

const ConversationSkeleton = () => (
  <View className="mx-4 my-2 bg-gray-100 rounded-2xl h-[64px] px-5 py-4">
    <View className="w-2/3 h-4 bg-gray-300 rounded mb-2" />
    <View className="w-1/3 h-3 bg-gray-200 rounded" />
  </View>
);

const Conversations = () => {
  const { data, isLoading, error, refetch, isRefetching } = useConversations();
  const [search, setSearch] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  // Fixed: Added multiple snap points and ensure proper indexing
  const snapPoints = useMemo(() => ["25%", "40%"], []);

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
        className="mx-3 my-2 px-1 py-2 rounded-[30px] active:bg-gray-50"
        onPress={() => router.push(`/(root)/conversation/${item.id}` as any)}
        onLongPress={() => handleLongPress(item)}
        android_ripple={{ color: "#E5E7EB", borderless: false }}
        accessibilityLabel={`Open conversation "${item.title || "New Chat"}"`}
      >
        <View className="flex-row items-center gap-3 rounded-2xl">
          <View className="bg-gray-200 rounded-full p-2">
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color="#1F2937"
            />
          </View>
          <View className="flex-1">
            <Text
              className="text-base font-semibold text-gray-900"
              numberOfLines={1}
            >
              {item.title || "New Chat"}
            </Text>
            <Text className="text-sm text-gray-500" numberOfLines={1}>
              {formatTime(item.updatedAt) || "Tap to continue"}
            </Text>
          </View>
          <TouchableOpacity
            className="p-2"
            onPress={() => handleLongPress(item)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </Pressable>
    ),
    [handleLongPress, formatTime]
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-3 pt-2 pb-4 ">
        <View className="flex w-full flex-row items-center mb-5 justify-between px-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color={"black"} size={25} />
          </TouchableOpacity>

          <View className="flex flex-row items-center justify-center gap-x-2">
            <MaterialCommunityIcons name="history" size={24} color="black" />
            <Text className="text-black text-base font-bold">
              Conversations
            </Text>
          </View>

          <View className="flex items-center justify-center bg-blue-200 rounded-full p-1">
            <Ionicons name="help" color={"blue"} size={12} />
          </View>
        </View>
        <View className="relative mb-1">
          <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <SearchIcon />
          </View>
          <TextInput
            placeholder="Search conversations…"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            className="bg-white rounded-xl pl-10 pr-12 py-3 shadow-sm text-gray-900 border border-gray-200"
            returnKeyType="search"
            clearButtonMode="while-editing"
            accessibilityLabel="Search bar"
          />
          {search.length > 0 && (
            <Pressable
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onPress={() => setSearch("")}
              accessibilityLabel="Clear search"
            >
              <Text className="text-gray-400 text-lg">✕</Text>
            </Pressable>
          )}
        </View>
        {search.length > 0 && (
          <Text className="text-sm text-gray-500 mt-2">
            {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}{" "}
            found
          </Text>
        )}
      </View>

      {isLoading && (
        <View className="flex-1 ">
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
        </View>
      )}

      {error && !isLoading && (
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-lg font-semibold text-gray-900 mb-2 text-center">
            Oops! Something went wrong
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Failed to load conversations. Please check your connection and try
            again.
          </Text>
          <Pressable
            className="bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => refetch()}
            accessibilityLabel="Try Again"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !error && (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.id?.toString() ?? Math.random().toString()
          }
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center px-8">
              <EmptyStateIcon />
              <Text className="text-xl font-semibold text-gray-900 mb-2 text-center mt-4">
                {search.length > 0
                  ? "No results found"
                  : "No conversations yet"}
              </Text>
              <Text className="text-gray-600 text-center mb-8">
                {search.length > 0
                  ? `Try searching for something else or start a new conversation.`
                  : "Start your first conversation by asking me anything!"}
              </Text>
              {search.length > 0 ? (
                <Pressable
                  className="bg-gray-100 px-6 py-3 rounded-xl"
                  onPress={() => setSearch("")}
                  accessibilityLabel="Clear Search"
                >
                  <Text className="text-gray-700 font-semibold">
                    Clear Search
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  className="bg-blue-500 px-8 py-3 rounded-xl"
                  onPress={() => router.push(`/(root)/(tabs)/dietitian` as any)}
                  accessibilityLabel="Start Chatting"
                >
                  <Text className="text-white font-semibold">
                    Start Chatting
                  </Text>
                </Pressable>
              )}
            </View>
          }
        />
      )}

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#fff" }}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB" }}
        // Fixed: Added proper onChange handler
        onChange={(index) => {
          if (index === -1) {
            setSelectedConversation(null);
          }
        }}
      >
        <BottomSheetView className="flex-1 bg-white/80 px-6 py-4 border-t border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            {selectedConversation?.title || "Untitled Chat"}
          </Text>

          <Pressable
            className="flex-row items-center py-4 border-b border-gray-100"
            onPress={handleRename}
          >
            <Ionicons name="create-outline" size={22} color="#3B82F6" />
            <Text className="ml-3 text-blue-500 font-medium text-base">
              Rename
            </Text>
          </Pressable>

          <Pressable
            className="flex-row items-center py-4 border-b border-gray-100"
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
            <Text className="ml-3 text-red-500 font-medium text-base">
              Delete
            </Text>
          </Pressable>

          <Pressable
            className="flex-row items-center py-4"
            onPress={handleCloseBottomSheet}
          >
            <Ionicons name="close-outline" size={22} color="#6B7280" />
            <Text className="ml-3 text-gray-600 font-medium text-base">
              Cancel
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Conversations;
