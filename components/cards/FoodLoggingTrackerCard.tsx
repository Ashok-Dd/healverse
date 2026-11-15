// FoodLoggingTrackerCard.tsx - Optimized main component
import Skeleton from "@/components/skeleton/Skeleton";
import { images } from "@/constants";
import { useOutboxEntries } from "@/hooks/useOutboxEntries";
import { dayOf } from "@/lib/day";
import { useFoodLogs } from "@/store/healthStore";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import FoodLogCard from "./FoodLogCard";
import { QueuedFoodCard } from "./QueuedFoodCard";

interface FoodLoggingTrackerCardProps {
    date: string;
}

const FoodLoggingTrackerCard = ({ date }: FoodLoggingTrackerCardProps) => {
    const { data: foodLogs, isLoading: foodLogsLoading } = useFoodLogs.ByDate(date);
    const queuedPhotos = useOutboxEntries("food-photo").filter(
        (entry) => dayOf(entry.payload.loggedAt) === date
    );

    // Only claim "nothing logged" once the request has actually finished.
    if (!foodLogsLoading && queuedPhotos.length === 0 && (!foodLogs || foodLogs.length === 0)) {
        return (
            <View className="bg-muted rounded-xl px-1 py-1">
                <View className="flex flex-row items-center">
                    <Image
                        source={images.emptyState}
                        className="w-28 h-24 rounded-lg"
                        resizeMode="cover"
                    />
                    <View className="flex-row text-wrap justify-center items-center flex-1">
                        <Text className="font-body text-sm text-muted-foreground" style={{ flexShrink: 1 }}>
                            {"You haven't logged any foods yet. Tap the log button to add one."}
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
                {queuedPhotos.map((entry) => (
                    <QueuedFoodCard key={entry.id} entry={entry} />
                ))}

                {/* Show existing food logs for the day */}
                {foodLogs?.map((foodLog: any, index: number) => (
                    <View key={`existing-${index}`} className="mr-3 bg-muted rounded-xl">
                        <TouchableOpacity onPress={() => router.push(`/(root)/food-log/${foodLog.id}`)}>
                            <FoodLogCard foodLog={foodLog} />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Show loading skeletons for existing food logs if they're loading */}
                {foodLogsLoading && (
                    Array.from({ length: 2 }).map((_, index) => (
                        <View key={`skeleton-${index}`} className="bg-card p-4 rounded-xl min-w-[280px] gap-4 mr-3 flex-row">
                            <View className="w-28 h-28 rounded-lg bg-muted" />
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