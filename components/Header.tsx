import {HeaderProps} from "@/types/type";
import React from 'react';
import {View, Text, Image, ImageSourcePropType} from 'react-native';
import StepProgressBar from "@/components/StepProgressBar";
import {images} from "@/constants";

const Header: React.FC<HeaderProps> = ({ progress = 1, showProgress = true }) => {
    return (
        <View className="px-6 pt-10 pb-4">
            {/* Progress Bar */}
            {showProgress && (
                <View className="mb-8">
                    <StepProgressBar
                        currentStep={progress}
                        totalSteps = {10}
                    />
                </View>
            )}

            {/* Logo and Title */}
            <View className="items-center mb-8">
                <View className="icon-container-large mb-6">
                    {/* Replace with your actual logo image */}
                    <Image
                        source={images.logo as ImageSourcePropType}
                        className="w-48 h-48"
                        resizeMode="contain"
                    />
                </View>

                <Text className="text-4xl font-jakarta-bold text-primary-600">
                    Heal<Text className="text-secondary-900"> Verse</Text>
                </Text>
            </View>
        </View>
    );
};

export default Header;