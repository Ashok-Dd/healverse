import React from 'react';
import { View, Text } from 'react-native';
import SmoothPicker from 'react-native-smooth-picker';
import { CustomSmoothPickerProps } from '@/types/type';

const CustomSmoothPicker: React.FC<CustomSmoothPickerProps> = ({
                                                                   data,
                                                                   selectedValue,
                                                                   onValueChange,
                                                                   itemHeight = 60,
                                                                   width = 120,
                                                                   highlightColor = '#3b82f6',
                                                                   highlightBgColor = '#dbeafe',
                                                                   textColor = '#9ca3af',
                                                                   selectedTextColor = '#1f2937',
                                                               }) => {
    const renderItem = (item: string | number, index: number) => {
        const isSelected = item === selectedValue;

        return (
            <View
                className="justify-center items-center"
                style={{ height: itemHeight }}
            >
                <Text
                    className={`text-lg font-jakarta-medium ${
                        isSelected
                            ? 'text-xl font-jakarta-semi-bold'
                            : ''
                    }`}
                    style={{
                        color: isSelected ? selectedTextColor : textColor,
                    }}
                >
                    {item}
                </Text>
            </View>
        );
    };

    const initialIndex = data.findIndex(item => item === selectedValue);

    return (
        <View className="justify-center items-center">
            {/* Selection highlight overlay */}
            <View
                className="absolute rounded-xl border-2"
                style={{
                    width: width,
                    height: itemHeight,
                    borderColor: highlightColor,
                }}
            />

            {/* Picker */}
            <SmoothPicker
                initialScrollToIndex={initialIndex > -1 ? initialIndex : 0}
                onScrollToIndexFailed={() => {}}
                keyExtractor={(item: string | number) => item.toString()}
                data={data}
                scrollAnimation
                onSelected={({ item }: { item: string | number }) => onValueChange(item)}
                renderItem={({ item, index }: { item: string | number; index: number }) =>
                    renderItem(item, index)
                }
                showsVerticalScrollIndicator={false}
                selectOnPress={true}
                bounces={true}
                decelerationRate="normal"
                style={{ width: width }}
            />
        </View>
    );
};

export default CustomSmoothPicker;