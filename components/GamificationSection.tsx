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
        <View className="bg-card rounded-2xl p-4  border border-border">
            {/* Stats Row Skeleton */}
            <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                    <View className="bg-muted rounded-xl p-4">
                        <View className="w-20 h-8 bg-muted rounded mb-1" />
                        <View className="w-16 h-4 bg-border rounded" />
                    </View>
                </View>
                <View className="flex-1 mx-1">
                    <View className="bg-muted rounded-xl p-4">
                        <View className="w-20 h-8 bg-muted rounded mb-1" />
                        <View className="w-16 h-4 bg-border rounded" />
                    </View>
                </View>
                <View className="flex-1 ml-2">
                    <View className="bg-muted rounded-xl p-4">
                        <View className="w-20 h-8 bg-muted rounded mb-1" />
                        <View className="w-16 h-4 bg-border rounded" />
                    </View>
                </View>
            </View>

            {/* Today Points Skeleton */}
            <View className="bg-muted rounded-xl p-4">
                <View className="w-24 h-6 bg-muted rounded" />
            </View>
        </View>
    </View>
);

const StatItem = ({
    icon,
    value,
    label,
    iconClass,
    bgClass,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    value: string | number;
    label: string;
    iconClass: string;
    bgClass: string;
}) => (
    <View className="flex-1">
        <View className="bg-muted rounded-xl p-4 items-center">
            <View className={`mb-2 h-10 w-10 items-center justify-center rounded-full ${bgClass}`}>
                <Ionicons name={icon} size={20} className={iconClass} />
            </View>
            <Text className="text-foreground text-2xl font-body-bold mb-1">
                {value}
            </Text>
            <Text className="text-muted-foreground text-xs font-body text-center">
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
        <View className="flex-row items-center p-3 bg-muted rounded-lg border border-border mb-3">
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
                <Text className="text-foreground font-body-semibold text-sm mb-1">
                    {activity.description}
                </Text>
                <Text className="text-muted-foreground font-body text-xs">
                    {formatDate(activity.date)}
                </Text>
            </View>
            <View className="bg-accent px-2 py-1 rounded-lg">
                <Text className="text-primary font-body-bold text-xs">
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
                    className="bg-card rounded-t-3xl max-h-[80%]"
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-6 border-b border-border">
                        <Text className="text-xl font-body-bold text-foreground">
                            Recent Activity
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-8 h-8 bg-muted rounded-full items-center justify-center"
                        >
                            <Ionicons name="close" size={20} className="text-muted-foreground" />
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
                                <Ionicons name="trophy-outline" size={64} className="text-border" />
                                <Text className="text-muted-foreground font-body text-base mt-4">
                                    No activity yet
                                </Text>
                                <Text className="text-muted-foreground font-body text-sm mt-2 text-center">
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
                <View className="bg-card rounded-2xl p-6  border border-border items-center">
                    <Ionicons name="alert-circle-outline" size={48} className="text-destructive" />
                    <Text className="text-foreground font-body-semibold text-lg mt-4 mb-2">
                        Unable to Load Progress
                    </Text>
                    <Text className="text-muted-foreground font-body text-sm text-center mb-4">
                        We could not fetch your wellness progress right now.
                    </Text>
                    <TouchableOpacity
                        onPress={() => refetch()}
                        className="bg-primary px-6 py-2 rounded-lg"
                    >
                        <Text className="text-primary-foreground font-body-semibold text-sm">
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
            <View className="bg-card rounded-2xl   border border-border">
                {/* Stats Row */}
                <View className="flex-row justify-between mb-4">
                    <StatItem
                        icon="flame"
                        value={gamification.currentStreak}
                        label="Day Streak"
                        iconClass="text-warning"
                        bgClass="bg-warning/10"
                    />
                    <View className="w-2" />
                    <StatItem
                        icon="star"
                        value={gamification.totalPoints}
                        label="Total Points"
                        iconClass="text-success"
                        bgClass="bg-success/10"
                    />
                    <View className="w-2" />
                    <StatItem
                        icon="trending-up"
                        value={gamification.longestStreak}
                        label="Best Streak"
                        iconClass="text-info"
                        bgClass="bg-info/10"
                    />
                </View>

                {/* Points today Card */}
                <View className="bg-secondary rounded-xl p-4 border border-border">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-muted-foreground font-body text-sm mb-1">
                                Points today
                            </Text>
                            <Text className="text-primary font-body-bold text-3xl">
                                {gamification.todayPoints}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setIsModalVisible(true)}
                            className=" px-4 py-2 rounded-lg flex-row items-center"
                        >
                            <Text className="text-primary font-body-semibold text-sm mr-1">
                                View Activity
                            </Text>
                            <Ionicons name="arrow-forward-outline" size={16} className="text-primary" />
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