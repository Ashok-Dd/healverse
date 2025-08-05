import React, { useEffect, useState, useCallback, useRef, useMemo, memo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Alert,
    Dimensions,
    ActivityIndicator,
    Platform,
    InteractionManager,
    StyleSheet, TextStyle, ViewStyle,
} from 'react-native';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

// Types
interface VoiceChatState {
    listening: boolean;
    speaking: boolean;
    processing: boolean;
    text: string;
    error: string | null;
    connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

interface APIResponse {
    reply?: string;
    error?: string;
    status: 'success' | 'error';
}

// Constants
const SCREEN_WIDTH = Dimensions.get('window').width;
const ANIMATION_DURATION = 800;
const MAX_RETRIES = 2;
const TIMEOUT_DURATION = 8000;
const DEBOUNCE_DELAY = 100;
const BALL_SIZE = 120;

// Animation configurations
const ANIMATION_CONFIG = {
    fast: { duration: 200, useNativeDriver: true },
    medium: { duration: 400, useNativeDriver: true },
    slow: { duration: 800, useNativeDriver: true },
} as const;

// Color schemes
const COLOR_SCHEMES = {
    listening: ['#50C878', '#32CD32'],
    processing: ['#FFB347', '#FFA500'],
    speaking: ['#FF6B6B', '#FF1493'],
    default: ['#4A90E2', '#7B68EE'],
    button: {
        active: ['#FF6B6B', '#FF1493'],
        inactive: ['#4A90E2', '#7B68EE'],
    },
} as const;

// API configuration
const API_CONFIG = {
    endpoint: 'https://your-sprint-ai-endpoint.com/chat',
    timeout: TIMEOUT_DURATION,
    retries: MAX_RETRIES,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    },
} as const;

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    iosContainer: {
        paddingTop: 50,
    },
    androidContainer: {
        paddingTop: 30,
    },
    connectionStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    connected: {
        backgroundColor: '#50C878',
    },
    disconnected: {
        backgroundColor: '#FF6B6B',
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        opacity: 0.8,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 40,
        textAlign: 'center',
    },
    animatedBall: {
        width: BALL_SIZE,
        height: BALL_SIZE,
        borderRadius: BALL_SIZE / 2,
        marginVertical: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    statusMessage: {
        fontSize: 18,
        color: 'white',
        marginVertical: 20,
        textAlign: 'center',
        opacity: 0.9,
    },
    textDisplay: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginVertical: 20,
        width: '100%',
        maxWidth: SCREEN_WIDTH - 40,
    },
    textLabel: {
        fontSize: 14,
        color: 'white',
        opacity: 0.7,
        marginBottom: 8,
    },
    textContent: {
        fontSize: 16,
        color: 'white',
        lineHeight: 24,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        width: '100%',
        maxWidth: SCREEN_WIDTH - 40,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
    },
    actionButton: {
        marginTop: 30,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 30,
        minWidth: 200,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
});




