import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { ExerciseLog as Exercise, IntensityLevel } from '@/types/type';
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
                isSelected ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-50"
            }`}
            onPress={() => onSelect(exercise.id.toString())}
        >
            <View
                className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                    isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                }`}
            >
                {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
            </View>

            <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mr-3">
                    <Ionicons name={EXERCISE_ICONS[exercise.exerciseName.toLowerCase()]} size={20} color="#6b7280" />
                </View>

                <View className="flex-1">
                    <Text className="text-sm text-gray-800 mb-1">{exercise.exerciseName}</Text>
                    <View className="flex-row items-center">
                        <Ionicons name="flame" size={14} color="#10b981" />
                        <Text className="text-xs text-green-600 ml-1">
                            -{exercise.caloriesBurned}kcal
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    className="flex flex-row gap-2 items-center"
                    onPress={() => onEditPress(exercise)}
                >
                    <Text className="text-blue-500 font-medium mb-1">
                        {INTENSITY_LEVELS.find(i  => i.level === exercise.intensity)?.label}
                    </Text>
                    <Text className="text-blue-500 font-medium">
                        {exercise.durationMinutes} min
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};