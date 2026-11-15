import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { Input } from "@/components/ui/Input";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import type { ApiError } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, isLoading, sessionExpired, clearSessionExpired } =
    useAuthStore();

  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
  });

  // After a 429 (too many attempts) keep the button disabled for a while.
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const passwordRef = useRef<TextInput>(null);

  useEffect(
    () => () => {
      if (cooldownTimer.current) clearInterval(cooldownTimer.current);
      // Notice is one-off: don't show it again next time login opens.
      clearSessionExpired();
    },
    [clearSessionExpired]
  );

  const startCooldown = (seconds: number) => {
    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    setCooldown(seconds);
    cooldownTimer.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (cooldownTimer.current) clearInterval(cooldownTimer.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const updateFormData = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (cooldown > 0) return;
    setFormError(null);

    try {
      await login({
        username: formData.username.trim(),
        password: formData.password,
      });

      router.replace("/(root)/(tabs)/tracker" as any);
    } catch (e) {
      // Server message is already user-friendly for 400/401/409/429; branch on status, not text.
      const status = (e as { status?: number })?.status;
      const message =
        (e as ApiError & Error)?.message ||
        "Please check your credentials and try again.";
      setFormError(message);
      if (status === 429) startCooldown(30);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/welcome" as any);
  };

  const canSubmit =
    formData.username.trim().length > 0 && formData.password.length > 0;

  const buttonTitle =
    cooldown > 0
      ? `Try again in ${cooldown}s`
      : isLoading
        ? "Signing in..."
        : "Sign in";

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerClassName="flex-grow px-6 pt-6 pb-6"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Pressable
              onPress={handleBack}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="w-11 h-11 rounded-full bg-card items-center justify-center border border-border"
            >
              <Ionicons name="chevron-back" size={22} color={colors.foreground} />
            </Pressable>

            <View className="flex-1 mt-8">
              <Text
                accessibilityRole="header"
                className="text-4xl font-display-bold text-foreground"
              >
                Welcome back
              </Text>
              <Text className="text-base font-body text-muted-foreground mt-2 mb-8">
                Sign in to pick up where you left off.
              </Text>

              <Input
                label="Username"
                value={formData.username}
                onChangeText={(text) => updateFormData("username", text)}
                placeholder="Your username"
                icon={
                  <Ionicons name="person-outline" size={20} color={colors.mutedForeground} />
                }
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                textContentType="username"
                onSubmitEditing={() => passwordRef.current?.focus()}
                submitBehavior="submit"
              />

              <Input
                ref={passwordRef}
                label="Password"
                value={formData.password}
                onChangeText={(text) => updateFormData("password", text)}
                placeholder="Your password"
                icon={
                  <Ionicons name="lock-closed-outline" size={20} color={colors.mutedForeground} />
                }
                secureTextEntry
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              {formError ? (
                <FormError message={formError} />
              ) : sessionExpired ? (
                <FormError
                  tone="info"
                  message="Your session has expired. Please sign in again."
                />
              ) : null}

              <Button
                variant="default"
                title={buttonTitle}
                onPress={handleLogin}
                loading={isLoading}
                disabled={!canSubmit || cooldown > 0}
                className="mt-2"
              />
            </View>

            <View className="flex-row items-center justify-center mt-10">
              <Text className="text-sm font-body text-muted-foreground">
                New to HealVerse?
              </Text>
              <Pressable
                onPress={() => router.push("/(auth)/welcome" as any)}
                hitSlop={8}
                accessibilityRole="link"
                accessibilityLabel="Create an account"
                className="min-h-[44px] justify-center px-2"
              >
                <Text className="text-sm font-body-bold text-primary">
                  Create an account
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default Login;
