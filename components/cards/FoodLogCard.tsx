
// FoodLogCard.tsx - Separate component
import Skeleton from "@/components/skeleton/Skeleton";
import NutrientBadge from "@/components/ui/NutritionBadge";
import { calculateTotals } from "@/lib/utils";
import { FoodItem } from "@/types/type";
import React, { memo } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

interface FoodLogCardProps {
    foodLog: any;
    isLoading?: boolean;
    imagePreview?: string;
    mealType?: string;
}

const FoodLogCard = memo(({ foodLog, isLoading = false, imagePreview, mealType }: FoodLogCardProps) => {
    const totals = calculateTotals(foodLog.items as FoodItem[]);

    const renderImageSection = () => {
        if (isLoading && imagePreview) {
            return (
                <View className="h-20 w-20 relative">
                    <Image
                        source={{ uri: imagePreview }}
                        className="w-20 h-20 rounded-lg mb-4"
                        resizeMode="cover"
                    />
                    <ActivityIndicator
                        size="small"
                        color="#22c55e"
                        style={{
                            position: "absolute",
                            top: "40%",
                            left: "40%",
                            transform: [{ translateX: -12 }, { translateY: -12 }],
                            zIndex: 10,
                        } as any}
                    />
                </View>
            );
        }

        if (foodLog.imageUrl) {
            return (
                <Image
                    source={{ uri: foodLog.imageUrl }}
                    className="w-20 h-20 rounded-lg border rounded-xl"
                    resizeMode="cover"
                />
            );
        }

        return (
            <View className="w-20 h-20 rounded-lg bg-gray-200 items-center justify-center">
                <Text className="text-gray-500 text-xs">No Image</Text>
            </View>
        );
    };

    return (
        <View className="p-4 rounded-xl items-center min-w-[310px] gap-4 mr-3 flex-row">
            {renderImageSection()}
            
            <View className="flex-1 gap-2">
                {isLoading ? (
                    <>
                        <Text className="text-black text-base font-semibold">
                            Logging {mealType}...
                        </Text>
                        <Skeleton />
                        <Skeleton />
                    </>
                ) : (
                    <>
                        <Text className="text-black text-base font-semibold">
                            {foodLog.mealName || `${foodLog.mealType || 'Meal'}`}
                        </Text>
                        <Text className="text-xs text-gray-500">
                            {new Date(foodLog.loggedAt).toLocaleString()}
                        </Text>

                        <View className="flex-row items-center gap-1">
                            <NutrientBadge
                                iconName="fire"
                                iconColor="red"
                                value={totals.calories}
                                unit="kcal"
                                textColor="text-red-500"
                            />
                            <NutrientBadge
                                iconName="food-drumstick"
                                iconColor="blue"
                                value={totals.protein}
                                unit="g"
                                textColor="text-blue-600"
                            />
                            <NutrientBadge
                                iconType="Entypo"
                                iconName="drop"
                                iconColor="orange"
                                value={totals.fats}
                                unit="g"
                                textColor="text-orange-400"
                            />
                            <NutrientBadge
                                iconName="leaf"
                                iconColor="green"
                                value={totals.carbs}
                                unit="g"
                                textColor="text-green-600"
                            />
                        </View>
                    </>
                )}
            </View>
        </View>
    );
});

FoodLogCard.displayName = 'FoodLogCard';

export default FoodLogCard;