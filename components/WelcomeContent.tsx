import React from 'react';
import { View, Text } from 'react-native';

const WelcomeContent: React.FC = () => {
    return (
        <View className="px-6 py-8 flex-1">
            {/* 🎉 Title Section */}
            <View className="mb-4">
                <Text className="text-sm text-center">
                    🎊 <Text className="font-jakarta-medium text-gray-900">New Year, New You!</Text>
                    <Text className="font-jakarta-semi-bold text-gray-600"> Get healthier in 2025 </Text>
                    🎄
                </Text>
            </View>

            {/* 💬 Message Box */}
            <View className="p-6 mb-8">
                <Text className="text-base mb-2 text-center">
                    Hey👋{' '}
                    <Text className="font-jakarta-semibold text-gray-800">
                        I am your Personal Nutritionist
                    </Text>
                </Text>

                <Text className="text-base leading-5 font-jakarta-regular text-center text-gray-700">
                    powered by AI. I will ask you some questions to personalize a smart diet plan for you
                </Text>
            </View>
        </View>
    );
};

export default WelcomeContent;
