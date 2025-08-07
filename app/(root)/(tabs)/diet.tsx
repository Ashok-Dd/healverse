import {
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DaySelector from "@/components/DaySelector";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NutritionInfo from "@/components/NutritionInfo";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import MealCard from "@/components/MealCard";
import { Meal } from "@/types/type";

// Import the new TanStack hooks
import { useDietPlanManager } from "@/store/dietPlan";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");

  // Use the composite hook that handles everything
  const {
    // Date management
    selectedDate,
    handleDateChange,
    isValidDate,

    // Diet plan data
    dietPlan,
    isLoading,
    error,
    totalNutrition,
    getMealsByType,

    // Actions
    handleGenerate,
    handleRefresh,
    isGenerating,
    isRefreshing,
  } = useDietPlanManager();

  // Debug logging
  console.log("Profile Debug:", {
    selectedDate,
    isValidDate,
    hasError: !!error,
    errorMessage: error?.message,
    isLoading,
    hasDietPlan: !!dietPlan,
  });

  const handleGenerateNewPlan = async () => {
    try {
      console.log("Generating new plan for date:", selectedDate);
      await handleGenerate();
    } catch (error) {
      console.error("Failed to generate new plan:", error);
      // You might want to show a toast or error message here
    }
  };

  const handleRefreshPlan = async () => {
    try {
      console.log("Refreshing plan for date:", selectedDate);
      await handleRefresh();
    } catch (error) {
      console.error("Failed to refresh plan:", error);
    }
  };

  const handleDateChangeWrapper = (date: string) => {
    try {
      console.log("Date changed to:", date);
      handleDateChange(date);
    } catch (error) {
      console.error("Error handling date change:", error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading diet plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && !dietPlan) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-lg text-red-600 text-center mb-4">
            {error.message || "Failed to load diet plan"}
          </Text>
          <TouchableOpacity
            onPress={handleRefreshPlan}
            disabled={isRefreshing}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">
              {isRefreshing ? "Retrying..." : "Try Again"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show invalid date message
  if (!isValidDate) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-lg text-gray-600 text-center">
            Please select a valid date within your account period
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <View className="bg-white px-4 py-1">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Text className="text-sm mr-2">🥗</Text>
            <Text className="text-sm font-bold text-green-600">HealVerse</Text>
          </View>
        </View>
      </View>

      {/* Date Selector */}
      <DaySelector
        selectedDate={selectedDate}
        handleDateChange={handleDateChangeWrapper}
        showDate={false}
        showButton={false}
      />

      {dietPlan ? (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="bg-white py-1 border-gray-200">
            {/* Tab Selector */}
            <View className="flex-row bg-gray-100 rounded-xl p-1">
              <TouchableOpacity
                className={`flex-1 py-1 rounded-xl ${
                  activeTab === "weekly" ? "bg-white shadow-sm" : ""
                }`}
                activeOpacity={0.4}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-lg mr-2">
                    <MaterialCommunityIcons name="calendar-week" size={15} />
                  </Text>
                  <Text
                    className={`font-medium ${
                      activeTab === "weekly" ? "text-gray-800" : "text-gray-600"
                    }`}
                  >
                    Weekly Plan
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("daily")}
                className={`flex-1 py-1 rounded-xl ${
                  activeTab === "daily" ? "bg-white shadow-sm" : ""
                }`}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-lg mr-2">
                    <MaterialCommunityIcons name="calendar-check" size={15} />
                  </Text>
                  <Text
                    className={`font-medium ${
                      activeTab === "daily" ? "text-gray-800" : "text-gray-600"
                    }`}
                  >
                    Daily Plan
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View className="px-2">
            <View className="flex-row items-center mb-2 ml-3">
              <Text className="text-2xl mr-2">≡</Text>
              <Text className="text-xl font-semibold text-gray-800">
                Daily Total
              </Text>
            </View>
            {/* Use calculated nutrition totals */}
            <NutritionInfo
              calories={totalNutrition.calories}
              protein={totalNutrition.protein}
              carbs={totalNutrition.carbs}
              fat={totalNutrition.fat}
            />
          </View>

          <View className="mb-4 px-2 gap-3 flex-row items-center justify-between">
            {/* Title Text */}
            <Text className="text-sm font-medium text-gray-800 flex-1 pr-2">
              Balanced Healthy Indian Diet Plan for User
            </Text>

            {/* Refresh AI Button */}
            <TouchableOpacity
              className="bg-blue-100 px-2 py-1 rounded-full"
              onPress={handleGenerateNewPlan}
              disabled={isGenerating}
            >
              <View className="flex-row items-center space-x-1">
                <Feather
                  name={isGenerating ? "loader" : "refresh-cw"}
                  size={14}
                  color="#1D4ED8"
                />
                <Text className="text-blue-700 text-xs">
                  {isGenerating ? "Generating..." : "AI Replace Day"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {dietPlan.meals && dietPlan.meals.length > 0 ? (
            <View className="px-2">
              {/* Show loading overlay if refetching */}
              {isRefreshing && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-80 z-10 justify-center items-center">
                  <Text className="text-gray-600">Refreshing...</Text>
                </View>
              )}

              {(dietPlan.meals as Meal[]).map((item, index) => (
                <MealCard
                  key={`${item.id}-${index}`} // Better key for re-renders
                  mealType={item.mealType}
                  mealName={item.mealName}
                  ingredients={item.ingredients}
                  instructions={item.instructions}
                  prepTime={item.preparationTimeMinutes}
                  calories={item.calories}
                  protein={item.protein}
                  fat={item.fat}
                  carbs={item.carbs}
                  healthBenefits={item.healthBenefits}
                  mealIcon=""
                />
              ))}
            </View>
          ) : (
            <View className="flex-1 bg-white flex justify-center items-center py-20">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                No Meals Added
              </Text>
              <TouchableOpacity
                onPress={handleGenerateNewPlan}
                disabled={isGenerating}
                className="bg-green-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">
                  {isGenerating ? "Generating..." : "Generate Diet Plan"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      ) : (
        <View className="flex-1 bg-white flex justify-center items-center">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Please create a diet plan
          </Text>
          <TouchableOpacity
            onPress={handleGenerateNewPlan}
            disabled={isGenerating}
            className="bg-green-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">
              {isGenerating ? "Creating..." : "Create Diet Plan"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Profile;
