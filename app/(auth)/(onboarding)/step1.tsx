import OnboardingWrapper from "@/components/OnboardingWrapper";
import { images } from "@/constants";
import React, { useState } from "react";
import {
  ImageSourcePropType,
  Text,
  View,
} from "react-native";
import GenderCard from "@/components/GenderCard";

// Types
type GenderType = "male" | "female" | null;

const GenderSelectionTitle = () => (
    <Text className="text-2xl font-jakarta-semi-bold text-center mb-8 text-secondary-800">
      What is your Gender?
    </Text>
);

const GenderDescription = () => (
    <View className="mt-8 mb-6">
      <Text className="text-center text-secondary-600 text-xs font-jakarta leading-5 px-2">
        We use gender to design the best diet plan for you. If you don't
        identify yourself as any of these options, please select the gender
        closest to your hormonal profile.
      </Text>
    </View>
);

const GenderOptions = ({
                         selectedGender,
                         onGenderSelect
                       }: {
  selectedGender: GenderType;
  onGenderSelect: (gender: "male" | "female") => void;
}) => (
    <View className="flex flex-row gap-4 flex-1 max-h-80">
      <GenderCard
          gender="male"
          image={images.male as ImageSourcePropType}
          selectedGender={selectedGender}
          onSelect={onGenderSelect}
      />
      <GenderCard
          gender="female"
          image={images.female as ImageSourcePropType}
          selectedGender={selectedGender}
          onSelect={onGenderSelect}
      />
    </View>
);

// Main Component
const Step1 = () => {
  const [selectedGender, setSelectedGender] = useState<GenderType>(null);

  const handleGenderSelect = (gender: "male" | "female") => {
    console.log(gender);
    setSelectedGender(gender);
  };

  return (
      <OnboardingWrapper>
        <View className="flex-1 px-4">
          <GenderSelectionTitle />

          <GenderOptions
              selectedGender={selectedGender}
              onGenderSelect={handleGenderSelect}
          />

          <GenderDescription />
        </View>
      </OnboardingWrapper>
  );
};

export default Step1;