// FoodLoggingTrackerCard.tsx - Optimized main component
import Skeleton from "@/components/skeleton/Skeleton";
import { images } from "@/constants";
import { useFoodLogMutationTracker } from "@/hooks/useFoodMutationTracker";
import { useFoodLogs } from "@/store/healthStore";
import { FoodLog } from "@/types/type";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import FoodLogCard from "./FoodLogCard";

interface FoodLoggingTrackerCardProps {
    date: string;
}

const FoodLoggingTrackerCard = ({ date }: FoodLoggingTrackerCardProps) => {
    const { loading, variables, result } = useFoodLogMutationTracker();
    const { data: foodLogs, isLoading: foodLogsLoading } = useFoodLogs.ByDate(date);

    // Memoized helper functions
    const imagePreview = useMemo(() => {
        if (variables instanceof FormData) {
            const imageEntry = variables.get("image");
            if (imageEntry && typeof imageEntry === "object" && "uri" in imageEntry) {
                return (imageEntry as any).uri;
            }
        }
        return null;
    }, [variables]);

    const mealType = useMemo(() => {
        if (variables instanceof FormData) {
            const mealTypeEntry = variables.get("mealType");
            return typeof mealTypeEntry === "string" ? mealTypeEntry : "Unknown";
        }
        return "Unknown";
    }, [variables]);

    // Memoized loading food log for ongoing mutation
    const loadingFoodLog = useMemo(() => ({
        items: (result as unknown as FoodLog)?.items || [],
        mealName: `Logging ${mealType}...`,
        loggedAt: new Date().toISOString()
    }), [result, mealType]);

    // Show empty state if no ongoing mutations and no existing food logs
    if (!loading && !result && (!foodLogs || foodLogs.length === 0)) {
        return (
            <View className="bg-gray-100 rounded-xl px-1 py-1">
                <View className="flex flex-row items-center">
                    <Image
                        source={images.emptyState}
                        className="w-28 h-24 rounded-lg"
                        resizeMode="cover"
                    />
                    <View className="flex-row text-wrap justify-center items-center flex-1">
                        <Text className="text-xs text-gray-500" style={{ flexShrink: 1 }}>
                            You haven't logged any foods yet! Start logging foods by clicking
                            the log button
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View className="w-full my-2">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
            >
                {/* Show ongoing mutation (loading state) */}
                {loading && !result && (
                    <View className="mr-3">
                        <FoodLogCard
                            foodLog={loadingFoodLog}
                            isLoading={true}
                            imagePreview={imagePreview}
                            mealType={mealType}
                        />
                    </View>
                )}

                {/* Show existing food logs for the day */}
                {foodLogs?.map((foodLog: any, index: number) => (
                    <View key={`existing-${index}`} className="mr-3 bg-gray-100 rounded-xl">
                        <TouchableOpacity onPress={() => router.push(`/(root)/food-log/${foodLog.id}`)}>
                            <FoodLogCard foodLog={foodLog} />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Show loading skeletons for existing food logs if they're loading */}
                {foodLogsLoading && !foodLogs && (
                    Array.from({ length: 2 }).map((_, index) => (
                        <View key={`skeleton-${index}`} className="bg-white p-4 rounded-xl min-w-[280px] gap-4 mr-3 flex-row">
                            <View className="w-28 h-28 rounded-lg bg-gray-200" />
                            <View className="flex-1 gap-2">
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default FoodLoggingTrackerCard;