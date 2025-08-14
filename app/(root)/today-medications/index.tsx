import ScreenHeader from "@/components/headers/ScreenHeader";
import SwipeableMedicineCard from "@/components/medication/SwipableMedicineCard";
import { useTodayMedications } from "@/hooks/useMedicationDashboard";
import { useLogMedication } from "@/hooks/useMedications";
import { showToast } from "@/lib/toast";
import { getStatusBadge, getStatusColor } from "@/lib/utils";
import {
  LogStatus,
  MedicationType,
  TodayMedication as TodayMedicationType,
} from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const TodayMedication: React.FC = () => {
  // Use the dashboard stats hook
  const {
    data: todayMedications,
    isLoading,
    error,
    refetch,
  } = useTodayMedications();

  const logMedicationMutation = useLogMedication();

  // Local state for medication displays (for UI updates during swipe actions)
  const [medicationDisplays, setMedicationDisplays] = useState<
    MedicationDisplay[]
  >([]);

  const convertToMedicationDisplay = (
    todayMed: TodayMedicationType
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
    if (todayMedications) {
      const displays = todayMedications.map(convertToMedicationDisplay);
      setMedicationDisplays(displays);
    }
  }, [todayMedications]);

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
    // TODO: Call API to update medication status
    // Example: updateMedicationStatus(medicationId, scheduleId, "SKIPPED");
    // Optionally refetch dashboard stats to get updated data
    // refetch();

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

  return (
    <SafeAreaView className="flex-1 px-2 py-2 bg-white">
      <ScrollView className="flex-1 px-2" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ScreenHeader
          title="Today's Medications"
          onPress={() => {}}
          iconName="tablet"
        />

        {/* Today's Medicines */}
        <View className="my-5 mb-3 flex-1">
          {medicationDisplays.length > 0 ? (
            medicationDisplays.map((medicationDisplay) => (
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

        {/* <View className="mx-6 mb-8">
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
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TodayMedication;
