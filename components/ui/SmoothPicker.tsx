import React, { useRef, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    NativeSyntheticEvent,
    NativeScrollEvent
} from 'react-native';
import { ITEM_HEIGHT, PICKER_HEIGHT } from '@/constants/exercise';

interface SmoothPickerProps<T> {
    title: string;
    data: T[];
    selectedValue: T;
    onValueChange: (value: T) => void;
    renderLabel: (item: T, isSelected: boolean) => string;
    keyExtractor: (item: T) => string;
    containerClassName?: string;
}

export function SmoothPicker<T>({
    title,
    data,
    selectedValue,
    onValueChange,
    renderLabel,
    keyExtractor,
    containerClassName = "flex-1"
}: SmoothPickerProps<T>) {
    const scrollRef = useRef<FlatList | null>(null);

    const handleScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            const index = Math.round(offsetY / ITEM_HEIGHT);
            const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
            const newValue = data[clampedIndex];

            if (newValue && newValue !== selectedValue) {
                onValueChange(newValue);
            }
        },
        [selectedValue, data, onValueChange]
    );

    const renderItem = ({ item, index }: { item: T; index: number }) => {
        const isSelected = item === selectedValue;
        return (
            <TouchableOpacity
                style={{ height: ITEM_HEIGHT }}
                className="items-center justify-center px-2"
                onPress={() => {
                    onValueChange(item);
                    scrollRef.current?.scrollToIndex({
                        index,
                        animated: true,
                    });
                }}
            >
                <Text
                    className={`${
                        isSelected
                            ? "text-blue-600 text-sm font-semibold"
                            : "text-gray-400 text-xs"
                    }`}
                >
                    {renderLabel(item, isSelected)}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View className={containerClassName}>
            <Text className="text-sm font-medium text-gray-700 mb-3 text-center">
                {title}
            </Text>
            <View style={{ height: PICKER_HEIGHT }} className="relative">
                <FlatList
                    ref={scrollRef}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    contentContainerStyle={{
                        paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 3,
                    }}
                    onMomentumScrollEnd={handleScroll}
                    getItemLayout={(_, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                />
            </View>
        </View>
    );
}
