import React, { forwardRef } from "react";
import {
  TextInput,
  View,
  Text,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      icon,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      ...props
    },
    ref
  ) => {
    return (
      <View style={[{ marginBottom: 16 }, containerStyle]}>
        {label && (
          <Text
            style={[
              {
                fontSize: 16,
                fontFamily: "Jakarta-Medium",
                color: "#333333",
                marginBottom: 8,
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: error ? "#dc2626" : "#E0E0E0",
            borderRadius: 12,
            paddingHorizontal: 16,
            backgroundColor: "#FFFFFF",
            minHeight: 48,
          }}
        >
          {icon && <View style={{ marginRight: 12 }}>{icon}</View>}

          <TextInput
            ref={ref}
            style={[
              {
                flex: 1,
                fontSize: 16,
                fontFamily: "Jakarta-Regular",
                color: "#333333",
                paddingVertical: 12,
              },
              inputStyle,
            ]}
            placeholderTextColor="#999999"
            {...props}
          />
        </View>

        {error && (
          <Text
            style={[
              {
                fontSize: 14,
                fontFamily: "Jakarta-Medium",
                color: "#dc2626",
                marginTop: 4,
              },
              errorStyle,
            ]}
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";
