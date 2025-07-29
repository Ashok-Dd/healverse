import OnboardingWrapper from "@/components/OnboardingWrapper";
import {Text, View} from "react-native";
import {useUserProfileStore} from "@/store/userProfile";

export default function Step12() {
    const state = useUserProfileStore();
    return (
        <OnboardingWrapper>
            <View>
                <Text>State username</Text>

                <Text>{JSON.stringify(state)}</Text>
            </View>
        </OnboardingWrapper>
    )
}