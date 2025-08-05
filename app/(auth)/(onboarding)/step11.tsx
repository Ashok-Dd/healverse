import React, { useState } from "react";
import {
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { useUserProfileStore } from "@/store/userProfile";
import OnboardingWrapper from "@/components/OnboardingWrapper";
import Button from "@/components/Button";
import {router} from "expo-router";

export default function Step11() {
    const { setUsername: setUsernameInZustand } = useUserProfileStore();
    const [username, setUsername] = useState<string>("");

    const handleUsernameBlur = () => {
        if (username.trim().length > 0) {
            setUsernameInZustand(username.trim());
        }
    };

    return (
        <OnboardingWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 gap-y-5  px-6">
                        <Text className="text-2xl font-jakarta-semi-bold text-center mb-6 text-secondary-800">
                            Choose your username
                        </Text>

                        <TextInput
                            className="w-full max-w-md border-b-2 border-primary-500 text-base text-black font-medium px-2 py-3 focus:border-primary-700"
                            placeholder="Enter a unique username"
                            placeholderTextColor="#64748b"
                            value={username}
                            onChangeText={setUsername}
                            onBlur={handleUsernameBlur}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="done"
                            clearButtonMode="while-editing"
                            keyboardAppearance="light"
                        />

                        <Button
                            title={"Register" }
                            onPress={() => {
                                username.trim().length > 3 ?
                                    router.push(`/(auth)/register` as any)
                                    : alert("Your username must be at least 4 characters long. Please try again with a longer username.");
                            }}
                            className="mb-10 bg-primary-500 mx-auto rounded-xl w-full shadow-medium max-w-[75%]"
                            textClassName="text-white font-jakarta-semi-bold text-lg"
                        />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </OnboardingWrapper>
    );
}
