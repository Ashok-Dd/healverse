import OnboardingWrapper from "@/components/OnboardingWrapper";
import { dietaryLimitations } from "@/constants/data";
import { FlatList, Text, View } from "react-native";
import {useUserProfileStore} from "@/store/userProfile";
import OptionsCard from "@/components/OptionsCard";
import {useShallow} from "zustand/react/shallow";

const Step8 = () => {
    const {dietaryRestriction , setDietaryRestriction} = useUserProfileStore(
        useShallow((state) => ({
            dietaryRestriction: state.dietaryRestriction,
            setDietaryRestriction: state.setDietaryRestriction,
        }))
    );

    return (
        <OnboardingWrapper>
            <View className="flex-1 p-4">
                <Text className="text-2xl font-semibold text-center mb-4 text-gray-800">
                    Do you have any dietary restrictions, allergies, or foods you dislike?
                </Text>

                <FlatList
                    data={dietaryLimitations}
                    keyExtractor={(item) => item.value}
                    ItemSeparatorComponent={() => <View className="h-3" />}
                    renderItem={({ item }) => (
                        <OptionsCard
                            {...item}
                            isSelected={dietaryRestriction === item.value}
                            onPress={() => setDietaryRestriction(item.value)}
                        />
                    )}
                />
            </View>
        </OnboardingWrapper>
    );
};

export default Step8;
