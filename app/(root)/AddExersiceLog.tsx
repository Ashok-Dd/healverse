import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Exercise {
  id: string;
  name: string;
  icon: string;
  calories: number;
  duration: number;
  intensity: string;
}

const exercises: Exercise[] = [
  {
    id: "1",
    name: "Walking",
    icon: "walk",
    calories: 146,
    duration: 45,
    intensity: "Moderate",
  },
  {
    id: "2",
    name: "Running",
    icon: "run",
    calories: 272,
    duration: 30,
    intensity: "Moderate",
  },
  {
    id: "3",
    name: "Cycling",
    icon: "bicycle",
    calories: 334,
    duration: 45,
    intensity: "Moderate",
  },
  {
    id: "4",
    name: "Weight Lifting",
    icon: "barbell",
    calories: 208,
    duration: 45,
    intensity: "Moderate",
  },
  {
    id: "5",
    name: "Yoga",
    icon: "body",
    calories: 167,
    duration: 60,
    intensity: "Moderate",
  },
  {
    id: "6",
    name: "Swimming",
    icon: "water",
    calories: 334,
    duration: 45,
    intensity: "Moderate",
  },
  {
    id: "7",
    name: "Elliptical",
    icon: "fitness",
    calories: 222,
    duration: 40,
    intensity: "Moderate",
  },
  {
    id: "8",
    name: "Bodyweight Exercises",
    icon: "person",
    calories: 139,
    duration: 30,
    intensity: "Moderate",
  },
  {
    id: "9",
    name: "Rowing",
    icon: "boat",
    calories: 167,
    duration: 30,
    intensity: "Moderate",
  },
  {
    id: "10",
    name: "Jumping Rope",
    icon: "flash",
    calories: 139,
    duration: 15,
    intensity: "Moderate",
  },
  {
    id: "11",
    name: "Dancing",
    icon: "musical-notes",
    calories: 229,
    duration: 45,
    intensity: "Moderate",
  },
];

const ExerciseLogScreen: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
  };

  const getTotalCalories = () => {
    if (!selectedExercise) return 0;
    const exercise = exercises.find((ex) => ex.id === selectedExercise);
    return exercise?.calories || 0;
  };

  const renderExerciseItem = (exercise: Exercise) => {
    const isSelected = selectedExercise === exercise.id;

    return (
      <TouchableOpacity
        key={exercise.id}
        className={`flex-row items-center p-4 mx-4 mb-2 rounded-xl ${
          isSelected ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-50"
        }`}
        onPress={() => handleExerciseSelect(exercise.id)}
      >
        <View
          className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
            isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
          }`}
        >
          {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
        </View>

        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mr-3">
            <Ionicons name={exercise.icon as any} size={20} color="#6b7280" />
          </View>

          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-800 mb-1">
              {exercise.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="flame" size={14} color="#10b981" />
              <Text className="text-sm text-green-600 font-medium ml-1">
                -{exercise.calories}kcal
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-blue-500 font-medium mb-1">
              {exercise.intensity}
            </Text>
            <Text className="text-blue-500 font-medium">
              {exercise.duration} min
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Ionicons name="walk" size={24} color="#374151" className="mr-2" />
          <Text className="text-lg font-semibold text-gray-800">
            Log Exercise
          </Text>
        </View>

        <TouchableOpacity className="bg-blue-200 px-3 py-1 rounded-full">
          <Text className="text-blue-500 text-xs font-semibold">Add new</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise List */}
      <ScrollView className="flex-1 py-4">
        {exercises.map(renderExerciseItem)}
      </ScrollView>

      {/* Bottom Section */}
      <View className="px-4 py-4 border-t flex-row justify-between items-center border-gray-100 bg-white">
        <View className=" mb-4">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={20} color="#6b7280" />
            <Text className="text-gray-600 ml-2">Today {currentTime}</Text>
            <TouchableOpacity className="ml-3">
              <Ionicons name="create-outline" size={15} color="skyblue" />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="menu" size={20} color="#374151" />
              <Text className="text-gray-800 font-medium ml-2">
                Total: {getTotalCalories()}kcal
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className={`px-10 py-4 rounded-xl items-center justify-center ${
            selectedExercise ? "bg-green-500" : "bg-gray-300"
          }`}
          disabled={!selectedExercise}
          onPress={() => {
            if (selectedExercise) {
              console.log("Exercise logged:", selectedExercise);
              // Handle exercise logging logic here
            }
          }}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="checkmark"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-lg">Okay</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ExerciseLogScreen;
