import React, {memo, useMemo} from "react";
import {Text, View} from "react-native";


const WeightValidation = memo(({
                                   weight,
                                   height = 165,
                                   unit,
                               }: {
    weight: number;
    height?: number;
    unit: "kg" | "lbs";
}) => {

    const validationData = useMemo(() => {
        const bmi = weight / (height / 100) ** 2;
        const minHealthyWeight = Math.round(18.5 * (height / 100) ** 2);
        const maxHealthyWeight = Math.round(25 * (height / 100) ** 2);

        const isHealthy = bmi >= 18.5 && bmi <= 25;
        const isTooLow = bmi < 18.5;

        return { isHealthy, isTooLow, minHealthyWeight, maxHealthyWeight };
    }, [weight, height]);

    if (validationData.isHealthy) {
        return (
            <View className="bg-green-100 rounded-xl p-4 mb-6 flex-row items-start">
                <View className="mr-3 mt-1">
                    <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center">
                        <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                </View>
                <View className="flex-1">
                    <Text className="text-green-700 font-semibold text-base mb-1">
                        Great target weight!
                    </Text>
                    <Text className="text-green-600 text-sm leading-5">
                        This weight is within the healthy range for your height
                    </Text>
                </View>
            </View>
        );
    }

    if (validationData.isTooLow) {
        return (
            <View className="bg-blue-100 rounded-xl p-4 mb-6 flex-row items-start">
                <View className="mr-3 mt-1">
                    <View className="bg-blue-500 rounded-full w-6 h-6 items-center justify-center">
                        <Text className="text-white text-xs font-bold">i</Text>
                    </View>
                    <View className="absolute -top-1 -right-1">
                        <Text className="text-xs">✨</Text>
                    </View>
                </View>
                <View className="flex-1">
                    <Text className="text-blue-700 font-semibold text-base mb-1">
                        Target weight is too low!
                    </Text>
                    <Text className="text-blue-600 text-sm leading-5">
                        It is advisable to maintain a weight range of {validationData.minHealthyWeight}{" "}
                        {unit} to {validationData.maxHealthyWeight} {unit} for your current height
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View className="bg-orange-100 rounded-xl p-4 mb-6 flex-row items-start">
            <View className="mr-3 mt-1">
                <View className="bg-orange-500 rounded-full w-6 h-6 items-center justify-center">
                    <Text className="text-white text-xs font-bold">!</Text>
                </View>
            </View>
            <View className="flex-1">
                <Text className="text-orange-700 font-semibold text-base mb-1">
                    Target weight is high
                </Text>
                <Text className="text-orange-600 text-sm leading-5">
                    Consider a weight range of {validationData.minHealthyWeight} {unit} to{" "}
                    {validationData.maxHealthyWeight} {unit} for optimal health
                </Text>
            </View>
        </View>
    );
});

WeightValidation.displayName = "WeightValidation";

export default WeightValidation;

