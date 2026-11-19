import { Ionicons } from "@expo/vector-icons";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface SheetModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: IconName;
  children: React.ReactNode;
  /** Buttons pinned under the content. */
  footer: React.ReactNode;
}

/** Bottom sheet used by the quick-add dialogs (water, exercise). Tapping outside closes it. */
export function SheetModal({
  visible,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
}: SheetModalProps) {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight(visible);
  const bottomPadding = keyboardHeight > 0 ? keyboardHeight + 16 : Math.max(insets.bottom, 16);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <View className="flex-1 justify-end bg-black/50">
        <Pressable
          className="flex-1"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
        <View
          className="rounded-t-3xl border-t border-border bg-card px-5 pt-3"
          style={{ paddingBottom: bottomPadding }}
        >
          <View className="mb-4 h-1.5 w-10 self-center rounded-full bg-border" />

          <View className="mb-5 flex-row items-center gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-accent">
              <Ionicons name={icon} size={22} className="text-accent-foreground" />
            </View>
            <View className="flex-1">
              <Text accessibilityRole="header" className="font-display text-xl text-foreground">
                {title}
              </Text>
              {subtitle ? (
                <Text className="font-body text-sm text-muted-foreground">{subtitle}</Text>
              ) : null}
            </View>
          </View>

          {children}

          <View className="mt-6 flex-row gap-3">{footer}</View>
        </View>
      </View>
    </Modal>
  );
}
