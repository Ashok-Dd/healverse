// components/chat/ChatHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Button from "@/components/Button";
import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";

interface ChatHeaderProps {
    title: string;
    subtitle?: string;
    onBackPress?: () => void;
    onMenuPress?: () => void;
    showTryFree?: boolean;
    onTryFreePress?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
                                                          title,
                                                          subtitle,
                                                          onBackPress,
                                                          onMenuPress,
                                                          showTryFree = false,
                                                          onTryFreePress,
                                                      }) => {
    return (
        <SafeAreaView className="bg-white">
            <View className="bg-white shadow-sm">
                <View className="flex-row items-center justify-between px-5 py-4">
                    {/* Left side */}
                    <View className="flex-row items-center flex-1">
                        {onBackPress && (
                            <TouchableOpacity
                                onPress={onBackPress}
                                className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-50"
                                activeOpacity={0.7}
                            >
                                <Ionicons name="arrow-back" size={22} color="#1f2937" />
                            </TouchableOpacity>
                        )}

                        <View className="flex-1">
                            {/* Title with icon */}
                            <View className="flex-row items-center mb-0.5">
                                <View className="mr-2 p-1.5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg shadow-sm">
                                    <Sparkles color="purple" size={16} strokeWidth={2.5} />
                                </View>
                                <Text className="text-xl font-bold text-gray-900 tracking-tight">
                                    {title}
                                </Text>
                            </View>

                            {/* Subtitle */}
                            {subtitle && (
                                <Text className="text-sm text-gray-500 ml-8 font-medium">
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Right side */}
                    <View className="flex-row items-center ml-4">
                        {showTryFree && onTryFreePress && (
                            <TouchableOpacity
                                onPress={onTryFreePress}
                                className="mr-3 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-sm"
                                activeOpacity={0.9}
                            >
                                <Text className="text-white font-semibold text-xs tracking-wide">
                                    Try Free
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={() => router.push("/(root)/conversations" as any)}
                            className="flex-row items-center px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 shadow-sm active:bg-gray-100"
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name="history"
                                size={14}
                                color="#6b7280"
                                style={{ marginRight: 4 }}
                            />
                            <Text className="text-gray-600 font-semibold text-xs tracking-wide">
                                History
                            </Text>
                        </TouchableOpacity>

                        {onMenuPress && (
                            <TouchableOpacity
                                onPress={onMenuPress}
                                className="ml-3 p-2 rounded-full active:bg-gray-50"
                                activeOpacity={0.7}
                            >
                                <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Bottom border with gradient */}
                <View className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </View>
        </SafeAreaView>
    );
};