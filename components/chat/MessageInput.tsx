// components/chat/MessageInput.tsx
import { images } from "@/constants";
import { colors as themeColors } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  Vibration,
  View,
  ViewStyle,
} from "react-native";
import HealthQueriesHorizontalScroll from "./HealthQueriesHorizantalScroll";

// Types
interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onVoicePress?: () => void;
  onImagePress?: () => void;
  onAttachmentPress?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  showVoiceButton?: boolean;
  showImageButton?: boolean;
  showAttachmentButton?: boolean;
  messagesLength: number;
}

// Constants
const COLORS = {
  background: themeColors.card,
  inputBackground: themeColors.background,
  border: themeColors.border,
  text: themeColors.foreground,
  placeholder: themeColors.mutedForeground,
  sendEnabled: themeColors.primary,
  sendDisabled: themeColors.border,
  buttonBackground: themeColors.muted,
  buttonBackgroundPressed: themeColors.secondary,
  recording: themeColors.destructive,
};

const MIN_INPUT_HEIGHT = 20;
const MAX_INPUT_HEIGHT = 120;
const BUTTON_SIZE = 44;

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onVoicePress,
  onImagePress,
  onAttachmentPress,
  isLoading = false,
  placeholder = "Message",
  maxLength = 4000,
  disabled = false,
  autoFocus = false,
  showVoiceButton = true,
  showImageButton = true,
  showAttachmentButton = false,
  messagesLength,
}) => {
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
  const [isFocused, setIsFocused] = useState(false);

  const textInputRef = useRef<TextInput | null>(null);

  const trimmedMessage = useMemo(() => message.trim(), [message]);
  const canSend = useMemo(
    () => trimmedMessage.length > 0 && !isLoading && !disabled,
    [trimmedMessage, isLoading, disabled]
  );
  const characterCount = useMemo(() => message.length, [message]);
  const isNearLimit = useMemo(
    () => characterCount > maxLength * 0.9,
    [characterCount, maxLength]
  );

  const handleQuerySelect = (message: string) => {
    setMessage(message);
  };

  const handleSend = useCallback(() => {
    if (!canSend) return;

    try {
      if (Platform.OS === "ios") {
        Vibration.vibrate(10);
      }

      onSendMessage(trimmedMessage);
      setMessage("");
      setInputHeight(MIN_INPUT_HEIGHT);

      AccessibilityInfo.announceForAccessibility("Message sent");
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  }, [canSend, trimmedMessage, onSendMessage]);

  const handleSpeechPress = useCallback(() => {
    try {
      if (Platform.OS === "ios") {
        Vibration.vibrate(20);
      }
      onVoicePress?.();
    } catch (error) {
      console.error("Error handling voice press:", error);
      Alert.alert("Error", "Voice feature temporarily unavailable.");
    }
  }, [onVoicePress]);

  const handleImagePress = useCallback(() => {
    try {
      onImagePress?.();
    } catch (error) {
      console.error("Error handling image press:", error);
      Alert.alert("Error", "Image picker temporarily unavailable.");
    }
  }, [onImagePress]);

  const handleAttachmentPress = useCallback(() => {
    try {
      onAttachmentPress?.();
    } catch (error) {
      console.error("Error handling attachment press:", error);
      Alert.alert("Error", "Attachment feature temporarily unavailable.");
    }
  }, [onAttachmentPress]);

  const handleTextChange = useCallback(
    (text: string) => {
      if (text.length > maxLength) {
        if (Platform.OS === "ios") {
          Vibration.vibrate(50);
        }
        Alert.alert(
          "Message Too Long",
          `Please keep your message under ${maxLength.toLocaleString()} characters.`
        );
        return;
      }

      setMessage(text);
    },
    [maxLength]
  );

  const handleContentSizeChange = useCallback(
    (event: any) => {
      const { height } = event.nativeEvent.contentSize;
      const newHeight = Math.min(
        Math.max(height, MIN_INPUT_HEIGHT),
        MAX_INPUT_HEIGHT
      );

      if (newHeight !== inputHeight) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setInputHeight(newHeight);
      }
    },
    [inputHeight]
  );

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const renderActionButton = useCallback(
    (iconName: string, onPress: () => void, accessibilityLabel: string) => (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={
          {
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            borderRadius: BUTTON_SIZE / 2,
            backgroundColor: COLORS.buttonBackground,
            alignItems: "center",
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
          } as any
        }
      >
        <MaterialCommunityIcons
          name={iconName as any}
          size={20}
          color={COLORS.text}
        />
      </TouchableOpacity>
    ),
    [disabled]
  );

  const renderWaveButton = useCallback(() => {
    if (!showVoiceButton) return null;
    return (
      <TouchableOpacity
        onPress={handleSpeechPress}
        disabled={disabled}
        style={
          {
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            borderRadius: BUTTON_SIZE / 2,
            backgroundColor: COLORS.buttonBackground,
            alignItems: "center",
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
          } as any
        }
      >
        <Image
          source={images.wave}
          style={{ width: 30, height: 30 }}
          accessibilityLabel="Voice input"
          accessibilityRole="button"
        />
      </TouchableOpacity>
    )
  }, [showVoiceButton, disabled, handleSpeechPress]);

  const renderSendButton = useCallback(
    () => (
      <TouchableOpacity
        onPress={handleSend}
        disabled={!canSend}
        accessibilityLabel="Send message"
        accessibilityRole="button"
        style={
          {
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            borderRadius: BUTTON_SIZE / 2,
            backgroundColor: canSend ? COLORS.sendEnabled : COLORS.sendDisabled,
            alignItems: "center",
            justifyContent: "center",
          } as any
        }
      >
        <Ionicons
          name={isLoading ? "hourglass-outline" : "arrow-up"}
          size={20}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    ),
    [handleSend, canSend, isLoading]
  );

  return (
    <View
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {messagesLength === 0 && (
        <HealthQueriesHorizontalScroll handleQuerySelect={handleQuerySelect} />
      )}
      <View
        style={{
          backgroundColor: COLORS.background,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}
      >
        <View
          style={
            {
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 12,
            } as ViewStyle
          }
        >
          {/* Left action buttons */}
          <View style={{ flexDirection: "row", gap: 8 } as ViewStyle}>
            {showAttachmentButton &&
              renderActionButton(
                "add",
                handleAttachmentPress,
                "Add attachment"
              )}
            {showImageButton &&
              renderActionButton("camera", handleImagePress, "Add image")}
          </View>

          {/* Text input container */}
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.inputBackground,
              borderRadius: 22,
              borderWidth: isFocused ? 2 : 1,
              borderColor: isFocused ? COLORS.sendEnabled : COLORS.border,
              paddingHorizontal: 4,
              minHeight: MIN_INPUT_HEIGHT,
              maxHeight: MAX_INPUT_HEIGHT,
            }}
          >
            <TextInput
              ref={textInputRef}
              value={message}
              onChangeText={handleTextChange}
              onContentSizeChange={handleContentSizeChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              placeholderTextColor={COLORS.placeholder}
              multiline
              autoFocus={autoFocus}
              editable={!disabled && !isLoading}
              maxLength={maxLength}
              returnKeyType="send"
              onSubmitEditing={Platform.OS === "ios" ? undefined : handleSend}
              blurOnSubmit={false}
              accessibilityLabel="Message input"
              accessibilityHint={`Type your message. ${characterCount} of ${maxLength} characters used.`}
              style={
                {
                  fontSize: 16,
                  lineHeight: 20,
                  color: COLORS.text,
                  minHeight: 20,
                  textAlignVertical: "top",
                } as TextStyle
              }

              onPress={() => {
                ;
              }}
            />
          </View>

          {/* Right action buttons */}
          <View style={{ flexDirection: "row", gap: 8 } as ViewStyle}>
            {trimmedMessage.length === 0 && renderWaveButton()}
            {trimmedMessage.length > 0 && renderSendButton()}
          </View>
        </View>

        {/* Character count indicator */}
        {isNearLimit && (
          <View style={{ alignItems: "flex-end", marginTop: 4 } as ViewStyle}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
                backgroundColor:
                  characterCount >= maxLength
                    ? COLORS.recording
                    : COLORS.buttonBackground,
              }}
            >
              <Text
                style={
                  {
                    fontSize: 12,
                    color:
                      characterCount >= maxLength ? "#FFFFFF" : COLORS.text,
                    fontWeight: "500",
                  } as TextStyle
                }
              >
                {characterCount}/{maxLength}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default MessageInput;
