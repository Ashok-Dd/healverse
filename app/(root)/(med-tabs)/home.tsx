// app/(tabs)/index.tsx (Dashboard)
import MedicalHeader from "@/components/headers/MedicalHeader";
import { AdherenceChart } from "@/components/medication/AdherenceChart";
import { EmptyState } from "@/components/medication/EmptyState";
import HealthStreakCard from "@/components/medication/HealthStreakCard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useDashboardStats } from "@/hooks/useMedicationDashboard";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AssistantCard {
  id: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  bgColor: string;
}

// Assistant cards data
const assistantCards: AssistantCard[] = [
  {
    id: "1",
    icon: "checkmark-circle",
    iconColor: "#10b981",
    title:
      "Great job! Your medication adherence has improved by 15% this week. Keep up the good work!",
    description: "",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  {
    id: "2",
    icon: "alert-circle",
    iconColor: "#f59e0b",
    title:
      "You've missed taking Vitamin D for 2 days. Consider setting a reminder to maintain your routine.",
    description: "",
    bgColor: "bg-amber-50 border-amber-200",
  },
  {
    id: "3",
    icon: "trending-up",
    iconColor: "#8b5cf6",
    title:
      "Your blood pressure readings look stable over the past week. Great job maintaining consistency at the same time daily.",
    description: "",
    bgColor: "bg-purple-50 border-purple-200",
  },
];

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { data: stats, isLoading, refetch, isRefetching } = useDashboardStats();

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (!stats) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
        <EmptyState
          title="Welcome to MedTracker"
          message="Start by adding your first medication to track your health journey."
          icon={<Text style={{ fontSize: 48 }}>💊</Text>}
          action={
            <Button
              title="Add Medication"
              onPress={() => router.push("/medication/add" as any)}
            />
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 px-2 py-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Medical Header */}
      <MedicalHeader />
      
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* Header */}
        <View className="px-2 pt-2 mb-4">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            Good morning{" "}
            <Text className="text-green-600 font-bold capitalize">
              {user?.username.substring(0, 10)}
            </Text>{" "}
            ! 👋
          </Text>
          <Text className="text-base text-gray-600">
            Take care of your health today
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="px-2 mb-4">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <HealthStreakCard days={stats.currentStreak} />
            </View>
          </View>
        </View>

        {/* Adherence Chart */}
        <View className="px-2 mb-4">
          <AdherenceChart adherenceRate={stats.adherenceRate} />
        </View>

        {/* AI Health Assistant */}
        <View className="mb-8 px-2">
          <View className="bg-gray-100 rounded-xl p-4">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="sparkles" size={18} color="#4ade80" />
              </View>
              <Text className="text-lg font-bold text-gray-900">
                AI Health Assistant
              </Text>
            </View>

            <Text className="text-gray-600 text-sm mb-3">
              Personalized insights and tips
            </Text>

            <View className="gap-y-3">
              {assistantCards.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  className="p-3 rounded-lg border bg-white border-gray-200"
                >
                  <View className="flex-row items-start">
                    <Ionicons
                      name={card.icon as any}
                      size={18}
                      color={card.iconColor}
                      style={{ marginTop: 2, marginRight: 10 }}
                    />
                    <Text className="flex-1 text-gray-800 text-sm leading-5">
                      {card.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity className="mt-4 bg-purple-100 py-3 rounded-xl flex-row items-center justify-center">
              <Ionicons name="chatbubble-ellipses" size={20} color="#8b5cf6" />
              <Text className="text-purple-700 font-semibold ml-2">
                Ask AI Assistant
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
