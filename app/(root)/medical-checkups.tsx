import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Checkup {
  id: string;
  type: string;
  date: string;
  time: string;
  reminder: string;
  icon: string;
  colorClass: string;
  completed?: boolean;
}

const MedicalCheckups: React.FC = () => {
  const [showCompleted, setShowCompleted] = useState(false);

  const upcomingCheckups: Checkup[] = [
    {
      id: "1",
      type: "Annual Blood Test",
      date: "Dec 20, 2024",
      time: "10:00 AM",
      reminder: "Reminds: 1 day before",
      icon: "🩸",
      colorClass: "border-l-blue-500",
    },
    {
      id: "2",
      type: "Dental Cleaning",
      date: "Dec 25, 2024",
      time: "2:30 PM",
      reminder: "Reminds: 2 hours before",
      icon: "🦷",
      colorClass: "border-l-green-500",
    },
    {
      id: "3",
      type: "Eye Examination",
      date: "Jan 5, 2025",
      time: "11:00 AM",
      reminder: "Reminds: 1 day before",
      icon: "👁️",
      colorClass: "border-l-amber-500",
    },
  ];

  const completedCheckups: Checkup[] = [
    {
      id: "4",
      type: "General Physical",
      date: "Nov 15, 2024",
      time: "9:00 AM",
      reminder: "Completed",
      icon: "🩺",
      colorClass: "border-l-gray-400",
      completed: true,
    },
    {
      id: "5",
      type: "Cardiology Check",
      date: "Oct 30, 2024",
      time: "3:00 PM",
      reminder: "Completed",
      icon: "❤️",
      colorClass: "border-l-gray-400",
      completed: true,
    },
  ];

  const CheckupCard: React.FC<{ checkup: Checkup }> = ({ checkup }) => (
    <View
      className={`bg-white rounded-xl p-4 mb-3 shadow-sm border-l-4 ${
        checkup.colorClass
      } ${checkup.completed ? "opacity-70" : ""}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4">
            <Text className="text-2xl">{checkup.icon}</Text>
          </View>
          <View className="flex-1">
            <Text
              className={`text-base font-semibold ${
                checkup.completed ? "text-gray-600" : "text-gray-900"
              }`}
            >
              {checkup.type}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text
                className={`text-sm ${
                  checkup.completed ? "text-gray-500" : "text-blue-600"
                } mr-2`}
              >
                📅 {checkup.date} at {checkup.time}
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Text
                className={`text-xs ${
                  checkup.completed ? "text-gray-400" : "text-amber-600"
                }`}
              >
                ⚠️ {checkup.reminder}
              </Text>
            </View>
          </View>
        </View>
        {!checkup.completed && (
          <View className="ml-2">
            <Text className="text-gray-400">›</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-6">
        {/* Header */}

        <View className="bg-gradient-to-r from-teal-400 to-blue-400 rounded-xl p-6 mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-white bg-opacity-20 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">📅</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-bold">
                Medical Checkups
              </Text>
              <Text className="text-white text-sm opacity-90 mt-1">
                Track and get timely reminders for your health visits
              </Text>
            </View>
          </View>
        </View>

        {/* Upcoming Checkups */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Upcoming Checkups
          </Text>
          {upcomingCheckups.map((checkup) => (
            <CheckupCard key={checkup.id} checkup={checkup} />
          ))}
        </View>

        {/* Dental Reminder Card */}
        <View className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
          <View className="flex-row items-start">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">🦷</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-medium mb-2">
                It's been 6 months since your last dental checkup. Would you
                like to schedule one?
              </Text>
              <TouchableOpacity
                className="bg-teal-400 px-6 py-2 rounded-lg self-start"
                onPress={() => router.push("/(root)/MedicalChatForm")}
              >
                <Text className="text-white font-medium">Schedule Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Completed Checkups */}
        <TouchableOpacity
          onPress={() => setShowCompleted(!showCompleted)}
          className="flex-row items-center justify-between mb-4"
        >
          <View className="flex-row items-center">
            <Text className="text-gray-600 mr-2">📋</Text>
            <Text className="text-lg font-semibold text-gray-800">
              Completed Checkups ({completedCheckups.length})
            </Text>
          </View>
          <Text
            className={`text-gray-400 text-lg transform ${
              showCompleted ? "rotate-90" : ""
            }`}
          >
            ›
          </Text>
        </TouchableOpacity>

        {showCompleted && (
          <View className="mb-6">
            {completedCheckups.map((checkup) => (
              <CheckupCard key={checkup.id} checkup={checkup} />
            ))}
          </View>
        )}

        {/* Add some bottom spacing */}
        <View className="h-6" />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 w-14 h-14 bg-teal-400 rounded-full items-center justify-center shadow-lg">
        <Text className="text-white text-2xl font-light">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MedicalCheckups;
