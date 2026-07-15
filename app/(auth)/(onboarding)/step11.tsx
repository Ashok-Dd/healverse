import OnboardingWrapper from "@/components/OnboardingWrapper";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUserProfileStore } from "@/store/userProfile";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useShallow } from "zustand/react/shallow";

interface ValidationErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Step11() {
  const { setUsername: setUsernameInZustand, setPassword: setPasswordInZustand } = useUserProfileStore(
    useShallow((state) => ({
      setUsername: state.setUsername,
      setPassword: state.setPassword,
    }))
  );
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Username validation
    if (username.trim().length < 4) {
      newErrors.username = "Username must be at least 4 characters long";
    } else if (username.trim().length > 20) {
      newErrors.username = "Username cannot exceed 20 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Password validation
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    } else if (password.length > 50) {
      newErrors.password = "Password cannot exceed 50 characters";
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameBlur = () => {
    if (username.trim().length > 0) {
      setUsernameInZustand(username.trim());
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setUsernameInZustand(username.trim());
      setPasswordInZustand(password);

      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      router.push("/(auth)/register" as any);
    } catch (error) {
      Alert.alert(
        "Error",
        "Something went wrong. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 px-6 py-4">
              {/* Header Section */}
              <View className="mb-8">
                <Text className="text-2xl font-jakarta-bold text-center text-secondary-800 mb-2">
                  Almost There! 🎉
                </Text>
                <Text className="text-base font-jakarta-regular text-center text-secondary-600 px-4">
                  Create your account credentials to complete your wellness journey setup
                </Text>
              </View>

              {/* Form Section */}
              <View className="flex-1 justify-center">
                <View className="space-y-4">
                  <Input
                    label="Username"
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      // Clear username error when user starts typing
                      if (errors.username) {
                        setErrors(prev => ({ ...prev, username: undefined }));
                      }
                    }}
                    onBlur={handleUsernameBlur}
                    placeholder="Choose a unique username"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {errors.username && (
                    <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                      <Text className="text-red-600 text-sm font-jakarta-medium">
                        {errors.username}
                      </Text>
                    </View>
                  )}

                  <Input
                    label="Password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      // Clear password error when user starts typing
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder="Create a secure password"
                    secureTextEntry
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                  {errors.password && (
                    <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                      <Text className="text-red-600 text-sm font-jakarta-medium">
                        {errors.password}
                      </Text>
                    </View>
                  )}

                  <Input
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      // Clear confirm password error when user starts typing
                      if (errors.confirmPassword) {
                        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    placeholder="Re-enter your password"
                    secureTextEntry
                    autoCapitalize="none"
                    returnKeyType="done"
                  />
                  {errors.confirmPassword && (
                    <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                      <Text className="text-red-600 text-sm font-jakarta-medium">
                        {errors.confirmPassword}
                      </Text>
                    </View>
                  )}

                  {/* Password Requirements */}
                  <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <Text className="text-blue-800 font-jakarta-semi-bold text-sm mb-2">
                      Password Requirements:
                    </Text>
                    <View className="space-y-1">
                      <Text className="text-blue-700 text-xs font-jakarta-regular">
                        • At least 6 characters long
                      </Text>
                      <Text className="text-blue-700 text-xs font-jakarta-regular">
                        • Username: 4-20 characters (letters, numbers, underscores only)
                      </Text>
                    </View>
                  </View>

                  <View className="mt-8">
                    <Button
                      title={isLoading ? "Creating Account..." : "Create Account"}
                      onPress={handleRegister}
                      disabled={isLoading}
                      variant="primary"
                      className="bg-primary-500 py-4 shadow-medium"
                      textClassName="text-white font-jakarta-semi-bold text-lg"
                    />
                  </View>
                </View>
              </View>

              {/* Footer */}
              <View className="mt-8 mb-4">
                <Text className="text-center text-gray-500 font-jakarta-regular text-xs">
                  Ready to start your wellness journey? 🌿✨
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </OnboardingWrapper>
  );
}
