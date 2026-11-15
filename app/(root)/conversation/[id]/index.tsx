import ChatScreen from "@/components/chat/ChatScreen";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function Conversation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChatScreen conversationId={id} isExistingConversation />;
}
