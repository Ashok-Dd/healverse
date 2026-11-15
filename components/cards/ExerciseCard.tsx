import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { ExerciseLog as Exercise } from '@/types/type';
import {EXERCISE_ICONS, INTENSITY_LEVELS} from '@/constants/exercise';

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
                                                              onEditPress
                                                          }) => {
    return (
        <TouchableOpacity
            className={`flex-row items-center p-4 mx-4 mb-2 rounded-xl ${
                isSelected ? "bg-secondary border-2 border-border" : "bg-background"
            }`}
            onPress={() => onSelect(exercise.id.toString())}
        >
            <View
                className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                    isSelected ? "border-border bg-primary" : "border-border"
                }`}
            >
                {isSelected && <Ionicons name="checkmark" size={16} className="text-primary-foreground" />}
            </View>

            <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-muted rounded-full items-center justify-center mr-3">
                    <Ionicons name={EXERCISE_ICONS[exercise.exerciseName.toLowerCase()]} size={20} className="text-muted-foreground" />
                </View>

                <View className="flex-1">
                    <Text className="text-sm text-foreground mb-1">{exercise.exerciseName}</Text>
                    <View className="flex-row items-center">
                        <Ionicons name="flame" size={14} color="#10b981" />
                        <Text className="text-xs text-accent-foreground ml-1">
                            -{exercise.caloriesBurned}kcal
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    className="flex flex-row gap-2 items-center"
                    onPress={() => onEditPress(exercise)}
                >
                    <Text className="text-primary font-body-semibold mb-1">
                        {INTENSITY_LEVELS.find(i  => i.level === exercise.intensity)?.label}
                    </Text>
                    <Text className="text-primary font-body-semibold">
                        {exercise.durationMinutes} min
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};