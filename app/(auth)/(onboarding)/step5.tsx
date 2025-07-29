import OnboardingWrapper from "@/components/OnboardingWrapper";
import {Text, View} from "react-native";
import {useState} from "react";
import DietaryGoals from "@/components/DietaryGoals";
import {useUserProfileStore} from "@/store/userProfile";
import {DietaryRestriction, Goal} from "@/types/type";

const DietaryHeader = () => (
    <Text className="text-2xl font-jakarta-semi-bold text-center mb-8 text-secondary-800">
        What is your main dietary Goals?
    </Text>
);

const Step5 = () => {


    const {goal, setGoal , gender} = useUserProfileStore();

    const handleSelectionDiet = (value: Goal) => {
        setGoal(value);
    }

    return (
        <OnboardingWrapper>
            <View className="flex-1">
                <DietaryHeader />
                <DietaryGoals
                    gender={gender}
                    onSelectionChange={handleSelectionDiet}
                    goal={goal}
                />
            </View>
        </OnboardingWrapper>
    )
}

export default Step5;