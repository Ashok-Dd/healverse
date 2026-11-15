import React from "react";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";

interface ErrorCardProps {
  message?: string;
  /** Shows a "Try again" button when provided. */
  onPress?: () => void;
  className?: string;
}

/** Inline error with an optional retry, for a section that failed to load. */
const ErrorCard = ({ message, onPress, className = "" }: ErrorCardProps) => (
  <View
    accessibilityRole="alert"
    className={`m-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 ${className}`}
  >
    <Text className="mb-1 font-display text-base text-destructive">Something went wrong</Text>
    <Text className="font-body text-sm text-foreground">
      {message || "We couldn't load this. Please try again."}
    </Text>
    {onPress && (
      <Button
        title="Try again"
        variant="soft"
        size="sm"
        onPress={onPress}
        className="mt-3 self-start"
      />
    )}
  </View>
);

export default ErrorCard;
