import OnboardingWrapper from "@/components/OnboardingWrapper";
import React, { useState } from "react";
import { Text, View } from "react-native";
import HeightSelector from "@/components/HeightSelector";

const HeightSelectionTitle = () => (
    <Text className="text-2xl font-jakarta-semi-bold text-center mb-8 text-secondary-800">
        What is your Height?
    </Text>
);

const Step2 = () => {
    const [selectedHeight, setSelectedHeight] = useState<{
        value: number;
        unit: 'cm' | 'ft';
    }>({ value: 170, unit: 'cm' });

    // Get gender from your global state/context from step 1
    const selectedGender = 'male'; // Replace with actual gender from step 1

    const handleHeightChange = (height: number, unit: 'cm' | 'ft') => {
        const newHeight = { value: height, unit };
        setSelectedHeight(newHeight);

        // Store this in your global state/context here
        console.log(`Selected height: ${height} ${unit}`);

        // You can also validate the height here
        if (unit === 'cm' && (height < 100 || height > 250)) {
            console.warn('Height out of normal range for cm');
        } else if (unit === 'ft' && (height < 3 || height > 8.5)) {
            console.warn('Height out of normal range for ft');
        }
    };

    return (
        <OnboardingWrapper>
            <View className="flex-1">
                <HeightSelectionTitle />
                <HeightSelector
                    onHeightChange={handleHeightChange}
                    initialHeight={selectedHeight.value}
                    initialUnit={selectedHeight.unit}
                    gender={selectedGender as 'male' | 'female'}
                    maleAvatarSource={require('@/assets/images/boy.png')}
                    femaleAvatarSource={require('@/assets/images/girl.png')}
                />

                {/* Display current selection for debugging */}
                <View className="px-4 py-2 bg-gray-100 rounded-lg mx-4 mt-4">
                    <Text className="text-center text-gray-600 text-sm">
                        Selected: {selectedHeight.value} {selectedHeight.unit}
                        {selectedHeight.unit === 'cm' ?
                            ` (${Math.floor(selectedHeight.value / 30.48)}'${Math.round((selectedHeight.value / 2.54) % 12)}")` :
                            ` (${Math.round(selectedHeight.value * 30.48)} cm)`
                        }
                    </Text>
                </View>
            </View>
        </OnboardingWrapper>
    );
};

export default Step2;