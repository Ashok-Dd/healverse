import {Text, View} from "react-native";
import React, {useState} from "react";
import OnboardingWrapper from "@/components/OnboardingWrapper";
import ActiveDailyBasis from "@/components/ActiveDailyBasis";


const ActiveDailyBasisHeader = () => (
    <Text className="text-2xl font-jakarta-semi-bold text-center mb-8 text-secondary-800">
        How active are you on your Daily Basis?
    </Text>
);

const Step4 = () => {
    const [selectedActivityLevel, setSelectedActivityLevel] = useState<string | null>(null);

    const handleActivitySelection = (value: string | null) => {
        setSelectedActivityLevel(value);
        // You can handle the selection here (e.g., save to state management, API call, etc.)
        console.log('Selected activity level:', value);
    };

    return (
        <OnboardingWrapper>
            <View className="flex-1">
                <ActiveDailyBasisHeader />
                <ActiveDailyBasis
                    gender={"female" as "female"}
                    onSelectionChange={handleActivitySelection}
                />
            </View>
        </OnboardingWrapper>
    );
};

export default Step4;