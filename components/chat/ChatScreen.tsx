import { useChat } from "@/hooks/useChat";
import { router } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
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

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      // The tab bar already covers the bottom inset on the Dietitian tab.
      edges={isExistingConversation ? ["top", "bottom"] : ["top"]}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
