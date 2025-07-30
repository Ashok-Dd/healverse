import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { RulerPicker } from 'react-native-ruler-picker';
import { HeightSelectorProps } from '@/types/type';

// Constants
const RULER_HEIGHT = 300;
const RULER_WIDTH = 600;
const MIN_HEIGHT_CM = 100;
const MAX_HEIGHT_CM = 250;
const MIN_HEIGHT_FT = 3.0;
const MAX_HEIGHT_FT = 8.5;
const CM_TO_FEET_RATIO = 30.48;

export function cmToFeet(cm: number): number {
    return +(cm / CM_TO_FEET_RATIO).toFixed(1);
}

export function feetToCm(feet: number): number {
    return Math.round(feet * CM_TO_FEET_RATIO);
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
                                                           gender = 'MALE',
                                                           maleAvatarSource,
                                                           femaleAvatarSource,
                                                       }) => {
    const [selectedUnit, setSelectedUnit] = useState<'cm' | 'ft'>(initialUnit);

    // Store height in cm internally for accuracy
    const [cmHeight, setCmHeight] = useState(() => {
        const height = initialUnit === 'cm' ? initialHeight : feetToCm(initialHeight);
        return height || 170; // Ensure we always have a valid height
    });

    // Key to force RulerPicker re-initialization
    const [rulerKey, setRulerKey] = useState(0);

    // Track if we're programmatically updating to avoid loops
    const isInternalUpdate = useRef(false);
    const hasInitialized = useRef(false);
    const initialHeightRef = useRef(initialHeight);

    // Memoized display values
    const displayCm = cmHeight;
    const displayFt = cmToFeet(cmHeight);

    // Configure the ruler/scale with proper initial value
    const rulerConfig = useMemo(() => {
        if (selectedUnit === 'cm') {
            return {
                min: MIN_HEIGHT_CM,
                max: MAX_HEIGHT_CM,
                step: 1,
                value: displayCm,
                fractionDigits: 0
            };
        } else {
            return {
                min: MIN_HEIGHT_FT,
                max: MAX_HEIGHT_FT,
                step: 0.1,
                value: parseFloat(displayFt.toFixed(1)),
                fractionDigits: 1
            };
        }
    }, [selectedUnit, displayCm, displayFt]);

    // Handle unit change
    const handleUnitChange = useCallback((unit: 'cm' | 'ft') => {
        if (unit === selectedUnit) return;

        setSelectedUnit(unit);

        // Force ruler re-initialization with new unit
        setRulerKey(prev => prev + 1);

        const emitValue = unit === 'cm' ? cmHeight : cmToFeet(cmHeight);
        onHeightChange?.(emitValue, unit);
    }, [selectedUnit, cmHeight, onHeightChange]);

    // Handle ruler value changes
    const handleRulerChange = useCallback((value: string) => {
        if (isInternalUpdate.current) return;

        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return;

        const updatedCm = selectedUnit === 'cm' ? numericValue : feetToCm(numericValue);

        setCmHeight(updatedCm);
        const emitValue = selectedUnit === 'cm' ? updatedCm : cmToFeet(updatedCm);
        onHeightChange?.(emitValue, selectedUnit);
    }, [selectedUnit, onHeightChange]);

    // Handle external prop changes (like from store) - but only once
    useEffect(() => {
        // Only update if this is a significant change from the initial value and we haven't initialized yet
        if (!hasInitialized.current && initialHeight !== initialHeightRef.current) {
            const newCmHeight = initialUnit === 'cm' ? initialHeight : feetToCm(initialHeight);

            if (newCmHeight && Math.abs(newCmHeight - cmHeight) > 1) {
                isInternalUpdate.current = true;
                setCmHeight(newCmHeight);
                initialHeightRef.current = initialHeight;

                // Force ruler re-initialization with new value
                setRulerKey(prev => prev + 1);

                setTimeout(() => {
                    isInternalUpdate.current = false;
                }, 100);
            }
        }
    }, [initialHeight, initialUnit, cmHeight]);

    // Initialize ruler on first render - with a more stable approach
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;

            // Ensure we have a valid initial height
            if (cmHeight >= MIN_HEIGHT_CM && cmHeight <= MAX_HEIGHT_CM) {
                // Small delay to ensure proper initialization
                setTimeout(() => {
                    setRulerKey(prev => prev + 1);
                }, 100);
            }
        }
    }, [cmHeight]);

    return (
        <View style={{
            flex: 1,
            position: 'relative',
            backgroundColor: 'transparent',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            {/* Unit Toggle */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 16,
                marginTop: 8
            }}>
                <TouchableOpacity
                    onPress={() => handleUnitChange('cm')}
                    style={{
                        backgroundColor: selectedUnit === 'cm' ? '#10B981' : undefined,
                        borderRadius: 18,
                        paddingHorizontal: 18,
                        paddingVertical: 6,
                        marginRight: 4,
                    }}
                    activeOpacity={0.7}
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
                    activeOpacity={0.7}
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
                <Text style={{
                    fontSize: 42,
                    fontWeight: '700',
                    color: '#222F4A',
                    marginBottom: 6
                }}>
                    {selectedUnit === 'cm'
                        ? `${Math.round(displayCm)} cm`
                        : formatFtInches(displayFt)
                    }
                </Text>
                <Text style={{ color: '#6B7280', fontSize: 16 }}>
                    {selectedUnit === 'cm' ? 'Centimeters' : 'Feet & Inches'}
                </Text>
            </View>

            {/* Avatar & Scale */}
            <View style={{
                marginTop: 80,
                flexDirection: 'row',
                position: 'relative',
                flex: 1,
                alignItems: 'center'
            }}>
                {/* Avatar on left */}
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {(maleAvatarSource || femaleAvatarSource) && (
                        <Image
                            source={gender === 'MALE' ? maleAvatarSource : femaleAvatarSource}
                            style={{
                                width: 300,
                                height: 300,
                                resizeMode: 'contain',
                            }}
                        />
                    )}
                </View>
            </View>

            {/* Vertical SCALE/RULER */}
            <View
                style={{
                    position: 'absolute',
                    right: "-50%",
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ rotate: '-90deg' }],
                    zIndex: -1,

                }}
            >
                <RulerPicker
                    key={`ruler-${rulerKey}-${selectedUnit}`} // Force re-mount on changes
                    min={rulerConfig.min}
                    max={rulerConfig.max}
                    step={rulerConfig.step}
                    fractionDigits={rulerConfig.fractionDigits}
                    initialValue={rulerConfig.value}
                    onValueChange={handleRulerChange}
                    onValueChangeEnd={handleRulerChange}
                    height={RULER_HEIGHT}
                    width={RULER_WIDTH}
                    indicatorColor={selectedUnit === 'cm' ? '#10B981' : '#2563eb'}
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
                        opacity: 0
                    }}
                />
            </View>
        </View>
    );
};

export default HeightSelector;