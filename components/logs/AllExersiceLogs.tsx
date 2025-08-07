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

interface ExerciseLog {
  id: number;
  name: string;
  intensity: string;
  duration: number;
  calories: number;
  date: string;
  time: string;
  icon: string;
}

interface GroupedLogs {
  [key: string]: ExerciseLog[];
}

interface ExerciseLogsComponentProps {
  exerciseLogs?: ExerciseLog[];
  onEdit?: (logId: number) => void;
  onDelete?: (logId: number) => void;
  onCopyFood?: (logId: number) => void;
}

const ExerciseLogsComponent: React.FC<ExerciseLogsComponentProps> = ({
  exerciseLogs = [
    {
      id: 1,
      name: "Yoga",
      intensity: "Moderate",
      duration: 60,
      calories: 167,
      date: "August 2",
      time: "August 2, 12:28 AM",
      icon: "🧘‍♀️",
    },
    {
      id: 2,
      name: "Walking",
      intensity: "Moderate",
      duration: 45,
      calories: 146,
      date: "August 1",
      time: "August 1, 09:36 PM",
      icon: "🚶‍♂️",
    },
    {
      id: 3,
      name: "Cycling",
      intensity: "Moderate",
      duration: 45,
      calories: 456,
      date: "July 30",
      time: "July 30, 10:26 PM",
      icon: "🚴‍♂️",
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

  const renderExerciseCard = (log: ExerciseLog): React.ReactElement => (
    <View key={log.id} className="mb-3">
      <View className="bg-white rounded-xl p-4 shadow-sm">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-xl bg-green-100 items-center justify-center mr-3">
            <Text className="text-xl">{log.icon}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm text-black mb-1">
              {log.name} | {log.intensity} | {log.duration} min
            </Text>
            <Text className="text-xs text-gray-500 mb-2">{log.time}</Text>
            <View className="flex-row items-center">
              <Ionicons name="flame" size={16} color="#10b981" />
              <Text className="text-xs text-green-600 font-medium ml-1">
                -{log.calories}kcal
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
    logs: ExerciseLog[]
  ): React.ReactElement => (
    <View key={date} className="mt-2">
      <Text className="text-sm text-gray-800 mb-3">{date}</Text>
      {logs.map((log: ExerciseLog) => renderExerciseCard(log))}
    </View>
  );

  // Group logs by date
  const groupedLogs: GroupedLogs = exerciseLogs.reduce(
    (acc: GroupedLogs, log: ExerciseLog) => {
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
        {Object.entries(groupedLogs).map(
          ([date, logs]: [string, ExerciseLog[]]) =>
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

export default ExerciseLogsComponent;
