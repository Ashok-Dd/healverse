import { useChat } from "@/hooks/useChat";
import { TAB_BAR_BASE_HEIGHT } from "@/constants/layout";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { router } from "expo-router";
import React from "react";
import { Animated } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { MessageInput } from "./MessageInput";

interface ChatScreenProps {
  conversationId: string;
  isExistingConversation?: boolean;
}

const ChatScreen = ({ conversationId, isExistingConversation = false }: ChatScreenProps) => {
  const {
    messages,
    isMessagesLoading,
    errorLoadingMessages,
    sendMessage,
    isSendingMessage,
    refetchMessages,
    isRefetching,
    flatListRef,
  } = useChat(conversationId, { isExistingConversation });

  // Lift the input above the keyboard and keep the latest message in view.
  // Only a loaded, empty chat offers suggestions; a past chat that is still loading (or failed
  // to load) must not look like a new one.
  const showSuggestions =
    !isMessagesLoading && !errorLoadingMessages && messages.length === 0 && !isSendingMessage;

  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardInset({
    // Tab screen: the tab bar sits below the chat. Pushed screen: only the bottom inset does.
    bottomOffset: isExistingConversation ? insets.bottom : TAB_BAR_BASE_HEIGHT + insets.bottom,
    onShown: () => flatListRef.current?.scrollToEnd({ animated: true }),
  });

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      // The tab bar already covers the bottom inset on the Dietitian tab.
      edges={isExistingConversation ? ["top", "bottom"] : ["top"]}
    >
      <Animated.View ref={keyboard.ref} style={keyboard.style}>
        <ChatHeader
          title="DietAI"
          onBackPress={isExistingConversation ? () => router.back() : undefined}
        />

        <ChatMessages
          messages={messages}
          isLoading={isMessagesLoading}
          isRefreshing={isRefetching}
          onRefresh={refetchMessages}
          error={errorLoadingMessages?.message}
          flatListRef={flatListRef}
          isSending={isSendingMessage}
        />

        <MessageInput
          onSendMessage={sendMessage}
          isLoading={isSendingMessage}
          placeholder="Ask any question"
          // Voice assistant is switched off on the server (410 Gone); bring the button back with the server.
          showVoiceButton={false}
          // Image input is not built yet (the button had no handler). Show it again once it is.
          showImageButton={false}
          showSuggestions={showSuggestions}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default ChatScreen;
