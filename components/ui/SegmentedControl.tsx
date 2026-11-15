import React from "react";
import { Pressable, Text, View } from "react-native";

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** Pill-shaped toggle between a few mutually exclusive options (units, pace, ...). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <View
      accessibilityRole="radiogroup"
      className={`flex-row self-stretch rounded-full bg-muted p-1 ${className}`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            className={`min-h-[44px] flex-1 items-center justify-center rounded-full ${
              selected ? "bg-card" : ""
            }`}
          >
            <Text
              className={`font-body-semibold text-base ${
                selected ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
