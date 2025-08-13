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
                fontWeight: "500",
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
            borderColor: error ? "#F44336" : "#E0E0E0",
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
                color: "#F44336",
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
