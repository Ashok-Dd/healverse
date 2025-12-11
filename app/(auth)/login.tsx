import Button from "@/components/Button";
import { CustomInput } from "@/components/CustomInput";
import { images } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

interface UserFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
  });

  const updateFormData = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    try {
      // Validate form
      // const validationError = validateUserForm(
      //   formData.username,
      //   formData.password
      // );
      // if (validationError) {
      //   Alert.alert("Validation Error", validationError);
      //   return;
      // }

      await login({
        username: formData.username.trim(),
        password: formData.password.trim(),
      });

      router.push("/(root)/(tabs)/tracker" as any);
    } catch (e) {
      console.log(e);
      Alert.alert(
        "Login Failed",
        error || "Please check your credentials and try again."
      );
    }
  };
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              flexGrow: 1,
              justifyContent: 'space-between',
              paddingHorizontal: 24,
              paddingVertical: 32
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top Section - Logo and Welcome */}
            <View>
              {/* Logo Section */}
              <View className="items-center mb-8">
                <View className="mb-6">
                  <Image
                    source={images.logo as ImageSourcePropType}
                    className="w-32 h-32"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-3xl font-jakarta-bold text-primary-600">
                  Heal<Text className="text-secondary-900">Verse</Text>
                </Text>
                <Text className="text-center font-jakarta-medium text-sm text-gray-600 mt-2">
                  🌿 Your personalized wellness companion
                </Text>
              </View>

              {/* Welcome Section */}
              <View className="mb-8">
                <Text className="text-2xl font-jakarta-bold text-center text-secondary-800 mb-2">
                  Welcome Back
                </Text>
                <Text className="text-base font-jakarta-regular text-center text-secondary-600">
                  Please enter your details to continue your wellness journey
                </Text>
              </View>
            </View>

            {/* Middle Section - Form */}
            <View className="flex-1 justify-center min-h-[300px]">
              <View className="space-y-4">
                <CustomInput
                  label="Username"
                  value={formData.username}
                  onChangeText={(text) => updateFormData("username", text)}
                  placeholder="Enter your username"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <CustomInput
                  label="Password"
                  value={formData.password}
                  onChangeText={(text) => updateFormData("password", text)}
                  placeholder="Enter your password"
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />

                {error && (
                  <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                    <Text className="text-red-600 text-sm font-jakarta-medium text-center">
                      {error}
                    </Text>
                  </View>
                )}

                <View className="mt-6">
                  <Button
                    title={isLoading ? "Signing in..." : "Sign In"}
                    onPress={handleLogin}
                    disabled={isLoading}
                    variant="primary"
                    className="bg-primary-500 py-4 shadow-medium"
                    textClassName="text-white font-jakarta-semi-bold text-lg"
                  />
                </View>
              </View>
            </View>

            {/* Bottom Section - Additional Options and Footer */}
            <View>
              {/* Additional Options */}
              <View className="mt-6 pt-4 border-t border-gray-100">
                <Button
                  title="Don't have an account? Get started here"
                  onPress={() => router.push("/(auth)/welcome" as any)}
                  variant="secondary"
                  className="bg-blue-50 border-none shadow-none py-2"
                  textClassName="text-blue-500 font-jakarta-medium text-sm"
                />
              </View>

              {/* Footer */}
              <View className="mt-8 mb-4">
                <Text className="text-center text-gray-500 font-jakarta-regular text-xs">
                  Continue your wellness journey 🧘‍♀️🍵
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};



export default Login;

// const handleGoogleSignIn = async (): Promise<void> => {
//     try {
//         // Validate form first
//         const validationError = validateUserForm(formData.username, formData.age);
//         if (validationError) {
//             Alert.alert('Validation Error', validationError);
//             return;
//         }
//
//         // Sign in with Google
//         const googleAccount = await signInWithGoogle();
//         if (!googleAccount) return;
//
//         // Combine form data with Google account details
//         const loginData: LoginData = {
//             ...formData,
//             ...googleAccount,
//         };
//
//         // Handle login
//         await AuthService.handleLogin(loginData);
//
//         Alert.alert(
//             'Login Successful!',
//             `Welcome ${googleAccount.name}!\nEmail: ${googleAccount.email}`,
//             [{ text: 'OK' }]
//         );
//     } catch (error: any) {
//         Alert.alert('Login Error', error.message);
//     }
// };
