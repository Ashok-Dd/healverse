import { DailySummary } from "@/types/type";
import React from "react";
import { FlatList, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";



export type NutritionType = "calories" | "protein" | "fat" | "carbs" | "water";

interface NutritionProgressProps {
    data: DailySummary;
    type: NutritionType;
    size?: number;
    strokeWidth?: number;
    showHeader?: boolean;
    showBottomStats?: boolean;
    customColor?: string;
    customTitle?: string;
}

const NutritionProgress: React.FC<NutritionProgressProps> = ({
    data,
    type,
    size = 120,
    strokeWidth = 8,
    showHeader = true,
    showBottomStats = true,
    customColor,
    customTitle,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Get nutrition data based on type
    const getNutritionData = (type: NutritionType) => {

        switch (type) {
            case "calories":
                return {
                    consumed: data.consumedCalories,
                    target: data.targetCalories,
                    remaining: data.remainingCalories,
                    progress: data.caloriesProgress,
                    unit: "kcal",
                    title: "Calories",
                    color: "#ef4444", 
                };
            case "protein":
                return {
                    consumed: data.consumedProtein,
                    target: data.targetProtein,
                    remaining: data.targetProtein - data.consumedProtein,
                    progress: data.proteinProgress,
                    unit: "g",
                    title: "Protein",
                    color: "#3b82f6", // Blue
                };
            case "fat":
                return {
                    consumed: data.consumedFat,
                    target: data.targetFat,
                    remaining: data.targetFat - data.consumedFat,
                    progress: data.fatProgress,
                    unit: "g",
                    title: "Fat",
                    color: "#f59e0b", // Orange/Yellow
                };
            case "carbs":
                return {
                    consumed: data.consumedCarbs,
                    target: data.targetCarbs,
                    remaining: data.targetCarbs - data.consumedCarbs,
                    progress: data.carbsProgress,
                    unit: "g",
                    title: "Carbs",
                    color: "#10b981", // Green
                };
            case "water":
                return {
                    consumed: data.waterConsumedMl,
                    target: data.targetWaterMl,
                    remaining: data.targetWaterMl - data.waterConsumedMl,
                    progress: data.waterProgress,
                    unit: "ml",
                    title: "Water",
                    color: "#06b6d4", // Cyan
                };
            default:
                return {
                    consumed: 0,
                    target: 0,
                    remaining: 0,
                    progress: 0,
                    unit: "",
                    title: "Unknown",
                    color: "#6b7280",
                };
        }
    };

    const nutritionData = getNutritionData(type);
    const progress = Math.min(nutritionData.progress, 100); // Cap at 100%
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Use custom color if provided, otherwise use default
    const progressColor = customColor || nutritionData.color;
    const title = customTitle || nutritionData.title;

    return (
        <View className="items-center justify-center bg-white">
            {/* Header */}
            {showHeader && (
                <Text
                    className="text-sm font-medium mb-2"
                    style={{ color: progressColor }}
                >
                    {title}
                </Text>
            )}

            {/* Circular Progress */}
            <View className="relative items-center  justify-center">
                <Svg width={size} height={size} className="transform -rotate-90">
                    <Defs>
                        <LinearGradient
                            id={`progressGradient-${type}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <Stop offset="0%" stopColor={progressColor} stopOpacity="1" />
                            <Stop offset="100%" stopColor={progressColor} stopOpacity="0.6" />
                        </LinearGradient>
                    </Defs>

                    {/* Background Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#f3f4f6"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />

                    {/* Progress Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={`url(#progressGradient-${type})`}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </Svg>

                {/* Center Content */}
                <View className="absolute items-center justify-center">
                    <Text className="text-2xl font-bold" style={{ color: progressColor }}>
                        {nutritionData.consumed}
                    </Text>
                    <Text className="text-xs text-gray-500">
                        /{nutritionData.target}
                        {nutritionData.unit}
                    </Text>
                </View>
            </View>

            {/* Bottom Stats */}
            {showBottomStats && (
                <View className="mt-3 items-center">
                    <Text className="text-xs text-gray-400">
                        {nutritionData.remaining > 0
                            ? `${nutritionData.remaining}${nutritionData.unit} left`
                            : `${Math.abs(nutritionData.remaining)}${nutritionData.unit
                            } over`}
                    </Text>
                </View>
            )}
        </View>
    );
};

// Updated Grid component with horizontal FlatList
interface NutritionGridProps {
    data: DailySummary;
    types?: NutritionType[];
    size?: number;
    strokeWidth?: number;
    horizontal?: boolean;
    showScrollIndicator?: boolean;
    itemSpacing?: number;
}

const NutritionGrid: React.FC<NutritionGridProps> = ({
    data,
    types = ["calories", "protein", "fat", "carbs"],
    size = 100,
    strokeWidth = 3,
    horizontal = true,
    showScrollIndicator = false,
    itemSpacing = 12,
}) => {
    const renderNutritionItem = ({
        item,
        index,
    }: {
        item: NutritionType;
        index: number;
    }) => (
        <View
            style={{
                marginRight: horizontal
                    ? index === types.length - 1
                        ? 0
                        : itemSpacing
                    : 0,
                marginBottom: !horizontal
                    ? index === types.length - 1
                        ? 0
                        : itemSpacing
                    : 0,
                width: horizontal ? size + 5 : undefined,
            }}
        >
            <NutritionProgress
                data={data}
                type={item}
                size={size}
                strokeWidth={strokeWidth}
            />
        </View>
    );

    return (
        <View className="bg-white py-1">
            <FlatList
                data={types}
                renderItem={renderNutritionItem}
                keyExtractor={(item) => item}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={showScrollIndicator}
                showsVerticalScrollIndicator={showScrollIndicator}
                contentContainerStyle={{
                    paddingHorizontal: horizontal ? 16 : 0,
                    paddingVertical: horizontal ? 0 : 16,
                    alignItems: horizontal ? undefined : "center",
                }}
                // Optional: Enable snap to interval for better UX
                snapToInterval={horizontal ? size + 40 + itemSpacing : undefined}
                decelerationRate={horizontal ? "fast" : "normal"}
            />
        </View>
    );
};

// Example of how to use in your actual app
const YourActualComponent: React.FC = () => {
    const dailySummary: DailySummary = {
        date: "2024-08-10",
        targetCalories: 1662,
        consumedCalories: 0,
        caloriesBurned: 300,
        remainingCalories: 1662,
        targetProtein: 124,
        consumedProtein: 0,
        targetCarbs: 166,
        consumedCarbs: 0,
        targetFat: 55,
        consumedFat: 0,
        waterConsumedMl: 0,
        targetWaterMl: 2000,
        caloriesProgress: 0,
        proteinProgress: 0,
        carbsProgress: 0,
        fatProgress: 0,
        waterProgress: 0,
    };

    return (
        <View className="flex-1 bg-gray-50 p-4">
            {/* Horizontal scroll nutrition grid */}
            <NutritionGrid
                data={dailySummary}
                types={["calories", "protein", "fat", "carbs"]}
                size={90}
                horizontal={true}
                showScrollIndicator={false}
                itemSpacing={16}
            />
        </View>
    );
};

// Example usage component for demonstration
const NutritionProgressExamples: React.FC = () => {
    // Sample data - matches your image design
    const sampleData: DailySummary = {
        date: "2024-03-15",
        targetCalories: 1662,
        consumedCalories: 0,
        caloriesBurned: 300,
        remainingCalories: 1662,
        targetProtein: 124,
        consumedProtein: 0,
        targetCarbs: 166,
        consumedCarbs: 0,
        targetFat: 55,
        consumedFat: 0,
        waterConsumedMl: 0,
        targetWaterMl: 2000,
        caloriesProgress: 0,
        proteinProgress: 0,
        carbsProgress: 0,
        fatProgress: 0,
        waterProgress: 0,
    };

    // Realistic sample with progress
    const realisticDailySummary: DailySummary = {
        date: "2024-08-10",
        targetCalories: 2200,
        consumedCalories: 1450,
        caloriesBurned: 350,
        remainingCalories: 750,
        caloriesProgress: 65.9,
        targetProtein: 150,
        consumedProtein: 95,
        proteinProgress: 63.3,
        targetCarbs: 275,
        consumedCarbs: 180,
        carbsProgress: 65.4,
        targetFat: 73,
        consumedFat: 52,
        fatProgress: 71.2,
        targetWaterMl: 2500,
        waterConsumedMl: 1800,
        waterProgress: 72.0,
    };

    return (
        <View className="flex-1 bg-gray-50 p-4">
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Horizontal Nutrition Progress
            </Text>

            {/* Main horizontal scroll - 4 items */}
            <Text className="text-lg font-semibold text-gray-700 mb-4">
                Main Nutrition Overview (Empty State)
            </Text>
            <NutritionGrid
                data={sampleData}
                types={["calories", "protein", "fat", "carbs"]}
                size={90}
                horizontal={true}
                showScrollIndicator={false}
                itemSpacing={16}
            />

            {/* Horizontal with all 5 items including water */}
            <Text className="text-lg font-semibold text-gray-700 mb-4 mt-8">
                Complete Overview (With Progress)
            </Text>
            <NutritionGrid
                data={realisticDailySummary}
                types={["calories", "protein", "fat", "carbs", "water"]}
                size={85}
                horizontal={true}
                showScrollIndicator={false}
                itemSpacing={12}
            />

            {/* Smaller size for more compact view */}
            <Text className="text-lg font-semibold text-gray-700 mb-4 mt-8">
                Compact View
            </Text>
            <NutritionGrid
                data={realisticDailySummary}
                types={["calories", "protein", "fat", "carbs", "water"]}
                size={70}
                horizontal={true}
                showScrollIndicator={false}
                itemSpacing={10}
            />

            {/* Vertical option (if needed) */}
            <Text className="text-lg font-semibold text-gray-700 mb-4 mt-8">
                Vertical Option (if needed)
            </Text>
            <View className="h-64">
                <NutritionGrid
                    data={realisticDailySummary}
                    types={["calories", "protein", "fat", "carbs"]}
                    size={70}
                    horizontal={false}
                    showScrollIndicator={true}
                    itemSpacing={8}
                />
            </View>
        </View>
    );
};


export default NutritionProgress;
export { NutritionGrid, NutritionProgressExamples };

