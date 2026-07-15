import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface BottomSectionProps {
    currentTime: string;
    totalCalories: number;
    selectedExercise: string | null;
    onSubmit: () => void;
    isPending: boolean;
}

export const BottomSection: React.FC<BottomSectionProps> = ({
                                                                currentTime,
                                                                totalCalories,
                                                                selectedExercise,
                                                                onSubmit,
    isPending
                                                            }) => {
    return (
        <View className="px-4 py-4 border-t flex-row justify-between items-center border-gray-100 bg-white">
            <View className="mb-4">
                <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={20} color="#6b7280" />
                    <Text className="text-gray-600 ml-2">Today {currentTime}</Text>
                    <TouchableOpacity className="ml-3">
                        <Ionicons name="create-outline" size={15} color="skyblue" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <Ionicons name="menu" size={20} color="#374151" />
                        <Text className="text-gray-800 font-medium ml-2">
                            Total: {totalCalories}kcal
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                className={`px-10 py-4 rounded-xl items-center justify-center ${
                    selectedExercise && !isPending ? "bg-green-500" : "bg-gray-300"
                }`}
                disabled={!selectedExercise || isPending}
                onPress={onSubmit}
            >
                <View className="flex-row items-center">
                    {isPending ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            <Ionicons
                                name="checkmark"
                                size={20}
                                color="white"
                                style={{ marginRight: 8 } as any}
                            />
                            <Text className="text-white font-semibold text-lg">Okay</Text>
                        </>
                    )}
                </View>
            </TouchableOpacity>

        </View>
    );
};