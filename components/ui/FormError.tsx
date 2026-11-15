import React from "react";
import { Text, View } from "react-native";

interface FormErrorProps {
  message?: string | null;
  /** Extra lines, e.g. the field list from a 400 response. */
  details?: string[];
  tone?: "error" | "warning" | "info";
}

const tones = {
  error: { box: "bg-destructive/10 border-destructive/30", text: "text-destructive" },
  warning: { box: "bg-warning/10 border-warning/30", text: "text-warning" },
  info: { box: "bg-secondary border-border", text: "text-secondary-foreground" },
};

/** Inline error/notice box for forms. Renders nothing when there is no message. */
export function FormError({ message, details, tone = "error" }: FormErrorProps) {
  if (!message) return null;
  const t = tones[tone];

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className={`mb-4 rounded-2xl border px-4 py-3 ${t.box}`}
    >
      <Text className={`text-center font-body-semibold text-sm ${t.text}`}>{message}</Text>
      {details?.map((line) => (
        <Text key={line} className={`mt-1 text-center font-body text-xs ${t.text}`}>
          {line}
        </Text>
      ))}
    </View>
  );
}
