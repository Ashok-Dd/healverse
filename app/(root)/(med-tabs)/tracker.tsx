import MedicalHeader from "@/components/headers/MedicalHeader";
import SwipeableMedicineCard from "@/components/medication/SwipableMedicineCard";
import { useDashboardStats } from "@/hooks/useMedicationDashboard";
import { useLogMedication } from "@/hooks/useMedications";
import { showToast } from "@/lib/toast";
import { getCurrentDate, getStatusBadge, getStatusColor } from "@/lib/utils";
import { LogStatus, MedicationType, TodayMedication } from "@/types/type";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

// UI-specific types for display purposes
interface MedicationDisplay {
  id: string;
  medicationId: string;
  name: string;
  dosage: string;
  type: MedicationType;
  scheduledTime: string;
  status: LogStatus;
  color: string;
  icon: string;
  actualTime?: string;
}

const MedTrackerScreen: React.FC = () => {
  // Use the dashboard stats hook
  const {
    data: dashboardStats,
    isLoading,
    error,
    refetch,
  } = useDashboardStats();

  const logMedicationMutation = useLogMedication();

  // Local state for medication displays (for UI updates during swipe actions)
  const [medicationDisplays, setMedicationDisplays] = useState<
    MedicationDisplay[]
  >([]);

  const convertToMedicationDisplay = (
    todayMed: TodayMedication
  ): MedicationDisplay => {
    const getColorByType = (type: MedicationType): string => {
      switch (type) {
        case "TABLET":
        case "CAPSULE":
          return "bg-emerald-500";
        case "LIQUID":
          return "bg-blue-500";
        case "INJECTION":
          return "bg-red-500";
        case "INHALER":
          return "bg-purple-500";
        case "DROPS":
          return "bg-pink-500";
        default:
          return "bg-gray-500";
      }
    };

    return {
      ...todayMed,
      color: getColorByType(todayMed.type),
      icon:
        todayMed.status === "TAKEN"
          ? "checkmark-circle"
          : todayMed.status === "SKIPPED"
          ? "close-circle"
          : todayMed.status === "MISSED"
          ? "alert-circle"
          : "time",
    };
  };

  useEffect(() => {
    if (dashboardStats?.todayMedications) {
      const displays = dashboardStats.todayMedications.map(
        convertToMedicationDisplay
      );
      setMedicationDisplays(displays);
    }
  }, [dashboardStats]);

  const handleSwipeComplete = async (
    medicationId: string,
    scheduleId: string
  ) => {
    // TODO: Call API to update medication status
    // Example: updateMedicationStatus(medicationId, scheduleId, "TAKEN");
    // Optionally refetch dashboard stats to get updated data
    // refetch();

    await logMedicationMutation.mutateAsync(
      {
        medicationId,
        data: {
          status: "TAKEN",
          scheduledTime:
            medicationDisplays.find(
              (display) =>
                display.medicationId === medicationId &&
                display.id === scheduleId
            )?.scheduledTime ?? "",
          actualTime: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          showToast("Medication logged successfully");
        },
        onError: () => {
          showToast("Failed to log medication", {
            type: "error",
          });
        },
      }
    );
  };

  const handleSwipeSkip = async (medicationId: string, scheduleId: string) => {
    await logMedicationMutation.mutateAsync(
      {
        medicationId,
        data: {
          status: "SKIPPED",
          scheduledTime:
            medicationDisplays.find(
              (display) =>
                display.medicationId === medicationId &&
                display.id === scheduleId
            )?.scheduledTime ?? "",
          actualTime: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          showToast("Medication logged successfully");
        },
        onError: () => {
          showToast("Failed to log medication", {
            type: "error",
          });
        },
      }
    );
    // TODO: Call API to update medication status
    // Example: updateMedicationStatus(medicationId, scheduleId, "SKIPPED");
    // Optionally refetch dashboard stats to get updated data
    // refetch();
  };

  const getProgressPercentage = (): number => {
    if (!dashboardStats || dashboardStats.todayTotal === 0) return 0;
    return (dashboardStats.todayTaken / dashboardStats.todayTotal) * 100;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-gray-600 mt-4">
          Loading your medication data...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text className="text-gray-900 font-bold text-lg mt-4 text-center">
          Unable to load data
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          Please check your connection and try again
        </Text>
        <TouchableOpacity
          className="bg-emerald-500 px-6 py-3 rounded-xl mt-6"
          onPress={() => refetch()}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!dashboardStats) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <Ionicons name="medical" size={48} color="#10b981" />
        <Text className="text-gray-900 font-bold text-lg mt-4 text-center">
          No medication data found
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          Add your first medication to get started
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-3 py-5 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Medical Header */}
      <MedicalHeader />
      

    
      
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex flex-row gap-1 items-center">
            <Feather name="clock" size={16} />
            <Text className="text-font-semibold">Today's Medications</Text>
          </View>
          <View className="bg-green-100 px-2 py-1 flex-row gap-1 justify-center rounded-lg items-center">
            <Ionicons name="flame" size={14} color="#4ade80" />
            <Text className="text-green-600 font-bold text-xs">
              {dashboardStats.currentStreak}
            </Text>
            <Text className="text-green-600 text-xs">day streak</Text>
          </View>
        </View>

        {/* Today's Progress */}
        <View className="mb-4">
          <View className="flex items-start mb-2">
            <View className="flex flex-row gap-1 items-center">
              <Ionicons name="analytics" size={16} />
              <Text className="text-font-semibold">Medication Overview</Text>
            </View>
          </View>
          
          <View className="bg-gray-100 rounded-xl p-4">
            <View className="flex-row justify-between items-center mb-3">
              <View>
                <Text className="text-lg font-bold text-gray-900">
                  Today's Progress
                </Text>
                <Text className="text-gray-500 text-xs">
                  {getCurrentDate()}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-lg font-bold text-green-600">
                  {dashboardStats.todayTaken}/{dashboardStats.todayTotal}
                </Text>
                <Text className="text-gray-500 text-sm">medicines taken</Text>
              </View>
            </View>
            {/* Progress Bar */}
            <View className="mb-3">
              <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                <View
                  className="bg-green-500 h-full rounded-full"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </View>
            </View>
            <View className="flex-row items-center">
              <Feather name="calendar" size={16} color="#4ade80" />
              <Text className="text-green-600 ml-2 text-xs">
                {getProgressPercentage() === 100
                  ? "Perfect! All medications completed for today"
                  : `Adherence rate: ${dashboardStats.adherenceRate.toFixed(
                      1
                    )}%`}
              </Text>
            </View>
          </View>
        </View>

        {/* Today's Medicines */}
        <View className="mb-3 flex-1">
          <View className="flex-row justify-between items-center mb-3 px-2">
            <View className="flex flex-row gap-1 items-center">
              <Ionicons name="medical" size={16} />
              <Text className="text-font-semibold">Today's Medicines</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                // Handle View All press
                router.push("/(root)/today-medications" as any);
              }}
              className="flex-row items-center"
            >
              <Text
                className={`text-green-600 text-xs mr-1 ${
                  medicationDisplays.length > 3 ? "visible" : "invisible"
                }`}
              >
                View All
              </Text>
              <Feather name="arrow-right-circle" size={16} color="#4ade80" />
            </TouchableOpacity>
          </View>
          {medicationDisplays.length > 0 ? (
            medicationDisplays
              .slice(0, 3)
              .map((medicationDisplay) => (
                <SwipeableMedicineCard
                  key={`${medicationDisplay.medicationId}-${medicationDisplay.id}`}
                  medicationDisplay={medicationDisplay}
                  onSwipeComplete={handleSwipeComplete}
                  onSwipeSkip={handleSwipeSkip}
                  getStatusColor={getStatusColor}
                  getStatusBadge={getStatusBadge}
                />
              ))
          ) : (
            <View className="bg-gray-50 p-6 flex-1 h-[50vh] justify-center rounded-2xl items-center">
              <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              <Text className="text-gray-900 font-semibold mt-3">
                All done for today!
              </Text>
              <Text className="text-gray-600 text-sm mt-1 text-center">
                You've completed all your medications for today
              </Text>
            </View>
          )}
        </View>

        {/* Add New Medicine Button */}
        <View className="mb-8">
          <TouchableOpacity
            className="bg-emerald-500 py-2 rounded-2xl flex-row items-center justify-center"
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
            onPress={() => {
              router.push("/(root)/(med-tabs)/add-medication");
            }}
          >
            <Text className="text-white text-2xl mr-2">+</Text>
            <Text className="text-white font-semibold text-lg">
              Add New Medicine
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mb-8">
          <TouchableOpacity
            className="bg-white border border-black py-2 rounded-2xl flex-row items-center justify-center"
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
            onPress={() => {
              router.push("/(root)/medications");
            }}
          >
            <Text className="text-black text-2xl mr-2">+</Text>
            <Text className="text-black font-semibold text-lg">
              View All Schedules
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MedTrackerScreen;
