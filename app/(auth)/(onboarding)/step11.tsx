import Button from "@/components/Button";
import OnboardingWrapper from "@/components/OnboardingWrapper";
import { useUserProfileStore } from "@/store/userProfile";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Step11() {
  const { setUsername: setUsernameInZustand } = useUserProfileStore();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleUsernameBlur = () => {
    if (username.trim().length > 0) {
      setUsernameInZustand(username.trim());
    }
  };

  const handleRegister = () => {
    if (username.trim().length < 4) {
      alert(
        "Your username must be at least 4 characters long. Please try again with a longer username."
      );
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    router.push(`/(auth)/register?password=${encodeURIComponent(password)}`)
  };

  return (
    <OnboardingWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 gap-y-5 px-6">
            <Text className="text-2xl font-jakarta-semi-bold text-center mb-6 text-secondary-800">
              Choose your username
            </Text>

            {/* Username */}
            <TextInput
              className="w-full max-w-md border-b-2 my-5 border-primary-500 text-base text-black font-medium px-2 py-3"
              placeholder="Enter a unique username"
              placeholderTextColor="#64748b"
              value={username}
              onChangeText={setUsername}
              onBlur={handleUsernameBlur}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              clearButtonMode="while-editing"
              keyboardAppearance="light"
            />

            {/* Password */}
            <TextInput
              className="w-full max-w-md border-b-2 my-5 border-primary-500 text-base text-black font-medium px-2 py-3"
              placeholder="Enter password"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              returnKeyType="next"
              clearButtonMode="while-editing"
            />

            {/* Confirm Password */}
            <TextInput
              className="w-full max-w-md border-b-2 my-5 border-primary-500 text-base text-black font-medium px-2 py-3"
              placeholder="Re-enter password"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              returnKeyType="done"
              clearButtonMode="while-editing"
            />

            {/* Register Button */}
            <Button
              title="Register"
              onPress={handleRegister}
              className="mt-5 bg-primary-500 mx-auto rounded-xl w-full shadow-medium max-w-xs"
              textClassName="text-white font-jakarta-semi-bold text-lg"
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </OnboardingWrapper>
  );
}
