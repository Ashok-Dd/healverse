import MedicalHeader from "@/components/headers/MedicalHeader";
import { useDashboardStats } from "@/hooks/useMedicationDashboard"; // Your hook
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`, // Green color to match main tabs
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  style: { borderRadius: 16 },
  propsForLabels: { fontSize: 11 },
};

const HealthAnalyticsScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const { data: dashboardStats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <View className="flex-1 justify-center items-center">
          <Text>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !dashboardStats) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <View className="flex-1 justify-center items-center">
          <Text>Error loading analytics</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Transform weekly adherence data for chart
  const weeklyAdherenceData = {
    labels: dashboardStats.weeklyAdherence?.labels || [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],
    datasets: [
      {
        data: dashboardStats.weeklyAdherence?.data || [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <SafeAreaView className="flex-1 px-2 py-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Medical Header */}
      <MedicalHeader />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-3 mb-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Health Analytics
              </Text>
              <Text className="text-gray-600 mt-1">
                Track your progress and insights
              </Text>
            </View>
            <TouchableOpacity className="p-2">
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Cards */}
        <View className="px-4 mb-4">
          <View className="flex-row gap-3">
            {/* Adherence Rate */}
            <View className="flex-1 bg-green-100 p-4 rounded-xl">
              <Text className="text-green-700 text-sm font-medium">
                Adherence Rate
              </Text>
              <Text className="text-green-900 text-2xl font-bold mt-1">
                {dashboardStats.adherenceRate}%
              </Text>
              <Text className="text-green-600 text-xs mt-1">This week</Text>
            </View>

            {/* Streak */}
            <View className="flex-1 bg-gray-100 p-4 rounded-xl">
              <Text className="text-gray-700 text-sm font-medium">
                Current Streak
              </Text>
              <Text className="text-gray-900 text-2xl font-bold mt-1">
                {dashboardStats.currentStreak}
              </Text>
              <Text className="text-gray-600 text-xs mt-1">days</Text>
            </View>
          </View>
        </View>

        {/* Weekly Adherence Chart */}
        <View className="px-4 mb-4">
          <View className="bg-gray-100 rounded-xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Weekly Adherence
              </Text>
              <TouchableOpacity className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 text-xs font-medium">
                  {selectedPeriod}
                </Text>
              </TouchableOpacity>
            </View>

            <LineChart
              data={weeklyAdherenceData}
              width={screenWidth - 80}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              withDots={true}
              withShadow={false}
              withInnerLines={false}
            />
          </View>
        </View>

        {/* Medicine Status and Daily Intake Row */}
        <View className="px-6 mb-6">
          <View className="gap-4">
            {/* Medicine Status */}
            <View
              className="flex-1 bg-white rounded-2xl p-4"
              style={{
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Medicine Status
              </Text>

              <View className="space-y-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 bg-emerald-500 rounded-full mr-2" />
                    <Text className="text-gray-700 text-sm">Taken</Text>
                  </View>
                  <Text className="text-gray-900 font-semibold">
                    {dashboardStats.medicineStatus?.taken || 0}%
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 bg-amber-500 rounded-full mr-2" />
                    <Text className="text-gray-700 text-sm">Missed</Text>
                  </View>
                  <Text className="text-gray-900 font-semibold">
                    {dashboardStats.medicineStatus?.missed || 0}%
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                    <Text className="text-gray-700 text-sm">Skipped</Text>
                  </View>
                  <Text className="text-gray-900 font-semibold">
                    {dashboardStats.medicineStatus?.skipped || 0}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Daily Intake */}
            <View
              className="flex-1 bg-white rounded-2xl p-4"
              style={{
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Daily Intake
              </Text>

              <View className="flex-row items-end justify-between h-24">
                {(dashboardStats.dailyIntake || []).map((item, index) => (
                  <View key={index} className="items-center">
                    <View
                      className="bg-emerald-500 w-4 rounded-t"
                      style={{ height: (item.value / 100) * 60 }}
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                      {item.day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthAnalyticsScreen;
