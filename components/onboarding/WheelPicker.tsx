import React from "react";
import { Text, View } from "react-native";
import SmoothPicker from "react-native-smooth-picker";

interface WheelPickerProps {
  data: number[];
  value: number;
  onChange: (value: number) => void;
  itemHeight?: number;
  width?: number;
}

/** Vertical number wheel with a highlighted centre row. */
export function WheelPicker({
  data,
  value,
  onChange,
  itemHeight = 64,
  width = 160,
}: WheelPickerProps) {
  const initialIndex = Math.max(
    0,
    data.findIndex((item) => item === value)
  );

  return (
    <View className="items-center justify-center">
      <View
        pointerEvents="none"
        className="absolute rounded-2xl border-2 border-primary bg-primary/5"
        style={{ width, height: itemHeight }}
      />

      <SmoothPicker
        initialScrollToIndex={initialIndex}
        onScrollToIndexFailed={() => {}}
        keyExtractor={(item: number) => item.toString()}
        data={data}
        scrollAnimation
        onSelected={({ item }: { item: number }) => onChange(item)}
        renderItem={({ item }: { item: number }) => (
          <View className="items-center justify-center" style={{ height: itemHeight }}>
            <Text
              className={
                item === value
                  ? "font-display-bold text-3xl text-foreground"
                  : "font-body-semibold text-xl text-muted-foreground"
              }
            >
              {item}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        selectOnPress
        bounces
        decelerationRate="normal"
        style={{ width }}
      />
    </View>
  );
}
