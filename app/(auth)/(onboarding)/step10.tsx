import OnboardingWrapper from "@/components/OnboardingWrapper";
import OptionsCard from "@/components/OptionsCard";
import { healthConditions } from "@/constants/data";
import { FlatList, Text, View } from "react-native";
import {useUserProfileStore} from "@/store/userProfile";

const Step4 = () => {
    const {healthCondition , setHealthCondition} = useUserProfileStore();

    return (
        <OnboardingWrapper>
            <View className="flex-1 p-4">
                <Text className="text-2xl font-semibold text-center mb-4 text-gray-800">
                    Do you have any Health Contions ?
                </Text>

                <FlatList
                    data={healthConditions}
                    keyExtractor={(item) => item.value}
                    ItemSeparatorComponent={() => <View className="h-3" />}
                    renderItem={({ item }) => (
                        <OptionsCard
                            {...item}
                            isSelected={healthCondition === item.value}
                            onPress={() => setHealthCondition(item.value)}
                        />
                    )}
                />
            </View>
        </OnboardingWrapper>
    );
};

export default Step4;
