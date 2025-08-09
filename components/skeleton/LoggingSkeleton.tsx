import React from "react";
import { ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Skeleton from "./Skeleton"; // your Skeleton component

const DashboardSkeleton = () => {
    return (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Remaining Calorie */}
            <View className="flex-row items-center mb-2 px-5">
                <Skeleton width={24} height={24} radius={12} className="mr-2" />
                <Skeleton width={160} height={24} radius={6} />
                <View className="ml-auto">
                    <Feather name="info" color={"lightgray"} size={20} />
                </View>
            </View>

            <View className="bg-gray-100 rounded-lg p-4 mx-4 mb-4 shadow-sm">
                <Skeleton height={80} radius={8} />
            </View>

            {/* Daily Total */}
            <View className="px-2">
                <View className="flex-row items-center mb-2 ml-3">
                    <Skeleton width={24} height={24} radius={12} className="mr-2" />
                    <Skeleton width={130} height={24} radius={6} />
                </View>
                <Skeleton height={64} radius={8} />
            </View>

            {/* Exercise Log */}
            <SkeletonLogCard />

            {/* Water Log */}
            <SkeletonLogCard />

            {/* Food Logs */}
            {[...Array(4)].map((_, i) => (
                <SkeletonLogCard key={i} />
            ))}
        </ScrollView>
    );
};

const SkeletonLogCard = () => {
    return (
        <View className="bg-gray-100 rounded-xl p-4 m-4 shadow-sm">
            {/* Header */}
            <View className="flex-row items-center mb-3">
                <Skeleton width={32} height={32} radius={16} className="mr-3" />
                <View className="flex-1">
                    <Skeleton width={120} height={20} radius={6} className="mb-2" />
                    <Skeleton width={180} height={16} radius={6} />
                </View>
            </View>

            {/* Items */}
            {[...Array(2)].map((_, idx) => (
                <Skeleton
                    key={idx}
                    height={56}
                    radius={8}
                    className="mb-3"
                />
            ))}
        </View>
    );
};

export default DashboardSkeleton;
