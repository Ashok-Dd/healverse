import { MedicationReminderService } from "@/utils/tasks";
import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface MedicationReminderModalProps {
  visible: boolean;
  reminderData: any;
  onClose: () => void;
  onMedicationLogged: (taken: boolean) => void;
}

export const MedicationReminderModal: React.FC<
  MedicationReminderModalProps
> = ({ visible, reminderData, onClose, onMedicationLogged }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (visible && reminderData) {
      interval = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - reminderData.startTime) / 1000
        );
        setTimeElapsed(elapsed);
      }, 1000) as unknown as NodeJS.Timeout;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [visible, reminderData]);

  // Prevent back button from closing modal
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return visible; // Block back button when modal is visible
      }
    );

    return () => backHandler.remove();
  }, [visible]);

  const handleMedicationTaken = async () => {
    if (isLogging) return;

    setIsLogging(true);
    try {
      await MedicationReminderService.logMedication(
        reminderData.medicationId,
        reminderData.scheduleId,
        true
      );
      onMedicationLogged(true);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to log medication. Please try again.");
      console.error("Error logging medication:", error);
    } finally {
      setIsLogging(false);
    }
  };

  const handleSnooze = async () => {
    if (isLogging) return;

    setIsLogging(true);
    try {
      await MedicationReminderService.snoozeMedication(
        reminderData.medicationId,
        reminderData.scheduleId
      );
      onMedicationLogged(false);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to snooze medication. Please try again.");
      console.error("Error snoozing medication:", error);
    } finally {
      setIsLogging(false);
    }
  };

  const handleSkip = async () => {
    Alert.alert(
      "Skip Medication?",
      "Are you sure you want to skip this medication? This will be logged.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Skip",
          style: "destructive",
          onPress: async () => {
            if (isLogging) return;

            setIsLogging(true);
            try {
              await MedicationReminderService.logMedication(
                reminderData.medicationId,
                reminderData.scheduleId,
                false
              );
              onMedicationLogged(false);
              onClose();
            } catch (error) {
              Alert.alert("Error", "Failed to log skip. Please try again.");
              console.error("Error logging skip:", error);
            } finally {
              setIsLogging(false);
            }
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!reminderData) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <View style={styles.fullScreenContainer}>
        <View style={styles.content}>
          <Text style={styles.urgentText}>💊 MEDICATION REMINDER</Text>

          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>
              {reminderData.medicationName}
            </Text>
            {reminderData.dosage && (
              <Text style={styles.dosage}>Dosage: {reminderData.dosage}</Text>
            )}
            {reminderData.instructions && (
              <Text style={styles.instructions}>
                {reminderData.instructions}
              </Text>
            )}
          </View>

          <View style={styles.timeInfo}>
            <Text style={styles.timeElapsed}>
              Time elapsed: {formatTime(timeElapsed)}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.takenButton,
                isLogging && styles.buttonDisabled,
              ]}
              onPress={handleMedicationTaken}
              disabled={isLogging}
            >
              <Text style={styles.buttonText}>
                {isLogging ? "⏳ LOGGING..." : "✅ TAKEN"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.snoozeButton,
                isLogging && styles.buttonDisabled,
              ]}
              onPress={handleSnooze}
              disabled={isLogging}
            >
              <Text style={styles.buttonText}>⏰ SNOOZE (5 min)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.skipButton,
                isLogging && styles.buttonDisabled,
              ]}
              onPress={handleSkip}
              disabled={isLogging}
            >
              <Text style={styles.buttonText}>⏭️ SKIP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  urgentText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 40,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  medicationInfo: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: "center",
    minWidth: 280,
  },
  medicationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  dosage: {
    fontSize: 18,
    color: "#666",
    marginBottom: 5,
  },
  instructions: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 5,
  },
  timeInfo: {
    marginBottom: 40,
  },
  timeElapsed: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  buttonContainer: {
    gap: 15,
    width: "100%",
    alignItems: "center",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  takenButton: {
    backgroundColor: "#4CAF50",
  },
  snoozeButton: {
    backgroundColor: "#FF9800",
  },
  skipButton: {
    backgroundColor: "#757575",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
