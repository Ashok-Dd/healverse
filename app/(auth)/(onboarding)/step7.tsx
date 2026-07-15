import { Text, View } from "react-native";
import React from "react";
import OnboardingWrapper from "@/components/OnboardingWrapper";
import ActiveDailyBasis from "@/components/ActiveDailyBasis";
import { useUserProfileStore } from "@/store/userProfile";
import { ActivityLevel } from "@/types/type";
import { useShallow } from "zustand/react/shallow";

const Step7 = () => {

    const { activityLevel, gender, setActivityLevel } = useUserProfileStore(
        useShallow((state) => ({
            activityLevel: state.activityLevel,
            gender: state.gender,
            setActivityLevel: state.setActivityLevel,
        }))
    );

    const handleActivitySelection = (value: ActivityLevel) => {
        setActivityLevel(value);
        // You can handle the selection here (e.g., save to state management, API call, etc.)
        // console.log('Selected activity level:', value);
    };

    return (
        <OnboardingWrapper>
            <View className="flex-1">
                <Text className="text-2xl font-jakarta-semi-bold text-center mb-8 text-secondary-800">
                    How active are you on your Daily Basis?
                </Text>
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