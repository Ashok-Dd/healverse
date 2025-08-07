import { healthQueries } from "@/constants/data";
import { HealthQuery } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const HealthQueryCard: React.FC<{
  query: HealthQuery;
  onPress: (m: string) => void;
}> = ({ query, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-blue-50 rounded-xl mr-4 shadow-sm"
      style={{ width: screenWidth * 0.8 }}
      activeOpacity={0.8}
      onPress={() => onPress(query.description)}
    >
      <View className="p-2">
        {/* Header with icon */}
        <View className="flex-row items-center justify-between">
          <View
            className="w-7 h-7 rounded-xl mr-2 items-center justify-center"
            style={{ backgroundColor: query.color + "15" }}
          >
            <Ionicons name={query.icon as any} size={15} color={query.color} />
          </View>
          {/* Description */}
          <Text className="text-xs truncate text-blue-500 leading-5 flex-1">
            {query.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const LoadMoreCard: React.FC = () => {
  return (
    <TouchableOpacity
      className="bg-indigo-500 rounded-xl"
      style={{ width: screenWidth * 0.8, height: 180 }}
      activeOpacity={0.8}
    >
      <View className="flex-1 items-center justify-center p-4">
        <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mb-3">
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </View>
        <Text className="text-base font-semibold text-white mb-2">
          Load More
        </Text>
        <Text className="text-xs text-white opacity-90 text-center">
          Discover more health topics and AI insights
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const HealthQueriesHorizontalScroll = ({
  handleQuerySelect,
}: {
  handleQuerySelect: (m: string) => void;
}) => {
  return (
    <View className="mb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 0, paddingRight: 16 }}
        snapToInterval={screenWidth * 0.8 + 16}
        decelerationRate="fast"
        snapToAlignment="start"
      >
        {healthQueries.map((query) => (
          <HealthQueryCard
            key={query.id}
            query={query}
            onPress={handleQuerySelect}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HealthQueriesHorizontalScroll;
