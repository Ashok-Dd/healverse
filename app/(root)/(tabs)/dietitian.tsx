import ChatScreen from "@/components/chat/ChatScreen";
import { generateUUID } from "@/lib/utils";
import React, { useState } from "react";

export default function Dietitian() {
  // A new conversation id per visit of the tab's lifetime; history opens past ones.
  const [conversationId] = useState(generateUUID);
  return <ChatScreen conversationId={conversationId} isExistingConversation={false} />;
}
