import OnboardingWrapper from "@/components/OnboardingWrapper";
import React, { useCallback, useMemo, useState } from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { RulerPicker } from "react-native-ruler-picker";

interface BMIInfo {
  bmi: number;
  category: string;
  color: string;
  position: number;
}

interface BMICategory {
  label: string;
  range: string;
  color: string;
  width: string;
}

// BMI Calculator and Display Component
const BMIDisplay: React.FC<{
  weight: number;
  height?: number;
}> = React.memo(({ weight, height = 175 }) => {
  const bmiInfo = useMemo((): BMIInfo => {
    const bmi = weight / (height / 100) ** 2;
    let category = "";
    let color = "";
    let position = 0;

    if (bmi < 18.5) {
      category = "underweight";
      color = "#3B82F6";
      position = (bmi / 18.5) * 20;
    } else if (bmi < 25) {
      category = "normal";
      color = "#10B981";
      position = 20 + ((bmi - 18.5) / (25 - 18.5)) * 25;
    } else if (bmi < 30) {
      category = "overweight";
      color = "#F59E0B";
      position = 45 + ((bmi - 25) / (30 - 25)) * 20;
    } else if (bmi < 35) {
      category = "obese";
      color = "#EF4444";
      position = 65 + ((bmi - 30) / (35 - 30)) * 20;
    } else {
      category = "extremely obese";
      color = "#7C2D12";
      position = Math.min(95, 85 + ((bmi - 35) / 10) * 15);
    }

    return {
      bmi: Math.round(bmi * 10) / 10,
      category,
      color,
      position: Math.min(95, Math.max(5, position)),
    };
  }, [weight, height]);

  const bmiCategories = useMemo(
    (): BMICategory[] => [
      { label: "Underweight", range: "18.5", color: "#3B82F6", width: "20%" },
      { label: "Normal", range: "25.0", color: "#10B981", width: "25%" },
      { label: "Overweight", range: "30.0", color: "#F59E0B", width: "20%" },
      { label: "Obese", range: "35.0", color: "#EF4444", width: "20%" },
      { label: "Extremely Obese", range: "", color: "#7C2D12", width: "15%" },
    ],
    []
  );

  return (
    <View className="mb-8 px-4">
      {/* BMI Title */}
      <Text className="text-center text-gray-600 text-base mb-2">
        Your Body Mass Index(BMI) is
      </Text>

      {/* BMI Value */}
      <Text className="text-center text-blue-500 text-5xl font-light mb-3">
        {bmiInfo.bmi}
      </Text>

      {/* BMI Status */}
      <Text className="text-center text-gray-700 text-base mb-6">
        Your BMI shows that you are{" "}
        <Text className="font-semibold">{bmiInfo.category}!</Text>
      </Text>

      {/* BMI Scale */}
      <View className="relative">
        {/* Color bar */}
        <View className="flex-row h-2 rounded-full overflow-hidden mb-3">
          {bmiCategories.map((category, index) => (
            <View
              key={index}
              className="h-full"
              style={
                {
                  backgroundColor: category.color,
                  width: category.width,
                } as ViewStyle
              }
            />
          ))}
        </View>

        {/* BMI Range Labels */}
        <View className="flex-row justify-between mb-2">
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

        {/* Category Labels */}
        <View className="flex-row justify-between mb-4">
          {bmiCategories.map((category, index) => (
            <View
              key={index}
              className="items-center"
              style={{ width: category.width } as ViewStyle}
            >
              <Text className="text-xs text-gray-500 text-center">
                {category.label}
              </Text>
            </View>
          ))}
        </View>

        {/* BMI Indicator */}
        <View
          className="absolute w-3 h-3 rounded-full border-2 border-white shadow-lg"
          style={{
            backgroundColor: bmiInfo.color,
            left: `${bmiInfo.position}%`,
            top: -2,
            marginLeft: -6,
          }}
        />
      </View>
    </View>
  );
});

// Main Weight Selection Component
const Step3: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<"kg" | "lbs">("kg");
  const [selectedWeight, setSelectedWeight] = useState<number>(73.7);

  // Convert between units
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

  // Get weight range based on unit
  const weightRange = useMemo(() => {
    return selectedUnit === "kg"
      ? { min: 30, max: 150, step: 0.1 }
      : { min: 66, max: 330, step: 0.2 };
  }, [selectedUnit]);

  // Handle unit change
  const handleUnitChange = useCallback(
    (newUnit: "kg" | "lbs") => {
      const convertedWeight = convertWeight(
        selectedWeight,
        selectedUnit,
        newUnit
      );
      setSelectedUnit(newUnit);
      setSelectedWeight(convertedWeight);
    },
    [selectedWeight, selectedUnit, convertWeight]
  );

  // Handle weight change from ruler
  const handleWeightChange = useCallback((value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setSelectedWeight(parsed);
    }
  }, []);

  // Generate ruler data
  const rulerData = useMemo(() => {
    const data = [];
    const { min, max, step } = weightRange;

    for (let i = min; i <= max; i += step) {
      data.push(Math.round(i * 10) / 10);
    }
    return data;
  }, [weightRange]);

  // Get initial index for ruler
  const initialIndex = useMemo(() => {
    return rulerData.findIndex(
      (weight) => Math.abs(weight - selectedWeight) < 0.1
    );
  }, [rulerData, selectedWeight]);

  return (
    <OnboardingWrapper>
      <View className="flex-1">
        {/* Title */}
        <Text className="text-2xl font-semibold text-center mb-2 text-gray-800">
          What is your weight?
        </Text>

        {/* Unit Toggle */}
        <View className="flex-row self-center mb-2 bg-gray-200 rounded-full overflow-hidden">
          <TouchableOpacity
            className={`px-3 py-1 ${
              selectedUnit === "kg" ? "bg-green-500" : "bg-transparent"
            }`}
            onPress={() => handleUnitChange("kg")}
            activeOpacity={0.7}
          >
            <Text
              className={`font-semibold ${
                selectedUnit === "kg" ? "text-white" : "text-gray-700"
              }`}
            >
              kg
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-3 py-1 ${
              selectedUnit === "lbs" ? "bg-gray-300" : "bg-transparent"
            }`}
            onPress={() => handleUnitChange("lbs")}
            activeOpacity={0.7}
          >
            <Text
              className={`font-semibold ${
                selectedUnit === "lbs" ? "text-gray-800" : "text-gray-700"
              }`}
            >
              lbs
            </Text>
          </TouchableOpacity>
        </View>

        {/* BMI Display */}
        <BMIDisplay
          weight={
            selectedUnit === "kg"
              ? selectedWeight
              : convertWeight(selectedWeight, "lbs", "kg")
          }
        />

        {/* Ruler Picker */}
        <View className="flex-1 justify-center">
          <RulerPicker
            min={weightRange.min}
            max={weightRange.max}
            step={selectedUnit === "kg" ? 0.1 : 0.2}
            fractionDigits={1}
            initialValue={selectedWeight}
            onValueChange={handleWeightChange}
            onValueChangeEnd={handleWeightChange}
            unit={selectedUnit}
            indicatorColor="#3B82F6"
            shortStepHeight={15}
            longStepHeight={25}
            shortStepColor="#E5E7EB"
            longStepColor="#9CA3AF"
          />
        </View>
      </View>
    </OnboardingWrapper>
  );
};

export default Step3;
