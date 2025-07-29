import OnboardingWrapper from "@/components/OnboardingWrapper";
import React, {useState} from "react";
import {Text, View} from "react-native";
import ThanksScreen from "@/components/ThanksScreen";

const ThanksScreenHeader = () => (
    <Text className="text-2xl font-jakarta-semi-bold text-center mb-8 text-secondary-800">
        Do you want to add any extra details you'd like our AI to include in your diet plan?
    </Text>
);

const Step11 = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>("all_set");

    const handleSelectionChange = (value: string | null) => {
        setSelectedOption(value);
        console.log("Selected option:", value);

        // Handle navigation or next steps based on selection
        if (value === "add_details") {
            // Navigate to details form or next screen
            console.log("User wants to add more details");
        } else {
            // User is all set, proceed to final step
            console.log("User is all set");
        }
    };

    return (
        <OnboardingWrapper>
            <View className="flex-1">
                <ThanksScreenHeader />
                <ThanksScreen
                    gender={"female"}
                    onSelectionChange={handleSelectionChange}
                />
            </View>
        </OnboardingWrapper>
    );
};

export default Step11;