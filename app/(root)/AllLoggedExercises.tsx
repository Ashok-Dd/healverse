import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoggedExercise {
  id: string;
  name: string;
  intensity: string;
  duration: number;
  calories: number;
  date: string;
  time: string;
  icon: string;
}

// Sample logged exercises data
const loggedExercises: LoggedExercise[] = [
  {
    id: "1",
    name: "Yoga",
    intensity: "Moderate",
    duration: 60,
    calories: 167,
    date: "August 2",
    time: "12:28 AM",
    icon: "🧘‍♀️",
  },
  {
    id: "2",
    name: "Walking",
    intensity: "Moderate",
    duration: 45,
    calories: 146,
    date: "August 1",
    time: "09:36 PM",
    icon: "🚶‍♂️",
  },
  {
    id: "3",
    name: "Cycling",
    intensity: "Moderate",
    duration: 45,
    calories: 456,
    date: "July 30",
    time: "10:26 PM",
    icon: "🚴‍♂️",
  },
];

const AllLoggedExercises: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleMenuPress = (exerciseId: string, event: any): void => {
    setSelectedExercise(exerciseId);
    // Position the menu near the three dots button
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX - 100, y: pageY + 10 });
    setModalVisible(true);
  };

  const handleEdit = (): void => {
    setModalVisible(false);
    // Add edit functionality here
    console.log("Edit exercise:", selectedExercise);
  };

  const handleDelete = (): void => {
    setModalVisible(false);
    // Add delete functionality here
    console.log("Delete exercise:", selectedExercise);
  };

  const handleCopyFood = (): void => {
    setModalVisible(false);
    // Add copy food functionality here
    console.log("Copy food exercise:", selectedExercise);
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setSelectedExercise(null);
  };

  const renderExerciseItem = (exercise: LoggedExercise, isFirst: boolean) => {
    return (
      <View key={exercise.id} className="mb-6">
        {/* Date Header */}
        {isFirst && (
          <Text className="text-lg font-semibold text-gray-800 mb-4 px-4">
            {exercise.date}
          </Text>
        )}

        {/* Exercise Card */}
        <View className="mx-4 bg-gray-50 rounded-2xl p-4">
          <View className="flex-row items-center">
            {/* Exercise Icon */}
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">{exercise.icon}</Text>
            </View>

            {/* Exercise Details */}
            <View className="flex-1">
              {/* Exercise Name and Details */}
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {exercise.name} | {exercise.intensity} | {exercise.duration} min
              </Text>

              {/* Exercise Type and Time */}
              <View className="flex-row items-center mb-2">
                <Ionicons name="walk" size={16} color="#9ca3af" />
                <Text className="text-gray-500 ml-2">
                  Exercise {exercise.date}, {exercise.time}
                </Text>
              </View>

              {/* Calories */}
              <View className="flex-row items-center">
                <Ionicons name="flame" size={16} color="#10b981" />
                <Text className="text-green-600 font-medium ml-1">
                  -{exercise.calories}kcal
                </Text>
              </View>
            </View>

            {/* More Options Button */}
            <TouchableOpacity
              className="p-2"
              onPress={(event) => handleMenuPress(exercise.id, event)}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const groupExercisesByDate = () => {
    const grouped: { [key: string]: LoggedExercise[] } = {};

    loggedExercises.forEach((exercise) => {
      if (!grouped[exercise.date]) {
        grouped[exercise.date] = [];
      }
      grouped[exercise.date].push(exercise);
    });

    return grouped;
  };

  const renderGroupedExercises = () => {
    const groupedExercises = groupExercisesByDate();
    const dates = Object.keys(groupedExercises);

    return dates.map((date) => (
      <View key={date} className="mb-2">
        {/* Date Header */}
        <Text className="text-sm text-gray-800 mb-4 px-4">{date}</Text>

        {/* Exercises for this date */}
        {groupedExercises[date].map((exercise) => (
          <View key={exercise.id} className="mb-1">
            <View className="mx-4 bg-gray-100 rounded-lg p-2">
              <View className="flex-row items-center">
                {/* Exercise Icon */}
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-2xl">{exercise.icon}</Text>
                </View>

                {/* Exercise Details */}
                <View className="flex-1">
                  {/* Exercise Name and Details */}
                  <Text className="text-sm font-semibold text-gray-800 mb-1">
                    {exercise.name} | {exercise.intensity} | {exercise.duration}{" "}
                    min
                  </Text>

                  {/* Exercise Type and Time */}
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="walk" size={16} color="#9ca3af" />
                    <Text className="text-sm text-gray-500 ml-2">
                      Exercise {exercise.date}, {exercise.time}
                    </Text>
                  </View>

                  {/* Calories */}
                  <View className="flex-row items-center">
                    <Ionicons name="flame" size={16} color="#10b981" />
                    <Text className="text-green-600 text-xs font-medium ml-1">
                      -{exercise.calories}kcal
                    </Text>
                  </View>
                </View>

                {/* More Options Button */}
                <TouchableOpacity
                  className="p-2"
                  onPress={(event) => handleMenuPress(exercise.id, event)}
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        {/* Title with Icon */}
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full items-center justify-center mr-1">
            <Feather name="clock" size={16} color="black" />
          </View>
          <Text className="text-lg font-semibold text-gray-800">
            Logged Exercises
          </Text>
        </View>

        {/* Filter Button */}
        <TouchableOpacity className="p-1">
          <Ionicons name="options" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Exercise List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {renderGroupedExercises()}

        {/* Empty State if no exercises */}
        {loggedExercises.length === 0 && (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="fitness" size={32} color="#9ca3af" />
            </View>
            <Text className="text-xl font-semibold text-gray-600 mb-2">
              No Exercises Logged
            </Text>
            <Text className="text-gray-500 text-center px-8">
              Start logging your exercises to track your fitness progress
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="none"
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

      {/* Bottom Safe Area */}
      <View className="h-6 bg-white" />
    </SafeAreaView>
  );
};

export default AllLoggedExercises;
