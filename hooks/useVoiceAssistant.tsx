import { API_URL as API_BASE_URL } from "@/constants/api";
import { fetchApi } from "@/lib/fetchApi";
import { generateSessionId } from "@/lib/utils";
import { Audio } from "expo-av";
import { useCallback, useRef, useState } from "react";

const useVoiceAssistant = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("disconnected");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>("");

  const soundRef = useRef<Audio.Sound | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHookMountedRef = useRef(true);

  const addLog = useCallback((message: string, type = "info") => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type.toUpperCase()}]: ${message}`);
  }, []);

  const resetSilenceTimeout = useCallback(() => {
    if (!isHookMountedRef.current) return;

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    silenceTimeoutRef.current = setTimeout(() => {
      if (
        isConnected &&
        !isProcessing &&
        !isSpeaking &&
        isHookMountedRef.current
      ) {
        handleAIResponse(
          "I'm still here to help. Is there anything else you'd like to discuss about your health?"
        );
      }
    }, 30000) as unknown as NodeJS.Timeout;
  }, [isConnected, isProcessing, isSpeaking]);

  const createSession = useCallback(async () => {
    try {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      addLog(`Created new session: ${newSessionId}`, "success");
      return newSessionId;
    } catch (error) {
      addLog(`Failed to create session: ${(error as Error).message}`, "error");
      throw error;
    }
  }, [addLog]);

  const clearSession = useCallback(async () => {
    if (!sessionId) {
      addLog("No active session to clear", "warning");
      return;
    }

    try {
      addLog(`Clearing session: ${sessionId}`, "info");

      await fetchApi(`/api/voice-chat/${sessionId}`, {
        method: "DELETE",
        requiresAuth: true,
      });

      addLog(`Session ${sessionId} cleared successfully`, "success");
    } catch (error) {
      addLog(`Error clearing session: ${(error as Error).message}`, "error");
    } finally {
      setSessionId(null);
      setAiResponse("");
    }
  }, [sessionId, addLog]);

  const initializeAudio = useCallback(async () => {
    try {
      addLog("Initializing audio system...", "info");

      await Audio.setAudioModeAsync({
        // allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        // staysActiveInBackground: false,
        // shouldDuckAndroid: true,
        // playThroughEarpieceAndroid: false,
        // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });

      addLog("Audio initialized successfully", "success");
    } catch (error) {
      addLog(
        `Audio initialization failed: ${(error as Error).message}`,
        "error"
      );
      throw error;
    }
  }, [addLog]);

  const cleanupAudio = useCallback(async () => {
    try {
      if (soundRef.current) {
        addLog("Cleaning up audio...", "info");
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsSpeaking(false);
      }
    } catch (error) {
      addLog(`Audio cleanup error: ${(error as Error).message}`, "warning");
    }
  }, [addLog]);

  const handleAudioResponseFromBase64 = useCallback(
    async (audioBase64: string) => {
      if (!isHookMountedRef.current) return;

      if (isMuted) {
        addLog("Audio muted, skipping playback", "info");
        return;
      }

      try {
        setIsSpeaking(true);
        addLog("Starting audio playback from base64", "info");

        // Clean up previous sound
        await cleanupAudio();

        // Validate base64
        if (!audioBase64 || audioBase64.trim() === "") {
          throw new Error("Invalid audio base64 data");
        }

        // Create data URI for React Native
        const audioUri = `data:audio/mpeg;base64,${audioBase64}`;
        addLog(`Audio URI created: ${audioUri.substring(0, 50)}...`, "info");

        // Create and load the sound with better error handling
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          {
            shouldPlay: true,
            volume: 1.0,
            rate: 1.0,
            progressUpdateIntervalMillis: 100,
          }
        );

        soundRef.current = sound;

        // Set up playback status update listener
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!isHookMountedRef.current) return;

          if (status.isLoaded) {
            if (status.didJustFinish) {
              addLog("Audio playback finished", "success");
              setIsSpeaking(false);
              // Clean up the sound object
              cleanupAudio();
            } else if (status.isPlaying) {
              addLog("Audio is playing...", "info");
            }
          } else if ("error" in status && status.error) {
            addLog(`Audio playback error: ${status.error}`, "error");
            setIsSpeaking(false);
            cleanupAudio();
          }
        });

        // Set a fallback timeout in case the audio doesn't finish properly
        setTimeout(() => {
          if (isSpeaking && isHookMountedRef.current) {
            addLog("Audio playback timeout, stopping...", "warning");
            setIsSpeaking(false);
            cleanupAudio();
          }
        }, 30000); // 30 second timeout
      } catch (error) {
        addLog(`Audio response error: ${(error as Error).message}`, "error");
        setIsSpeaking(false);
        await cleanupAudio();
      }
    },
    [addLog, isMuted, cleanupAudio, isSpeaking]
  );

  const sendToAI = useCallback(
    async (text: string) => {
      if (!isHookMountedRef.current) return;

      if (!sessionId) {
        throw new Error("No active session");
      }

      if (!text.trim()) {
        addLog("Empty text, skipping AI request", "warning");
        return;
      }

      setIsProcessing(true);
      setConnectionStatus("processing");
      setError(null);

      try {
        addLog(`Sending to AI (Session: ${sessionId}): "${text}"`, "info");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          addLog("Request timeout, aborting...", "warning");
          controller.abort();
        }, 20000); // Increased timeout

        const requestUrl = `${API_BASE_URL}/api/voice-chat/voice-chat-with-text`;
        addLog(`Making request to: ${requestUrl}`, "info");

        const response = await fetch(requestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": sessionId,
          },
          body: JSON.stringify({ text: text.trim() }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        addLog(`Response status: ${response.status}`, "info");

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP ${response.status}: ${errorText || "Unknown error"}`
          );
        }

        const data = await response.json();
        addLog(`Response data keys: ${Object.keys(data).join(", ")}`, "info");

        // Set the text response immediately
        if (data.textResponse) {
          setAiResponse(data.textResponse);
          addLog(`Received text response: "${data.textResponse}"`, "success");

          // Play audio if available and not muted
          if (data.audioBase64 && !isMuted) {
            addLog("Audio data received, starting playback...", "info");
            await handleAudioResponseFromBase64(data.audioBase64);
          } else if (!data.audioBase64) {
            addLog("No audio data in response", "warning");
          }
        } else {
          throw new Error("No text response received from server");
        }
      } catch (error) {
        if (error.name === "AbortError") {
          addLog("Request was aborted (timeout)", "error");
        } else {
          addLog(
            `AI communication error: ${(error as Error).message}`,
            "error"
          );
        }

        const fallbackResponse =
          "I'm having trouble connecting right now. Please check your internet connection and try again.";
        setAiResponse(fallbackResponse);
        setError("Connection issue - using fallback response");
      } finally {
        if (isHookMountedRef.current) {
          setIsProcessing(false);
          setConnectionStatus(isConnected ? "connected" : "disconnected");
        }
      }
    },
    [sessionId, handleAudioResponseFromBase64, isConnected, addLog, isMuted]
  );

  const handleAIResponse = useCallback(
    async (responseText: string) => {
      if (!isHookMountedRef.current) return;

      addLog(`AI Response: "${responseText}"`, "info");
      setAiResponse(responseText);

      // Convert to speech if not muted and we have a session
      if (!isMuted && sessionId) {
        try {
          addLog(`Converting text to speech: "${responseText}"`, "info");

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          const response = await fetch(
            `${API_BASE_URL}/api/voice-chat/text-to-speech`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Session-ID": sessionId,
              },
              body: JSON.stringify({ text: responseText }),
              signal: controller.signal,
            }
          );

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            if (data.audioBase64) {
              await handleAudioResponseFromBase64(data.audioBase64);
            } else {
              addLog("TTS response has no audio data", "warning");
            }
          } else {
            addLog(`TTS request failed: ${response.status}`, "error");
          }
        } catch (error) {
          if (error.name === "AbortError") {
            addLog("TTS request timeout", "warning");
          } else {
            addLog(`TTS failed: ${(error as Error).message}`, "warning");
          }
        }
      }
    },
    [isMuted, sessionId, handleAudioResponseFromBase64, addLog]
  );

  const startConnection = useCallback(async () => {
    console.log("Starting voice assistant connection...");
    if (!isHookMountedRef.current) return;
    console.log("Hook is mounted, proceeding with connection...");

    try {
      setConnectionStatus("connecting");
      setError(null);
      addLog("Starting connection...", "info");

      // Initialize audio first
      await initializeAudio();

      // Create new session
      const newSessionId = await createSession();

      if (!isHookMountedRef.current) return;

      setIsConnected(true);
      setConnectionStatus("connected");

      // Welcome message
      const welcomeMessage =
        "Hello! I'm your health assistant. How are you feeling today? What can I help you with?";

      setTimeout(() => {
        if (isHookMountedRef.current) {
          handleAIResponse(welcomeMessage);
          resetSilenceTimeout();
        }
      }, 1000);

      addLog(`Connection established with session: ${newSessionId}`, "success");
      return newSessionId;
    } catch (error) {
      addLog(`Connection error: ${(error as Error).message}`, "error");
      setError("Failed to start conversation");
      setConnectionStatus("error");
      setIsConnected(false);
      throw error;
    }
  }, [
    initializeAudio,
    createSession,
    handleAIResponse,
    resetSilenceTimeout,
    addLog,
  ]);

  const stopConnection = useCallback(async () => {
    addLog("Stopping connection...", "info");

    setIsConnected(false);
    setIsProcessing(false);
    setConnectionStatus("disconnected");
    setError(null);

    // Stop audio playback
    await cleanupAudio();

    // Clear timeouts
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    // Clear session
    await clearSession();

    addLog("Connection stopped", "success");
  }, [cleanupAudio, clearSession, addLog]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      addLog(`Audio ${newMuted ? "muted" : "unmuted"}`, "info");

      // If we're unmuting and there's a current AI response and we're not already speaking, speak it
      if (!newMuted && aiResponse && !isSpeaking && sessionId) {
        setTimeout(() => {
          if (!newMuted && isHookMountedRef.current) {
            handleAIResponse(aiResponse);
          }
        }, 500);
      }

      return newMuted;
    });
  }, [addLog, aiResponse, isSpeaking, sessionId, handleAIResponse]);

  const cleanup = useCallback(async () => {
    addLog("Cleaning up voice assistant...", "info");
    isHookMountedRef.current = false;
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