const VoiceChatWithPermissions: React.FC = () => {
    const [permissionsGranted, setPermissionsGranted] = useState(false);
    const [permissionsChecked, setPermissionsChecked] = useState(false);

    const handlePermissionsGranted = useCallback(() => {
        console.log('Permissions granted');
        setPermissionsGranted(true);
        setPermissionsChecked(true);
    }, []);

    const handlePermissionsDenied = useCallback(() => {
        console.log('Permissions denied');
        setPermissionsGranted(false);
        setPermissionsChecked(true);
        Alert.alert(
            'Permissions Required',
            'This app requires microphone access to function properly.',
            [{ text: 'OK' }]
        );
    }, []);

    const checkAndRequestPermissions = useCallback(async () => {
        try {
            console.log('Checking permissions...');

            // Check audio recording permission
            const audioPermission = await Audio.getPermissionsAsync();

            if (audioPermission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                    staysActiveInBackground: false,
                });
                handlePermissionsGranted();
            } else {
                // Request permissions
                const requestResult = await Audio.requestPermissionsAsync();
                if (requestResult.status === 'granted') {
                    await Audio.setAudioModeAsync({
                        allowsRecordingIOS: true,
                        playsInSilentModeIOS: true,
                        shouldDuckAndroid: true,
                        playThroughEarpieceAndroid: false,
                        staysActiveInBackground: false,
                    });
                    handlePermissionsGranted();
                } else {
                    handlePermissionsDenied();
                }
            }
        } catch (error) {
            console.error('Permission error:', error);
            handlePermissionsDenied();
        }
    }, [handlePermissionsGranted, handlePermissionsDenied]);

    useEffect(() => {
        checkAndRequestPermissions();
    }, [checkAndRequestPermissions]);

    if (!permissionsChecked) {
        return (
            <LinearGradient
                colors={['#1a1a2e', '#16213e']}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' } as ViewStyle}
            >
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={{ color: 'white', marginTop: 20, fontSize: 16 } as TextStyle}>
                    Checking permissions...
                </Text>
            </LinearGradient>
        );
    }

    if (!permissionsGranted) {
        return (
            <LinearGradient
                colors={['#1a1a2e', '#16213e']}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 } as ViewStyle}
            >
                <Ionicons name="mic-off" size={64} color="#FF6B6B" />
                <Text style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 20,
                    marginBottom: 10
                } as TextStyle}>
                    Microphone Access Required
                </Text>
                <Text style={{
                    color: 'white',
                    fontSize: 16,
                    textAlign: 'center',
                    opacity: 0.8,
                    marginBottom: 30,
                    lineHeight: 24
                } as TextStyle}>
                    This app needs access to your microphone to recognize your voice commands.
                </Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#4A90E2',
                        paddingHorizontal: 30,
                        paddingVertical: 15,
                        borderRadius: 25,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                    }}
                    onPress={checkAndRequestPermissions}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' } as TextStyle}>
                        Grant Permission
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    }

    // Return your main VoiceChat component here
    return <VoiceChat />;
};

export default VoiceChatWithPermissions;

// Memoized components
const ConnectionStatus = memo(({ status }: { status: 'connected' | 'disconnected' | 'connecting' }) => (
    <View style={styles.connectionStatus}>
        <View style={[
            styles.statusDot,
            status === 'connected' ? styles.connected : styles.disconnected
        ]} />
        <Text style={styles.statusText as TextStyle}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
    </View>
));

const ErrorDisplay = memo(({ error }: { error: string }) => (
    <View style={styles.errorContainer}>
        <Ionicons name="warning" size={20} color="#FF6B6B" />
        <Text style={styles.errorText as TextStyle}>{error}</Text>
    </View>
));

const TextDisplay = memo(({ text, fadeAnimation }: { text: string; fadeAnimation: Animated.Value }) => (
    <Animated.View style={[styles.textDisplay, { opacity: fadeAnimation }]}>
        <Text style={styles.textLabel as TextStyle}>You said:</Text>
        <Text style={styles.textContent as TextStyle}>{text}</Text>
    </Animated.View>
));

