import DaySelector from "@/components/DaySelector";
import NutritionInfo from "@/components/NutritionInfo";
import useHealthStore from "@/store/healthStore";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
interface CalorieData {
  target: number;
  exercise: number;
  food: number;
  remaining: number;
}

interface DailyTotals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface LogCardProps {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
  showArrow?: boolean;
  emojiIcon?: string;
  backgroundStyle?: string;
}

// Reusable Log Card Component
const LogCard: React.FC<LogCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  onPress,
  showArrow = true,
  emojiIcon = "🍽️",
  backgroundStyle = "bg-orange-50",
}) => {
  return (
    <View className="bg-white rounded-lg p-4 mx-1 mb-2 shadow-sm">
      <View className="flex flex-row justify-between">
        <View className="flex-row items-center">
          <Text className="text-xl mr-3">{icon}</Text>
          <Text className="text-xl font-semibold text-gray-800">{title}</Text>
        </View>
        <View className="flex-row items-center justify-between mb-2">
          {showArrow && (
            <Text className="text-blue-500 text-2xl">
              <Feather name="arrow-right-circle" color={"skyblue"} size={20} />
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row bg-gray-100 px-2 rounded-lg items-center">
        <View
          className={`w-16 h-16 ${backgroundStyle} rounded-full items-center justify-center mr-4`}
        >
          <Text className="text-3xl">{emojiIcon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-gray-600 text-xs  ">{description}</Text>
        </View>
        <TouchableOpacity
          className="bg-blue-200 px-3 py-1 rounded-full"
          onPress={onPress}
        >
          <Text className="text-blue-500 text-xs font-xs">{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DietLoggingApp: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    healthData,
    isLoading,
    fetchDashboardData,
  } = useHealthStore();

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <View className="bg-white px-4 py-3">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Text className="text-2xl mr-2">🥗</Text>
            <Text className="text-xl font-bold text-green-600">HealVerse</Text>
          </View>
        </View>
      </View>

      {/* Date Selector */}
      <DaySelector
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center mb-2 px-5">
          <Text className="text-xl mr-2">🏠</Text>
          <Text className="text-xl font-semibold text-gray-800">
            Remaining Calorie
          </Text>
          <View className="ml-auto">
            <Text className="text-blue-500 text-lg">
              <Feather name="info" color={"skyblue"} size={20} />
            </Text>
          </View>
        </View>

        {/* Remaining Calorie Section */}
        <View className="bg-gray-100 rounded-lg p-4 mx-4 mb-4 shadow-sm">
          <View className="flex-row items-center  justify-between">
            <View className="items-center">
              <Text className="text-md font-bold text-gray-800">
                {healthData?.summary.targetCalories}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-gray-600 text-xs">Target</Text>
                <Text className="text-blue-500 ml-1 text-xs">
                  <Feather name="info" color={"skyblue"} size={15} />
                </Text>
              </View>
            </View>

            <Text className="text-xl font-light text-gray-400">+</Text>

            <View className="items-center">
              <Text className="text-md font-bold text-teal-500">
                {healthData?.summary.caloriesBurned}
              </Text>
              <Text className="text-teal-500 text-xs">Exercise</Text>
            </View>

            <Text className="text-xl font-light text-gray-400">−</Text>

            <View className="items-center">
              <Text className="text-md font-bold text-orange-500">
                {healthData?.summary.consumedCalories}
              </Text>
              <Text className="text-orange-500 text-xs">Food</Text>
            </View>

            <Text className="text-xl font-light text-gray-400">=</Text>

            <View className="items-center">
              <Text className="text-md font-bold text-red-500">
                {healthData?.summary.remainingCalories}
              </Text>
              <Text className="text-red-500 text-xs">Remaining</Text>
            </View>
          </View>
        </View>

        <View className="px-2">
          <View className="flex-row items-center mb-2 ml-3 ">
            <Text className="text-2xl mr-2">≡</Text>
            <Text className="text-xl font-semibold text-gray-800">
              Daily Total
            </Text>
          </View>
          <NutritionInfo calories={0} protein={0} carbs={0} fat={0} />
        </View>

        {/* Exercise Card */}
        <LogCard
          icon="🏃"
          title="Exercise"
          description="Move more, feel better!"
          buttonText="+ Log Exercise"
          onPress={() => {}}
          showArrow={true}
          emojiIcon="👥"
          backgroundStyle=""
        />

        {/* Water Card */}
        <LogCard
          icon="💧"
          title="Water"
          description="Recommended: 3700mL"
          buttonText="+ Log Water"
          onPress={() => {}}
          showArrow={true}
          emojiIcon="🥛"
          backgroundStyle=""
        />

        {/* Breakfast Card */}
        <LogCard
          icon="🌅"
          title="Breakfast"
          description="Recommended: 405kcal"
          buttonText="+ Log Food"
          onPress={() => {}}
          showArrow={false}
          emojiIcon="🍽️"
          backgroundStyle="bg-orange-50"
        />

        {/* Lunch Card */}
        <LogCard
          icon="☁️"
          title="Lunch"
          description="Recommended: 557kcal"
          buttonText="+ Log Food"
          onPress={() => {}}
          showArrow={false}
          emojiIcon="🥗"
          backgroundStyle="bg-orange-50"
        />

        {/* Dinner Card */}
        <LogCard
          icon="🌙"
          title="Dinner"
          description="Recommended: 557kcal"
          buttonText="+ Log Food"
          onPress={() => {}}
          showArrow={false}
          emojiIcon="🍝"
          backgroundStyle="bg-orange-50"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DietLoggingApp;
