import OnboardingWrapper from "@/components/OnboardingWrapper";
import { images } from "@/constants";
import React, { useCallback, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CallbackGenderSelection = () => {
  const [selectedGender, setSelectedGender] = useState<"male" | "female">(
    "male"
  );

  // Using useCallback to prevent unnecessary re-renders
  const handleGenderSelect = useCallback((gender: "male" | "female") => {
    console.log(gender);
    setSelectedGender(gender);
  }, []);

  // Alternative: Create individual handlers
  const handleMaleSelect = useCallback(() => {
    console.log("male");
    setSelectedGender("male");
  }, []);

  const handleFemaleSelect = useCallback(() => {
    console.log("female");
    setSelectedGender("female");
  }, []);

  return (
    <OnboardingWrapper>
      <View className="flex-1 px-4">
        <Text className="text-2xl font-semibold text-center mb-8 text-gray-800">
          What is your Gender?
        </Text>

        <View className="flex flex-row gap-8  flex-1 max-h-80">
          {/* Male Option */}
          <TouchableOpacity
            className={`
              border-2 rounded-2xl flex-1 
              justify-center items-center 
              p-4 min-h-[200px]
              overflow-hidden
              ${
                selectedGender === "male"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }
            `}
            onPress={handleMaleSelect}
            activeOpacity={0.8}
          >
            <View className="items-center   justify-center flex-1">
              <Image
                source={images.male as ImageSourcePropType}
                className="w-34 h-64 mb-4"
                resizeMode="contain"
              />
              <Text
                className={`
                text-lg font-semibold text-center
                ${selectedGender === "male" ? "text-blue-700" : "text-gray-700"}
              `}
              >
                Male
              </Text>
            </View>

            {selectedGender === "male" && (
              <View className="absolute top-3 right-3 bg-blue-600 rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Female Option */}
          <TouchableOpacity
            className={`
              border-2 rounded-2xl flex-1 
              justify-center items-center 
              p-4 min-h-[200px]
              overflow-hidden
              ${
                selectedGender === "female"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-300 bg-white"
              }
            `}
            onPress={handleFemaleSelect}
            activeOpacity={0.8}
          >
            <View className="items-center  justify-center flex-1">
              <Image
                source={images.female as ImageSourcePropType}
                className="w-34 h-60 mb-4"
                resizeMode="contain"
              />
              <Text
                className={`
                text-lg font-semibold text-center
                ${
                  selectedGender === "female"
                    ? "text-pink-700"
                    : "text-gray-700"
                }
              `}
              >
                Female
              </Text>
            </View>

            {selectedGender === "female" && (
              <View className="absolute top-3 right-3 bg-pink-500 rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-8 mb-6">
          <Text className="text-center text-gray-600 text-sm leading-5 px-2">
            We use gender to design the best diet plan for you. If you don't
            identify yourself as any of these options, please select the gender
            closest to your hormonal profile.
          </Text>
        </View>
      </View>
    </OnboardingWrapper>
  );
};

export default CallbackGenderSelection;
