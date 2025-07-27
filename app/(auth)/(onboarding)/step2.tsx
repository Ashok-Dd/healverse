import OnboardingWrapper from "@/components/OnboardingWrapper";
import { convertWeight } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// Reusable Weight Scale Component
const AdjustableWeightScale = ({
  minWeight = 30,
  maxWeight = 150,
  initialWeight = 56,
  unit = "kg",
  onWeightChange,
  style,
}: {
  minWeight: number;
  maxWeight: number;
  initialWeight: number;
  unit: "kg" | "lbs";
  onWeightChange: any;
  style: any;
}) => {
  const [selectedWeight, setSelectedWeight] = useState(initialWeight);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = 6; // Width of each scale mark
  const centerOffset = screenWidth / 2 - itemWidth / 2;

  // Generate all weight values (with decimals for precision)
  const generateWeights = () => {
    const weights = [];
    for (let i = minWeight * 10; i <= maxWeight * 10; i++) {
      weights.push(i / 10);
    }
    return weights;
  };

  const weights = generateWeights();

  // Handle scroll and update selected weight
  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / itemWidth);
    const newWeight = weights[index];

    if (newWeight && newWeight !== selectedWeight) {
      setSelectedWeight(newWeight);
      onWeightChange && onWeightChange(newWeight);
    }
  };

  // Scroll to specific weight
  const scrollToWeight = (weight: number) => {
    const index = weights.findIndex((w) => w === weight);
    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current?.scrollTo({
        x: index * itemWidth,
        animated: true,
      });
    }
  };

  // Initialize scroll position
  useEffect(() => {
    setTimeout(() => {
      scrollToWeight(initialWeight);
    }, 100);
  }, []);

  const renderScaleMark = (weight: number, index: number) => {
    const isMainMark = weight % 1 === 0; // Whole numbers
    const isHalfMark = weight % 0.5 === 0 && weight % 1 !== 0; // Half marks
    const isSelected = Math.abs(weight - selectedWeight) < 0.05;

    const getMarkHeight = () => {
      if (isMainMark) return 24;
      if (isHalfMark) return 18;
      return 12;
    };

    const getMarkColor = () => {
      if (isSelected) return "#3B82F6"; // Blue
      if (isMainMark) return "#374151"; // Dark gray
      if (isHalfMark) return "#6B7280"; // Medium gray
      return "#D1D5DB"; // Light gray
    };

    return (
      <View
        key={index}
        className="items-center justify-end"
        style={{ width: itemWidth }}
      >
        <View
          style={{
            width: isMainMark ? 3 : 2,
            height: getMarkHeight(),
            backgroundColor: getMarkColor(),
            borderRadius: 1,
          }}
        />
        {isMainMark && (
          <Text
            className="text-xs mt-2"
            style={{
              color: isSelected ? "#3B82F6" : "#6B7280",
              fontWeight: isSelected ? "bold" : "normal",
            }}
          >
            {Math.round(weight)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[{ height: 80 }, style]}>
      {/* Center indicator line */}
      <View
        className="absolute top-0 z-10 w-0.5 bg-blue-500 h-8"
        style={{ left: centerOffset }}
      />

      {/* Scrollable scale */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: centerOffset,
        }}
      >
        {weights.map((weight, index) => renderScaleMark(weight, index))}
      </ScrollView>
    </View>
  );
};

// BMI Calculator Component
const BMIIndicator = ({ height = 165, weight = 56 }) => {
  const bmi = (weight / (height / 100) ** 2).toFixed(1);

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5)
      return { category: "Underweight", color: "#3B82F6", position: "15%" };
    if (bmiValue < 25)
      return { category: "Normal", color: "#10B981", position: "35%" };
    if (bmiValue < 30)
      return { category: "Overweight", color: "#F59E0B", position: "60%" };
    if (bmiValue < 35)
      return { category: "Obese", color: "#EF4444", position: "80%" };
    return { category: "Extremely Obese", color: "#7C2D12", position: "95%" };
  };

  const bmiInfo = getBMICategory(parseFloat(bmi));

  const bmiCategories = [
    { label: "Underweight", range: "18.5", color: "#3B82F6", width: "20%" },
    { label: "Normal", range: "25.0", color: "#10B981", width: "25%" },
    { label: "Overweight", range: "30.0", color: "#F59E0B", width: "20%" },
    { label: "Obese", range: "35.0", color: "#EF4444", width: "20%" },
    { label: "Extremely Obese", range: "", color: "#7C2D12", width: "15%" },
  ];

  return (
    <View className="mb-6">
      <View className="flex-row h-3 rounded-full overflow-hidden mb-2">
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
          style={
            {
              backgroundColor: bmiInfo.color,
              left: bmiInfo.position,
              top: -35,
              marginLeft: -6,
            } as ViewStyle
          }
        />
        <Text
          className="absolute text-xs font-bold text-white text-center"
          style={
            {
              left: bmiInfo.position,
              top: -50,
              marginLeft: -15,
              backgroundColor: bmiInfo.color,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 8,
              minWidth: 30,
            } as TextStyle
          }
        >
          {bmi}
        </Text>
      </View>
    </View>
  );
};

