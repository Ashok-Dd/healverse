import { EXERCISE_ICONS, INTENSITY_LEVELS } from "@/constants/exercise";
import { ExerciseLog as Exercise } from "@/types/type";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface ExerciseCardProps {
  exercise: Exercise;
  isSelected: boolean;
  onSelect: (exerciseId: string) => void;
  onEditPress: (exercise: Exercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isSelected,
  onSelect,
  onEditPress,
}) => {
  const intensity = INTENSITY_LEVELS.find((i) => i.level === exercise.intensity)?.label;

  return (
    <Pressable
      onPress={() => onSelect(exercise.id.toString())}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={exercise.exerciseName}
      className={`mx-3 mb-2 flex-row items-center gap-3 rounded-2xl border p-3 active:opacity-80 ${
        isSelected ? "border-primary bg-secondary" : "border-border bg-card"
      }`}
    >
      <View
        className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
          isSelected ? "border-primary bg-primary" : "border-border"
        }`}
      >
        {isSelected && <Ionicons name="checkmark" size={14} className="text-primary-foreground" />}
      </View>

      <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Ionicons
          name={EXERCISE_ICONS[exercise.exerciseName.toLowerCase()]}
          size={20}
          className="text-muted-foreground"
        />
      </View>

      <View className="flex-1">
        <Text className="font-body-semibold text-sm text-foreground" numberOfLines={1}>
          {exercise.exerciseName}
        </Text>
        <View className="flex-row items-center gap-1">
          <MaterialCommunityIcons name="fire" size={14} className="text-destructive" />
          <Text className="font-body-semibold text-xs text-destructive">
            {exercise.caloriesBurned} kcal
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => onEditPress(exercise)}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={`Change intensity and duration of ${exercise.exerciseName}`}
        className="min-h-[44px] items-end justify-center active:opacity-70"
      >
        <Text className="font-body-semibold text-xs text-primary">{intensity}</Text>
        <Text className="font-body-semibold text-xs text-primary">
          {exercise.durationMinutes} min
        </Text>
      </Pressable>
    </Pressable>
  );
};
