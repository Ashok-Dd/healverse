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
      className="bg-green-50 gap-x-4 rounded-xl border border-green-200 flex-row items-center justify-center py-3 px-4"
      style={[
        {
          shadowColor: "#4ade80",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        style,
      ]}
    >
      {/* Icon Container */}
      <View
        className="bg-green-500 w-10 h-10 rounded-lg items-center justify-center"
        style={{
          shadowColor: "#4ade80",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Ionicons name="heart-outline" size={24} color="#fff" />
      </View>

      {/* Text Container */}
      <View className="items-center justify-center">
        <View className="items-center">
          <Text className="text-green-600 font-bold leading-tight">
            <Text className="text-2xl font-bold">{days}</Text>
            <Text className="text-lg"> days</Text>
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
