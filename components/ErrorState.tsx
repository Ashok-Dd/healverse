import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export const ErrorState: React.FC = () => {
    return (
        <View className="flex-1 bg-background">
            <View className="flex-1 justify-center items-center">
                <Ionicons name="alert-circle" size={48} className="text-destructive" />
                <Text className="mt-4 text-muted-foreground text-center">
                    Failed to load exercises. Please try again.
                </Text>
            </View>
        </View>
    );
};