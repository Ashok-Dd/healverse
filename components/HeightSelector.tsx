import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { RulerPicker } from 'react-native-ruler-picker';
import { HeightSelectorProps } from '@/types/type';

function cmToFeetInches(cm: number): number {
    // convert cm to feet with decimals (e.g., 5.9)
    return +(cm / 30.48).toFixed(1);
}

function feetToCm(feet: number): number {
    // convert feet.decimal to cm
    return Math.round(feet * 30.48);
}

function formatFtInches(value: number): string {
    const feet = Math.floor(value);
    const inches = Math.round((value - feet) * 12);
    return `${feet}' ${inches}"`;
}

const HeightSelector: React.FC<HeightSelectorProps> = ({
                                                           onHeightChange,
                                                           initialHeight = 170,
                                                           initialUnit = 'cm',
                                                           gender = 'male',
                                                           maleAvatarSource,
                                                           femaleAvatarSource,
                                                       }) => {
    const [selectedUnit, setSelectedUnit] = useState<'cm' | 'ft'>(initialUnit);
    // Store height in cm internally for accuracy
    const [cmHeight, setCmHeight] = useState(
        initialUnit === 'cm' ? initialHeight : feetToCm(initialHeight)
    );

    // Change units cleanly
    const handleUnitChange = useCallback((unit: 'cm' | 'ft') => {
        if (unit === selectedUnit) return;
        setSelectedUnit(unit);
        const emitValue = unit === 'cm' ? cmHeight : cmToFeetInches(cmHeight);
        onHeightChange?.(emitValue, unit);
    }, [selectedUnit, cmHeight, onHeightChange]);

    // When ruler/scale changes
    const handleRulerChange = useCallback((value: string) => {
        let numericValue = parseFloat(value);
        let updatedCm = selectedUnit === 'cm' ? numericValue : feetToCm(numericValue);
        setCmHeight(updatedCm);
        const emitValue = selectedUnit === 'cm' ? updatedCm : cmToFeetInches(updatedCm);
        onHeightChange?.(emitValue, selectedUnit);
    }, [selectedUnit, onHeightChange]);

    // CM value and ft/inches value
    const displayCm = cmHeight;
    const displayFt = cmToFeetInches(cmHeight);

    // Configure the ruler/scale
    const rulerConfig =
        selectedUnit === 'cm'
            ? { min: 100, max: 250, step: 1, value: displayCm }
            : { min: 3.0, max: 8.5, step: 0.1, value: parseFloat(displayFt.toFixed(1)) };

    // Ruler width/height
    const RULER_HEIGHT = 300;
    const RULER_WIDTH = 600;

    // Render
    return (
        <View className="flex-1  relative bg-transparent" style={{ flexDirection: 'column', justifyContent: 'center' }}>
            {/* Toggle */}
            <View className="flex-row justify-center mb-4 mt-2">
                <TouchableOpacity
                    onPress={() => handleUnitChange('cm')}
                    style={{
                        backgroundColor: selectedUnit === 'cm' ? '#10B981' : undefined,
                        borderRadius: 18,
                        paddingHorizontal: 18,
                        paddingVertical: 6,
                        marginRight: 4,
                    }}
                >
                    <Text style={{
                        color: selectedUnit === 'cm' ? 'white' : '#374151',
                        fontWeight: 'bold',
                    }}>
                        cm
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleUnitChange('ft')}
                    style={{
                        backgroundColor: selectedUnit === 'ft' ? '#2563eb' : undefined,
                        borderRadius: 18,
                        paddingHorizontal: 18,
                        paddingVertical: 6,
                        marginLeft: 4,
                    }}
                >
                    <Text style={{
                        color: selectedUnit === 'ft' ? 'white' : '#374151',
                        fontWeight: 'bold',
                    }}>
                        ft
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Central value display */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 42, fontWeight: '700', color: '#222F4A', marginBottom: 6 }}>
                    {selectedUnit === 'cm'
                        ? `${Math.round(displayCm)} cm`
                        : formatFtInches(displayFt)
                    }
                </Text>
                <Text style={{ color: '#6B7280' }}>
                    {selectedUnit === 'cm' ? 'Centimeters' : 'Feet & Inches'}
                </Text>
            </View>

            {/* Avatar & Scale */}
            <View className={" mt-10"}  style={{ flexDirection: 'row', position : "relative", flex: 1, alignItems: 'center'}}>
                {/* Avatar on left */}
                <View style={{ flex: 1, alignItems: 'center' }} >
                    {(maleAvatarSource || femaleAvatarSource) && (
                        <Image
                            source={gender === 'male' ? maleAvatarSource : femaleAvatarSource}
                            style={{
                                width: 300,
                                height: 300,
                                resizeMode: 'contain',
                            }}
                        />
                    )}
                </View>


            </View>

            {/* Vertical SCALE/RULER on right */}
            <View
                nativeID={"asdasd"}
                style={{
                    // width: RULER_WIDTH,
                    // height: RULER_HEIGHT,
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ rotate: '-90deg' }],
                }}
                className={"absolute -z-10  transform-cpu top-0 "}
            >
                <RulerPicker
                    min={rulerConfig.min}
                    max={rulerConfig.max}
                    step={rulerConfig.step}
                    fractionDigits={selectedUnit === 'ft' ? 1 : 0}
                    initialValue={rulerConfig.value}
                    onValueChange={handleRulerChange}
                    onValueChangeEnd={handleRulerChange}
                    height={RULER_HEIGHT}
                    width={RULER_WIDTH}
                    indicatorColor="#10B981"
                    indicatorHeight={200}
                    valueTextStyle={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#374151',
                        // @ts-ignore
                        opacity: 0,
                    }}
                    shortStepHeight={40}
                    longStepHeight={120}
                    unitTextStyle={{
                        // @ts-ignore
                        opacity : 0
                    }}
                />
            </View>

        </View>
    );
};

export default HeightSelector;
