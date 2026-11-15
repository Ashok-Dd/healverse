import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

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
        <View className="px-4 py-4 border-t flex-row justify-between items-center border-border bg-card">
            <View className="mb-4">
                <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={20} className="text-muted-foreground" />
                    <Text className="text-muted-foreground ml-2">Today {currentTime}</Text>
                    <TouchableOpacity className="ml-3">
                        <Ionicons name="create-outline" size={15} className="text-primary" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <Ionicons name="menu" size={20} className="text-foreground" />
                        <Text className="text-foreground font-body-semibold ml-2">
                            Total: {totalCalories}kcal
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                className={`px-10 py-4 rounded-xl items-center justify-center ${
                    selectedExercise ? "bg-primary" : "bg-muted"
                }`}
                disabled={!selectedExercise}
                onPress={onSubmit}
            >
                <View className="flex-row items-center">
                    <Ionicons
                        name="checkmark"
                        size={20}
                        className="text-primary-foreground"
                        style={{ marginRight: 8 } as any}
                    />
                    <Text className="text-primary-foreground font-body-semibold text-lg">Okay</Text>
                </View>
            </TouchableOpacity>

        </View>
    );
};