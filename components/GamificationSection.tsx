import { useGamificationSummary } from "@/lib/tanstack";
import { GamificationActivity } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const GamificationSkeleton = () => (
    <View className="mx-6 mb-6">
        <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            {/* Stats Row Skeleton */}
            <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                    <View className="bg-gray-50 rounded-xl p-4">
                        <View className="w-20 h-8 bg-gray-200 rounded mb-1" />
                        <View className="w-16 h-4 bg-gray-150 rounded" />
                    </View>
                </View>
                <View className="flex-1 mx-1">
                    <View className="bg-gray-50 rounded-xl p-4">
                        <View className="w-20 h-8 bg-gray-200 rounded mb-1" />
                        <View className="w-16 h-4 bg-gray-150 rounded" />
                    </View>
                </View>
                <View className="flex-1 ml-2">
                    <View className="bg-gray-50 rounded-xl p-4">
                        <View className="w-20 h-8 bg-gray-200 rounded mb-1" />
                        <View className="w-16 h-4 bg-gray-150 rounded" />
                    </View>
                </View>
            </View>

            {/* Today Points Skeleton */}
            <View className="bg-gray-50 rounded-xl p-4">
                <View className="w-24 h-6 bg-gray-200 rounded" />
            </View>
        </View>
    </View>
);

const StatItem = ({
    icon,
    value,
    label,
    iconColor,
    bgColor,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    value: string | number;
    label: string;
    iconColor: string;
    bgColor: string;
}) => (
    <View className="flex-1">
        <View className="bg-gray-50 rounded-xl p-4 items-center">
            <View 
                className="w-10 h-10 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: bgColor }}
            >
                <Ionicons name={icon} size={20} color={iconColor} />
            </View>
            <Text className="text-secondary-800 text-2xl font-jakarta-bold mb-1">
                {value}
            </Text>
            <Text className="text-secondary-500 text-xs font-jakarta-regular text-center">
                {label}
            </Text>
        </View>
    </View>
);

