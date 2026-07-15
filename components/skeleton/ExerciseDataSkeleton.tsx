// components/LoadingState.tsx
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ExerciseDataSkeleton: React.FC = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-600">Loading exercises...</Text>
            </View>
        </SafeAreaView>
    );
};