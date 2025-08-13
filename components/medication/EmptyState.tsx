// src/components/ui/EmptyState.tsx
import React from "react";
import { View, Text } from "react-native";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, message, icon, action }: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      {icon && <View style={{ marginBottom: 20 }}>{icon}</View>}

      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: "#333333",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#666666",
          textAlign: "center",
          lineHeight: 24,
          marginBottom: 24,
        }}
      >
        {message}
      </Text>

      {action}
    </View>
  );
}
