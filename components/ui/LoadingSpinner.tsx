// src/components/ui/LoadingSpinner.tsx
import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
}

export function LoadingSpinner({
  message,
  size = "large",
}: LoadingSpinnerProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <ActivityIndicator size={size} color="#4CAF50" />
      {message && (
        <Text
          style={{
            marginTop: 12,
            fontSize: 16,
            color: "#666666",
            textAlign: "center",
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
}