// Weight Validation Component
const WeightValidation = ({
  weight,
  height = 165,
  unit,
}: {
  weight: number;
  height: number;
  unit: "kg" | "lbs";
}) => {
  const bmi = weight / (height / 100) ** 2;
  const minHealthyWeight = Math.round(18.5 * (height / 100) ** 2);
  const maxHealthyWeight = Math.round(25 * (height / 100) ** 2);

  const isHealthy = bmi >= 18.5 && bmi <= 25;
  const isTooLow = bmi < 18.5;

  if (isHealthy) {
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

  if (isTooLow) {
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
            It is advisable to maintain a weight range of {minHealthyWeight}{" "}
            {unit} to {maxHealthyWeight} {unit} for your current height
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
          Consider a weight range of {minHealthyWeight} {unit} to{" "}
          {maxHealthyWeight} {unit} for optimal health
        </Text>
      </View>
    </View>
  );
};

// Main Step2 Component
const step2 = () => {
  const [selectedUnit, setSelectedUnit] = useState<"kg" | "lbs">("kg");
  const [targetWeight, setTargetWeight] = useState(56);
  const [userHeight] = useState(165); // This could come from previous step

  const handleUnitChange = (newUnit: "kg" | "lbs") => {
    const convertedWeight = convertWeight(targetWeight, selectedUnit, newUnit);
    setSelectedUnit(newUnit);
    setTargetWeight(convertedWeight);
  };

  const handleWeightChange = (weight: number) => {
    setTargetWeight(weight);
  };

  const getWeightRange = () => {
    return selectedUnit === "kg"
      ? { min: 30, max: 150, initial: 56 }
      : { min: 66, max: 330, initial: 123 };
  };

  const range = getWeightRange();

  return (
    <OnboardingWrapper>
      <View className="flex-1 px-4">
        <Text className="text-2xl font-semibold text-center mb-8 text-gray-800">
          What is your target weight?
        </Text>

        <View className="flex-row self-center mb-8 bg-gray-200 rounded-full overflow-hidden">
          <TouchableOpacity
            className={`px-6 py-2 ${
              selectedUnit === "kg" ? "bg-green-500" : "bg-transparent"
            }`}
            onPress={() => handleUnitChange("kg")}
          >
            <Text
              className={`font-medium ${
                selectedUnit === "kg" ? "text-white" : "text-gray-700"
              }`}
            >
              kg
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-2 ${
              selectedUnit === "lbs" ? "bg-green-500" : "bg-transparent"
            }`}
            onPress={() => handleUnitChange("lbs")}
          >
            <Text
              className={`font-medium ${
                selectedUnit === "lbs" ? "text-white" : "text-gray-700"
              }`}
            >
              lbs
            </Text>
          </TouchableOpacity>
        </View>

        <WeightValidation
          weight={
            selectedUnit === "kg"
              ? targetWeight
              : convertWeight(targetWeight, "lbs", "kg")
          }
          height={userHeight}
          unit={selectedUnit}
        />

        <BMIIndicator
          height={userHeight}
          weight={
            selectedUnit === "kg"
              ? targetWeight
              : convertWeight(targetWeight, "lbs", "kg")
          }
        />

        <View className="items-center mb-8">
          <Text className="text-6xl font-light text-blue-500 mb-2">
            {selectedUnit === "kg"
              ? targetWeight.toFixed(1)
              : Math.round(targetWeight)}
            <Text className="text-4xl ml-2">{selectedUnit}</Text>
          </Text>
          <Text className="text-sm text-gray-500">
            Drag the scale below to adjust
          </Text>
        </View>

        <AdjustableWeightScale
          minWeight={range.min}
          maxWeight={range.max}
          initialWeight={targetWeight}
          unit={selectedUnit}
          onWeightChange={handleWeightChange}
          style={{ marginBottom: 32 }}
        />

        {/* <View className="flex-row justify-center space-x-4 mb-8">
          <TouchableOpacity
            className="bg-gray-100 px-4 py-2 rounded-full"
            onPress={() =>
              setTargetWeight(targetWeight - (selectedUnit === "kg" ? 0.5 : 1))
            }
          >
            <Text className="text-gray-700 font-medium">
              -{selectedUnit === "kg" ? "0.5" : "1"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-100 px-4 py-2 rounded-full"
            onPress={() =>
              setTargetWeight(targetWeight + (selectedUnit === "kg" ? 0.5 : 1))
            }
          >
            <Text className="text-gray-700 font-medium">
              +{selectedUnit === "kg" ? "0.5" : "1"}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </OnboardingWrapper>
  );
};

export default step2;
