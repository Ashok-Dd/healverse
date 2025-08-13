import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View, ViewStyle } from "react-native";

interface HealthStreakCardProps {
  days: number;
  style?: ViewStyle;
}

const HealthStreakCard: React.FC<HealthStreakCardProps> = ({ days, style }) => {
  return (
    <View
      className="bg-teal-50 gap-x-4 rounded-2xl border-2 border-teal-200 flex-row items-center justify-center py-2 px-4"
      style={[
        {
          shadowColor: "#0da886",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.12,
          shadowRadius: 32,
          elevation: 4,
        },
        style,
      ]}
    >
      {/* Icon Container */}
      <View
        className="bg-teal-500 w-12 h-12 rounded-xl items-center justify-center"
        style={{
          shadowColor: "#0da886",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.18,
          shadowRadius: 32,
          elevation: 12,
        }}
      >
        <Ionicons name="heart-outline" size={28} color="#fff" />
      </View>

      {/* Text Container */}
      <View className=" items-center justify-center">
        <View className="items-center">
          <Text className="text-teal-500 font-bold leading-tight">
            <Text className="text-3xl font-bold">{days}</Text>
            <Text className="text-xl"> days</Text>
          </Text>
          <Text className="text-gray-600 text-sm font-normal mt-1">
            Health streak
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HealthStreakCard;
