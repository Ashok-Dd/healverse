import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View, ViewStyle,
} from "react-native";
import {useWaterLogMutations, useWaterLogs} from "@/store/healthStore";
import {CreateWaterLogData} from "@/types/type";

interface WaterLogModalProps {
  visible: boolean;
  onClose: () => void;
  currentIntake?: number; // Current daily intake
  dailyGoal?: number; // Daily goal in mL
}

const WaterLogModal: React.FC<WaterLogModalProps> = ({
  visible,
  onClose,
  currentIntake = 0,
  dailyGoal = 3700,
}) => {
    const {
        addWaterLog
    } = useWaterLogMutations();

  const [waterAmount, setWaterAmount] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  // Common water amounts in mL
  const presetAmounts = [
    { label: "Glass", amount: 250, icon: "🥛" },
    { label: "Bottle", amount: 500, icon: "🍼" },
    { label: "Large Bottle", amount: 750, icon: "🫗" },
    { label: "Liter", amount: 1000, icon: "💧" },
  ];

  const handlePresetSelect = (amount: number) => {
    setSelectedPreset(amount);
    setWaterAmount(amount.toString());
  };

  const handleSave = () => {
    const amount = parseInt(waterAmount);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid water amount.");
      return;
    }

    if (amount > 5000) {
      Alert.alert("Large Amount", "That's a lot of water! Are you sure?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {

            addWaterLog.mutate({
                amountMl : amount,
                loggedAt : new Date().toISOString()
            } as CreateWaterLogData)

            handleClose();
          },
        },
      ]);
      return;
    }

      addWaterLog.mutate({
          amountMl : amount,
          loggedAt : new Date().toISOString()
      } as CreateWaterLogData);

    handleClose();
  };

  const handleClose = () => {
    setWaterAmount("");
    setSelectedPreset(null);
    onClose();
  };

  const progressPercentage = Math.min((currentIntake / dailyGoal) * 100, 100);
  const remainingAmount = Math.max(dailyGoal - currentIntake, 0);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-11/12 max-w-md bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <View className="items-center p-6 border-b border-gray-100">
            <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-3">
              <Text className="text-2xl">💧</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Log Water Intake
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              Stay hydrated for better health and energy
            </Text>
          </View>

          {/* Content */}
          <View className="p-6">
            {/* Current Progress */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-medium text-gray-700">
                  Daily Progress
                </Text>
                <Text className="text-sm text-blue-600 font-semibold">
                  {currentIntake}mL / {dailyGoal}mL
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <View
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` } as ViewStyle}
                />
              </View>

              <Text className="text-xs text-gray-500 text-center">
                {remainingAmount > 0
                  ? `${remainingAmount}mL remaining to reach your goal`
                  : "🎉 Daily goal achieved!"}
              </Text>
            </View>

            {/* Quick Presets */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                Quick Add
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {presetAmounts.map((preset) => (
                  <TouchableOpacity
                    key={preset.amount}
                    className={`flex-1 min-w-0 p-3 rounded-xl border ${
                      selectedPreset === preset.amount
                        ? "bg-blue-50 border-blue-500"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    onPress={() => handlePresetSelect(preset.amount)}
                  >
                    <Text className="text-center text-lg mb-1">
                      {preset.icon}
                    </Text>
                    <Text className="text-xs font-medium text-gray-800 text-center">
                      {preset.label}
                    </Text>
                    <Text className="text-xs text-gray-600 text-center">
                      {preset.amount}mL
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Custom Amount Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                Custom Amount
              </Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-lg text-center"
                  placeholder="Enter amount"
                  value={waterAmount}
                  onChangeText={(text) => {
                    setWaterAmount(text);
                    setSelectedPreset(null);
                  }}
                  keyboardType="numeric"
                  maxLength={4}
                />
                <Text className="ml-3 text-gray-600 font-medium">mL</Text>
              </View>
            </View>

            {/* Hydration Tips */}
            <View className="mb-4 p-3 bg-blue-50 rounded-xl">
              <View className="flex-row items-center mb-2">
                <Ionicons name="bulb" size={16} color="#3b82f6" />
                <Text className="text-sm font-medium text-blue-800 ml-2">
                  Hydration Tip
                </Text>
              </View>
              <Text className="text-xs text-blue-700">
                Drink water consistently throughout the day rather than large
                amounts at once for better absorption.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row p-6 border-t border-gray-100 gap-3">
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-4 rounded-xl items-center"
              onPress={handleClose}
            >
              <Text className="text-gray-700 font-semibold text-lg">
                Cancel
              </Text>
            </TouchableOpacity>
              <TouchableOpacity
                  className={`flex-1 py-4 rounded-xl items-center ${
                      waterAmount && !addWaterLog.isPending ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onPress={handleSave}
                  disabled={!waterAmount || addWaterLog.isPending}
              >
                  <View className="flex-row items-center">
                      {addWaterLog.isPending ? (
                          <ActivityIndicator size="small" color="white" />
                      ) : (
                          <>
                              <Ionicons
                                  name="add"
                                  size={20}
                                  color="white"
                                  style={{ marginRight: 8 } as any}
                              />
                              <Text className="text-white font-semibold text-lg">
                                  Log Water
                              </Text>
                          </>
                      )}
                  </View>
              </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};

// Example usage component that demonstrates how to integrate with your LogCard
const WaterLogModalLink: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIntake, setCurrentIntake] = useState(1250); // Example current intake
  const [dailyGoal] = useState(3700); // Daily goal

  const handleSaveWaterLog = (amount: number) => {
    // Add the new amount to current intake
    setCurrentIntake((prev) => prev + amount);

    // Here you would typically save to your backend/database
    console.log(`Logged ${amount}mL of water`);

    // You could also show a success message
    // Alert.alert("Success", `Added ${amount}mL to your daily intake!`);
  };

  return (
    <>
      <TouchableOpacity
        className="bg-blue-500 px-4 py-2 rounded-lg"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-medium">+ Log Water</Text>
      </TouchableOpacity>

      <WaterLogModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveWaterLog}
        currentIntake={currentIntake}
        dailyGoal={dailyGoal}
      />
    </>
  );
};

export { WaterLogModal, WaterLogModalLink };
