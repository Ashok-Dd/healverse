import { useDashboardStats } from "@/hooks/useMedicationDashboard";
import { LogStatus, MedicationType } from "@/types/type";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

// Updated TodayMedication interface (should be imported from your types)
export interface TodayMedication {
  id: string;
  medicationId: string;
  name: string;
  dosage: string;
  type: MedicationType;
  scheduledTime: string;
  status: LogStatus;
  actualTime?: string;
}

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

interface SwipeButtonProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface SwipeableMedicineCardProps {
  medicationDisplay: MedicationDisplay;
  onSwipeComplete: (medicationId: string, scheduleId: string) => void;
  onSwipeSkip: (medicationId: string, scheduleId: string) => void;
  getStatusColor: (status: LogStatus) => string;
  getStatusBadge: (status: LogStatus) => { text: string; color: string };
}

interface StatusBadge {
  text: string;
  color: string;
}

// Swipe Button Component
const SwipeButton: React.FC<SwipeButtonProps> = ({ onComplete, onSkip }) => {
  const buttonWidth = 320;
  const ballSize = 40;
  const maxTranslate = (buttonWidth - ballSize) / 2;

  const translateX = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState<"left" | "right" | null>(null);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handleAction = async (side: "left" | "right") => {
    setLoading(side);
    await new Promise((res) => setTimeout(res, 1000));
    if (side === "right") onComplete();
    else onSkip();
    setLoading(null);
    translateX.setValue(0);
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END && !loading) {
      const { translationX } = event.nativeEvent;
      if (translationX > maxTranslate * 0.6) {
        Animated.timing(translateX, {
          toValue: maxTranslate,
          duration: 200,
          useNativeDriver: true,
        }).start(() => handleAction("right"));
      } else if (translationX < -maxTranslate * 0.6) {
        Animated.timing(translateX, {
          toValue: -maxTranslate,
          duration: 200,
          useNativeDriver: true,
        }).start(() => handleAction("left"));
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const ballPosition =
    loading === "right" ? maxTranslate : loading === "left" ? -maxTranslate : 0;

  return (
    <View className="items-center mt-3">
      <View
        className="bg-gray-100 rounded-full border border-gray-300 p-0.5 relative overflow-hidden"
        style={{
          width: buttonWidth,
          height: ballSize + 8,
          justifyContent: "center",
        }}
      >
        {/* Left Side - Skip */}
        <View
          className="absolute left-0 top-0 bottom-0 flex-row items-center justify-start pl-3"
          style={{
            width: buttonWidth / 2,
            backgroundColor: "#f87171",
            borderTopLeftRadius: 999,
            borderBottomLeftRadius: 999,
          }}
        >
          <Ionicons name="chevron-back" size={16} color="white" />
          <Text className="text-white text-xs font-bold ml-1">Skip</Text>
        </View>
        {/* Right Side - Done */}
        <View
          className="absolute right-0 top-0 bottom-0 flex-row items-center justify-end pr-3"
          style={{
            width: buttonWidth / 2,
            backgroundColor: "#34d399",
            borderTopRightRadius: 999,
            borderBottomRightRadius: 999,
          }}
        >
          <Text className="text-white text-xs font-bold mr-1">Done</Text>
          <Ionicons name="chevron-forward" size={16} color="white" />
        </View>
        {/* Draggable Ball */}
        <PanGestureHandler
          enabled={!loading}
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            className="bg-white rounded-full items-center justify-center"
            style={{
              width: ballSize,
              height: ballSize,
              position: "absolute",
              left: (buttonWidth - ballSize) / 2,
              top: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 4,
              elevation: 4,
              transform: [
                {
                  translateX: loading
                    ? new Animated.Value(ballPosition)
                    : translateX,
                },
              ],
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#10b981" />
            ) : (
              <>
                <View className="absolute top-1 left-1 w-3 h-3 bg-white opacity-40 rounded-full" />
                <Ionicons name="swap-horizontal" size={20} color="#6b7280" />
              </>
            )}
          </Animated.View>
        </PanGestureHandler>
      </View>
      <Text className="text-xs text-gray-400 mt-2">
        Swipe left to skip, right to complete
      </Text>
    </View>
  );
};

// Updated Medicine Card Component
const SwipeableMedicineCard: React.FC<SwipeableMedicineCardProps> = ({
  medicationDisplay,
  onSwipeComplete,
  onSwipeSkip,
  getStatusColor,
  getStatusBadge,
}) => {
  const { name, dosage, type, scheduledTime, status, color, medicationId, id } =
    medicationDisplay;
  const badge: StatusBadge = getStatusBadge(status);

  const getMedicationTypeIcon = (type: MedicationType): string => {
    switch (type) {
      case "TABLET":
      case "CAPSULE":
        return "medication";
      case "LIQUID":
        return "water-drop";
      case "INJECTION":
        return "medical";
      case "INHALER":
        return "air";
      case "DROPS":
        return "water-drop";
      default:
        return "medication";
    }
  };

  if (status === "TAKEN" || status === "SKIPPED") {
    return (
      <View
        className={`p-4 rounded-2xl mb-5 border ${getStatusColor(status)}`}
        style={{
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <View
              className={`w-8 h-8 rounded-full ${color} items-center justify-center`}
            >
              <MaterialIcons
                name={getMedicationTypeIcon(type) as any}
                size={16}
                color="white"
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-gray-900">{name}</Text>
              <Text className="text-gray-600 text-xs">{dosage}</Text>
            </View>
          </View>
          <View className={`px-3 py-1 rounded-full ${badge.color}`}>
            <Text className="text-xs">{badge.text}</Text>
          </View>
        </View>
        <View className="flex-row items-center mb-3">
          <Feather name="calendar" size={16} color="#6b7280" />
          <Text className="ml-2 text-xs text-gray-600">{scheduledTime}</Text>
        </View>
        <View
          className={`${
            status === "TAKEN" ? "bg-emerald-100" : "bg-red-100"
          } py-2 rounded-xl px-3 flex-row items-center justify-center`}
        >
          {status === "TAKEN" ? (
            <AntDesign name="checkcircle" size={20} color="#10b981" />
          ) : (
            <AntDesign name="closecircle" size={16} color="#ef4444" />
          )}
          <Text
            className={`ml-2 ${
              status === "TAKEN" ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {status === "TAKEN" ? "Completed" : "Skipped"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-5">
      <View
        className={`p-4 rounded-2xl border ${getStatusColor(status)}`}
        style={{
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <View
              className={`w-8 h-8 rounded-full ${color} items-center justify-center`}
            >
              <MaterialIcons
                name={getMedicationTypeIcon(type) as any}
                size={16}
                color="white"
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-gray-900">{name}</Text>
              <Text className="text-gray-600 text-xs">{dosage}</Text>
            </View>
          </View>
          <View className={`px-3 py-1 rounded-full ${badge.color}`}>
            <Text className="text-xs">{badge.text}</Text>
          </View>
        </View>
        <View className="flex-row items-center mb-3">
          <Feather
            name="calendar"
            size={16}
            color={status === "MISSED" ? "#ef4444" : "#6b7280"}
          />
          <Text
            className={`ml-2 text-xs ${
              status === "MISSED" ? "text-red-600" : "text-gray-600"
            }`}
          >
            {scheduledTime}
          </Text>
        </View>
        <SwipeButton
          onComplete={() => onSwipeComplete(medicationId, id)}
          onSkip={() => onSwipeSkip(medicationId, id)}
        />
      </View>
    </View>
  );
};

const MedTrackerScreen: React.FC = () => {
  // Use the dashboard stats hook
  const {
    data: dashboardStats,
    isLoading,
    error,
    refetch,
  } = useDashboardStats();

  // Local state for medication displays (for UI updates during swipe actions)
  const [medicationDisplays, setMedicationDisplays] = useState<
    MedicationDisplay[]
  >([]);

  // Convert TodayMedication to MedicationDisplay format
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

  // Update medication displays when dashboard stats change
  useEffect(() => {
    if (dashboardStats?.todayMedications) {
      const displays = dashboardStats.todayMedications.map(
        convertToMedicationDisplay
      );
      setMedicationDisplays(displays);
    }
  }, [dashboardStats]);

  // Weekly adherence data (you might want to get this from another API endpoint)
  const weeklyData: number[] = [100, 100, 85, 100, 100, 0, 0];
  const weekDays: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleSwipeComplete = (
    medicationId: string,
    scheduleId: string
  ): void => {
    setMedicationDisplays((prev) =>
      prev.map((display) =>
        display.medicationId === medicationId && display.id === scheduleId
          ? {
              ...display,
              status: "TAKEN" as LogStatus,
              icon: "checkmark-circle",
            }
          : display
      )
    );
    // TODO: Call API to update medication status
    // Example: updateMedicationStatus(medicationId, scheduleId, "TAKEN");
    // Optionally refetch dashboard stats to get updated data
    // refetch();
  };

  const handleSwipeSkip = (medicationId: string, scheduleId: string): void => {
    setMedicationDisplays((prev) =>
      prev.map((display) =>
        display.medicationId === medicationId && display.id === scheduleId
          ? { ...display, status: "SKIPPED" as LogStatus, icon: "close-circle" }
          : display
      )
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

  const getStatusColor = (status: LogStatus): string => {
    switch (status) {
      case "TAKEN":
        return "border-emerald-200 bg-emerald-50";
      case "MISSED":
        return "border-red-200 bg-red-50";
      case "PENDING":
        return "border-blue-200 bg-blue-50";
      case "SKIPPED":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getStatusBadge = (status: LogStatus): StatusBadge => {
    switch (status) {
      case "TAKEN":
        return { text: "Taken", color: "bg-emerald-100 text-emerald-700" };
      case "MISSED":
        return { text: "Missed", color: "bg-red-100 text-red-700" };
      case "PENDING":
        return { text: "Pending", color: "bg-blue-100 text-blue-700" };
      case "SKIPPED":
        return { text: "Skipped", color: "bg-red-100 text-red-700" };
      default:
        return { text: "Unknown", color: "bg-gray-100 text-gray-700" };
    }
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  const chartData = {
    labels: weekDays,
    datasets: [
      {
        data: weeklyData,
      },
    ],
  };

  const getCurrentDate = (): string => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString("en-US", options);
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
    <SafeAreaView className="flex-1 px-2 py-2 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">
                Med Tracker
              </Text>
              <Text className="text-gray-600 mt-1">
                Stay consistent with your medications
              </Text>
            </View>
            <View
              className="bg-orange-100 px-2 py-1 flex-row gap-1 justify-center rounded-2xl items-center"
              style={{
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
              }}
            >
              <Ionicons name="flame" size={14} color="#f97316" />
              <Text className="text-orange-600 font-bold text-xs">
                {dashboardStats.currentStreak}
              </Text>
              <Text className="text-orange-600 text-xs">day streak</Text>
            </View>
          </View>
        </View>

        {/* Today's Progress */}
        <View className="mx-5 mb-6">
          <View
            className="bg-gray-100 px-6 py-2 rounded-2xl"
            style={{
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-md font-bold text-gray-900">
                  Today's Progress
                </Text>
                <Text className="text-gray-500 text-xs">
                  {getCurrentDate()}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-lg font-bold text-emerald-600">
                  {dashboardStats.todayTaken}/{dashboardStats.todayTotal}
                </Text>
                <Text className="text-gray-500 text-sm">medicines taken</Text>
              </View>
            </View>
            {/* Progress Bar */}
            <View className="mb-4">
              <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                <View
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </View>
            </View>
            <View className="flex-row items-center">
              <Feather name="calendar" size={16} color="#10b981" />
              <Text className="text-emerald-600 ml-2 text-xs">
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
        <View className="mx-6 mb-3 flex-1">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sm font-bold text-gray-900">
              Today's Medicines
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-emerald-600 text-xs mr-1">View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#10b981" />
            </TouchableOpacity>
          </View>
          {medicationDisplays.length > 0 ? (
            medicationDisplays.map((medicationDisplay, index) => (
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
        <View className="mx-6 mb-8">
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default MedTrackerScreen;
