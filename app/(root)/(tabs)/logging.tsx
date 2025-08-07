import CalorieSummary from "@/components/CalorieSummary";
import DaySelector from "@/components/DaySelector";
import LogCard from "@/components/LogCard";
import {
  ExerciseLogHolder,
  FoodLogHolder,
  WaterLogHolder,
} from "@/components/LogHolders";
import NutritionInfo from "@/components/NutritionInfo";
import { WaterLogModal } from "@/components/WaterLogModel";
import useHealthStore from "@/store/healthStore";
import { ExerciseLog, FoodLog, WaterLog } from "@/types/type";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DietLoggingApp: React.FC = () => {
  const [openWaterModel, setOpenWaterModel] = useState(false);

  const {
    selectedDate,
    setSelectedDate,
    healthData,
    isLoading,
    fetchDashboardData,
    getFoodLogsByMealType,
  } = useHealthStore();

  // useEffect(() => {
  //   fetchDashboardData();
  // }, [selectedDate]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  if (isLoading)
    return (
      <SafeAreaView className="flex-1 bg-white flex justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );

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
          <CalorieSummary healthData={healthData} />
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

        {/* Exercise Log */}
        <LogCard
          icon="🏃"
          title="Exercise"
          description="Move more, feel better!"
          buttonText="+ Log Exercise"
          Link={() => {
            router.push("/(root)/AddExersiceLog");
          }}
          showArrow={true}
          emojiIcon="👥"
          backgroundStyle="bg-green-50"
          items={healthData?.exerciseLogs as ExerciseLog[]}
          component={ExerciseLogHolder}
          moveTo={() => {
            router.push("/(root)/AllLogs");
          }}
        />

        {/* Water Log */}
        <LogCard
          icon="💧"
          title="Water"
          description="Recommended: 3700mL"
          buttonText="+ Log Water"
          showArrow={true}
          emojiIcon="🥛"
          backgroundStyle="bg-blue-50"
          items={healthData?.waterLogs as WaterLog[]}
          component={WaterLogHolder}
          Link={() => setOpenWaterModel(true)}
          moveTo={() => {
            router.push("/(root)/AllWaterLogs");
          }}
        />

        <LogCard
          icon="🌅"
          title="Breakfast"
          description="Recommended: 405kcal"
          buttonText="+ Log Food"
          Link={() => {
            router.push("/(root)/calorie-counter");
          }}
          showArrow={false}
          emojiIcon="🍽"
          backgroundStyle="bg-orange-50"
          items={getFoodLogsByMealType("BREAKFAST") as FoodLog[]}
          component={FoodLogHolder}
        />

        <LogCard
          icon="☁"
          title="Lunch"
          description="Recommended: 557kcal"
          buttonText="+ Log Food"
          Link={() => {
            router.push("/(root)/calorie-counter");
          }}
          showArrow={false}
          emojiIcon="🥗"
          backgroundStyle="bg-orange-50"
          items={getFoodLogsByMealType("LUNCH") as FoodLog[]}
          component={FoodLogHolder}
        />

        <LogCard
          icon="🌙"
          title="Dinner"
          description="Recommended: 557kcal"
          buttonText="+ Log Food"
          Link={() => {
            router.push("/(root)/calorie-counter");
          }}
          showArrow={false}
          emojiIcon="🍝"
          backgroundStyle="bg-orange-50"
          items={getFoodLogsByMealType("DINNER") as FoodLog[]}
          component={FoodLogHolder}
        />

        <LogCard
          icon="🍬"
          title="Snacks"
          description="Mindful snacking helps energy!"
          buttonText="+ Log Snack"
          Link={() => {
            router.push("/(root)/calorie-counter");
          }}
          showArrow={false}
          emojiIcon="🍫"
          backgroundStyle="bg-orange-50"
          items={getFoodLogsByMealType("SNACK") as FoodLog[]}
          component={FoodLogHolder}
        />
      </ScrollView>

      <WaterLogModal
        visible={openWaterModel}
        onClose={() => setOpenWaterModel(false)}
        onSave={() => {}}
        currentIntake={healthData?.summary.waterConsumedMl!}
        dailyGoal={healthData?.summary.targetWaterMl!}
      />
    </SafeAreaView>
  );
};

export default DietLoggingApp;

/*
 *
 *
 * */
