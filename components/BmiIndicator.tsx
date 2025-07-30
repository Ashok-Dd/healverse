// Memoized BMI Indicator Component
import {memo, useMemo} from "react";
import {DimensionValue, Text, TextStyle, View, ViewStyle} from "react-native";

const BMIIndicator = memo(({ height = 165, weight = 56 }: {
    height?: number;
    weight?: number;
}) => {
    const bmiData = useMemo(() => {
        const bmi = (weight / (height / 100) ** 2).toFixed(1);
        const bmiValue = parseFloat(bmi);

        let category: string, color: string, position: string;
        if (bmiValue < 18.5) {
            category = "Underweight";
            color = "#3B82F6";
            position = "15%";
        } else if (bmiValue < 25) {
            category = "Normal";
            color = "#10B981";
            position = "35%";
        } else if (bmiValue < 30) {
            category = "Overweight";
            color = "#F59E0B";
            position = "60%";
        } else if (bmiValue < 35) {
            category = "Obese";
            color = "#EF4444";
            position = "80%";
        } else {
            category = "Extremely Obese";
            color = "#7C2D12";
            position = "95%";
        }

        return { bmi, category, color, position };
    }, [height, weight]);

    // Static BMI categories - no need to recalculate
    const bmiCategories = useMemo(() => [
        { label: "Underweight", range: "18.5", color: "#3B82F6", width: "20%" },
        { label: "Normal", range: "25.0", color: "#10B981", width: "25%" },
        { label: "Overweight", range: "30.0", color: "#F59E0B", width: "20%" },
        { label: "Obese", range: "35.0", color: "#EF4444", width: "20%" },
        { label: "Extremely Obese", range: "", color: "#7C2D12", width: "15%" },
    ], []);

    const indicatorStyle = useMemo((): ViewStyle => ({
        backgroundColor: bmiData.color,
        left: bmiData.position as DimensionValue,
        top: -35,
        marginLeft: -6,
    }), [bmiData.color, bmiData.position]);

    const labelStyle = useMemo((): ViewStyle => ({
        left: bmiData.position as DimensionValue,
        top: -50,
        marginLeft: -15,
        backgroundColor: bmiData.color,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        minWidth: 30,
    }), [bmiData.color, bmiData.position]);

    return (
        <View className="mb-6">
            <View className="flex-row h-3 rounded-full overflow-hidden mb-2">
                {bmiCategories.map((category, index) => (
                    <View
                        key={index}
                        className="h-full"
                        style={{
                            backgroundColor: category.color,
                            width: category.width,
                        } as ViewStyle}
                    />
                ))}
            </View>

            {/* BMI Labels */}
            <View className="flex-row justify-between mb-1">
                {bmiCategories.map((category, index) => (
                    <View
                        key={index}
                        className="items-center"
                        style={{ width: category.width } as ViewStyle}
                    >
                        {category.range && (
                            <Text className="text-xs text-gray-600 font-medium">
                                {category.range}
                            </Text>
                        )}
                    </View>
                ))}
            </View>

            <View className="flex-row justify-between mb-2">
                {bmiCategories.map((category, index) => (
                    <View
                        key={index}
                        className="items-center"
                        style={{ width: category.width } as ViewStyle}
                    >
                        <Text className="text-xs text-gray-500">{category.label}</Text>
                    </View>
                ))}
            </View>

            {/* BMI Indicator */}
            <View className="relative">
                <View
                    className="absolute w-3 h-3 rounded-full border-2 border-white shadow-lg"
                    style={indicatorStyle}
                />
                <Text
                    className="absolute text-xs font-bold text-white text-center"
                    style={labelStyle as TextStyle}
                >
                    {bmiData.bmi}
                </Text>
            </View>
        </View>
    );
});

BMIIndicator.displayName = "BMIIndicator";

export default BMIIndicator;