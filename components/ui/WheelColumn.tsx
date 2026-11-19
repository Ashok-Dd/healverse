import React, { useCallback, useRef } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from "react-native";

interface WheelColumnProps<T> {
  data: readonly T[];
  value: T;
  onChange: (value: T) => void;
  renderLabel: (item: T) => string;
  keyExtractor: (item: T) => string;
  itemHeight?: number;
  /** Rows shown at once. Odd, so the selected row sits in the middle. */
  visibleItems?: number;
  className?: string;
  selectedTextClassName?: string;
  idleTextClassName?: string;
}

/**
 * Vertical wheel: the row under the highlight is the value. The value follows the scroll live, rows
 * snap to the highlight, and tapping a row scrolls it there. First and last rows can reach the
 * middle because the list is padded by half the wheel.
 */
export function WheelColumn<T>({
  data,
  value,
  onChange,
  renderLabel,
  keyExtractor,
  itemHeight = 50,
  visibleItems = 5,
  className = "w-full",
  selectedTextClassName = "font-body-bold text-lg text-foreground",
  idleTextClassName = "font-body text-base text-muted-foreground",
}: WheelColumnProps<T>) {
  const listRef = useRef<FlatList<T>>(null);
  const selectedKey = keyExtractor(value);
  const selectedIndex = Math.max(
    0,
    data.findIndex((item) => keyExtractor(item) === selectedKey)
  );
  const padding = itemHeight * Math.floor(visibleItems / 2);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
      const item = data[Math.min(Math.max(index, 0), data.length - 1)];
      if (item !== undefined && keyExtractor(item) !== selectedKey) onChange(item);
    },
    [data, itemHeight, keyExtractor, onChange, selectedKey]
  );

  return (
    <View className={className} style={{ height: itemHeight * visibleItems }}>
      <View
        pointerEvents="none"
        className="absolute inset-x-0 rounded-2xl border-2 border-primary bg-primary/5"
        style={{ top: padding, height: itemHeight }}
      />
      <FlatList
        ref={listRef}
        data={data}
        extraData={selectedKey}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => listRef.current?.scrollToOffset({ offset: index * itemHeight, animated: true })}
            accessibilityRole="button"
            accessibilityState={{ selected: keyExtractor(item) === selectedKey }}
            style={{ height: itemHeight }}
            className="items-center justify-center"
          >
            <Text
              className={keyExtractor(item) === selectedKey ? selectedTextClassName : idleTextClassName}
            >
              {renderLabel(item)}
            </Text>
          </Pressable>
        )}
        getItemLayout={(_, index) => ({ length: itemHeight, offset: itemHeight * index, index })}
        initialScrollIndex={selectedIndex}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: padding }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      />
    </View>
  );
}
