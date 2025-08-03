// components/CalorieStatItem.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface CalorieStatItemProps {
  value: number | string | undefined;
  label: string;
  color: string;
  icon?: boolean;
}

const CalorieStatItem: React.FC<CalorieStatItemProps> = ({
  value,
  label,
  color,
  icon,
}) => (
  <View className="items-center">
    <Text className={`text-md font-bold ${color}`}>{value}</Text>
    <View className="flex-row items-center">
      <Text className={`${color} text-xs`}>{label}</Text>
      {icon && (
        <Feather
          name="info"
          color={
            color.includes("blue") ? "skyblue" : color.replace("text-", "")
          }
          size={15}
          style={{ marginLeft: 4 }}
        />
      )}
    </View>
  </View>
);

export default CalorieStatItem;
