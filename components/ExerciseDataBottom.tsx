import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface BottomSectionProps {
  currentTime: string;
  totalCalories: number;
  selectedExercise: string | null;
  onSubmit: () => void;
}

export const BottomSection: React.FC<BottomSectionProps> = ({
  currentTime,
  totalCalories,
  selectedExercise,
  onSubmit,
}) => {
  return (
    <View className="flex-row items-center justify-between gap-4 border-t border-border bg-card px-4 py-3">
      <View className="gap-1">
        <View className="flex-row items-center gap-2">
          <Ionicons name="time-outline" size={18} className="text-muted-foreground" />
          <Text className="font-body text-sm text-muted-foreground">Today {currentTime}</Text>
        </View>
        <Text className="font-body-semibold text-base text-foreground">
          Total: {totalCalories} kcal
        </Text>
      </View>

      <Button
        title="Log exercise"
        size="sm"
        disabled={!selectedExercise}
        onPress={onSubmit}
      />
    </View>
  );
};
