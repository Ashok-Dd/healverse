import { useRef } from "react";
import { generateUUID } from "@/lib/utils";
import ChatScreen from "@/components/chat/ChatScreen";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

const Dietitian = () => {
  const conversationId = useRef<string>(generateUUID());

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ChatScreen
        conversationId={conversationId.current}
        isExistingConversation={false}
      />
    </KeyboardAvoidingView>
  );
};

export default Dietitian;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
