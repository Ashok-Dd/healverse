import { useInsights } from "@/lib/tanstack";
import { Insight, InsightType } from "@/types/type";
import { Feather } from "@expo/vector-icons";
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

  console.log("Insights data:", data);

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
          color: "text-red-500",
          bgColor: "bg-red-50",
          emoji: "❤️",
          title: "Health Tips"
        };
      case "diet":
        return {
          color: "text-green-500",
          bgColor: "bg-green-50",
          emoji: "🥗",
          title: "Diet Tips"
        };
      case "medication":
        return {
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          emoji: "💊",
          title: "Medication Tips"
        };
      default:
        return {
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          emoji: "ℹ️",
          title: "Tips"
        };
    }
  };

  // Get insight type icon
  const getInsightIcon = (insightType: InsightType) => {
    switch (insightType) {
      case "SUGGESTION":
        return "💡";
      case "BETTER":
        return "📈";
      case "WARNING":
        return "⚠️";
      case "INFO":
        return "ℹ️";
      default:
        return "💭";
    }
  };

  const insights = getInsights().slice(0, maxItems);
  const typeConfig = getTypeConfig();

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-center py-4">
          <ActivityIndicator size="small" color="#9CA3AF" />
        </View>
      );
    }

    if (error || insights.length === 0) {
      return (
        <View className="flex-center py-3">
          <Text className="text-gray-400 text-xs">No insights available</Text>
        </View>
      );
    }

    return (
      <View className="space-y-2">
        {insights.map((insight, index) => (
          <View key={index} className="flex-row items-start">
            <Text className="text-xs mr-2 mt-0.5">
              {getInsightIcon(insight.type)}
            </Text>
            <Text className="text-xs text-gray-700 leading-relaxed flex-1" numberOfLines={2}>
              {insight.content}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const Component = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { onPress, activeOpacity: 0.7 } : {};

  return (
    <Component 
      className={`${typeConfig.bgColor} rounded-lg p-3 mx-1 mb-2`}
      {...containerProps}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Text className="text-sm mr-2">{typeConfig.emoji}</Text>
          <Text className="text-sm font-medium text-gray-800">{typeConfig.title}</Text>
        </View>
        {onPress && (
          <Feather name="chevron-right" size={14} color="#9CA3AF" />
        )}
      </View>

      {/* Content */}
      {renderContent()}

      {/* Footer - Show count if there are more */}
      {!isLoading && !error && data && getInsights().length > maxItems && (
        <View className="mt-2 pt-2 border-t border-gray-200">
          <Text className="text-xs text-gray-500 text-center">
            +{getInsights().length - maxItems} more
          </Text>
        </View>
      )}
    </Component>
  );
};

export default CompactInsights;
