import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WaterLog {
  id: number;
  date: string;
  time: string;
  amount: string;
}

interface GroupedLogs {
  [key: string]: WaterLog[];
}

interface WaterLogsComponentProps {
  waterLogs?: WaterLog[];
  onEdit?: (logId: number) => void;
  onDelete?: (logId: number) => void;
  onCopyFood?: (logId: number) => void;
}

const WaterLogsComponent: React.FC<WaterLogsComponentProps> = ({
  waterLogs = [
    {
      id: 1,
      date: "August 2",
      time: "August 2, 12:43 AM",
      amount: "100mL",
    },
    {
      id: 2,
      date: "July 30",
      time: "July 30, 10:26 PM",
      amount: "5.0mL",
    },
  ],
  onEdit,
  onDelete,
  onCopyFood,
}) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleMenuPress = (cardId: number, event: any): void => {
    setSelectedCard(cardId);
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX - 100, y: pageY + 10 });
    setModalVisible(true);
  };

  const handleEdit = (): void => {
    setModalVisible(false);
    if (selectedCard && onEdit) {
      onEdit(selectedCard);
    }
  };

  const handleDelete = (): void => {
    setModalVisible(false);
    if (selectedCard && onDelete) {
      onDelete(selectedCard);
    }
  };

  const handleCopyFood = (): void => {
    setModalVisible(false);
    if (selectedCard && onCopyFood) {
      onCopyFood(selectedCard);
    }
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setSelectedCard(null);
  };

  const renderWaterCard = (log: WaterLog): React.ReactElement => (
    <View key={log.id} className="mb-3">
      <View className="bg-white rounded-xl p-4 shadow-sm">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-xl bg-green-100 items-center justify-center mr-3">
            <Ionicons name="water" size={24} color="#4CAF50" />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-black mb-1">Water</Text>
            <Text className="text-xs text-gray-500 mb-2">{log.time}</Text>
            <View className="flex-row items-center">
              <Ionicons name="water-outline" size={16} color="#2196F3" />
              <Text className="text-xs text-blue-500 font-medium ml-1">
                {log.amount}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="p-2"
            onPress={(event) => handleMenuPress(log.id, event)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderDateSection = (
    date: string,
    logs: WaterLog[]
  ): React.ReactElement => (
    <View key={date} className="mt-2">
      <Text className="text-sm text-gray-800 mb-3">{date}</Text>
      {logs.map((log: WaterLog) => renderWaterCard(log))}
    </View>
  );

  // Group logs by date
  const groupedLogs: GroupedLogs = waterLogs.reduce(
    (acc: GroupedLogs, log: WaterLog) => {
      const date = log.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    },
    {}
  );

  return (
    <View className="flex-1">
      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {Object.entries(groupedLogs).map(([date, logs]: [string, WaterLog[]]) =>
          renderDateSection(date, logs)
        )}
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Pressable className="flex-1" onPress={closeModal}>
          <View
            className="absolute bg-white rounded-xl w-32 py-1 shadow-2xl border border-gray-100"
            style={{
              top: menuPosition.y,
              right: 20,
              elevation: 10,
            }}
          >
            <TouchableOpacity
              className="flex-row items-center px-4 py-3"
              onPress={handleEdit}
            >
              <Text className="text-base text-gray-800 font-normal">Edit</Text>
            </TouchableOpacity>

            <View className="h-px bg-gray-150 mx-0" />

            <TouchableOpacity
              className="flex-row items-center px-4 py-3"
              onPress={handleDelete}
            >
              <Text className="text-base text-gray-800 font-normal">
                Delete
              </Text>
            </TouchableOpacity>

            <View className="h-px bg-gray-150 mx-0" />

            <TouchableOpacity
              className="flex-row items-center px-4 py-3"
              onPress={handleCopyFood}
            >
              <Text className="text-base text-gray-800 font-normal">
                Copy Food
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default WaterLogsComponent;
