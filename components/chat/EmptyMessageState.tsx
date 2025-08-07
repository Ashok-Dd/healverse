import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonProps {
  icon: string;
  text: string;
  keyword: string;
  onPress: (keyword: string) => void;
  variant?: "primary" | "secondary";
}

const { width: screenWidth } = Dimensions.get("window");

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  text,
  keyword,
  onPress,
  variant = "primary",
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(keyword)}
      className={`
        flex-row items-center justify-center px-6 py-3 rounded-full border
        ${
          variant === "primary"
            ? "bg-gray-50 border-gray-200 min-w-[160px]"
            : "bg-transparent border-gray-300"
        }
      `}
      activeOpacity={0.7}
    >
      <Text
        className={`text-sm mr-3 ${variant === "primary" ? "block" : "hidden"}`}
      >
        {icon}
      </Text>
      <Text className="text-gray-600 text-sm font-medium">{text}</Text>
    </TouchableOpacity>
  );
};

const EmptyMessageState: React.FC = () => {
  const handleAction = (keyword: string) => {
    switch (keyword) {
      case "log_meal":
        console.log("Logging meal...");
        break;
      case "log_exercise":
        console.log("Logging exercise...");
        break;
      case "track_water":
        console.log("Tracking water...");
        break;
      case "log_sleep":
        console.log("Logging sleep...");
        break;
      case "meditate":
        console.log("Starting meditation...");
        break;
      case "view_progress":
        console.log("Viewing progress...");
        break;
      case "medicine_reminder":
        console.log("Setting medicine reminder...");
        break;
      case "check_symptoms":
        console.log("Checking symptoms...");
        break;
      case "healthy_tips":
        console.log("Showing healthy tips...");
        break;
      case "plan_day":
        console.log("Planning your day...");
        break;
      default:
        console.log("Unknown action");
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <Text className="text-2xl font-bold text-gray-900 mb-16 text-center">
        What can I help with?
      </Text>

      <View
        style={{
          width: screenWidth,
        }}
        className=" gap-2 p-2 flex-row flex-wrap items-center justify-center"
      >
        <ActionButton
          icon="🍎"
          text="Log Meal"
          keyword="log_meal"
          onPress={handleAction}
        />
        <ActionButton
          icon="🏃"
          text="Log Exercise"
          keyword="log_exercise"
          onPress={handleAction}
        />
        <ActionButton
          icon="💧"
          text="Track Water"
          keyword="track_water"
          onPress={handleAction}
        />
        <ActionButton
          icon="🛌"
          text="Log Sleep"
          keyword="log_sleep"
          onPress={handleAction}
        />
        <ActionButton
          icon="🧘"
          text="Start Meditation"
          keyword="meditate"
          onPress={handleAction}
        />
        {/* <ActionButton
          icon="📈"
          text="View Progress"
          keyword="view_progress"
          onPress={handleAction}
        />
        <ActionButton
          icon="💊"
          text="Medicine Reminder"
          keyword="medicine_reminder"
          onPress={handleAction}
        />
        <ActionButton
          icon="🩺"
          text="Check Symptoms"
          keyword="check_symptoms"
          onPress={handleAction}
        />
        <ActionButton
          icon="🍵"
          text="Healthy Tips"
          keyword="healthy_tips"
          onPress={handleAction}
        />
        <ActionButton
          icon="📅"
          text="Plan My Day"
          keyword="plan_day"
          onPress={handleAction}
        /> */}
      </View>
    </View>
  );
};

export default EmptyMessageState;
