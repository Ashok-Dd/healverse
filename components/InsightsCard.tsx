import { useInsights } from "@/lib/tanstack";
import { Insight, InsightType } from "@/types/type";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface InsightsCardProps {
  type: "health" | "diet";
  title?: string;
  maxItems?: number;
  onViewAll?: () => void;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ 
  type, 
  title, 
  maxItems = 5,
  onViewAll
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
      default:
        return [];
    }
  };

  // Get icon and title based on type
  const getTypeConfig = () => {
    switch (type) {
      case "health":
        return {
          icon: "heart" as keyof typeof Ionicons.glyphMap,
          title: title || "Health Insights"
        };
      case "diet":
        return {
          icon: "restaurant" as keyof typeof Ionicons.glyphMap,
          title: title || "Diet Insights"
        };
      default:
        return {
          icon: "bulb" as keyof typeof Ionicons.glyphMap,
          title: title || "Insights"
        };
    }
  };

  // Get insight type styling for individual insights
  const getInsightTypeColor = (insightType: InsightType) => {
    switch (insightType) {
      case "SUGGESTION":
        return "bg-blue-100 border-blue-300";
      case "BETTER":
        return "bg-green-100 border-green-300";
      case "WARNING":
        return "bg-orange-100 border-orange-300";
      case "INFO":
        return "bg-gray-100 border-gray-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const insights = getInsights().slice(0, maxItems);
  const typeConfig = getTypeConfig();

  // Loading state matching tracker style
  if (isLoading) {
    return (
      <View>
        <View className="flex flex-row gap-1 items-center mb-2">
          <View className="w-4 h-4 bg-gray-200 rounded-full" />
          <View className="w-40 h-4 bg-gray-200 rounded" />
        </View>
        <View className="bg-gray-100 rounded-xl p-4">
          <ActivityIndicator size="small" color="#9CA3AF" />
          <Text className="text-gray-500 text-sm mt-2 text-center">Loading insights...</Text>
        </View>
      </View>
    );
  }

  // Error or empty state
  if (error || insights.length === 0) {
    return (
      <View>
        <View className="flex flex-row gap-1 items-center mb-2">
          <Ionicons name={typeConfig.icon} size={16} />
          <Text className="text-font-semibold">{typeConfig.title}</Text>
        </View>
        <View className="bg-gray-100 rounded-xl p-4">
          <Text className="text-gray-500 text-sm text-center">
            {error ? "Unable to load insights" : "No insights available"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      {/* Header matching tracker style */}
      <View className="flex flex-row justify-between items-center mb-2">
        <View className="flex flex-row gap-1 items-center">
          <Ionicons name={typeConfig.icon} size={16} />
          <Text className="text-font-semibold">{typeConfig.title}</Text>
        </View>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Feather name="arrow-right-circle" size={20} color={"skyblue"} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content in tracker style container */}
      <View className="bg-gray-100 rounded-xl p-4">
        {insights.map((insight, index) => (
          <View 
            key={index} 
            className={`p-3 rounded-lg border-l-4 ${getInsightTypeColor(insight.type)} ${index < insights.length - 1 ? 'mb-3' : ''}`}
          >
            <Text className="text-sm text-gray-800 leading-relaxed">
              {insight.content}
            </Text>
            <Text className="text-xs text-gray-600 mt-1 capitalize">
              {insight.type.toLowerCase()}
            </Text>
          </View>
        ))}
        
        {/* Show count if there are more */}
        {data && getInsights().length > maxItems && (
          <View className="mt-3 pt-3 border-t border-gray-200">
            <Text className="text-xs text-gray-500 text-center">
              +{getInsights().length - maxItems} more insight{getInsights().length - maxItems !== 1 ? 's' : ''} available
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default InsightsCard;
