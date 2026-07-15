// components/chat/MessageBubble.tsx
import React from "react";
import { Text, View } from "react-native";
import Markdown, { MarkdownProps } from "react-native-markdown-display";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  isLoading?: boolean;
  avatar?: string;
}

const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151", // gray-700
    fontFamily: "System",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827", // gray-900
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 14,
    marginBottom: 6,
  },
  heading3: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    marginBottom: 12,
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
  },
  strong: {
    fontWeight: "600",
    color: "#111827",
  },
  em: {
    fontStyle: "italic",
    color: "#4B5563", // gray-600
  },
  code_inline: {
    backgroundColor: "#F3F4F6", // gray-100
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "Menlo, Monaco, Consolas, monospace",
    color: "#DC2626", // red-600
  },
  code_block: {
    backgroundColor: "#1F2937", // gray-800
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  fence: {
    backgroundColor: "#1F2937",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: "#E5E7EB", // gray-200
    borderRadius: 6,
    marginVertical: 8,
  },
  thead: {
    backgroundColor: "#F9FAFB", // gray-50
  },
  tbody: {},
  th: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    fontWeight: "600",
    color: "#111827",
  },
  td: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    color: "#374151",
  },
  list_item: {
    marginBottom: 6,
    fontSize: 16,
    color: "#374151",
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  blockquote: {
    backgroundColor: "#F9FAFB",
    borderLeftWidth: 4,
    borderLeftColor: "#6B7280", // gray-500
    paddingLeft: 16,
    paddingVertical: 8,
    marginVertical: 8,
    fontStyle: "italic",
  },
  hr: {
    backgroundColor: "#E5E7EB",
    height: 1,
    marginVertical: 16,
  },
  link: {
    color: "#2563EB", // blue-600
    textDecorationLine: "underline",
  },
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isUser,
  timestamp,
  isLoading = false,
  avatar,
}) => {
  // Markdown styles for bot messages

  if (isUser) {
    // Simple user message bubble (ChatGPT style)
    return (
      <View className="flex-row justify-end py-2 px-2">
        <View className="max-w-[80%]  bg-green-500 rounded-2xl  px-4 py-3  ">
          <Text className="text-white text-base leading-6 font-light break-words">
            {message}
          </Text>
        </View>
      </View>
    );
  }

  // Bot message with markdown rendering
  return (
    <View className="flex-row justify-start">
      {/* Bot Message Content */}
      <View className="flex-1">
        {isLoading ? (
          // Loading state
          <View className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-gray-400 rounded-full mr-1 opacity-60" />
              <View className="w-2 h-2 bg-gray-400 rounded-full mr-1 opacity-60" />
              <View className="w-2 h-2 bg-gray-400 rounded-full opacity-60" />
            </View>
          </View>
        ) : (
          // Message content with markdown
          <View className={"border-t border-gray-200"}>
            <View>
              <Markdown style={markdownStyles as MarkdownProps["style"]}>
                {message}
              </Markdown>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
