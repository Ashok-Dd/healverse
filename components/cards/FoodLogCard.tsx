import NutrientBadge from "@/components/ui/NutritionBadge";
import { parseServerTime } from "@/lib/day";
import { calculateTotals } from "@/lib/utils";
import { FoodItem } from "@/types/type";
import { MealPhoto } from "@/components/ui/MealPhoto";
import React, { memo } from "react";
import { Text, View } from "react-native";

interface FoodLogCardProps {
    foodLog: any;
}

const FoodLogCard = memo(({ foodLog }: FoodLogCardProps) => {
    const totals = calculateTotals(foodLog.items as FoodItem[]);

    return (
        <View className="p-3 rounded-xl items-center min-w-[310px] gap-3 mr-3 flex-row">
            <MealPhoto
                logId={foodLog.id}
                imageUrl={foodLog.imageUrl}
                className="w-[72px] h-[72px] rounded-xl"
            />

            <View className="flex-1 gap-1">
                <Text className="text-foreground text-base font-body-semibold" numberOfLines={1}>
                    {foodLog.mealName || `${foodLog.mealType || 'Meal'}`}
                </Text>
                <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                    {parseServerTime(foodLog.loggedAt).toLocaleString()}
                </Text>

                {/* Wraps onto a second row instead of running past the card edge. */}
                <View className="flex-row flex-wrap gap-1">
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
                        value={totals.fat}
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
