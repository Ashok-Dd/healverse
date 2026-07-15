// src/components/dashboard/NutritionProgress.tsx
import { CircularProgress } from "@/components/ui/CircularProgress";
import { DailySummary } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";

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

  
  const getNutritionData = (type: NutritionType) => {
    switch (type) {
      case "calories":
        return {
          consumed: data.consumedCalories,
          target: data.targetCalories,
          progress: data.calorieProgress,
          unit: "kcal",
          title: "Calories",
          color: "#ef4444",
        };
      case "protein":
        return {
          consumed: data.consumedProtein,
          target: data.targetProtein,
          progress: data.proteinProgress,
          unit: "g",
          title: "Protein",
          color: "#3b82f6",
        };
      case "fat":
        return {
          consumed: data.consumedFat,
          target: data.targetFat,
          progress: data.fatProgress,
          unit: "g",
          title: "Fat",
          color: "#f59e0b",
        };
      case "carbs":
        return {
          consumed: data.consumedCarbs,
          target: data.targetCarbs,
          progress: data.carbsProgress,
          unit: "g",
          title: "Carbs",
          color: "#10b981",
        };
      case "water":
        return {
          consumed: data.waterConsumedMl,
          target: data.targetWaterMl,
          progress: data.waterProgress,
          unit: "ml",
          title: "Water",
          color: "#06b6d4",
        };
      default:
        return {
          consumed: 0,
          target: 0,
          progress: 0,
          unit: "",
          title: "Unknown",
          color: "#6b7280",
        };
    }
  };

  const { consumed, target, progress, unit, title, color } =
    getNutritionData(type);
  const displayColor = customColor || color;
  const isExceeded = consumed > target;

  return (
    <View className="items-center justify-center bg-white">
      {showHeader && (
        <Text
          className="text-sm font-medium mb-2"
          style={{ color: displayColor }}
        >
          {customTitle || title}
        </Text>
      )}

      <CircularProgress
        progress={progress}
        size={size}
        strokeWidth={strokeWidth}
        progressColor={displayColor}
        showCenterContent={true}
        centerContent={
          <View className="items-center justify-center">
            <View className="flex-row items-center">
              <Text
                className="text-xl font-bold"
                style={{ color: isExceeded ? '#EF4444' : displayColor }}
              >
                {consumed}
              </Text>
              {isExceeded && (
                <Ionicons 
                  name="warning" 
                  size={16} 
                  color="#EF4444" 
                  style={{ marginLeft: 4 }} 
                />
              )}
            </View>
            <Text className="text-xs text-gray-500">
              /{target}{unit}
            </Text>
          </View>
        }
      />

      {showBottomStats && (
        <Text className="mt-2 text-xs text-gray-400">
          {target - consumed > 0
            ? `${target - consumed}${unit} left`
            : `${Math.abs(target - consumed)}${unit} over`}
        </Text>
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

export default NutritionProgress;
export { NutritionGrid };

