import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { AgePickerProps } from '@/types/type';

const AgePicker: React.FC<AgePickerProps> = ({
                                                 minAge = 1,
                                                 maxAge = 100,
                                                 initialAge = 20,
                                                 onAgeChange,
                                             }) => {
    const [selectedAge, setSelectedAge] = useState(initialAge);
    const scrollViewRef = useRef<ScrollView>(null);

    const itemHeight = 60;
    const visibleItemCount = 5;
    const containerHeight = itemHeight * visibleItemCount;

    const ages = Array.from({ length: maxAge - minAge + 1 }, (_, i) => minAge + i);

    useEffect(() => {
        const initialIndex = ages.indexOf(initialAge);
        if (initialIndex !== -1) {
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: initialIndex * itemHeight,
                    animated: false,
                });
            }, 300); // Wait for layout
        }
    }, []);

    const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / itemHeight);

        const snapOffset = index * itemHeight;
        scrollViewRef.current?.scrollTo({
            y: snapOffset,
            animated: true,
        });

        const newAge = ages[index];
        setSelectedAge(newAge);
        onAgeChange?.(newAge);
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / itemHeight);
        const currentAge = ages[index];
        if (currentAge !== selectedAge && currentAge >= minAge && currentAge <= maxAge) {
            setSelectedAge(currentAge);
            onAgeChange?.(currentAge);
        }
    };

    // Render each age, checking if it's selected
    const renderAgeItem = (age: number, index: number) => {
        const isSelected = age === selectedAge;
        return (
            <View
                key={age}
                style={{ height: itemHeight, justifyContent: 'center', alignItems: 'center' }}
            >
                <Text style={{
                    fontSize: 24,
                    fontWeight: isSelected ? '700' : '400',
                    color: isSelected ? '#222F4A' : '#BBB',
                }}>
                    {age}
                </Text>
            </View>
        );
    };

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {/* Picker Container */}
            <View style={{ height: containerHeight, width: 120, position: 'relative' }}>
                {/* The fixed highlight box */}
                <View
                    pointerEvents="none"
                    style={{
                        position: 'absolute',
                        top: (containerHeight - itemHeight) / 2,
                        left: 0,
                        right: 0,
                        height: itemHeight,
                        borderColor: '#339DFF',
                        borderWidth: 2,
                        borderRadius: 12,
                        zIndex: 2,
                        // backgroundColor: 'white', // if you want a background for the box
                    }}
                />
                {/* The picker list */}
                <ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={itemHeight}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{
                        paddingTop: (containerHeight - itemHeight) / 2,
                        paddingBottom: (containerHeight - itemHeight) / 2,
                    }}
                    style={{ flex: 1, zIndex: 1 }}
                >
                    {ages.map(renderAgeItem)}
                </ScrollView>
            </View>
        </View>
    );
};

export default AgePicker;
