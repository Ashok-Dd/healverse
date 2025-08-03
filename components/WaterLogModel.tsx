import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WaterLogModalProps {
  visible: boolean;
  onClose: () => void;
  onLogWater: (amount: number) => void;
}

const WaterLogModal: React.FC<WaterLogModalProps> = ({
  visible,
  onClose,
  onLogWater,
}) => {
  const [waterAmount, setWaterAmount] = useState<string>("");

  const handleLogWater = () => {
    const amount = parseInt(waterAmount) || 0;
    if (amount > 0) {
      onLogWater(amount);
      setWaterAmount("");
      onClose();
    }
  };

  const handleClose = () => {
    setWaterAmount("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Background Overlay */}
      <TouchableOpacity
        className="flex-1 bg-black/50 justify-center items-center px-6"
        activeOpacity={1}
        onPress={handleClose}
      >
        {/* Modal Content */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-sm"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 pb-4">
            {/* Menu dots */}
            <View className="flex-row space-x-1">
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <View className="w-2 h-2 bg-green-500 rounded-full" />
            </View>

            {/* Toggle Switch */}
            <View className="bg-green-500 rounded-full w-12 h-6 justify-center items-end pr-1">
              <View className="w-5 h-5 bg-white rounded-full" />
            </View>

            {/* Dropdown Arrow */}
            <Ionicons name="chevron-up" size={20} color="#10b981" />
          </View>

          {/* Water Icon and Title */}
          <View className="items-center px-6 pb-4">
            <View className="flex-row items-center mb-4">
              <Ionicons name="water" size={24} color="#6b7280" />
              <Text className="text-2xl font-semibold text-gray-800 ml-3">
                Water
              </Text>
            </View>

            {/* Description */}
            <View className="flex-row items-start mb-6">
              <Ionicons
                name="water"
                size={16}
                color="#3b82f6"
                style={{ marginTop: 2, marginRight: 8 }}
              />
              <Text className="text-gray-600 text-center leading-6 flex-1">
                Log the water you drink to keep track of your hydration. 1 glass
                is 250mL! Fill up, stay refreshed, and crush your hydration
                goals! 💧
              </Text>
            </View>

            {/* Water Amount Input */}
            <View className="w-full items-center mb-6">
              <View className="flex-row items-center justify-center mb-2">
                <TextInput
                  value={waterAmount}
                  onChangeText={setWaterAmount}
                  placeholder="0"
                  keyboardType="numeric"
                  className="text-4xl font-light text-gray-800 text-center min-w-[60px] border-b-2 border-gray-300 pb-1"
                  style={{ minWidth: 60 }}
                />
                <Text className="text-xl text-gray-500 ml-4">mL</Text>
              </View>
            </View>

            {/* Log Water Button */}
            <TouchableOpacity
              onPress={handleLogWater}
              className="bg-green-500 rounded-2xl w-full py-4 flex-row items-center justify-center"
              activeOpacity={0.8}
            >
              <View className="w-6 h-6 bg-white rounded-full items-center justify-center mr-3">
                <Ionicons name="add" size={16} color="#10b981" />
              </View>
              <Text className="text-white font-semibold text-lg">
                Log Water
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// Water Log Holder Component for LogCard
export const WaterLogHolder: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLogWater = (amount: number) => {
    console.log(`Logged ${amount}mL of water`);
    // Here you would typically update your health data state
    // Example: updateHealthData({ waterLogs: [...existingLogs, { amount, timestamp: new Date() }] });
  };

  return (
    <View>
      <WaterLogModal
        visible={modalVisible}
        onClose={closeModal}
        onLogWater={handleLogWater}
      />
    </View>
  );
};

// Modified LogCard Link Component
export const WaterLogModalLink: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLogWater = (amount: number) => {
    console.log(`Logged ${amount}mL of water`);
    // Update your health data here
    // updateHealthData with new water log entry
  };

  // This component will be triggered when LogCard button is pressed
  React.useEffect(() => {
    // Auto-open modal when this component is rendered
    openModal();
  }, []);

  return (
    <WaterLogModal
      visible={modalVisible}
      onClose={closeModal}
      onLogWater={handleLogWater}
    />
  );
};

export default WaterLogModal;

// Usage with LogCard - Update your LogCard usage like this:
/*
<LogCard
  icon="💧"
  title="Water"
  description="Recommended: 3700mL"
  buttonText="+ Log Water"
  Link={WaterLogModalLink}  // Use the Link component that auto-opens modal
  showArrow={true}
  emojiIcon="🥛"
  backgroundStyle="bg-blue-50"
  items={healthData?.waterLogs as WaterLog[]}
  component={WaterLogHolder}
/>
*/
