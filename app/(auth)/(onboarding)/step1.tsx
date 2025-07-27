import OnboardingWrapper from "@/components/OnboardingWrapper";
import { images } from "@/constants";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const step1 = () => {
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | null
  >(null);

  const handleGenderSelect = (gender: "male" | "female") => {
    console.log(gender);
    setSelectedGender(gender);
  };

  return (
    <OnboardingWrapper>
      <View className="flex-1 px-4">
        <Text className="text-2xl font-semibold text-center mb-8 text-gray-800">
          What is your Gender?
        </Text>

        <View className="flex flex-row gap-4 flex-1 max-h-80">
          {/* Male Option */}
          <TouchableOpacity
            className={`
              border-2 rounded-2xl flex-1 
              justify-center items-center 
              p-4 min-h-[200px]
              ${
                selectedGender === "male"
                  ? "border-blue-500"
                  : "border-gray-300 bg-white"
              }
            `}
            onPress={() => handleGenderSelect("male")}
            activeOpacity={0.8}
          >
            <View className="items-center justify-center flex-1">
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

            {/* Selection Indicator */}
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
              ${
                selectedGender === "female"
                  ? "border-blue-500"
                  : "border-gray-300 bg-white"
              }
            `}
            onPress={() => handleGenderSelect("female")}
            activeOpacity={0.8}
          >
            <View className="items-center justify-center flex-1">
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
                    ? "text-blue-700"
                    : "text-gray-700"
                }
              `}
              >
                Female
              </Text>
            </View>

            {/* Selection Indicator */}
            {selectedGender === "female" && (
              <View className="absolute top-3 right-3 bg-blue-500 rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Description Text */}
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

export default step1;

// Alternative version with custom gender option
export const GenderSelectionWithCustom = () => {
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | "other" | null
  >(null);

  const handleGenderSelect = (gender: "male" | "female" | "other") => {
    setSelectedGender(gender);
  };

  return (
    <OnboardingWrapper>
      <View className="flex-1 px-4">
        <Text className="text-2xl font-semibold text-center mb-8 text-gray-800">
          What is your Gender?
        </Text>

        <View className="flex-1">
          {/* Male and Female Row */}
          <View className="flex flex-row gap-4 mb-4">
            {/* Male Option */}
            <TouchableOpacity
              className={`
                border-2 rounded-2xl flex-1 
                justify-center items-center 
                p-4 h-48
                ${
                  selectedGender === "male"
                    ? "border-lime-600 bg-lime-50"
                    : "border-gray-300 bg-white"
                }
              `}
              onPress={() => handleGenderSelect("male")}
              activeOpacity={0.8}
            >
              <Image
                source={images.male as ImageSourcePropType}
                className="w-20 h-20 mb-3"
                resizeMode="contain"
              />
              <Text
                className={`
                text-base font-semibold
                ${selectedGender === "male" ? "text-lime-700" : "text-gray-700"}
              `}
              >
                Male
              </Text>

              {selectedGender === "male" && (
                <View className="absolute top-3 right-3 bg-lime-600 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs">✓</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Female Option */}
            <TouchableOpacity
              className={`
                border-2 rounded-2xl flex-1 
                justify-center items-center 
                p-4 h-48
                ${
                  selectedGender === "female"
                    ? "border-lime-600 bg-lime-50"
                    : "border-gray-300 bg-white"
                }
              `}
              onPress={() => handleGenderSelect("female")}
              activeOpacity={0.8}
            >
              <Image
                source={images.female as ImageSourcePropType}
                className="w-20 h-20 mb-3"
                resizeMode="contain"
              />
              <Text
                className={`
                text-base font-semibold
                ${
                  selectedGender === "female"
                    ? "text-lime-700"
                    : "text-gray-700"
                }
              `}
              >
                Female
              </Text>

              {selectedGender === "female" && (
                <View className="absolute top-3 right-3 bg-lime-600 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs">✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Other Option */}
          <TouchableOpacity
            className={`
              border-2 rounded-2xl 
              justify-center items-center 
              p-4 h-16 mb-4
              ${
                selectedGender === "other"
                  ? "border-lime-600 bg-lime-50"
                  : "border-gray-300 bg-white"
              }
            `}
            onPress={() => handleGenderSelect("other")}
            activeOpacity={0.8}
          >
            <Text
              className={`
              text-base font-semibold
              ${selectedGender === "other" ? "text-lime-700" : "text-gray-700"}
            `}
            >
              Prefer not to say / Other
            </Text>

            {selectedGender === "other" && (
              <View className="absolute right-4 bg-lime-600 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs">✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Description Text */}
        <View className="mb-6">
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
