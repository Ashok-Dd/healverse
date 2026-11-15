import { useChat } from "@/hooks/useChat";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { router } from "expo-router";
import React from "react";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const keyboard = useKeyboardInset(() => flatListRef.current?.scrollToEnd({ animated: true }));

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      // The tab bar already covers the bottom inset on the Dietitian tab.
      edges={isExistingConversation ? ["top", "bottom"] : ["top"]}
    >
      <Animated.View ref={keyboard.ref} className="flex-1" style={keyboard.style}>
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
          // Voice assistant is switched off on the server (410 Gone). Re-enable together with VoiceModel.
          showVoiceButton={false}
          messagesLength={messages.length}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default ChatScreen;