const ActivityItem = ({ activity }: { activity: GamificationActivity }) => {
    const getActivityIcon = (reason: string): keyof typeof Ionicons.glyphMap => {
        switch (reason) {
            case 'DAILY_LOGIN':
                return 'calendar';
            case 'FOOD_LOG':
            case 'DIET_FOLLOW':
                return 'restaurant';
            case 'EXERCISE_LOG':
                return 'fitness';
            case 'WATER_LOG':
                return 'water';
            case 'WEIGHT_UPDATE':
                return 'scale';
            case 'CHAT_INTERACTION':
                return 'chatbubble';
            case 'STREAK_MILESTONE':
                return 'flame';
            case 'DAILY_COMPLETE':
                return 'checkmark-circle';
            default:
                return 'star';
        }
    };

    const getActivityColor = (reason: string): string => {
        switch (reason) {
            case 'DAILY_LOGIN':
                return '#3B82F6';
            case 'FOOD_LOG':
            case 'DIET_FOLLOW':
                return '#F59E0B';
            case 'EXERCISE_LOG':
                return '#EF4444';
            case 'WATER_LOG':
                return '#06B6D4';
            case 'WEIGHT_UPDATE':
                return '#8B5CF6';
            case 'CHAT_INTERACTION':
                return '#10B981';
            case 'STREAK_MILESTONE':
                return '#F97316';
            case 'DAILY_COMPLETE':
                return '#22C55E';
            default:
                return '#6B7280';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <View className="flex-row items-center p-3 bg-gray-50 rounded-lg border border-gray-100 mb-3">
            <View
                className="w-10 h-10 items-center justify-center mr-3 rounded-full"
                style={{ backgroundColor: `${getActivityColor(activity.reason)}15` }}
            >
                <Ionicons
                    name={getActivityIcon(activity.reason)}
                    size={18}
                    color={getActivityColor(activity.reason)}
                />
            </View>
            <View className="flex-1">
                <Text className="text-secondary-800 font-jakarta-semi-bold text-sm mb-1">
                    {activity.description}
                </Text>
                <Text className="text-secondary-500 font-jakarta-regular text-xs">
                    {formatDate(activity.date)}
                </Text>
            </View>
            <View className="bg-primary-50 px-2 py-1 rounded-lg">
                <Text className="text-primary-600 font-jakarta-bold text-xs">
                    +{activity.pointsEarned}
                </Text>
            </View>
        </View>
    );
};

const ActivityModal = ({
    visible,
    onClose,
    activities,
}: {
    visible: boolean;
    onClose: () => void;
    activities: GamificationActivity[];
}) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <Pressable 
                className="flex-1 bg-black/50 justify-end"
                onPress={onClose}
            >
                <Pressable 
                    className="bg-white rounded-t-3xl max-h-[80%]"
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
                        <Text className="text-xl font-jakarta-bold text-secondary-800">
                            Recent Activity
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                        >
                            <Ionicons name="close" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Activity List */}
                    <ScrollView className="px-6 py-4">
                        {activities.length > 0 ? (
                            activities.map((activity) => (
                                <ActivityItem key={activity.id} activity={activity} />
                            ))
                        ) : (
                            <View className="items-center py-12">
                                <Ionicons name="trophy-outline" size={64} color="#D1D5DB" />
                                <Text className="text-secondary-500 font-jakarta-regular text-base mt-4">
                                    No activity yet
                                </Text>
                                <Text className="text-secondary-400 font-jakarta-regular text-sm mt-2 text-center">
                                    Complete daily tasks to earn points!
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const GamificationSection = () => {
    const { data: gamification, isLoading, error, refetch } = useGamificationSummary();
    const [isModalVisible, setIsModalVisible] = useState(false);


    if (isLoading) {
        return <GamificationSkeleton />;
    }

    if (error) {
        return (
            <View className="mx-6 mb-6">
                <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 items-center">
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text className="text-secondary-800 font-jakarta-semi-bold text-lg mt-4 mb-2">
                        Unable to Load Progress
                    </Text>
                    <Text className="text-secondary-500 font-jakarta-regular text-sm text-center mb-4">
                        We couldn't fetch your wellness progress data right now.
                    </Text>
                    <TouchableOpacity
                        onPress={() => refetch()}
                        className="bg-primary-500 px-6 py-2 rounded-lg"
                    >
                        <Text className="text-white font-jakarta-semi-bold text-sm">
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (!gamification) return null;

    return (
        <View className="mx-6 mb-6">
            <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                {/* Stats Row */}
                <View className="flex-row justify-between mb-4">
                    <StatItem
                        icon="flame"
                        value={gamification.currentStreak}
                        label="Day Streak"
                        iconColor="#F97316"
                        bgColor="#FFF7ED"
                    />
                    <View className="w-2" />
                    <StatItem
                        icon="star"
                        value={gamification.totalPoints}
                        label="Total Points"
                        iconColor="#22C55E"
                        bgColor="#F0FDF4"
                    />
                    <View className="w-2" />
                    <StatItem
                        icon="trending-up"
                        value={gamification.longestStreak}
                        label="Best Streak"
                        iconColor="#3B82F6"
                        bgColor="#EFF6FF"
                    />
                </View>

                {/* Today's Points Card */}
                <View className="bg-blue-50 rounded-xl p-4 border border-primary-100">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-secondary-600 font-jakarta-regular text-sm mb-1">
                                Today's Points
                            </Text>
                            <Text className="text-blue-600 font-jakarta-bold text-3xl">
                                {gamification.todayPoints}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setIsModalVisible(true)}
                            className=" px-4 py-2 rounded-lg flex-row items-center"
                        >
                            <Text className="text-blue-500 font-jakarta-semi-bold text-sm mr-1">
                                View Activity
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Activity Modal */}
            <ActivityModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                activities={gamification.recentActivity}
            />
        </View>
    );
};

export default GamificationSection;