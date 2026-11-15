import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const AllLoggedExercises: React.FC = () => {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <ThemedStatusBar />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <Ionicons name="arrow-back" size={24} className="text-foreground" />
                </TouchableOpacity>

                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-1">
                        <Feather name="clock" size={16} className="text-foreground" />
                    </View>
                    <Text className="text-lg font-body-semibold text-foreground">
                        Logged Exercises
                    </Text>
                </View>

                <TouchableOpacity className="p-1">
                    <Ionicons name="options" size={24} className="text-primary" />
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
