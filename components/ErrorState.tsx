import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export const ErrorState: React.FC = () => {
    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center">
                <Ionicons name="alert-circle" size={48} color="#ef4444" />
                <Text className="mt-4 text-gray-600 text-center">
                    Failed to load exercises. Please try again.
                </Text>
            </View>
        </View>
    );
};