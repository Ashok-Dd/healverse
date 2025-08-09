import { Modal, View } from "react-native";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { MessageInput } from "@/components/chat/MessageInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";

interface ChatScreenProps {
  conversationId: string;
  isExistingConversation?: boolean;
}

const ChatScreen = ({
  conversationId,
  isExistingConversation = false,
}: ChatScreenProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

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

  const handleTryFreePress = () => {
    // Show premium features
    console.log("Try free pressed");
  };

  const handleDiscountPress = () => {
    // Show discount offer
    console.log("Discount pressed");
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
        />
      </View>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isSendingMessage}
        placeholder="Ask any question"
        onVoicePress={openModal}
        messagesLength={messages.length}
      />

      <Modal
        animationType="slide"
        transparent={false} // Set to false for full-screen
        visible={isModalVisible}
        onRequestClose={closeModal} // Android back button
      >
        {/*<VoiceChat/>*/}
      </Modal>
    </SafeAreaView>
  );
};

export default ChatScreen;
