import { useInsights } from "@/lib/tanstack";
import { Insight } from "@/types/type";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface CompactInsightsProps {
  type: "health" | "diet" | "medication";
  maxItems?: number;
  onPress?: () => void;
}

const CompactInsights: React.FC<CompactInsightsProps> = ({ 
  type, 
  maxItems = 3,
  onPress
}) => {
  const { data, isLoading, error } = useInsights();

  // Get insights based on type
  const getInsights = (): Insight[] => {
    if (!data) return [];
    
    switch (type) {
      case "health":
        return data.healthInsights || [];
      case "diet":
        return data.dietInsights || [];
      case "medication":
        return data.medicationInsights || [];
      default:
        return [];
    }
  };

  // Get icon and colors based on type
  const getTypeConfig = () => {
    switch (type) {
      case "health":
        return {
          icon: "heart-outline" as keyof typeof Ionicons.glyphMap,
          title: "AI Health Insights"
        };
      case "diet":
        return {
          icon: "restaurant" as keyof typeof Ionicons.glyphMap,
          title: "AI Diet Insights"
        };
      case "medication":
        return {
          icon: "medical" as keyof typeof Ionicons.glyphMap,
          title: "AI Medication Insights"
        };
      default:
        return {
          icon: "bulb" as keyof typeof Ionicons.glyphMap,
          title: "AI Insights"
        };
    }
  };

  const insights = getInsights().slice(0, maxItems);
  const typeConfig = getTypeConfig();

  // If loading, show skeleton matching tracker style
  if (isLoading) {
    return (
      <View>
        <View className="flex flex-row gap-1 items-center mb-2">
          <View className="w-4 h-4 bg-gray-200 rounded-full" />
          <View className="w-32 h-4 bg-gray-200 rounded" />
        </View>
        <View className="bg-gray-100 rounded-xl p-4">
          <ActivityIndicator size="small" color="#9CA3AF" />
        </View>
      </View>
    );
  }

  // If no insights, don't render anything (clean like tracker)
  if (error || insights.length === 0) {
    return null;
  }

  return (
    <View className="my-5">
      {/* Header matching tracker style */}
      <View className="flex flex-row justify-between items-center mb-2">
        <View className="flex flex-row gap-1 items-center">
          <Ionicons name={typeConfig.icon} size={16} />
          <Text className="text-font-semibold">{typeConfig.title}</Text>
        </View>
        {onPress && (
          <TouchableOpacity onPress={onPress}>
            <Feather name="arrow-right-circle" size={20} color={"skyblue"} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content in tracker style container */}
      <View className="bg-gray-100 rounded-xl p-4">
        {insights.map((insight, index) => (
          <View 
            key={index} 
            className={`flex-row items-start ${index < insights.length - 1 ? 'mb-3' : ''}`}
          >
            <View className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3" />
            <Text className="text-sm text-gray-800 leading-relaxed flex-1">
              {insight.content}
            </Text>
          </View>
        ))}
        
        {/* Show count if there are more */}
        {data && getInsights().length > maxItems && (
          <View className="mt-3 pt-3 border-t border-gray-200">
            <Text className="text-xs text-gray-500 text-center">
              +{getInsights().length - maxItems} more insight{getInsights().length - maxItems !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CompactInsights;
