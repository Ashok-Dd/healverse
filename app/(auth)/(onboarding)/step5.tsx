import OnboardingWrapper from "@/components/OnboardingWrapper";
import {Text, View} from "react-native";
import {useState} from "react";
import DietaryGoals from "@/components/DietaryGoals";

const DietaryHeader = () => (
    <Text className="text-2xl font-jakarta-semi-bold text-center mb-8 text-secondary-800">
        What is your main dietary Goals?
    </Text>
);

const Step5 = () => {

    const [selectedDiet, setSelectedDiet] = useState<String | null>(null);

    const handleSelectionDiet = (value: String | null) => {
        setSelectedDiet(value);
        console.log("Selected Diet: " + value);
    }

    return (
        <OnboardingWrapper>
            <View className="flex-1">
                <DietaryHeader />
                <DietaryGoals
                    gender={"male"} // or "female"
                    onSelectionChange={handleSelectionDiet}
                />
            </View>
        </OnboardingWrapper>
    )
}

export default Step5;