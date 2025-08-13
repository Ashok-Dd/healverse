// src/components/dashboard/StatCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Card } from "../ui/Card";
import { LinearGradient } from "expo-linear-gradient";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  gradientColors?: string[];
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradientColors,
}: StatCardProps) {
  const defaultGradient = ["#4CAF50", "#45A049"];

  return (
    <Card shadow={false} padding={0} style={{ overflow: "hidden" }}>
      <LinearGradient
        colors={gradientColors || (defaultGradient as any)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 16 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.8)",
                marginBottom: 4,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#FFFFFF",
                marginBottom: 2,
              }}
            >
              {value}
            </Text>
            {subtitle && (
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                {subtitle}
              </Text>
            )}
          </View>
          <Text style={{ fontSize: 32, opacity: 0.8 }}>{icon}</Text>
        </View>
      </LinearGradient>
    </Card>
  );
}
