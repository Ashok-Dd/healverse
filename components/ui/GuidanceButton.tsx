import { APP_GUIDANCE, getGuidanceContent } from "@/constants/appGuidance";
import { colors } from "@/constants/theme";
import { useAppGuidance } from "@/hooks/useAppGuidance";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";

interface GuidanceButtonProps {
  /** Predefined help text from constants/appGuidance. */
  guidanceKey?: keyof typeof APP_GUIDANCE;
  /** Or provide the text directly. */
  title?: string;
  content?: string;
  type?: "info" | "tip" | "warning" | "feature";
}

/** Small "?" button that opens the shared guidance sheet. */
const GuidanceButton = ({ guidanceKey, title, content, type = "info" }: GuidanceButtonProps) => {
  const { showGuidance } = useAppGuidance();

  const handlePress = () => {
    if (guidanceKey) {
      const guidance = getGuidanceContent(guidanceKey);
      showGuidance({
        title: guidance.title,
        content: guidance.content,
        type: guidance.type as GuidanceButtonProps["type"],
      });
    } else if (content) {
      showGuidance({ title: title || "Help", content, type });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={title ? `About: ${title}` : "Help"}
      className="h-11 w-11 items-center justify-center"
    >
      <Feather name="help-circle" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
};

export default GuidanceButton;
