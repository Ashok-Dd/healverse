import OnboardingWrapper from "@/components/OnboardingWrapper";
import CustomSmoothPicker from "@/components/CustomSmoothPicker";
import { Text, View } from "react-native";
import React, { useState } from "react";
import {useUserProfileStore} from "@/store/userProfile";

const AgeSelectionTitle = () => (
    <View className="items-center mb-12">

        <Text className="text-2xl font-jakarta-semi-bold text-center text-secondary-800">
            What is your age?
        </Text>
    </View>
);

const Step2 = () => {
    const  {age, setAge} = useUserProfileStore();

    // Generate ages from 13 to 100 (covering all potential users)
    const ages = Array.from({ length: 88 }, (_, i) => i + 13);

    const handleAgeChange = (age: string | number) => {
        setAge(age as number);
        // console.log('Selected age:', age);
    };

    return (
        <OnboardingWrapper>
            <View className="flex-1">
                <AgeSelectionTitle />

                <View className="flex-1 justify-center items-center">
                    <CustomSmoothPicker
                        data={ages}
                        selectedValue={age}
                        onValueChange={handleAgeChange}
                        itemHeight={60}
                        width={120}
                        highlightColor="#22c55e" // Using your primary green
                        highlightBgColor="#f0fdf4" // Using your primary-50
                        textColor="#64748b" // Using your secondary-500
                        selectedTextColor="#1e293b" // Using your secondary-800
                    />

                    {/* Show selected age for feedback */}
                    <View className="mt-8">
                        <Text className="text-center text-secondary-600 font-jakarta-medium">
                            Selected Age: {age}
                        </Text>
                    </View>
                </View>
            </View>
        </OnboardingWrapper>
    );
};

export default Step2;