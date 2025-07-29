import {Image, ImageSourcePropType, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {Gender} from "@/types/type";


const GenderCard = ({
                        gender,
                        image,
                        selectedGender,
                        onSelect
                    }: {
    gender: Gender;
    image: ImageSourcePropType;
    selectedGender: Gender;
    onSelect: (gender: Gender) => void;
}) => {
    const isSelected = selectedGender === gender;

    return (
        <TouchableOpacity
            className={`
        border-2 rounded-2xl flex-1 
        justify-center overflow-hidden items-center 
        p-4 min-h-[200px]
        ${
                isSelected
                    ? "border-primary-500"
                    : "border-secondary-300 bg-white"
            }
      `}
            onPress={() => onSelect(gender)}
            activeOpacity={0.8}
        >
            <View className="items-center justify-center flex-1">
                <Image
                    source={image}
                    className={`mb-4 ${
                        gender === "MALE" ? "w-36 h-64" : "w-34 h-60"
                    }`}
                    resizeMode="contain"
                />
                <Text
                    className={`
            text-lg font-jakarta-semi-bold text-center capitalize
            ${isSelected ? "text-primary-700" : "text-secondary-700"}
          `}
                >
                    {gender}
                </Text>
            </View>

            {/* Selection Indicator */}
            {isSelected && (
                <View className="absolute top-3 right-3 bg-primary-500 rounded-full w-6 h-6 items-center justify-center">
                    <Text className="text-white text-xs font-jakarta-bold">✓</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default GenderCard;
