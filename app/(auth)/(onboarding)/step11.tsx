import OnboardingWrapper from "@/components/OnboardingWrapper";
import {Text, TextInput, View} from "react-native";
import React, {useState} from "react";
import {useUserProfileStore} from "@/store/userProfile";

export default function Step11() {
    const {setUsername : setUsernameInZustand} = useUserProfileStore();

    const [username , setUsername] = useState<string>("");

    return (
        <OnboardingWrapper>
            <View className={"flex-1"}>
                <Text className="text-2xl font-jakarta-semi-bold text-center mb-8 text-secondary-800">
                    Please enter your username.
                </Text>

                <TextInput
                    className={"mt-8 mx-2 max-w-xs mx-auto font-medium text-black border-b-2 border-primary-500 w-full"}
                    placeholder="Username"
                    maxLength={15}
                    placeholderTextColor="#64748b"
                    value={username}
                    onChangeText={setUsername}
                    onBlur={() => setUsernameInZustand(username)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                />
            </View>
        </OnboardingWrapper>
    )
}