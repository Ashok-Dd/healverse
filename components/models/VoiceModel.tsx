import useVoiceAssistant from "@/hooks/useVoiceAssistant";
import { Ionicons } from "@expo/vector-icons";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import React, { useEffect, useRef, useState } from "react";
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
    handleAIResponse,
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

  // Animation references - separated for native vs non-native driver
  const orbScale = useRef(new Animated.Value(1)).current;
  const orbOpacity = useRef(new Animated.Value(0.7)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Separate animated value for glow (non-native driver)
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const glowRadius = useRef(new Animated.Value(20)).current;

  // Other references
  const silenceTimeoutRef = useRef(null);
  const reconnectTimeoutRef = useRef<number | NodeJS.Timeout | null>(null);
  const continuousListeningRef = useRef(false);

  // Animation functions
  const startListeningAnimation = () => {
    // Orb scaling animation (native driver)
    // Animated.loop(
    //   Animated.sequence([
    //     Animated.timing(orbScale, {
    //       toValue: 1.1,
    //       duration: 1000,
    //       useNativeDriver: false
    //     }),
    //     Animated.timing(orbScale, {
    //       toValue: 1,
    //       duration: 1000,
    //       useNativeDriver: false
    //     }),
    //   ])
    // ).start();
    // // Pulse ring animation (native driver)
    // Animated.loop(
    //   Animated.timing(pulseAnim, {
    //     toValue: 1,
    //     duration: 2000,
    //     useNativeDriver: false,
    //   })
    // ).start();
    // // Glow animations (non-native driver for shadow effects)
    // Animated.loop(
    //   Animated.sequence([
    //     Animated.timing(glowOpacity, {
    //       toValue: 0.8,
    //       duration: 1500,
    //       useNativeDriver: false,
    //     }),
    //     Animated.timing(glowOpacity, {
    //       toValue: 0.3,
    //       duration: 1500,
    //       useNativeDriver: false,
    //     }),
    //   ])
    // ).start();
    // Animated.loop(
    //   Animated.sequence([
    //     Animated.timing(glowRadius, {
    //       toValue: 40,
    //       duration: 1500,
    //       useNativeDriver: false,
    //     }),
    //     Animated.timing(glowRadius, {
    //       toValue: 20,
    //       duration: 1500,
    //       useNativeDriver: false,
    //     }),
    //   ])
    // ).start();
  };

  const stopListeningAnimation = () => {
    // orbScale.stopAnimation();
    // pulseAnim.stopAnimation();
    // glowOpacity.stopAnimation();
    // glowRadius.stopAnimation();
    // Animated.timing(orbScale, {
    //   toValue: 1,
    //   duration: 300,
    //   useNativeDriver: false,
    // }).start();
    // Animated.timing(pulseAnim, {
    //   toValue: 0,
    //   duration: 300,
    //   useNativeDriver: false,
    // }).start();
    // Animated.timing(glowOpacity, {
    //   toValue: 0.3,
    //   duration: 300,
    //   useNativeDriver: false,
    // }).start();
    // Animated.timing(glowRadius, {
    //   toValue: 20,
    //   duration: 300,
    //   useNativeDriver: false,
    // }).start();
  };

  const speakingAnimation = () => {
    // Animated.loop(
    //   Animated.sequence([
    //     Animated.timing(orbScale, {
    //       toValue: 1.15,
    //       duration: 800,
    //       useNativeDriver: false,
    //     }),
    //     Animated.timing(orbScale, {
    //       toValue: 0.95,
    //       duration: 800,
    //       useNativeDriver: false,
    //     }),
    //   ])
    // ).start();
  };

  // Speech Recognition Event Handlers
  useSpeechRecognitionEvent("start", () => {
    addLog("Speech recognition started", "success");
    setRecognizing(true);
    startListeningAnimation();
  });

  useSpeechRecognitionEvent("end", () => {
    addLog("Speech recognition ended", "info");
    setRecognizing(false);
    stopListeningAnimation();
    setInterimText("");

    // Restart if still connected and continuous listening is enabled
    if (isConnected && continuousListeningRef.current) {
      setTimeout(() => {
        startSpeechRecognition();
      }, 500);
    }
  });

  useSpeechRecognitionEvent("result", (event) => {
    addLog(`Result received - Final: ${event.isFinal}`, "info");

    if (event.results && event.results.length > 0) {
      const result = event.results[0];
      const text = result.transcript || "";

      if (event.isFinal) {
        setTranscript((prev) => prev + text + " ");
        setInterimText("");
        addLog(`Final transcript: "${text}"`, "success");

        // Process the final transcript
        if (text.trim()) {
          handleUserSpeech(text.trim());
          resetSilenceTimeout();
        }
      } else {
        setInterimText(text);
        addLog(`Interim transcript: "${text}"`, "info");
      }
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    const errorMsg = `Error: ${event.error} - ${
      event.message || "Unknown error"
    }`;
    addLog(errorMsg, "error");
    setRecognizing(false);
    stopListeningAnimation();
    setInterimText("");

    // Handle specific errors
    switch (event.error) {
      case "not-allowed":
        Alert.alert(
          "Permission Denied",
          "Please allow microphone and speech recognition permissions in settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Try Again", onPress: () => handleReconnection() },
          ]
        );
        break;
      case "network":
        Alert.alert("Network Error", "Please check your internet connection.", [
          { text: "OK", onPress: () => handleReconnection() },
        ]);
        break;
      case "no-speech":
        // Don't show alert for no-speech, just continue listening
        if (isConnected) {
          handleReconnection();
        }
        break;
      default:
        Alert.alert("Speech Recognition Error", errorMsg);
        handleReconnection();
    }
  });

  useSpeechRecognitionEvent("nomatch", () => {
    addLog("No speech matched", "warning");
    // Continue listening instead of showing alert
    if (isConnected) {
      setTimeout(() => startSpeechRecognition(), 1000);
    }
  });

  // Additional speech events
  useSpeechRecognitionEvent("speechstart", () => {
    addLog("Speech detected", "info");
  });

  useSpeechRecognitionEvent("speechend", () => {
    addLog("Speech ended", "info");
  });

  // Speech recognition functions
  const startSpeechRecognition = async () => {
    try {
      addLog("Requesting permissions...", "info");

      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();

      if (!result.granted) {
        throw new Error("Permissions not granted");
      }

      addLog("Starting speech recognition...", "success");

      ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        continuous: false,
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
        ],
      });

      return true;
    } catch (error) {
      const errorMsg = `Failed to start recognition: ${
        (error as Error).message
      }`;
      addLog(errorMsg, "error");
      throw error;
    }
  };

  // Handle user speech input
  const handleUserSpeech = async (text: string) => {
    try {
      await sendToAI(text);
      setTranscript("");
    } catch (error) {
      addLog(
        `Error processing user speech: ${(error as Error).message}`,
        "error"
      );
    }
  };

  // Connection management
  const startConversation = async () => {
    try {
      await startConnection();

      // Start speech recognition
      const started = await startSpeechRecognition();

      if (started) {
        continuousListeningRef.current = true;
      }
    } catch (error) {
      addLog(
        `Failed to start conversation: ${(error as Error).message}`,
        "error"
      );
      Alert.alert(
        "Connection Error",
        "Failed to start conversation. Please try again."
      );
    }
  };

  const stopConversation = async () => {
    continuousListeningRef.current = false;
    setRecognizing(false);

    ExpoSpeechRecognitionModule.stop();
    stopListeningAnimation();

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    await stopConnection();
  };

  const handleReconnection = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      if (isConnected) {
        startSpeechRecognition();
      }
    }, 2000);
  };

  // Clear conversation history
  const handleClearConversation = async () => {
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
  };

  // Get status info
  const getStatusColor = () => {
    if (connectionStatus === "connected" && (recognizing || isSpeaking))
      return "#00ff88";
    if (connectionStatus === "connected") return "#007fff";
    if (
      connectionStatus === "connecting" ||
      connectionStatus === "reconnecting" ||
      connectionStatus === "processing"
    )
      return "#ffaa00";
    if (connectionStatus === "error" || error) return "#ff3030";
    return "#666666";
  };

  const getStatusText = () => {
    if (error) return error;
    if (connectionStatus === "connecting") return "Connecting...";
    if (connectionStatus === "reconnecting") return "Reconnecting...";
    if (connectionStatus === "processing") return "Processing...";
    if (connectionStatus === "connected" && recognizing) return "Listening...";
    if (connectionStatus === "connected" && isSpeaking) return "Speaking...";
    if (connectionStatus === "connected")
      return `Connected - ${
        sessionId ? `Session: ${sessionId.slice(0, 8)}...` : "Ready"
      }`;
    return "Tap to start conversation";
  };

  // Start speaking animation when isSpeaking changes
  useEffect(() => {
    if (isSpeaking) {
      speakingAnimation();
    } else {
      stopListeningAnimation();
    }
  }, [isSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="white" />

      {/* Background gradient overlay */}
      <View
        style={[
          styles.backgroundGradient,
          { backgroundColor: getStatusColor() + "22" },
        ]}
      />

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
          {/* Pulse rings */}
          {(recognizing || isSpeaking) && (
            <>
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    borderColor: getStatusColor(),
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.4],
                        }),
                      },
                    ],
                    opacity: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 0],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.pulseRing,
                  styles.pulseRing2,
                  {
                    borderColor: getStatusColor(),
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.6],
                        }),
                      },
                    ],
                    opacity: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 0],
                    }),
                  },
                ]}
              />
            </>
          )}

          {/* Main orb */}
          <Animated.View
            style={[
              styles.orb,
              {
                backgroundColor: getStatusColor(),
                transform: [{ scale: orbScale }],
                shadowColor: getStatusColor(),
                shadowOpacity: glowOpacity,
                shadowRadius: glowRadius,
              },
            ]}
          />
        </View>

        {/* Transcript display */}
        {(transcript || interimText || aiResponse) && (
          <View style={styles.transcriptContainer}>
            {(transcript || interimText) && (
              <Text style={styles.transcriptUser}>
                "{transcript}
                {interimText}"
              </Text>
            )}
            {aiResponse && (
              <Text style={styles.transcriptAI}>{aiResponse}</Text>
            )}
          </View>
        )}
      </View>

      {/* Control buttons */}
      <View style={styles.controlsContainer}>
        {/* Clear conversation button */}

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
            size={24}
            color="white"
            style={{ transform: [{ rotate: isConnected ? "135deg" : "0deg" }] }}
          />
        </TouchableOpacity>

        {/* Mute button */}
        {isConnected && (
          <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: StatusBar.currentHeight || 50,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
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
  },
  orb: {
    width: 200,
    height: 200,
    borderRadius: 100,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  pulseRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  pulseRing2: {
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  transcriptContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    maxWidth: width * 0.8,
    backdropFilter: "blur(10px)",
  },
  transcriptUser: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 10,
    textAlign: "center",
  },
  transcriptAI: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  clearButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },
  historyContainer: {
    position: "absolute",
    bottom: 140,
    left: 20,
    right: 20,
    maxHeight: 120,
  },
  historyScroll: {
    flex: 1,
  },
  historyItem: {
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: "80%",
  },
  historyUser: {
    backgroundColor: "rgba(0, 123, 255, 0.3)",
    alignSelf: "flex-end",
  },
  historyAI: {
    backgroundColor: "rgba(0, 255, 136, 0.3)",
    alignSelf: "flex-start",
  },
  historyText: {
    fontSize: 12,
    lineHeight: 16,
  },
  historyTextUser: {
    color: "rgba(135, 206, 250, 1)",
  },
  historyTextAI: {
    color: "rgba(144, 238, 144, 1)",
  },
});
