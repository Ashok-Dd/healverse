import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <Text
        accessibilityRole="header"
        className="mb-2 px-1 font-body-bold text-xs uppercase tracking-wide text-muted-foreground"
      >
        {title}
      </Text>
      <View className="overflow-hidden rounded-3xl border border-border bg-card">{children}</View>
    </View>
  );
}

interface SettingsRowProps {
  icon: IconName;
  label: string;
  /** Text shown on the right. */
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  /** Draws a divider under the row. */
  divider?: boolean;
}

export function SettingsRow({ icon, label, value, onPress, destructive, divider }: SettingsRowProps) {
  const tone = destructive ? "text-destructive" : "text-foreground";

  const content = (
    <View
      className={`min-h-[56px] flex-row items-center gap-3 px-4 ${
        divider ? "border-b border-border" : ""
      }`}
    >
      <View
        className={`h-9 w-9 items-center justify-center rounded-full ${
          destructive ? "bg-destructive/10" : "bg-secondary"
        }`}
      >
        <Ionicons name={icon} size={18} className={tone} />
      </View>
      <Text className={`flex-1 font-body-semibold text-base ${tone}`}>{label}</Text>
      {value ? (
        <Text className="font-body text-sm text-muted-foreground" numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {onPress && !destructive ? (
        <Ionicons name="chevron-forward" size={18} className="text-muted-foreground" />
      ) : null}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      className="active:opacity-70"
    >
      {content}
    </Pressable>
  );
}
