import { Button } from "@/components/ui/Button";
import { SheetModal } from "@/components/ui/SheetModal";
import { WheelColumn } from "@/components/ui/WheelColumn";
import {
  DURATION_OPTIONS,
  EXERCISE_DESCRIPTIONS,
  EXERCISE_ICONS,
  INTENSITY_LEVELS,
} from "@/constants/exercise";
import { ExerciseIntensity, ExerciseLog as Exercise, IntensityLevel } from "@/types/type";
import React from "react";
import { Text, View } from "react-native";

interface ExerciseModalProps {
  visible: boolean;
  exercise: Exercise | null;
  selectedIntensity: ExerciseIntensity;
  selectedDuration: number;
  calculatedCalories: number;
  onIntensityChange: (intensity: ExerciseIntensity) => void;
  onDurationChange: (duration: number) => void;
  onSave: () => void;
  onCancel: () => void;
  /** Shows a spinner on Save and locks the sheet while the save is in flight. */
  saving?: boolean;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  visible,
  exercise,
  selectedIntensity,
  selectedDuration,
  calculatedCalories,
  onIntensityChange,
  onDurationChange,
  onSave,
  onCancel,
  saving = false,
}) => {
  if (!exercise) return null;

  const key = exercise.exerciseName.toLowerCase();

  return (
    <SheetModal
      visible={visible}
      onClose={onCancel}
      icon={EXERCISE_ICONS[key]}
      title={exercise.exerciseName}
      subtitle={EXERCISE_DESCRIPTIONS[key] || EXERCISE_DESCRIPTIONS.default}
      footer={
        <>
          <Button
            title="Cancel"
            variant="outline"
            className="flex-1"
            onPress={onCancel}
            disabled={saving}
          />
          <Button title="Save" className="flex-1" onPress={onSave} loading={saving} />
        </>
      }
    >
      <View className="mb-4 items-center rounded-2xl bg-muted py-4">
        <Text className="font-display text-4xl text-foreground">{calculatedCalories}</Text>
        <Text className="font-body text-sm text-muted-foreground">kcal burned</Text>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text className="mb-2 text-center font-body-semibold text-sm text-foreground">
            Intensity
          </Text>
          <WheelColumn<IntensityLevel>
            data={INTENSITY_LEVELS}
            value={INTENSITY_LEVELS.find((i) => i.level === selectedIntensity)!}
            onChange={(level) => onIntensityChange(level.level as ExerciseIntensity)}
            renderLabel={(item) => item.label}
            keyExtractor={(item) => item.level}
          />
        </View>
        <View className="flex-1">
          <Text className="mb-2 text-center font-body-semibold text-sm text-foreground">
            Duration
          </Text>
          <WheelColumn<number>
            data={DURATION_OPTIONS}
            value={selectedDuration}
            onChange={onDurationChange}
            renderLabel={(item) => `${item} min`}
            keyExtractor={(item) => item.toString()}
          />
        </View>
      </View>
    </SheetModal>
  );
};
