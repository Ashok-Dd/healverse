import React, { useCallback, useMemo, useRef } from "react";
import { FlatList, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

const STEP_WIDTH = 2;
const STEP_GAP = 8;
const PITCH = STEP_WIDTH + STEP_GAP;
/** Every tenth tick is long. */
const LONG_EVERY = 10;

interface RulerProps {
  width: number;
  height: number;
  min: number;
  max: number;
  step: number;
  /** Read once, when the ruler mounts. To start from another value, change `key`. */
  initialValue: number;
  fractionDigits: number;
  shortTickColor: string;
  longTickColor: string;
  indicatorColor: string;
  /** Called each time the tick under the indicator changes. */
  onChange: (value: number) => void;
}

interface TickProps {
  isLong: boolean;
  height: number;
  shortTickColor: string;
  longTickColor: string;
}

const Tick = React.memo(function Tick({ isLong, height, shortTickColor, longTickColor }: TickProps) {
  const tickHeight = isLong ? height * 0.5 : height * 0.25;
  return (
    <View style={{ width: PITCH, height, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: STEP_WIDTH,
          height: tickHeight,
          backgroundColor: isLong ? longTickColor : shortTickColor,
        }}
      />
    </View>
  );
});

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as unknown as typeof FlatList;

/**
 * Horizontal ruler. The scroll is tracked on the UI thread and JavaScript only hears about it when
 * the tick under the indicator changes. Only the ticks near the screen are rendered, and snapping
 * uses one interval instead of an offset per tick, so long ranges (30-250 kg in 0.1 steps) stay smooth.
 */
export function Ruler({
  width,
  height,
  min,
  max,
  step,
  initialValue,
  fractionDigits,
  shortTickColor,
  longTickColor,
  indicatorColor,
  onChange,
}: RulerProps) {
  const count = Math.round((max - min) / step) + 1;
  const ticks = useMemo(() => Array.from({ length: count }, (_, index) => index), [count]);
  const initialIndex = useRef(
    Math.min(Math.max(Math.round((initialValue - min) / step), 0), count - 1)
  ).current;
  const lastIndex = useSharedValue(initialIndex);

  const emit = useCallback(
    (index: number) => onChange(Number((min + index * step).toFixed(fractionDigits))),
    [onChange, min, step, fractionDigits]
  );

  const scrollHandler = useAnimatedScrollHandler((event) => {
    const index = Math.min(Math.max(Math.round(event.contentOffset.x / PITCH), 0), count - 1);
    if (index !== lastIndex.value) {
      lastIndex.value = index;
      runOnJS(emit)(index);
    }
  });

  const renderItem = useCallback(
    ({ index }: { index: number }) => (
      <Tick
        isLong={index % LONG_EVERY === 0}
        height={height}
        shortTickColor={shortTickColor}
        longTickColor={longTickColor}
      />
    ),
    [height, shortTickColor, longTickColor]
  );

  return (
    <View style={{ width, height }}>
      <AnimatedFlatList
        data={ticks}
        keyExtractor={(index: number) => index.toString()}
        renderItem={renderItem}
        getItemLayout={(_, index) => ({ length: PITCH, offset: PITCH * index, index })}
        initialScrollIndex={initialIndex}
        horizontal
        snapToInterval={PITCH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (width - PITCH) / 2 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={Math.ceil(width / PITCH) + 4}
        windowSize={5}
        maxToRenderPerBatch={30}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: (width - STEP_WIDTH) / 2,
          top: height * 0.1,
          width: STEP_WIDTH,
          height: height * 0.8,
          backgroundColor: indicatorColor,
        }}
      />
    </View>
  );
}
