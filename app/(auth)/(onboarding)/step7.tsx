import {Text, View} from "react-native";
import React, {useState} from "react";
import OnboardingWrapper from "@/components/OnboardingWrapper";
import ActiveDailyBasis from "@/components/ActiveDailyBasis";
import {useUserProfileStore} from "@/store/userProfile";
import {ActivityLevel} from "@/types/type";


const ActiveDailyBasisHeader = () => (
    <Text className="text-2xl font-jakarta-semi-bold text-center mb-8 text-secondary-800">
        How active are you on your Daily Basis?
    </Text>
);

const Step7 = () => {

    const {  activityLevel , gender , setActivityLevel } = useUserProfileStore();

    const handleActivitySelection = (value: ActivityLevel) => {
        setActivityLevel(value);
        // You can handle the selection here (e.g., save to state management, API call, etc.)
        console.log('Selected activity level:', value);
    };

    return (
        <OnboardingWrapper>
            <View className="flex-1">
                <ActiveDailyBasisHeader />
                <ActiveDailyBasis
                    gender={gender}
                    onSelectionChange={handleActivitySelection}
                    activityLevel={activityLevel}
                />
            </View>
        </OnboardingWrapper>
    );
};

export default Step7;