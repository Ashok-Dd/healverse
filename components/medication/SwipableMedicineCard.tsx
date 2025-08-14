import { LogStatus, MedicationType } from "@/types/type";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { format } from "date-fns";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Animated, Text, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

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
        return "medication";
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
        className={`p-4 bg-white rounded-2xl border ${getStatusColor(status)}`}
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
            {format(scheduledTime, "MMMM d, yyyy 'at' h:mm a")}
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

export default SwipeableMedicineCard;
