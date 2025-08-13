import React from "react";
import { View, Text, StyleProp, TextStyle, ViewStyle } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

interface CircularProgressProps {
  progress: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
  gradient?: boolean;
  label?: string | number;
  subLabel?: string;
  labelStyle?: StyleProp<TextStyle>;
  subLabelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  showCenterContent?: boolean;
  centerContent?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  backgroundColor = "#f3f4f6",
  progressColor = "#3b82f6",
  gradient = true,
  label,
  subLabel,
  labelStyle,
  subLabelStyle,
  containerStyle,
  showCenterContent = false,
  centerContent,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <View className="items-center justify-center" style={containerStyle}>
      <View className="relative items-center justify-center">
        <Svg
          width={size}
          height={size}
          style={{ transform: [{ rotate: "-90deg" }] }}
        >
          {gradient && (
            <Defs>
              <LinearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor={progressColor} stopOpacity={1} />
                <Stop
                  offset="100%"
                  stopColor={progressColor}
                  stopOpacity={0.6}
                />
              </LinearGradient>
            </Defs>
          )}

          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={gradient ? "url(#progressGradient)" : progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>

        {/* Center Content */}
        <View className="absolute items-center justify-center">
          {showCenterContent && centerContent ? (
            centerContent
          ) : (
            <>
              {label !== undefined && (
                <Text
                  className="text-xl font-bold"
                  style={[{ color: progressColor }, labelStyle]}
                >
                  {label}
                </Text>
              )}
              {subLabel && (
                <Text className="text-xs text-gray-500" style={subLabelStyle}>
                  {subLabel}
                </Text>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};
