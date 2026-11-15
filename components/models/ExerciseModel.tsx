import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { ExerciseLog as Exercise, IntensityLevel , ExerciseIntensity} from '@/types/type';
import { INTENSITY_LEVELS, DURATION_OPTIONS, EXERCISE_DESCRIPTIONS  , EXERCISE_ICONS} from '@/constants/exercise';
import { SmoothPicker } from '@/components/ui/SmoothPicker';

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
                                                                onCancel
                                                            }) => {
    if (!exercise) return null;

    const getExerciseDescription = (exerciseName: string) => {
        return (
            EXERCISE_DESCRIPTIONS[exerciseName.toLowerCase()] ||
            EXERCISE_DESCRIPTIONS.default
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="w-11/12 max-w-md bg-card rounded-2xl shadow-xl">
                    {/* Modal Header */}
                    <View className="items-center p-6 border-b border-border">
                        <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center mb-3">
                            <Ionicons
                                name={EXERCISE_ICONS[exercise.exerciseName.toLowerCase()]}
                                size={24}
                                className="text-primary"
                            />
                        </View>
                        <Text className="text-xl font-body-bold text-foreground mb-2">
                            {exercise.exerciseName}
                        </Text>
                        <Text className="text-sm text-muted-foreground text-center leading-5">
                            {getExerciseDescription(exercise.exerciseName)}
                        </Text>
                    </View>

                    {/* Modal Content */}
                    <View className="p-6">
                        {/* Exercise Details */}
                        <View className="mb-6">
                            <Text className="text-xs font-body-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                Intensity Levels
                            </Text>
                            <View className="space-y-2">
                                {INTENSITY_LEVELS.map((level) => (
                                    <View key={level.level} className="flex-row items-center">
                                        <View
                                            className="w-1.5 h-1.5 rounded-full mr-3"
                                            style={{ backgroundColor: level.color }}
                                        />
                                        <Text className="text-xs text-muted-foreground">
                                            {level.label}:{" "}
                                            {level.level === "LOW"
                                                ? "Light effort, comfortable pace"
                                                : level.level === "MODERATE"
                                                    ? "Steady effort, moderate pace"
                                                    : "Vigorous effort, challenging pace"}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Calories Display */}
                        <View className="items-center mb-6">
                            <Text className="text-4xl font-body-bold text-foreground">
                                {calculatedCalories}
                            </Text>
                            <Text className="text-muted-foreground text-lg">kcal</Text>
                        </View>

                        {/* Smooth Pickers Side by Side */}
                        <View className="flex-row mb-3">
                            <SmoothPicker<IntensityLevel>
                                title="Intensity"
                                data={INTENSITY_LEVELS}
                                selectedValue={INTENSITY_LEVELS.find(i => i.level === selectedIntensity)!}
                                onValueChange={(level) => onIntensityChange(level.level as ExerciseIntensity)}
                                renderLabel={(item, isSelected) => item.label}
                                keyExtractor={(item) => item.level}
                                containerClassName="flex-1 mr-4"
                            />

                            <SmoothPicker<number>
                                title="Duration"
                                data={DURATION_OPTIONS}
                                selectedValue={selectedDuration}
                                onValueChange={onDurationChange}
                                renderLabel={(item) => `${item} min`}
                                keyExtractor={(item) => item.toString()}
                                containerClassName="flex-1 ml-4"
                            />
                        </View>
                    </View>

                    {/* Modal Footer */}
                    <View className="flex-row p-6 border-t border-border gap-3">
                        <TouchableOpacity
                            className="flex-1 bg-muted py-4 rounded-xl items-center"
                            onPress={onCancel}
                        >
                            <Text className="text-foreground font-body-semibold text-lg">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-primary py-4 rounded-xl items-center"
                            onPress={onSave}
                        >
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="checkmark"
                                    size={20}
                                    className="text-primary-foreground"
                                    style={{ marginRight: 8 } as any}
                                />
                                <Text className="text-primary-foreground font-body-semibold text-lg">
                                    Save
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

