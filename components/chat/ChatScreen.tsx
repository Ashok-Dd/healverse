import { View } from "react-native";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { MessageInput } from "@/components/chat/MessageInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

interface ChatScreenProps {
  conversationId: string;
  isExistingConversation?: boolean;
}

const ChatScreen = ({
  conversationId,
  isExistingConversation = false,
}: ChatScreenProps) => {
  const {
    messages,
    isMessagesLoading,
    errorLoadingMessages,
    sendMessage,
    isSendingMessage,
    // sendMessageError,
    refetchMessages,
    isRefetching,
    // retryFailedMessage,
    // clearError,
      flatListRef
  } = useChat(conversationId, { isExistingConversation });

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  const handleMenuPress = () => {
    // Show menu options
    console.log("Menu pressed");
  };




  return (
    <SafeAreaView className={"flex-1"}>
      {/* Header */}
      <ChatHeader
        title="DietAI"
        onMenuPress={handleMenuPress}
        onBackPress={isExistingConversation ? () => router.back() : undefined}
      />

      {/* Messages Body */}
      <View className="flex-1 ">
        <ChatMessages
          messages={messages}
          isLoading={isMessagesLoading}
          isRefreshing={isRefetching}
          onRefresh={refetchMessages}
          error={errorLoadingMessages?.message}
          flatListRef={flatListRef}
          isSending={isSendingMessage}
        />
      </View>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isSendingMessage}
        placeholder="Ask any question"
        // Voice assistant is switched off on the server (410 Gone). Re-enable together with VoiceModel.
        showVoiceButton={false}
        messagesLength={messages.length}
      />

    </SafeAreaView>
  );
};

export default ChatScreen;
