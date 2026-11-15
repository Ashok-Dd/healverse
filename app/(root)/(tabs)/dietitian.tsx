import ChatScreen from "@/components/chat/ChatScreen";
import { generateUUID } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";

export default function Dietitian() {
  // "New chat" in History navigates here with a new `fresh` value, which starts a new conversation.
  const { fresh } = useLocalSearchParams<{ fresh?: string }>();
  const conversationId = useMemo(generateUUID, [fresh]);
  return <ChatScreen conversationId={conversationId} isExistingConversation={false} />;
}
