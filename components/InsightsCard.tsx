import { useInsights } from "@/lib/tanstack";
import { Insight, InsightType } from "@/types/type";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface InsightsCardProps {
  type: "health" | "diet" | "medication";
  title?: string;
  showIcon?: boolean;
  maxItems?: number;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ 
  type, 
  title, 
  showIcon = true, 
  maxItems = 5 
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
          icon: "heart",
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-100",
          emoji: "❤️"
        };
      case "diet":
        return {
          icon: "restaurant",
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-100",
          emoji: "🥗"
        };
      case "medication":
        return {
          icon: "local-pharmacy",
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-100",
          emoji: "💊"
        };
      default:
        return {
          icon: "info",
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-100",
          emoji: "ℹ️"
        };
    }
  };

  // Get insight type styling
  const getInsightTypeStyle = (insightType: InsightType) => {
    switch (insightType) {
      case "SUGGESTION":
        return {
          icon: "lightbulb-outline",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200"
        };
      case "BETTER":
        return {
          icon: "trending-up",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      case "WARNING":
        return {
          icon: "warning",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200"
        };
      case "INFO":
        return {
          icon: "info-outline",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200"
        };
      default:
        return {
          icon: "info-outline",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
    }
  };

  const insights = getInsights().slice(0, maxItems);
  const typeConfig = getTypeConfig();
  const displayTitle = title || `${type.charAt(0).toUpperCase() + type.slice(1)} Insights`;

  if (isLoading) {
    return (
      <View className={`bg-white rounded-xl p-4 mx-1 mb-4 shadow-sm ${typeConfig.borderColor} border`}>
        <View className="flex-row items-center mb-3">
          {showIcon && (
            <View className={`w-8 h-8 ${typeConfig.bgColor} rounded-full flex-center mr-3`}>
              <Text className="text-sm">{typeConfig.emoji}</Text>
            </View>
          )}
          <Text className="text-lg font-semibold text-gray-800 flex-1">{displayTitle}</Text>
        </View>
        <View className="flex-center py-8">
          <ActivityIndicator size="small" color="#6B7280" />
          <Text className="text-gray-500 text-sm mt-2">Loading insights...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`bg-white rounded-xl p-4 mx-1 mb-4 shadow-sm ${typeConfig.borderColor} border`}>
        <View className="flex-row items-center mb-3">
          {showIcon && (
            <View className={`w-8 h-8 ${typeConfig.bgColor} rounded-full flex-center mr-3`}>
              <Text className="text-sm">{typeConfig.emoji}</Text>
            </View>
          )}
          <Text className="text-lg font-semibold text-gray-800 flex-1">{displayTitle}</Text>
        </View>
        <View className="flex-center py-4">
          <Feather name="alert-circle" size={24} color="#EF4444" />
          <Text className="text-gray-500 text-sm mt-2 text-center">
            Unable to load insights
          </Text>
        </View>
      </View>
    );
  }

  if (insights.length === 0) {
    return (
      <View className={`bg-white rounded-xl p-4 mx-1 mb-4 shadow-sm ${typeConfig.borderColor} border`}>
        <View className="flex-row items-center mb-3">
          {showIcon && (
            <View className={`w-8 h-8 ${typeConfig.bgColor} rounded-full flex-center mr-3`}>
              <Text className="text-sm">{typeConfig.emoji}</Text>
            </View>
          )}
          <Text className="text-lg font-semibold text-gray-800 flex-1">{displayTitle}</Text>
        </View>
        <View className="flex-center py-6">
          <Feather name="smile" size={24} color="#9CA3AF" />
          <Text className="text-gray-500 text-sm mt-2 text-center">
            No insights available at the moment
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`bg-white rounded-xl p-4 mx-1 mb-4 shadow-sm ${typeConfig.borderColor} border`}>
      {/* Header */}
      <View className="flex-row items-center mb-4">
        {showIcon && (
          <View className={`w-8 h-8 ${typeConfig.bgColor} rounded-full flex-center mr-3`}>
            <Text className="text-sm">{typeConfig.emoji}</Text>
          </View>
        )}
        <Text className="text-lg font-semibold text-gray-800 flex-1">{displayTitle}</Text>
        <View className={`px-2 py-1 ${typeConfig.bgColor} rounded-full`}>
          <Text className={`text-xs font-medium ${typeConfig.color}`}>
            {insights.length} tip{insights.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Insights List */}
      <View className="space-y-3">
        {insights.map((insight, index) => {
          const insightStyle = getInsightTypeStyle(insight.type);
          
          return (
            <View 
              key={index} 
              className={`p-3 rounded-lg ${insightStyle.bgColor} ${insightStyle.borderColor} border-l-4`}
            >
              <View className="flex-row items-start">
                <View className="mr-3 mt-0.5">
                  <MaterialIcons 
                    name={insightStyle.icon as any} 
                    size={16} 
                    color={insightStyle.color.includes('yellow') ? '#D97706' : 
                           insightStyle.color.includes('green') ? '#059669' :
                           insightStyle.color.includes('orange') ? '#EA580C' :
                           insightStyle.color.includes('blue') ? '#2563EB' : '#6B7280'} 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-800 leading-relaxed">
                    {insight.content}
                  </Text>
                  <View className="mt-1">
                    <Text className={`text-xs font-medium capitalize ${insightStyle.color}`}>
                      {insight.type.toLowerCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer - Show if there are more insights */}
      {data && getInsights().length > maxItems && (
        <View className="mt-4 pt-3 border-t border-gray-100">
          <Text className="text-center text-xs text-gray-500">
            +{getInsights().length - maxItems} more insight{getInsights().length - maxItems !== 1 ? 's' : ''} available
          </Text>
        </View>
      )}
    </View>
  );
};

export default InsightsCard;
