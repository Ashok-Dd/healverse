import { API_URL as API_BASE_URL } from "@/constants/api";
import { fetchApi } from "@/lib/fetchApi";
import { generateSessionId } from "@/lib/utils";
import { Audio } from 'expo-av';
import { useCallback, useRef, useState } from "react";

const useVoiceAssistant = () => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);

    const soundRef = useRef<Audio.Sound | null>(null);
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const addLog = useCallback((message: string, type = "info") => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${type.toUpperCase()}]: ${message}`);
    }, []);

    const resetSilenceTimeout = useCallback(() => {
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
        }

        silenceTimeoutRef.current = setTimeout(() => {
            if (isConnected && !isProcessing) {
                 handleAIResponse("I'm still here to help. Is there anything else you'd like to discuss about your health?");
            }
        }, 30000) as unknown as NodeJS.Timeout;
    }, [isConnected, isProcessing]);

    const createSession = useCallback(() => {
        try {
            const newSessionId = generateSessionId();
            setSessionId(newSessionId);
            addLog(`Created new session: ${newSessionId}`, 'success');
            return newSessionId;
        } catch (error) {
            addLog(`Failed to create session: ${(error as Error).message}`, 'error');
            throw error;
        }
    }, [generateSessionId, addLog]);

    const clearSession = useCallback(async () => {
        if (!sessionId) {
            addLog('No active session to clear', 'warning');
            return;
        }

        try {
            addLog(`Clearing session: ${sessionId}`, 'info');

            await fetchApi(`/api/voice-chat/${sessionId}`, {
                method: 'DELETE',
                requiresAuth: true,
            });

            addLog(`Session ${sessionId} cleared successfully`, 'success');
        } catch (error) {
            addLog(`Error clearing session: ${(error as Error).message}`, 'error');
        } finally {
            // Clear local session data regardless of server response
            setSessionId(null);
            setAiResponse('');
        }
    }, [sessionId, addLog]);

    const initializeAudio = useCallback(async () => {
        try {
            // Configure audio mode for playback
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
            addLog('Audio initialized successfully', 'success');
        } catch (error) {
            addLog(`Audio initialization failed: ${(error as Error).message}`, 'error');
            throw error;
        }
    }, [addLog]);

    const handleAudioResponse = useCallback(async (audioBlob: Blob) => {
        try {
            setIsSpeaking(true);
            addLog('Starting audio playback', 'info');
 
            // Clean up previous sound
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }

            // Convert blob to URI
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);

            reader.onloadend = async () => {
                try {
                    const base64data = reader.result as string;
                    
                    // Create and load the sound
                    const { sound } = await Audio.Sound.createAsync(
                        { uri: base64data },
                        { shouldPlay: true }
                    );
                    
                    soundRef.current = sound;

                    // Set up playback status update listener
                    sound.setOnPlaybackStatusUpdate((status) => {
                        if (status.isLoaded) {
                            if (status.didJustFinish) {
                                setIsSpeaking(false);
                                addLog('Audio playback finished', 'success');
                                // Clean up the sound object
                                sound.unloadAsync();
                                soundRef.current = null;
                            }
                        } else if ('error' in status) {
                            addLog(`Audio playback error: ${status.error}`, 'error');
                            setIsSpeaking(false);
                        }
                    });

                } catch (playbackError) {
                    addLog(`Audio playback error: ${(playbackError as Error).message}`, 'error');
                    setIsSpeaking(false);
                }
            };

            reader.onerror = () => {
                addLog('Failed to read audio blob', 'error');
                setIsSpeaking(false);
            };

        } catch (error) {
            addLog(`Audio response error: ${(error as Error).message}`, 'error');
            setIsSpeaking(false);
        }
    }, [addLog]);

    const sendToAI = useCallback(async (text: string) => {
        if (!sessionId) {
            throw new Error('No active session');
        }

        setIsProcessing(true);
        setConnectionStatus('processing');

        try {
            addLog(`Sending to AI (Session: ${sessionId}): "${text}"`, 'info');

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            // Use a new endpoint that returns both audio and text
            const response = await fetch(`${API_BASE_URL}/api/voice-chat/voice-chat-with-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId,
                },
                body: JSON.stringify({ text }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // This endpoint should return JSON with both text and audio
            const data = await response.json();
            
            // Set the text response immediately
            setAiResponse(data.textResponse);
            addLog(`Received text response: "${data.textResponse}"`, 'success');

            // Play audio if not muted - use data URI directly
            if (!isMuted && data.audioBase64) {
                await handleAudioResponseFromBase64(data.audioBase64);
            }

        } catch (error) {
            addLog(`AI communication error: ${(error as Error).message}`, 'error');

            const fallbackResponse = "I'm having trouble connecting right now. Please check your internet connection and try again.";
            await handleAIResponse(fallbackResponse);
            setError('Connection issue - using fallback response');
        } finally {
            setIsProcessing(false);
            setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        }
    }, [sessionId, API_BASE_URL, isMuted, isConnected, addLog]);

    // Handle audio response from base64 data (React Native compatible)
    const handleAudioResponseFromBase64 = useCallback(async (audioBase64: string) => {
        try {
            setIsSpeaking(true);
            addLog('Starting audio playback from base64', 'info');

            // Clean up previous sound
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }

            // Create data URI for React Native
            const audioUri = `data:audio/mpeg;base64,${audioBase64}`;
            
            // Create and load the sound
            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: true }
            );
            
            soundRef.current = sound;

            // Set up playback status update listener
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    if (status.didJustFinish) {
                        setIsSpeaking(false);
                        addLog('Audio playback finished', 'success');
                        // Clean up the sound object
                        sound.unloadAsync();
                        soundRef.current = null;
                    }
                } else if ('error' in status) {
                    addLog(`Audio playback error: ${status.error}`, 'error');
                    setIsSpeaking(false);
                }
            });

        } catch (error) {
            addLog(`Audio response error: ${(error as Error).message}`, 'error');
            setIsSpeaking(false);
        }
    }, [addLog]);

    const convertTextToSpeech = useCallback(async (text: string) => {
        if (!sessionId || isMuted) return;

        try {
            addLog(`Converting text to speech: "${text}"`, 'info');
            
            const response = await fetch(`${API_BASE_URL}/api/voice-chat/text-to-speech`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId,
                },
                body: JSON.stringify({ text }),
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                await handleAudioResponse(audioBlob);
            } else {
                addLog(`TTS request failed: ${response.status}`, 'error');
            }
        } catch (error) {
            addLog(`TTS failed: ${(error as Error).message}`, 'warning');
        }
    }, [sessionId, isMuted, API_BASE_URL, addLog, handleAudioResponse]);

    const handleAIResponse = useCallback(async (responseText: string) => {
        addLog(`AI Response: "${responseText}"`, 'info');
        setAiResponse(responseText);

        // Convert to speech if not muted
        if (!isMuted) {
            await convertTextToSpeech(responseText);
        }
    }, [isMuted, convertTextToSpeech]);

    const startConnection = useCallback(async () => {
        try {
            setConnectionStatus('connecting');
            setError('');

            // Initialize audio first
            await initializeAudio();

            // Create new session
            const newSessionId = await createSession();

            setIsConnected(true);
            setConnectionStatus('connected');

            // Welcome message - this will be spoken to the user
            const welcomeMessage = "Hello! I'm your health assistant. How are you feeling today? What can I help you with?";
            await handleAIResponse(welcomeMessage);

            resetSilenceTimeout();

            addLog(`Connection established with session: ${newSessionId}`, 'success');
            return newSessionId;

        } catch (error) {
            addLog(`Connection error: ${(error as Error).message}`, 'error');
            setError('Failed to start conversation');
            setConnectionStatus('error');
            throw error;
        }
    }, [initializeAudio, createSession, handleAIResponse, resetSilenceTimeout, addLog]);

    const stopConnection = useCallback(async () => {
        addLog('Stopping connection...', 'info');

        setIsConnected(false);
        setIsProcessing(false);
        setIsSpeaking(false);
        setConnectionStatus('disconnected');

        // Stop audio playbook
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }
        } catch (error) {
            addLog(`Error stopping audio: ${(error as Error).message}`, 'warning');
        }

        // Clear timeouts
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
        }

        // Clear session
        await clearSession();

        addLog('Connection stopped', 'success');
    }, [clearSession, addLog]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newMuted = !prev;
            addLog(`Audio ${newMuted ? 'muted' : 'unmuted'}`, 'info');
            
            // If we're unmuting and there's a current AI response, speak it
            if (!newMuted && aiResponse && !isSpeaking) {
                convertTextToSpeech(aiResponse);
            }
            
            return newMuted;
        });
    }, [addLog, aiResponse, isSpeaking, convertTextToSpeech]);

    const cleanup = useCallback(async () => {
        addLog('Cleaning up voice assistant...', 'info');
        await stopConnection();
    }, [stopConnection, addLog]);

    return {
        // State
        sessionId,
        isConnected,
        isProcessing,
        isSpeaking,
        connectionStatus,
        error,
        isMuted,
        aiResponse,
        
        // Actions
        startConnection,
        stopConnection,
        sendToAI,
        handleAIResponse,
        toggleMute,
        clearSession,
        cleanup,
        resetSilenceTimeout,
        
        // Utilities
        addLog,
    };
};

export default useVoiceAssistant;