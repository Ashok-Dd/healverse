import useVoiceAssistant from "@/hooks/useVoiceAssistant";
import { Ionicons } from "@expo/vector-icons";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function VoiceHealthAssistant() {
  // Voice assistant hook
  const {
    sessionId,
    isConnected,
    isProcessing,
    isSpeaking,
    connectionStatus,
    error,
    isMuted,
    aiResponse,
    startConnection,
    stopConnection,
    sendToAI,
    toggleMute,
    clearSession,
    cleanup,
    resetSilenceTimeout,
    addLog,
  } = useVoiceAssistant();

  // Local state for speech recognition
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Animation references
  const orbScale = useRef(new Animated.Value(1)).current;
  const orbOpacity = useRef(new Animated.Value(0.7)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  // Control references
  const recognitionActiveRef = useRef(false);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);

  // Animation functions
  const startListeningAnimation = useCallback(() => {
    if (!isComponentMountedRef.current) return;

    orbScale.stopAnimation();
    pulseAnim.stopAnimation();
    glowOpacity.stopAnimation();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orbScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(orbScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [orbScale, pulseAnim, glowOpacity]);

  const stopListeningAnimation = useCallback(() => {
    if (!isComponentMountedRef.current) return;

    orbScale.stopAnimation();
    pulseAnim.stopAnimation();
    glowOpacity.stopAnimation();

    Animated.timing(orbScale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(pulseAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(glowOpacity, {
      toValue: 0.3,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [orbScale, pulseAnim, glowOpacity]);

  const speakingAnimation = useCallback(() => {
    if (!isComponentMountedRef.current) return;

    orbScale.stopAnimation();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orbScale, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(orbScale, {
          toValue: 0.95,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [orbScale]);

  // Initialize permissions
  const initializePermissions = useCallback(async () => {
    try {
      addLog("Requesting speech recognition permissions...", "info");
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();

      if (result.granted) {
        setPermissionsGranted(true);
        addLog("Speech recognition permissions granted", "success");
        return true;
      } else {
        setPermissionsGranted(false);
        addLog("Speech recognition permissions denied", "error");
        Alert.alert(
          "Permission Required",
          "Microphone and speech recognition permissions are required for voice interaction.",
          [{ text: "OK" }]
        );
        return false;
      }
    } catch (error) {
      addLog(`Permission request failed: ${(error as Error).message}`, "error");
      setPermissionsGranted(false);
      return false;
    }
  }, [addLog]);

  // Speech Recognition Event Handlers
  useSpeechRecognitionEvent("start", () => {
    if (!isComponentMountedRef.current) return;

    addLog("Speech recognition started", "success");
    setRecognizing(true);
    recognitionActiveRef.current = true;
    startListeningAnimation();

    // Clear any existing speech timeout
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
  });

  useSpeechRecognitionEvent("end", () => {
    if (!isComponentMountedRef.current) return;

    addLog("Speech recognition ended", "info");
    setRecognizing(false);
    recognitionActiveRef.current = false;
    stopListeningAnimation();
    setInterimText("");

    // Only restart if conditions are right and we're not processing
    if (
      isConnected &&
      speechEnabled &&
      !isProcessing &&
      !isSpeaking &&
      isComponentMountedRef.current
    ) {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }

      restartTimeoutRef.current = setTimeout(() => {
        if (
          isConnected &&
          speechEnabled &&
          !isProcessing &&
          !isSpeaking &&
          !recognitionActiveRef.current &&
          isComponentMountedRef.current
        ) {
          startSpeechRecognition();
        }
      }, 2000) as unknown as NodeJS.Timeout; // Longer delay
    }
  });

  useSpeechRecognitionEvent("result", (event) => {
    if (!isComponentMountedRef.current) return;

    if (event.results && event.results.length > 0) {
      const result = event.results[0];
      const text = result.transcript || "";

      if (event.isFinal) {
        addLog(`Final transcript: "${text}"`, "success");
        setTranscript(text);
        setInterimText("");

        // Process the final transcript if it's meaningful
        if (text.trim() && text.length > 1) {
          // Even shorter threshold
          handleUserSpeech(text.trim());
          resetSilenceTimeout();
        }
      } else {
        // Show interim results
        setInterimText(text);
        addLog(`Interim transcript: "${text}"`, "info");
      }
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    if (!isComponentMountedRef.current) return;

    const errorMsg = `Speech Error: ${event.error} - ${
      event.message || "Unknown error"
    }`;
    addLog(errorMsg, "error");

    setRecognizing(false);
    recognitionActiveRef.current = false;
    stopListeningAnimation();
    setInterimText("");

    // Handle specific errors
    switch (event.error) {
      case "not-allowed":
        setSpeechEnabled(false);
        setPermissionsGranted(false);
        Alert.alert(
          "Permission Denied",
          "Please allow microphone and speech recognition permissions in settings.",
          [
            {
              text: "Retry",
              onPress: () => initializePermissions(),
            },
            { text: "OK" },
          ]
        );
        break;

      case "network":
        Alert.alert("Network Error", "Please check your internet connection.", [
          { text: "OK" },
        ]);
        // Retry after network error
        setTimeout(() => {
          if (isConnected && speechEnabled && isComponentMountedRef.current) {
            startSpeechRecognition();
          }
        }, 5000);
        break;

      case "no-speech":
        // Silently restart for no-speech
        if (isConnected && speechEnabled && !isProcessing && !isSpeaking) {
          setTimeout(() => {
            if (
              isConnected &&
              speechEnabled &&
              !recognitionActiveRef.current &&
              isComponentMountedRef.current
            ) {
              startSpeechRecognition();
            }
          }, 1500);
        }
        break;

      default:
        // For other errors, try to restart with backoff
        if (isConnected && speechEnabled) {
          setTimeout(() => {
            if (
              isConnected &&
              speechEnabled &&
              !recognitionActiveRef.current &&
              isComponentMountedRef.current
            ) {
              startSpeechRecognition();
            }
          }, 3000);
        }
    }
  });

  useSpeechRecognitionEvent("nomatch", () => {
    if (!isComponentMountedRef.current) return;

    addLog("No speech matched", "warning");
    // Continue listening
    if (isConnected && speechEnabled && !isProcessing && !isSpeaking) {
      setTimeout(() => {
        if (
          isConnected &&
          speechEnabled &&
          !recognitionActiveRef.current &&
          isComponentMountedRef.current
        ) {
          startSpeechRecognition();
        }
      }, 1500);
    }
  });

  useSpeechRecognitionEvent("speechstart", () => {
    if (!isComponentMountedRef.current) return;

    addLog("Speech detected", "info");
    // Reset speech timeout when speech is detected
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
  });

  useSpeechRecognitionEvent("speechend", () => {
    if (!isComponentMountedRef.current) return;

    addLog("Speech ended", "info");
  });

  // Speech recognition functions
  const startSpeechRecognition = useCallback(async () => {
    if (!isComponentMountedRef.current) return false;

    if (recognitionActiveRef.current || isProcessing || isSpeaking) {
      addLog("Speech recognition already active or system busy", "info");
      return false;
    }

    if (!permissionsGranted) {
      const granted = await initializePermissions();
      if (!granted) return false;
    }

    try {
      addLog("Starting speech recognition...", "info");

      // Use more robust settings
      ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        continuous: true, // Enable continuous listening
        maxAlternatives: 1,
        requiresOnDeviceRecognition: false,
        addsPunctuation: true,
        contextualStrings: [
          "health",
          "symptoms",
          "medication",
          "doctor",
          "pain",
          "fever",
          "headache",
          "stomach",
          "chest",
          "blood pressure",
          "feeling",
          "hurt",
          "sick",
          "tired",
          "dizzy",
          "help",
          "what",
          "how",
          "when",
          "where",
          "why",
        ],
      });

      return true;
    } catch (error) {
      const errorMsg = `Failed to start recognition: ${
        (error as Error).message
      }`;
      addLog(errorMsg, "error");
      setSpeechEnabled(false);
      return false;
    }
  }, [
    isProcessing,
    isSpeaking,
    permissionsGranted,
    initializePermissions,
    addLog,
  ]);

  const stopSpeechRecognition = useCallback(() => {
    if (!isComponentMountedRef.current) return;

    if (recognitionActiveRef.current) {
      addLog("Stopping speech recognition...", "info");
      try {
        ExpoSpeechRecognitionModule.stop();
      } catch (error) {
        addLog(
          `Error stopping speech recognition: ${(error as Error).message}`,
          "warning"
        );
      }
      setRecognizing(false);
      recognitionActiveRef.current = false;
      stopListeningAnimation();
    }

    // Clear timeouts
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  }, [stopListeningAnimation, addLog]);

  // Handle user speech input
  const handleUserSpeech = useCallback(
    async (text: string) => {
      if (!isComponentMountedRef.current) return;

      try {
        addLog(`Processing user speech: "${text}"`, "info");

        // Temporarily stop listening while processing
        stopSpeechRecognition();
        setSpeechEnabled(false);

        await sendToAI(text);
        setTranscript("");

        // Wait for AI response to finish before restarting
        setTimeout(() => {
          if (isConnected && !isSpeaking && isComponentMountedRef.current) {
            setSpeechEnabled(true);
          }
        }, 3000);
      } catch (error) {
        addLog(
          `Error processing user speech: ${(error as Error).message}`,
          "error"
        );

        // Re-enable speech even on error
        setTimeout(() => {
          if (isConnected && isComponentMountedRef.current) {
            setSpeechEnabled(true);
          }
        }, 2000);
      }
    },
    [sendToAI, isConnected, stopSpeechRecognition, addLog, isSpeaking]
  );

  // Connection management
  const startConversation = useCallback(async () => {
    if (!isComponentMountedRef.current) return;

    try {
      // Check permissions first
      const hasPermissions = await initializePermissions();
      if (!hasPermissions) {
        throw new Error("Speech recognition permissions required");
      }

      await startConnection();

      // Wait a bit before enabling speech
      setTimeout(() => {
        if (isConnected && isComponentMountedRef.current) {
          setSpeechEnabled(true);
        }
      }, 2000);
    } catch (error) {
      addLog(
        `Failed to start conversation: ${(error as Error).message}`,
        "error"
      );
      Alert.alert(
        "Connection Error",
        "Failed to start conversation. Please check your permissions and try again."
      );
    }
  }, [startConnection, isConnected, initializePermissions, addLog]);

  const stopConversation = useCallback(async () => {
    if (!isComponentMountedRef.current) return;

    setSpeechEnabled(false);
    stopSpeechRecognition();
    await stopConnection();
  }, [stopSpeechRecognition, stopConnection]);

  // Clear conversation history
  const handleClearConversation = useCallback(async () => {
    Alert.alert(
      "Clear Conversation",
      "Are you sure you want to clear the conversation history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearSession();
            setTranscript("");
            setInterimText("");
          },
        },
      ]
    );
  }, [clearSession]);

  // Get status info
  const getStatusColor = useCallback(() => {
    if (error) return "#ff3030";
    if (connectionStatus === "error") return "#ff3030";
    if (isSpeaking) return "#00ff88";
    if (recognizing) return "#00aaff";
    if (isProcessing) return "#ffaa00";
    if (connectionStatus === "connected") return "#007fff";
    if (connectionStatus === "connecting") return "#ffaa00";
    return "#666666";
  }, [error, connectionStatus, isSpeaking, recognizing, isProcessing]);

  const getStatusText = useCallback(() => {
    if (error) return error;
    if (!permissionsGranted) return "Permissions required";
    if (connectionStatus === "connecting") return "Connecting...";
    if (connectionStatus === "processing") return "Processing...";
    if (connectionStatus === "connected" && isSpeaking) return "Speaking...";
    if (connectionStatus === "connected" && recognizing) return "Listening...";
    if (connectionStatus === "connected" && isProcessing) return "Thinking...";
    if (connectionStatus === "connected")
      return `Connected${sessionId ? ` - ${sessionId.slice(0, 8)}...` : ""}`;
    if (connectionStatus === "error") return "Connection Error";
    return "Tap to start conversation";
  }, [
    error,
    permissionsGranted,
    connectionStatus,
    isSpeaking,
    recognizing,
    isProcessing,
    sessionId,
  ]);

  // Effects
  useEffect(() => {
    if (isSpeaking) {
      speakingAnimation();
    } else if (!recognizing) {
      stopListeningAnimation();
    }
  }, [isSpeaking, recognizing, speakingAnimation, stopListeningAnimation]);

  // Handle speech recognition restart when conditions change
  useEffect(() => {
    if (!isComponentMountedRef.current) return;

    if (
      speechEnabled &&
      isConnected &&
      !isProcessing &&
      !isSpeaking &&
      !recognitionActiveRef.current &&
      permissionsGranted
    ) {
      const timer = setTimeout(() => {
        if (
          speechEnabled &&
          isConnected &&
          !isProcessing &&
          !isSpeaking &&
          !recognitionActiveRef.current &&
          permissionsGranted &&
          isComponentMountedRef.current
        ) {
          startSpeechRecognition();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    speechEnabled,
    isConnected,
    isProcessing,
    isSpeaking,
    permissionsGranted,
    startSpeechRecognition,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    isComponentMountedRef.current = true;

    return () => {
      isComponentMountedRef.current = false;
      stopSpeechRecognition();
      cleanup();
    };
  }, [cleanup, stopSpeechRecognition]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Assistant</Text>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        {sessionId && (
          <Text style={styles.sessionText}>
            Session: {sessionId.slice(0, 8)}...
          </Text>
        )}
      </View>

      {/* Main content area */}
      <View style={styles.mainContent}>
        {/* Animated orb */}
        <View style={styles.orbContainer}>
          {/* Glow effect */}
          <Animated.View
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: getStatusColor(),
              opacity: glowOpacity,
              top: 20,
              left: 20,
              zIndex: 0,
            }}
            pointerEvents="none"
          />
          {/* Main orb */}
          <Animated.View
            style={[
              styles.orb,
              {
                backgroundColor: getStatusColor(),
                transform: [{ scale: orbScale }],
                shadowColor: getStatusColor(),
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 20,
                zIndex: 1,
              },
            ]}
          />
        </View>

        {/* Transcript display */}
        {(transcript || interimText || aiResponse) && (
          <View style={styles.transcriptContainer}>
            {(transcript || interimText) && (
              <View style={styles.userTranscriptWrapper}>
                <Text style={styles.transcriptLabel}>You said:</Text>
                <Text style={styles.transcriptUser}>
                  "{transcript}
                  {interimText}"
                </Text>
              </View>
            )}
            {aiResponse && (
              <View style={styles.aiResponseWrapper}>
                <Text style={styles.transcriptLabel}>Assistant:</Text>
                <Text style={styles.transcriptAI}>{aiResponse}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Control buttons */}
      <View style={styles.controlsContainer}>
        {/* Clear conversation button */}
        {isConnected && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearConversation}
          >
            <Ionicons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        )}

        {/* Main call button */}
        <TouchableOpacity
          style={[
            styles.callButton,
            {
              backgroundColor: isConnected ? "#ff3030" : "#00ff88",
              shadowColor: isConnected ? "#ff3030" : "#00ff88",
            },
          ]}
          onPress={isConnected ? stopConversation : startConversation}
          disabled={connectionStatus === "connecting"}
        >
          <Ionicons
            name={isConnected ? "call" : "call"}
            size={32}
            color="white"
            style={{ transform: [{ rotate: isConnected ? "135deg" : "0deg" }] }}
          />
        </TouchableOpacity>

        {/* Mute button */}
        {isConnected && (
          <TouchableOpacity
            style={[
              styles.muteButton,
              {
                backgroundColor: isMuted
                  ? "#ff6b6b"
                  : "rgba(255, 255, 255, 0.2)",
              },
            ]}
            onPress={toggleMute}
          >
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Speech recognition indicator */}
      {isConnected && (
        <View style={styles.speechIndicator}>
          <View
            style={[
              styles.speechDot,
              {
                backgroundColor:
                  speechEnabled && permissionsGranted ? "#00ff88" : "#666",
              },
            ]}
          />
          <Text style={styles.speechText}>
            {!permissionsGranted
              ? "Permissions Required"
              : speechEnabled
              ? "Voice Recognition On"
              : "Voice Recognition Off"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: StatusBar.currentHeight || 50,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    color: "white",
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  sessionText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  orbContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    height: 240,
    width: 240,
  },
  orb: {
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowOffset: { width: 0, height: 0 },
  },
  transcriptContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    maxWidth: width * 0.9,
    maxHeight: height * 0.3,
    backdropFilter: "blur(10px)",
  },
  userTranscriptWrapper: {
    marginBottom: 15,
  },
  aiResponseWrapper: {
    marginTop: 10,
  },
  transcriptLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  transcriptUser: {
    color: "#87ceeb",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
  },
  transcriptAI: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  clearButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 25,
  },
  callButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  muteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 25,
  },
  speechIndicator: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  speechDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  speechText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontWeight: "500",
  },
});
