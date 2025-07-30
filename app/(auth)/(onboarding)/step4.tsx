import OnboardingWrapper from "@/components/OnboardingWrapper";
import React, {useCallback, useMemo, useState, memo, useEffect} from "react";
import { Text , Dimensions , TextStyle , View } from "react-native";
import { RulerPicker } from "react-native-ruler-picker";
import { useUserProfileStore } from "@/store/userProfile";
import BMIIndicator from "@/components/BmiIndicator";
import UnitToggle from "@/components/UnitToggle";
import WeightRulerPicker from "@/components/WeightRulerPicker";



interface WeightRange {
    min: number;
    max: number;
    step: number;
}

// // Optimized Weight Ruler Component
// const WeightRuler = memo<{
//     selectedUnit: "kg" | "lbs";
//     selectedWeight: number;
//     weightRange: WeightRange;
//     onWeightChange: (value: string) => void;
// }>(({ selectedUnit, selectedWeight, weightRange, onWeightChange }) => {
//     const screenWidth = useMemo(() => Dimensions.get("window").width, []);
//
//     // Memoized text styles for better performance
//     const valueTextStyle = useMemo((): TextStyle => ({
//         color: "#3B82F6",
//         fontSize: 56,
//         fontWeight: "300",
//     }), []);
//
//     const unitTextStyle = useMemo((): TextStyle => ({
//         color: "#6B7280",
//         fontSize: 28,
//         fontWeight: "400",
//     }), []);
//
//     return (
//         <View className="flex-1 justify-center">
//             <RulerPicker
//                 width={screenWidth}
//                 height={150}
//                 min={weightRange.min}
//                 max={weightRange.max}
//                 step={weightRange.step}
//                 fractionDigits={selectedUnit === "kg" ? 1 : 0}
//                 initialValue={selectedWeight}
//                 onValueChange={onWeightChange}
//                 onValueChangeEnd={onWeightChange}
//                 unit={selectedUnit}
//                 indicatorColor="#3B82F6"
//                 indicatorHeight={70}
//                 shortStepHeight={20}
//                 longStepHeight={35}
//                 stepWidth={2}
//                 gapBetweenSteps={10}
//                 shortStepColor="#E5E7EB"
//                 longStepColor="#9CA3AF"
//                 valueTextStyle={valueTextStyle}
//                 unitTextStyle={unitTextStyle}
//                 decelerationRate="fast"
//             />
//         </View>
//     );
// });

// Optimized Unit Toggle Component

// Main optimized Step4 Component
const Step4 = memo(() => {
    const [selectedUnit, setSelectedUnit] = useState<"kg" | "lbs">("kg");

    const { currentWeightKg, setCurrentWeightKg } = useUserProfileStore();

    const [selectedWeight , setSelectedWeight] = useState<number>(currentWeightKg);

    // Optimized weight conversion function with memoization
    const convertWeight = useCallback(
        (weight: number, fromUnit: "kg" | "lbs", toUnit: "kg" | "lbs"): number => {
            if (fromUnit === toUnit) return weight;
            if (fromUnit === "kg" && toUnit === "lbs") {
                return Math.round(weight * 2.205 * 10) / 10;
            }
            if (fromUnit === "lbs" && toUnit === "kg") {
                return Math.round((weight / 2.205) * 10) / 10;
            }
            return weight;
        },
        []
    );

    // Memoized weight range calculation
    const weightRange = useMemo((): WeightRange => {
        return selectedUnit === "kg"
            ? { min: 30, max: 150, step: 0.1 }
            : { min: 66, max: 330, step: 0.2 };
    }, [selectedUnit]);

    // Optimized unit change handler
    const handleUnitChange = useCallback(
        (newUnit: "kg" | "lbs") => {
            if (newUnit === selectedUnit) return; // Prevent unnecessary updates

            const convertedWeight = convertWeight(selectedWeight, selectedUnit, newUnit);
            setSelectedUnit(newUnit);
            setSelectedWeight(convertedWeight);
        },
        [selectedWeight, selectedUnit, convertWeight, setSelectedWeight]
    );

    // Optimized weight change handler with validation
    const handleWeightChange = useCallback((value: number) => {
        if (!isNaN(value) && value >= weightRange.min && value <= weightRange.max) {
            setSelectedWeight(value);
        }
    }, [weightRange.min, weightRange.max, setSelectedWeight]);


    // Memoized weight for BMI calculation
    const bmiWeight = useMemo(() => {
        return selectedUnit === "kg"
            ? selectedWeight
            : convertWeight(selectedWeight, "lbs", "kg");
    }, [selectedWeight, selectedUnit, convertWeight]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentWeightKg(selectedWeight);
        }, 100); // 100ms delay

        return () => clearTimeout(timer);
    }, [selectedWeight]);

    return (
        <OnboardingWrapper>
            <View className="flex-1">
                {/* Title */}
                <Text className="text-2xl font-semibold text-center mb-6 text-gray-800">
                    What is your current weight?
                </Text>

                {/* Unit Toggle */}
                <UnitToggle
                    selectedUnit={selectedUnit}
                    onUnitChange={handleUnitChange}
                />

                {/* BMI Display */}
                <BMIIndicator weight={bmiWeight} height={175} />

                {/* Weight Ruler */}
                {/* Weight Ruler */}
                <WeightRulerPicker
                    unit={selectedUnit}
                    initialWeight={selectedWeight}
                    minWeight={weightRange.min}
                    maxWeight={weightRange.max}
                    onWeightChange={handleWeightChange}
                />
            </View>
        </OnboardingWrapper>
    );
});

// Display names for better debugging
Step4.displayName = "Step4"


export default Step4;