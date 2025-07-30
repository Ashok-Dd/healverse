import OnboardingWrapper from "@/components/OnboardingWrapper";
import { convertWeight } from "@/lib/utils";
import React, {
    useState,
    useMemo,
    useCallback,
    memo, useEffect
} from "react";
import {
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import BMIIndicator from "@/components/BmiIndicator";
import WeightRulerPicker from "@/components/WeightRulerPicker";
import WeightValidation from "@/components/WeightValidation";
import UnitToggle from "@/components/UnitToggle";
import {useUserProfileStore} from "@/store/userProfile";




const Step2 = memo(() => {
    const [selectedUnit, setSelectedUnit] = useState<"kg" | "lbs">("kg");

    const { targetWeightKg , setTargetWeightKg  , heightCm : userHeight } = useUserProfileStore();

    const [targetWeight, setTargetWeight] = useState<number>(targetWeightKg);


    // Memoize unit change handler
    const handleUnitChange = useCallback((newUnit: "kg" | "lbs") => {
        const convertedWeight = convertWeight(targetWeight, selectedUnit, newUnit);
        setSelectedUnit(newUnit);
        setTargetWeight(convertedWeight);
    }, [targetWeight, selectedUnit]);

    // Memoize weight change handler
    const handleWeightChange = useCallback((weight: number) => {
        setTargetWeight(weight);
    }, []);

    // Memoize weight range calculation
    const weightRange = useMemo(() => {
        return selectedUnit === "kg"
            ? { min: 30, max: 150, initial: 56 }
            : { min: 66, max: 330, initial: 123 };
    }, [selectedUnit]);

    // Memoize weight for BMI calculation
    const weightForBMI = useMemo(() => {
        return selectedUnit === "kg"
            ? targetWeight
            : convertWeight(targetWeight, "lbs", "kg");
    }, [targetWeight, selectedUnit]);

    // // Memoize display weight calculation
    // const displayWeight = useMemo(() => {
    //     return selectedUnit === "kg"
    //         ? targetWeight.toFixed(1)
    //         : Math.round(targetWeight).toString();
    // }, [targetWeight, selectedUnit]);
    //
    // // Unit button styles
    // const getUnitButtonStyle = useCallback((isSelected: boolean): ViewStyle => ({
    //     paddingHorizontal: 24,
    //     paddingVertical: 8,
    //     backgroundColor: isSelected ? "#10B981" : "transparent",
    // }), []);
    //
    // const getUnitTextStyle = useCallback((isSelected: boolean): TextStyle => ({
    //     fontWeight: "600" as const,
    //     color: isSelected ? "#FFFFFF" : "#6B7280",
    // }), []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTargetWeightKg(targetWeight);
        }, 100); // 100ms delay

        return () => clearTimeout(timer);
    }, [targetWeight]);

    return (
        <OnboardingWrapper>
            <View className="flex-1 px-4">
                <Text className="text-2xl font-semibold text-center mb-8 text-gray-800">
                    What is your target weight?
                </Text>


                <UnitToggle selectedUnit={selectedUnit}   onUnitChange={handleUnitChange}/>

                <WeightValidation
                    weight={weightForBMI}
                    height={userHeight}
                    unit={selectedUnit}
                />

                <BMIIndicator
                    height={userHeight}
                    weight={weightForBMI}
                />

                <View className="items-center mb-8">
                    <Text className="text-sm text-gray-500 mb-4">
                        Drag the scale below to adjust
                    </Text>
                </View>

                <WeightRulerPicker
                    minWeight={weightRange.min}
                    maxWeight={weightRange.max}
                    initialWeight={targetWeight}
                    unit={selectedUnit}
                    onWeightChange={handleWeightChange}
                />
            </View>
        </OnboardingWrapper>
    );
});

Step2.displayName = "Step2";

export default Step2;