// src/components/dashboard/AdherenceChart.tsx
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { Card } from "../ui/Card";
import { CircularProgress } from "../ui/CircularProgress";

interface AdherenceChartProps {
  adherenceRate: number;
}

const { width } = Dimensions.get("window");
const chartWidth = width - 64; // Account for padding

export function AdherenceChart({ adherenceRate }: AdherenceChartProps) {
  const getColor = (rate: number) => {
    if (rate >= 90) return "#14b8a6";
    if (rate >= 70) return "#FF9800";
    return "#F44336";
  };

  const color = getColor(adherenceRate);

  return (
    <Card shadow={false}>
      {/* Chart */}
      <View
        style={{
          alignItems: "center",
          marginBottom: 20,
          paddingVertical: 23,
        }}
      >
        <CircularProgress
          size={150}
          strokeWidth={10}
          progress={adherenceRate}
          progressColor={color}
          backgroundColor="#E0E0E0"
          showCenterContent
          centerContent={
            <>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: color,
                  textAlign: "center",
                }}
              >
                {adherenceRate}%
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#666",
                  textAlign: "center",
                }}
              >
                adherence
              </Text>
            </>
          }
        />
      </View>

      {/* Legend */}
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#4CAF50",
              borderRadius: 6,
              marginBottom: 4,
            }}
          />
          <Text style={{ fontSize: 12, color: "#666" }}>Excellent (90%+)</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#FF9800",
              borderRadius: 6,
              marginBottom: 4,
            }}
          />
          <Text style={{ fontSize: 12, color: "#666" }}>Good (70-89%)</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#F44336",
              borderRadius: 6,
              marginBottom: 4,
            }}
          />
          <Text style={{ fontSize: 12, color: "#666" }}>Needs Improvement</Text>
        </View>
      </View>
    </Card>
  );
}
