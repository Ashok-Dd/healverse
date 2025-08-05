import React, {
    useMemo,
    useCallback,
    memo
} from "react";
import {
    Dimensions,
    TextStyle,
    View,
} from "react-native";
import { RulerPicker } from "react-native-ruler-picker";



// Optimized Weight Scale Component using RulerPicker
const WeightRulerPicker = memo(({
                                    minWeight,
                                    maxWeight,
                                    initialWeight,
                                    unit,
                                    onWeightChange,
                                }: {
    minWeight: number;
    maxWeight: number;
    initialWeight: number;
    unit: "kg" | "lbs";
    onWeightChange: (weight: number) => void;
}) => {
    const screenWidth = useMemo(() => Dimensions.get("window").width, []);

    // Memoize step value based on unit
    const stepValue = useMemo(() => unit === "kg" ? 0.1 : 1, [unit]);

    // Memoize fraction digits based on unit
    const fractionDigits = useMemo(() => unit === "kg" ? 1 : 0, [unit]);

    // Optimized value change handler
    const handleValueChange = useCallback((value: string) => {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            onWeightChange(numericValue);
        }
    }, [onWeightChange]);

    // Memoized text styles
    const valueTextStyle = useMemo((): TextStyle => ({
        color: "#3B82F6",
        fontSize: 48,
        fontWeight: "300",
    }), []);

    const unitTextStyle = useMemo((): TextStyle => ({
        color: "#6B7280",
        fontSize: 24,
        fontWeight: "400",
    }), []);

    return (
        <View className="items-center justify-center  flex-1" style={{ height: 120 }}>
            <RulerPicker
                width={screenWidth}
                height={120}
                min={minWeight}
                max={maxWeight}
                step={stepValue}
                initialValue={initialWeight}
                fractionDigits={fractionDigits}
                unit={unit}
                indicatorHeight={60}
                indicatorColor="#3B82F6"
                shortStepHeight={15}
                longStepHeight={30}
                stepWidth={2}
                gapBetweenSteps={8}
                shortStepColor="#D1D5DB"
                longStepColor="#6B7280"
                valueTextStyle={valueTextStyle}
                unitTextStyle={unitTextStyle}
                decelerationRate="fast"
                onValueChange={handleValueChange}
                onValueChangeEnd={handleValueChange}
            />
        </View>
    );
});

WeightRulerPicker.displayName = "WeightRulerPicker";

export default WeightRulerPicker;