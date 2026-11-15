import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { Input } from "@/components/ui/Input";
import { ACCOUNT_REVIEW_PATH } from "@/constants/onboarding";
import { useUserProfileStore } from "@/store/userProfile";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { TextInput } from "react-native";

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

const validateUsername = (value: string) => {
  const username = value.trim();
  if (username.length < 4) return "Use at least 4 characters.";
  if (username.length > 20) return "Use 20 characters or fewer.";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Only letters, numbers and underscores.";
  return undefined;
};

const validatePassword = (value: string) => {
  if (value.length < 6) return "Use at least 6 characters.";
  if (value.length > 50) return "Use 50 characters or fewer.";
  return undefined;
};

export default function Step10() {
  const setUsernameInStore = useUserProfileStore((s) => s.setUsername);
  const setPasswordInStore = useUserProfileStore((s) => s.setPassword);

  // Start from what was typed before if the user comes back from the review screen.
  const [username, setUsername] = useState(() => useUserProfileStore.getState().username);
  const [password, setPassword] = useState(() => useUserProfileStore.getState().password);
  const [confirmPassword, setConfirmPassword] = useState(
    () => useUserProfileStore.getState().password
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const clearError = (field: keyof FormErrors) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const submit = () => {
    const next: FormErrors = {
      username: validateUsername(username),
      password: validatePassword(password),
      confirmPassword: password !== confirmPassword ? "Passwords don't match." : undefined,
    };
    setErrors(next);
    if (next.username || next.password || next.confirmPassword) return false;

    setUsernameInStore(username.trim());
    setPasswordInStore(password);
    router.push(ACCOUNT_REVIEW_PATH as any);
    return false; // already navigated
  };

  return (
    <OnboardingScreen
      step={10}
      title="Create your account"
      subtitle="Last step. Choose how you'll sign in."
      continueLabel="Review & finish"
      onContinue={submit}
    >
      <Input
        label="Username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          clearError("username");
        }}
        onBlur={() => username && setErrors((p) => ({ ...p, username: validateUsername(username) }))}
        error={errors.username}
        hint="4-20 letters, numbers or underscores."
        placeholder="Choose a username"
        icon={<Ionicons name="person-outline" size={20} className="text-muted-foreground" />}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username-new"
        textContentType="username"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        submitBehavior="submit"
      />

      <Input
        ref={passwordRef}
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          clearError("password");
          clearError("confirmPassword");
        }}
        error={errors.password}
        hint="At least 6 characters."
        placeholder="Create a password"
        icon={<Ionicons name="lock-closed-outline" size={20} className="text-muted-foreground" />}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password-new"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => confirmRef.current?.focus()}
        submitBehavior="submit"
      />

      <Input
        ref={confirmRef}
        label="Confirm password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          clearError("confirmPassword");
        }}
        error={errors.confirmPassword}
        placeholder="Re-enter your password"
        icon={<Ionicons name="lock-closed-outline" size={20} className="text-muted-foreground" />}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password-new"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={submit}
      />
    </OnboardingScreen>
  );
}
