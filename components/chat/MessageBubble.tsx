import { useThemeColors, type ThemeColors } from "@/constants/theme";
import { SyncBadge } from "@/components/ui/SyncBadge";
import type { OutboxStatus } from "@/types/type";
import React, { memo, useMemo } from "react";
import { Text, View } from "react-native";
import Markdown, { MarkdownProps } from "react-native-markdown-display";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  outboxStatus?: OutboxStatus;
}

const createMarkdownStyles = (colors: ThemeColors): MarkdownProps["style"] => {
  const body = {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    lineHeight: 24,
    color: colors.foreground,
  };

  return {
    body,
    paragraph: { ...body, marginTop: 0, marginBottom: 12 },
    heading1: {
      fontFamily: "Fredoka-Bold",
      fontSize: 24,
      color: colors.foreground,
      marginTop: 16,
      marginBottom: 8,
    },
    heading2: {
      fontFamily: "Fredoka-SemiBold",
      fontSize: 20,
      color: colors.foreground,
      marginTop: 14,
      marginBottom: 6,
    },
    heading3: {
      fontFamily: "Fredoka-SemiBold",
      fontSize: 18,
      color: colors.foreground,
      marginTop: 12,
      marginBottom: 4,
    },
    strong: { fontFamily: "Nunito-Bold", color: colors.foreground },
    em: { fontStyle: "italic" },
    list_item: { ...body, marginBottom: 6 },
    bullet_list: { marginVertical: 8 },
    ordered_list: { marginVertical: 8 },
    code_inline: {
      backgroundColor: colors.muted,
      paddingHorizontal: 6,
      borderRadius: 4,
      fontSize: 14,
      color: colors.destructive,
    },
    fence: { backgroundColor: colors.foreground, padding: 16, borderRadius: 12, marginVertical: 8 },
    code_block: {
      backgroundColor: colors.foreground,
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
    },
    table: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginVertical: 8 },
    th: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      fontFamily: "Nunito-Bold",
    },
    td: { padding: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
    blockquote: {
      backgroundColor: colors.muted,
      borderLeftWidth: 4,
      borderLeftColor: colors.ring,
      paddingLeft: 16,
      paddingVertical: 8,
      marginVertical: 8,
    },
    hr: { backgroundColor: colors.border, height: 1, marginVertical: 16 },
    link: { color: colors.ring, textDecorationLine: "underline" },
  };
};

/**
 * One chat message. Memoised: rendering markdown is the most expensive part of the chat, and
 * a new message should not re-render every earlier bubble.
 */
export const MessageBubble = memo(function MessageBubble({
  message,
  isUser,
  timestamp,
  outboxStatus,
}: MessageBubbleProps) {
  const colors = useThemeColors();
  const markdownStyles = useMemo(() => createMarkdownStyles(colors), [colors]);

  if (isUser) {
    return (
      <View className="items-end px-2 py-2">
        <View className="max-w-[80%] rounded-3xl rounded-br-md bg-primary px-4 py-3">
          <Text className="font-body text-base text-primary-foreground">{message}</Text>
        </View>
        {timestamp ? (
          <Text className="mt-1 font-body text-xs text-muted-foreground">{timestamp}</Text>
        ) : null}
        <SyncBadge status={outboxStatus} />
      </View>
    );
  }

  return (
    <View className="px-2 py-2">
      <View className="rounded-3xl rounded-tl-md border border-border bg-card px-4 pt-3">
        <Markdown style={markdownStyles}>{message}</Markdown>
      </View>
      {timestamp ? (
        <Text className="mt-1 font-body text-xs text-muted-foreground">{timestamp}</Text>
      ) : null}
    </View>
  );
});