const VoiceChat: React.FC = () => {
    // State management
    const [state, setState] = useState<VoiceChatState>({
        listening: false,
        speaking: false,
        processing: false,
        text: '',
        error: null,
        connectionStatus: 'disconnected',
    });

    // Animation refs
    const pulseAnimation = useRef(new Animated.Value(1)).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(1)).current;
    const fadeAnimation = useRef(new Animated.Value(1)).current;

    // Utility refs
    const retryCount = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(true);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const voiceInitialized = useRef(false);

    // Performance: Batch state updates
    const batchedUpdates = useRef<Partial<VoiceChatState>>({});
    const updateBatchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Optimized state update with batching
    const updateState = useCallback((updates: Partial<VoiceChatState>) => {
        Object.assign(batchedUpdates.current, updates);

        if (updateBatchTimeout.current) {
            clearTimeout(updateBatchTimeout.current);
        }

        updateBatchTimeout.current = setTimeout(() => {
            if (isMounted.current) {
                setState(prev => ({ ...prev, ...batchedUpdates.current }));
                batchedUpdates.current = {};
            }
        }, 16) as NodeJS.Timeout;
    }, []);

    // Debounced error handler
    const handleError = useCallback((error: string, context: string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            console.error(`${context}:`, error);
            updateState({ error, listening: false, processing: false, speaking: false });

            InteractionManager.runAfterInteractions(() => {
                Alert.alert(
                    'Voice Chat Error',
                    `${context}: ${error}`,
                    [
                        { text: 'Retry', onPress: () => updateState({ error: null }) },
                        { text: 'Cancel', style: 'cancel' },
                    ]
                );
            });
        }, DEBOUNCE_DELAY) as NodeJS.Timeout;
    }, [updateState]);

    // Animation functions
    const startPulseAnimation = useCallback(() => {
        pulseAnimation.setValue(1);
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnimation, { ...ANIMATION_CONFIG.medium, toValue: 1.2 }),
                Animated.timing(pulseAnimation, { ...ANIMATION_CONFIG.medium, toValue: 1 }),
            ])
        ).start();
    }, [pulseAnimation]);

    const stopPulseAnimation = useCallback(() => {
        pulseAnimation.stopAnimation();
        Animated.timing(pulseAnimation, { ...ANIMATION_CONFIG.fast, toValue: 1 }).start();
    }, [pulseAnimation]);

    const startRotateAnimation = useCallback(() => {
        rotateAnimation.setValue(0);
        Animated.loop(
            Animated.timing(rotateAnimation, { ...ANIMATION_CONFIG.slow, toValue: 1 })
        ).start();
    }, [rotateAnimation]);

    const stopRotateAnimation = useCallback(() => {
        rotateAnimation.stopAnimation();
        Animated.timing(rotateAnimation, { ...ANIMATION_CONFIG.fast, toValue: 0 }).start();
    }, [rotateAnimation]);

    const startScaleAnimation = useCallback(() => {
        scaleAnimation.setValue(1);
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnimation, { ...ANIMATION_CONFIG.fast, toValue: 0.9 }),
                Animated.timing(scaleAnimation, { ...ANIMATION_CONFIG.fast, toValue: 1.1 }),
            ])
        ).start();
    }, [scaleAnimation]);

    const stopScaleAnimation = useCallback(() => {
        scaleAnimation.stopAnimation();
        Animated.timing(scaleAnimation, { ...ANIMATION_CONFIG.fast, toValue: 1 }).start();
    }, [scaleAnimation]);

    // Voice recognition handlers
    const onSpeechResults = useCallback((event: SpeechResultsEvent) => {
        if (!event.value || event.value.length === 0) return;

        const userText = event.value[0];
        console.log('Speech recognized:', userText);

        updateState({ text: userText, listening: false });
        stopPulseAnimation();
        handleSprintAI(userText);
    }, [updateState, stopPulseAnimation]);

    const onSpeechError = useCallback((error: SpeechErrorEvent) => {
        console.error('Speech recognition error:', error);
        stopPulseAnimation();

        const errorMessage = error.error?.message || 'Speech recognition failed';
        handleError(errorMessage, 'Speech Recognition');
    }, [handleError, stopPulseAnimation]);

    const onSpeechStart = useCallback(() => {
        console.log('Speech recognition started');
        updateState({ listening: true, error: null });
        startPulseAnimation();
    }, [updateState, startPulseAnimation]);

    const onSpeechEnd = useCallback(() => {
        console.log('Speech recognition ended');
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    // Initialize Voice
    const initializeVoice = useCallback(async () => {
        try {
            if (voiceInitialized.current) return;

            // Check if Voice is available
            const isAvailable = await Voice.isAvailable();
            if (!isAvailable) {
                throw new Error('Voice recognition is not available on this device');
            }

            // Set up event listeners only after ensuring Voice is available
            Voice.onSpeechStart = onSpeechStart;
            Voice.onSpeechResults = onSpeechResults;
            Voice.onSpeechError = onSpeechError;
            Voice.onSpeechEnd = onSpeechEnd;

            voiceInitialized.current = true;
            console.log('Voice initialized successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Voice initialization failed';
            console.error('Voice initialization error:', errorMessage);
            handleError(errorMessage, 'Voice Initialization');
        }
    }, [onSpeechStart, onSpeechResults, onSpeechError, onSpeechEnd, handleError]);

    // Voice control functions
    const startListening = useCallback(async () => {
        try {
            if (state.listening || state.processing || state.speaking) return;
            if (!voiceInitialized.current) {
                await initializeVoice();
            }

            updateState({ error: null, connectionStatus: 'connecting' });

            // Set timeout for listening
            timeoutRef.current = setTimeout(() => {
                stopListening();
                handleError('Listening timeout', 'Voice Recognition');
            }, TIMEOUT_DURATION) as NodeJS.Timeout;

            await Voice.start('en-US');
            updateState({ connectionStatus: 'connected' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to start listening';
            handleError(errorMessage, 'Start Listening');
        }
    }, [state, updateState, handleError, initializeVoice]);

    const stopListening = useCallback(async () => {
        try {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (voiceInitialized.current) {
                await Voice.stop();
            }
            updateState({ listening: false, connectionStatus: 'disconnected' });
            stopPulseAnimation();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to stop listening';
            console.error('Stop listening error:', errorMessage);
        }
    }, [updateState, stopPulseAnimation]);

    // API communication
    const handleSprintAI = useCallback(async (message: string) => {
        updateState({ processing: true });
        startRotateAnimation();

        const requestPayload = JSON.stringify({
            message,
            timestamp: Date.now(),
            sessionId: `${Date.now()}-${Math.random()}`,
        });

        const attemptAPICall = async (attempt: number): Promise<APIResponse> => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

            try {
                const response = await fetch(API_CONFIG.endpoint, {
                    method: 'POST',
                    headers: API_CONFIG.headers,
                    body: requestPayload,
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data: APIResponse = await response.json();
                return data;
            } catch (error) {
                clearTimeout(timeoutId);

                if (attempt < API_CONFIG.retries) {
                    console.warn(`API attempt ${attempt} failed, retrying...`);
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 500, 3000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return attemptAPICall(attempt + 1);
                }

                throw error;
            }
        };

        try {
            const data = await attemptAPICall(1);
            const reply = data.reply || "I didn't understand that. Could you please repeat?";

            console.log('AI Response:', reply);

            InteractionManager.runAfterInteractions(() => {
                speak(reply);
            });

            retryCount.current = 0;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'AI processing failed';
            handleError(errorMessage, 'AI Processing');

            InteractionManager.runAfterInteractions(() => {
                speak("I'm sorry, I'm having trouble processing your request right now.");
            });
        } finally {
            updateState({ processing: false });
            stopRotateAnimation();
        }
    }, [updateState, startRotateAnimation, stopRotateAnimation, handleError]);

    // Text-to-speech
    const speak = useCallback(async (text: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            updateState({ speaking: true });
            startScaleAnimation();

            const speechOptions: Speech.SpeechOptions = {
                language: 'en-US',
                pitch: 1.1,
                rate: 1.1,
                voice: Platform.OS === 'ios' ? 'com.apple.ttsbundle.Samantha-compact' : undefined,
                onStart: () => {
                    console.log('Speech started');
                },
                onDone: () => {
                    console.log('Speech completed');
                    updateState({ speaking: false });
                    stopScaleAnimation();

                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }

                    animationFrameRef.current = requestAnimationFrame(() => {
                        if (isMounted.current && !state.processing) {
                            startListening();
                        }
                    });

                    resolve();
                },
                onStopped: () => {
                    updateState({ speaking: false });
                    stopScaleAnimation();
                    resolve();
                },
                onError: (error) => {
                    updateState({ speaking: false });
                    stopScaleAnimation();
                    handleError(error.toString(), 'Text-to-Speech');
                    reject(error);
                },
            };

            Speech.speak(text, speechOptions);
        });
    }, [updateState, startScaleAnimation, stopScaleAnimation, handleError, state.processing, startListening]);

    // Component lifecycle
    useEffect(() => {
        // Initialize voice on component mount
        initializeVoice();

        // Pre-warm animations
        InteractionManager.runAfterInteractions(() => {
            pulseAnimation.setValue(1);
            rotateAnimation.setValue(0);
            scaleAnimation.setValue(1);
            fadeAnimation.setValue(1);
        });

        return () => {
            isMounted.current = false;

            // Cleanup timeouts
            [timeoutRef, debounceRef, updateBatchTimeout].forEach(ref => {
                if (ref.current) {
                    clearTimeout(ref.current);
                }
            });

            // Cleanup animation frame
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            // Stop all animations
            [pulseAnimation, rotateAnimation, scaleAnimation, fadeAnimation].forEach(anim => {
                anim.stopAnimation();
            });

            // Cleanup voice
            if (voiceInitialized.current) {
                Voice.destroy()
                    .then(() => {
                        Voice.removeAllListeners();
                        voiceInitialized.current = false;
                    })
                    .catch(console.error);
            }
        };
    }, [initializeVoice]);

    // Memoized values
    const animationStyles = useMemo(() => {
        const rotateInterpolate = rotateAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });

        return {
            rotateInterpolate,
        };
    }, [rotateAnimation]);

    const currentColorScheme = useMemo(() => {
        if (state.listening) return COLOR_SCHEMES.listening;
        if (state.processing) return COLOR_SCHEMES.processing;
        if (state.speaking) return COLOR_SCHEMES.speaking;
        return COLOR_SCHEMES.default;
    }, [state.listening, state.processing, state.speaking]);

    const currentAnimationStyle = useMemo(() => {
        if (state.listening) {
            return { transform: [{ scale: pulseAnimation }] };
        }
        if (state.processing) {
            return { transform: [{ rotate: animationStyles.rotateInterpolate }] };
        }
        if (state.speaking) {
            return { transform: [{ scale: scaleAnimation }] };
        }
        return {};
    }, [state.listening, state.processing, state.speaking, pulseAnimation, scaleAnimation, animationStyles.rotateInterpolate]);

    const statusText = useMemo(() => {
        if (state.listening) return '🎙️ Listening...';
        if (state.processing) return '🤖 Processing...';
        if (state.speaking) return '🔊 Speaking...';
        return 'Ready to chat';
    }, [state.listening, state.processing, state.speaking]);

    const isActive = useMemo(() =>
            state.listening || state.processing || state.speaking,
        [state.listening, state.processing, state.speaking]
    );

    // Render methods
    const renderAnimatedBall = useCallback(() => (
        <Animated.View style={currentAnimationStyle}>
            <LinearGradient
                colors={currentColorScheme}
                style={styles.animatedBall}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
        </Animated.View>
    ), [currentAnimationStyle, currentColorScheme]);

    const renderActionButton = useCallback(() => (
        <TouchableOpacity
            style={[
                styles.actionButton,
                isActive && { transform: [{ scale: 1.05 }] },
                state.error && { opacity: 0.7 }
            ] as ViewStyle}
            onPress={isActive ? stopListening : startListening}
            disabled={state.processing || state.speaking}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={isActive ? COLOR_SCHEMES.button.active : COLOR_SCHEMES.button.inactive}
                style={styles.buttonContent}
            >
                {state.processing ? (
                    <ActivityIndicator color="white" size="small" />
                ) : (
                    <Ionicons
                        name={isActive ? 'stop' : 'mic'}
                        size={24}
                        color="white"
                    />
                )}
                <Text style={styles.buttonText as TextStyle}>
                    {isActive ? 'Stop' : 'Start Conversation'}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    ), [isActive, state.error, state.processing, state.speaking, stopListening, startListening]);

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16213e']}
            style={[
                styles.container,
                Platform.OS === 'ios' ? styles.iosContainer : styles.androidContainer
            ]}
        >
            <ConnectionStatus status={state.connectionStatus} />

            <View style={styles.mainContent}>
                <Text style={styles.title as TextStyle}>Voice Assistant</Text>

                {renderAnimatedBall()}

                <Text style={styles.statusMessage as TextStyle}>{statusText}</Text>

                {state.text ? (
                    <TextDisplay text={state.text} fadeAnimation={fadeAnimation} />
                ) : null}

                {state.error ? (
                    <ErrorDisplay error={state.error} />
                ) : null}

                {renderActionButton()}
            </View>
        </LinearGradient>
    );
};





// Set display names
TextDisplay.displayName = 'TextDisplay';
ErrorDisplay.displayName = 'ErrorDisplay';
ConnectionStatus.displayName = 'ConnectionStatus';

