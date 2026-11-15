import { healthQueries } from "@/constants/data";
import type { HealthQuery } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

const HealthQueryCard = memo(function HealthQueryCard({
  query,
  width,
  onPress,
}: {
  query: HealthQuery;
  width: number;
  onPress: (text: string) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(query.description)}
      accessibilityRole="button"
      accessibilityLabel={`Ask: ${query.description}`}
      className="mr-3 min-h-[56px] flex-row items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 active:opacity-80"
      style={{ width }}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${query.color}22` }}
      >
        <Ionicons name={query.icon as any} size={18} color={query.color} />
      </View>
      <Text className="flex-1 font-body text-sm text-foreground" numberOfLines={2}>
        {query.description}
      </Text>
    </Pressable>
  );
});

/** Horizontal list of suggested questions; tapping one fills the input box. */
const HealthQueriesHorizontalScroll = ({
  handleQuerySelect,
}: {
  handleQuerySelect: (text: string) => void;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth * 0.78;

  return (
    <View className="mb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4"
        snapToInterval={cardWidth + 12}
        decelerationRate="fast"
        snapToAlignment="start"
        keyboardShouldPersistTaps="handled"
      >
        {healthQueries.map((query) => (
          <HealthQueryCard
            key={query.id}
            query={query}
            width={cardWidth}
            onPress={handleQuerySelect}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default memo(HealthQueriesHorizontalScroll);
