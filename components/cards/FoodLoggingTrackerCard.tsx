import React from "react";
import { View, Image, ActivityIndicator, Text } from "react-native";
import { useFoodLogMutationTracker } from "@/hooks/useFoodMutationTracker";
import Skeleton from "@/components/skeleton/Skeleton";
import {FoodItem} from "@/types/type";

const FoodLoggingTrackerCard = () => {
    const { loading, variables, result } = useFoodLogMutationTracker();

    if (!loading && !result) {
        return <Text className="text-gray-500">No logging in progress</Text>;
    }

    const renderImagePreview = () => {
        if (variables instanceof FormData) {
            const imageEntry = variables.get("image");
            if (imageEntry && typeof imageEntry === "object" && "uri" in imageEntry) {
                const imageUri = (imageEntry as any).uri;
                return (
                    <View className="h-28 w-28 relative">
                        <Image
                            source={{ uri: imageUri }}
                            className="w-28 h-28 rounded-lg mb-4"
                            resizeMode="cover"
                        />
                        <ActivityIndicator
                            size="large"
                            color="#22c55e"
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: [{ translateX: -12 }, { translateY: -12 }],
                                zIndex: 10,
                            } as any}
                        />
                    </View>
                );
            }
        }
        return null;
    };

    const getMealType = () => {
        if (variables instanceof FormData) {
            const mealType = variables.get("mealType");
            return typeof mealType === "string" ? mealType : "Unknown";
        }
        return "Unknown";
    };

    const totals = (result?.items as FoodItem[])?.reduce(
        (acc, item) => {
            acc.calories += item.calories || 0;
            acc.protein += item.protein || 0;
            acc.carbs += item.carbs || 0;
            acc.fats += item.fats || 0;
            return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    return (
        <View className="w-full gap-3">
            {/* Loading state */}
            {loading && !result && (
                <View className="bg-white p-5 w-full rounded-xl flex-row gap-3 items-center min-w-[200px]">
                    {renderImagePreview()}
                    <View className="flex-1 gap-2">
                        <Text className="text-black text-base font-semibold">
                            Logging {getMealType()}...
                        </Text>
                        <Skeleton />
                        <Skeleton />
                    </View>
                </View>
            )}

            {/* Completed state */}
            {result && (
                <View className="bg-white p-4 w-full rounded-xl flex-row items-center min-w-[200px] gap-4">
                    {result.imageUrl ? (
                        <Image
                            source={{ uri: result.imageUrl }}
                            className="w-28 h-28 rounded-lg"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-28 h-28 rounded-lg bg-gray-200 items-center justify-center">
                            <Text className="text-gray-500 text-xs">No Image</Text>
                        </View>
                    )}

                    <View className="flex-1 gap-2">
                        <Text className="text-black text-base font-semibold">
                            {result.mealName || `Logged ${getMealType()}`}
                        </Text>
                        <Text className="text-xs text-gray-500">
                            {new Date(result.loggedAt).toLocaleString()}
                        </Text>

                        <View className="flex-row flex-wrap gap-x-3 mt-1">
                            <Text className="text-red-500 font-semibold">{totals?.calories} kcal</Text>
                            <Text className="text-green-500 font-semibold">{totals?.protein}g protein</Text>
                            <Text className="text-yellow-500 font-semibold">{totals?.carbs}g carbs</Text>
                            <Text className="text-blue-500 font-semibold">{totals?.fats}g fat</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default FoodLoggingTrackerCard;
