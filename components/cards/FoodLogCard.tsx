import NutrientBadge from "@/components/ui/NutritionBadge";
import { parseServerTime } from "@/lib/day";
import { calculateTotals } from "@/lib/utils";
import { FoodItem } from "@/types/type";
import React, { memo } from "react";
import { Image, Text, View } from "react-native";

interface FoodLogCardProps {
    foodLog: any;
}

const FoodLogCard = memo(({ foodLog }: FoodLogCardProps) => {
    const totals = calculateTotals(foodLog.items as FoodItem[]);

    return (
        <View className="p-4 rounded-xl items-center min-w-[310px] gap-4 mr-3 flex-row">
            {foodLog.imageUrl ? (
                <Image
                    source={{ uri: foodLog.imageUrl }}
                    className="w-20 h-20 rounded-lg border rounded-xl"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-20 h-20 rounded-lg bg-muted items-center justify-center">
                    <Text className="text-muted-foreground text-xs">No Image</Text>
                </View>
            )}

            <View className="flex-1 gap-2">
                <Text className="text-foreground text-base font-body-semibold">
                    {foodLog.mealName || `${foodLog.mealType || 'Meal'}`}
                </Text>
                <Text className="text-xs text-muted-foreground">
                    {parseServerTime(foodLog.loggedAt).toLocaleString()}
                </Text>

                <View className="flex-row items-center gap-1">
                    <NutrientBadge
                        iconName="fire"
                        value={totals.calories}
                        unit="kcal"
                        tone="destructive"
                    />
                    <NutrientBadge
                        iconName="food-drumstick"
                        value={totals.protein}
                        unit="g"
                        tone="info"
                    />
                    <NutrientBadge
                        iconType="Entypo"
                        iconName="drop"
                        value={totals.fats}
                        unit="g"
                        tone="warning"
                    />
                    <NutrientBadge
                        iconName="leaf"
                        value={totals.carbs}
                        unit="g"
                        tone="success"
                    />
                </View>
            </View>
        </View>
    );
});

FoodLogCard.displayName = 'FoodLogCard';

export default FoodLogCard;
