// components/chat/MessageInput.tsx
import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Vibration,
    AccessibilityInfo,
    Dimensions,
    LayoutAnimation,
    ViewStyle,
    TextStyle, Text,
} from 'react-native';
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';

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
    theme?: 'light' | 'dark';
}

// Constants
const COLORS = {
    light: {
        background: '#FFFFFF',
        inputBackground: '#F7F7F8',
        border: '#E5E5E7',
        text: '#000000',
        placeholder: 'black',
        sendEnabled: '#007AFF',
        sendDisabled: '#C7C7CC',
        buttonBackground: '#F2F2F7',
        buttonBackgroundPressed: '#E5E5EA',
        recording: '#FF3B30',
    },
    dark: {
        background: '#1C1C1E',
        inputBackground: '#2C2C2E',
        border: '#38383A',
        text: '#FFFFFF',
        placeholder: '#8E8E93',
        sendEnabled: '#007AFF',
        sendDisabled: '#48484A',
        buttonBackground: '#3A3A3C',
        buttonBackgroundPressed: '#48484A',
        recording: '#FF453A',
    },
};

const ANIMATION_DURATION = 250;
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
                                                              theme = 'light',
 }) => {
    const [message, setMessage] = useState('');
    const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
    const [isFocused, setIsFocused] = useState(false);

    const textInputRef = useRef<TextInput | null>(null);

    const colors = useMemo(() => COLORS[theme], [theme]);
    const trimmedMessage = useMemo(() => message.trim(), [message]);
    const canSend = useMemo(() =>
            trimmedMessage.length > 0 && !isLoading && !disabled,
        [trimmedMessage, isLoading, disabled]
    );
    const characterCount = useMemo(() => message.length, [message]);
    const isNearLimit = useMemo(() => characterCount > maxLength * 0.9, [characterCount, maxLength]);

    const handleSend = useCallback(() => {
        if (!canSend) return;

        try {
            if (Platform.OS === 'ios') {
                Vibration.vibrate(10);
            }

            onSendMessage(trimmedMessage);
            setMessage('');
            setInputHeight(MIN_INPUT_HEIGHT);

            AccessibilityInfo.announceForAccessibility('Message sent');
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message. Please try again.');
        }
    }, [canSend, trimmedMessage, onSendMessage]);

    const handleSpeechPress = useCallback(() => {
        try {
            if (Platform.OS === 'ios') {
                Vibration.vibrate(20);
            }
            onVoicePress?.();
        } catch (error) {
            console.error('Error handling voice press:', error);
            Alert.alert('Error', 'Voice feature temporarily unavailable.');
        }
    }, [onVoicePress]);

    const handleImagePress = useCallback(() => {
        try {
            onImagePress?.();
        } catch (error) {
            console.error('Error handling image press:', error);
            Alert.alert('Error', 'Image picker temporarily unavailable.');
        }
    }, [onImagePress]);

    const handleAttachmentPress = useCallback(() => {
        try {
            onAttachmentPress?.();
        } catch (error) {
            console.error('Error handling attachment press:', error);
            Alert.alert('Error', 'Attachment feature temporarily unavailable.');
        }
    }, [onAttachmentPress]);

    const handleTextChange = useCallback((text: string) => {
        if (text.length > maxLength) {
            if (Platform.OS === 'ios') {
                Vibration.vibrate(50);
            }
            Alert.alert(
                'Message Too Long',
                `Please keep your message under ${maxLength.toLocaleString()} characters.`
            );
            return;
        }

        setMessage(text);
    }, [maxLength]);

    const handleContentSizeChange = useCallback((event: any) => {
        const { height } = event.nativeEvent.contentSize;
        const newHeight = Math.min(Math.max(height, MIN_INPUT_HEIGHT), MAX_INPUT_HEIGHT);

        if (newHeight !== inputHeight) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setInputHeight(newHeight);
        }
    }, [inputHeight]);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    const renderActionButton = useCallback((iconName: string, onPress: () => void, accessibilityLabel: string) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            style={{
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                borderRadius: BUTTON_SIZE / 2,
                backgroundColor: colors.buttonBackground,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: disabled ? 0.5 : 1,
            } as any}
        >
            <MaterialCommunityIcons name={iconName as any} size={20} color={colors.text} />
        </TouchableOpacity>
    ), [colors, disabled]);

    const renderWaveButton = useCallback(() => {
        if (!showVoiceButton) return null;

        return renderActionButton(
            'waveform',
            handleSpeechPress,
            'Voice message'
        );
    }, [showVoiceButton, renderActionButton, handleSpeechPress]);

    const renderSendButton = useCallback(() => (
        <TouchableOpacity
            onPress={handleSend}
            disabled={!canSend}
            accessibilityLabel="Send message"
            accessibilityRole="button"
            style={{
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                borderRadius: BUTTON_SIZE / 2,
                backgroundColor: canSend ? colors.sendEnabled : colors.sendDisabled,
                alignItems: 'center',
                justifyContent: 'center',
            } as any}
        >
            <Ionicons
                name={isLoading ? "hourglass-outline" : "arrow-up"}
                size={20}
                color="#FFFFFF"
            />
        </TouchableOpacity>
    ), [handleSend, canSend, colors, isLoading]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View
                style={{
                    backgroundColor: colors.background,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 } as ViewStyle}>
                    {/* Left action buttons */}
                    <View style={{ flexDirection: 'row', gap: 8 } as ViewStyle}>
                        {showAttachmentButton && renderActionButton('add', handleAttachmentPress, 'Add attachment')}
                        {showImageButton && renderActionButton('camera', handleImagePress, 'Add image')}
                    </View>

                    {/* Text input container */}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: colors.inputBackground,
                            borderRadius: 22,
                            borderWidth: isFocused ? 2 : 1,
                            borderColor: isFocused ? colors.sendEnabled : colors.border,
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
                            placeholderTextColor={colors.placeholder}
                            multiline
                            autoFocus={autoFocus}
                            editable={!disabled && !isLoading}
                            maxLength={maxLength}
                            returnKeyType="send"
                            onSubmitEditing={Platform.OS === 'ios' ? undefined : handleSend}
                            blurOnSubmit={false}
                            accessibilityLabel="Message input"
                            accessibilityHint={`Type your message. ${characterCount} of ${maxLength} characters used.`}
                            style={{
                                fontSize: 16,
                                lineHeight:20,
                                color: colors.text,
                                minHeight: 20,
                                textAlignVertical: 'top',
                            } as TextStyle}
                        />
                    </View>

                    {/* Right action buttons */}
                    <View style={{ flexDirection: 'row', gap: 8 } as ViewStyle}>
                        {trimmedMessage.length === 0 && renderWaveButton()}
                        {trimmedMessage.length > 0 && renderSendButton()}
                    </View>
                </View>

                {/* Character count indicator */}
                {isNearLimit && (
                    <View style={{ alignItems: 'flex-end', marginTop: 4 } as ViewStyle}>
                        <View
                            style={{
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                                borderRadius: 8,
                                backgroundColor: characterCount >= maxLength ? colors.recording : colors.buttonBackground,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: characterCount >= maxLength ? '#FFFFFF' : colors.text,
                                    fontWeight: '500',
                                } as TextStyle}
                            >
                                {characterCount}/{maxLength}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

export default MessageInput;
