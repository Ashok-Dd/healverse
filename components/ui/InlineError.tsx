import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface InlineErrorProps {
  message: string;
  onRetry: () => void;
}

/** One-line error with a Retry, for a section that failed while the rest of the screen still works. */
const InlineError = ({ message, onRetry }: InlineErrorProps) => (
  <View
    accessibilityRole="alert"
    className="flex-row items-center rounded-2xl bg-destructive/10 pl-3 pr-1"
  >
    <Ionicons name="alert-circle-outline" size={18} className="text-destructive" />
    <Text className="ml-2 flex-1 py-2 font-body text-sm text-foreground">{message}</Text>
    <Pressable
      onPress={onRetry}
      accessibilityRole="button"
      accessibilityLabel="Retry"
      className="min-h-[44px] justify-center px-3 active:opacity-70"
    >
      <Text className="font-body-semibold text-sm text-primary">Retry</Text>
    </Pressable>
  </View>
);

export default InlineError;
