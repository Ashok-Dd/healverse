import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExerciseLog } from "@/types/type";
import {
    useDashboardData,
    useDateSelectorForHealthStore,
} from "@/store/healthStore";

const AllLoggedExercises: React.FC = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>

                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-1">
                        <Feather name="clock" size={16} color="black" />
                    </View>
                    <Text className="text-lg font-semibold text-gray-800">
                        Logged Exercises
                    </Text>
                </View>

                <TouchableOpacity className="p-1">
                    <Ionicons name="options" size={24} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            {/* Exercise List */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingVertical: 16 }}
                showsVerticalScrollIndicator={false}
            >
                <AllLoggedExercises/>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AllLoggedExercises;
