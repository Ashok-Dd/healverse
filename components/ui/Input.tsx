import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  /** Inline validation message, shown under the field. */
  error?: string;
  /** Helper text shown under the field when there is no error. */
  hint?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, hint, icon, containerClassName = "", ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const isPassword = !!props.secureTextEntry;

    const borderClass = error
      ? "border border-destructive"
      : focused
        ? "border-2 border-ring"
        : "border border-border";

    return (
      <View className={`mb-4 ${containerClassName}`}>
        {label && (
          <Text className="mb-2 font-body-semibold text-sm text-secondary-foreground">
            {label}
          </Text>
        )}

        <View
          className={`min-h-[56px] flex-row items-center rounded-2xl bg-card px-4 ${borderClass}`}
        >
          {icon && <View className="mr-3">{icon}</View>}

          <TextInput
            ref={ref}
            className="flex-1 py-3 font-body text-base text-foreground"
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={label}
            {...props}
            secureTextEntry={isPassword && !revealed}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
          />

          {isPassword && (
            <Pressable
              onPress={() => setRevealed((v) => !v)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={revealed ? "Hide password" : "Show password"}
              className="min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <Ionicons
                name={revealed ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.mutedForeground}
              />
            </Pressable>
          )}
        </View>

        {error ? (
          <Text
            accessibilityRole="alert"
            className="mt-1 font-body-semibold text-sm text-destructive"
          >
            {error}
          </Text>
        ) : hint ? (
          <Text className="mt-1 font-body text-sm text-muted-foreground">{hint}</Text>
        ) : null}
      </View>
    );
  }
);

Input.displayName = "Input";
