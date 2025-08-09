import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export const HeaderComponent: React.FC = () => {
    return (
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>

            <View className="flex-row items-center">
                <Ionicons name="walk" size={24} color="#374151" className="mr-2" />
                <Text className="text-lg font-semibold text-gray-800">
                    Log Exercise
                </Text>
            </View>

            <TouchableOpacity className="bg-blue-200 px-3 py-1 rounded-full">
                <Text className="text-blue-500 text-xs">+ Add New</Text>
            </TouchableOpacity>
        </View>
    );
};