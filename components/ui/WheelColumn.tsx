import React, { useCallback, useRef } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface WheelColumnProps<T> {
  data: readonly T[];
  /** Read once, when the wheel mounts. To start from another value, change `key`. */
  value: T;
  onChange: (value: T) => void;
  renderLabel: (item: T) => string;
  keyExtractor: (item: T) => string;
  itemHeight?: number;
  /** Rows shown at once. Odd, so the selected row sits in the middle. */
  visibleItems?: number;
  className?: string;
  textClassName?: string;
}

interface RowProps {
  label: string;
  index: number;
  itemHeight: number;
  scrollY: SharedValue<number>;
  textClassName: string;
  onPress: (index: number) => void;
}

/** One row. It fades and shrinks with its distance from the highlight, driven on the UI thread. */
const Row = React.memo(function Row({ label, index, itemHeight, scrollY, textClassName, onPress }: RowProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(scrollY.value / itemHeight - index);
    return {
      opacity: interpolate(distance, [0, 1, 2], [1, 0.5, 0.25], Extrapolation.CLAMP),
      transform: [{ scale: interpolate(distance, [0, 1], [1, 0.8], Extrapolation.CLAMP) }],
    };
  });

  return (
    <Pressable
      onPress={() => onPress(index)}
      accessible={false}
      style={{ height: itemHeight }}
      className="items-center justify-center"
    >
      <Animated.View style={animatedStyle}>
        <Text className={textClassName}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
});

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as unknown as typeof FlatList;

/**
 * Vertical wheel: the row under the highlight is the value. Scrolling is tracked on the UI thread;
 * JavaScript only hears about it when the row under the highlight changes, so the wheel stays
 * smooth. Rows snap to the highlight and tapping a row scrolls it there. The first and last rows
 * can reach the middle because the list is padded by half the wheel.
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
  textClassName = "font-body-bold text-lg text-foreground",
}: WheelColumnProps<T>) {
  const listRef = useRef<FlatList<T>>(null);
  const initialIndex = useRef(
    Math.max(
      0,
      data.findIndex((item) => keyExtractor(item) === keyExtractor(value))
    )
  ).current;
  const scrollY = useSharedValue(initialIndex * itemHeight);
  const lastIndex = useSharedValue(initialIndex);
  const padding = itemHeight * Math.floor(visibleItems / 2);

  const emit = useCallback(
    (index: number) => {
      const item = data[index];
      if (item !== undefined) onChange(item);
    },
    [data, onChange]
  );

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    const index = Math.min(Math.max(Math.round(event.contentOffset.y / itemHeight), 0), data.length - 1);
    if (index !== lastIndex.value) {
      lastIndex.value = index;
      runOnJS(emit)(index);
    }
  });

  const scrollToRow = useCallback(
    (index: number) => listRef.current?.scrollToOffset({ offset: index * itemHeight, animated: true }),
    [itemHeight]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => (
      <Row
        label={renderLabel(item)}
        index={index}
        itemHeight={itemHeight}
        scrollY={scrollY}
        textClassName={textClassName}
        onPress={scrollToRow}
      />
    ),
    [renderLabel, itemHeight, scrollY, textClassName, scrollToRow]
  );

  return (
    <View
      className={className}
      style={{ height: itemHeight * visibleItems }}
      accessible
      accessibilityRole="adjustable"
      accessibilityValue={{ text: renderLabel(value) }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(event) => {
        const step = event.nativeEvent.actionName === "increment" ? 1 : -1;
        scrollToRow(Math.min(Math.max(lastIndex.value + step, 0), data.length - 1));
      }}
    >
      <View
        pointerEvents="none"
        className="absolute inset-x-0 rounded-2xl border-2 border-primary bg-primary/5"
        style={{ top: padding, height: itemHeight }}
      />
      <AnimatedFlatList
        ref={listRef}
        data={data as T[]}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={(_, index) => ({ length: itemHeight, offset: itemHeight * index, index })}
        initialScrollIndex={initialIndex}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: padding }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        windowSize={7}
        initialNumToRender={visibleItems + 2}
      />
    </View>
  );
}
