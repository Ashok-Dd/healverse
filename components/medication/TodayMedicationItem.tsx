// src/components/medication/TodayMedicationItem.tsx
import { LogStatus, TodayMedication } from "@/types/type";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface TodayMedicationItemProps {
  medication: TodayMedication;
  onLog: (medication: TodayMedication, status: LogStatus) => void;
}

const statusConfig: Record<
  LogStatus,
  { color: string; backgroundColor: string; label: string }
> = {
  TAKEN: { color: "#4CAF50", backgroundColor: "#E8F5E8", label: "Taken" },
  MISSED: { color: "#F44336", backgroundColor: "#FFEBEE", label: "Missed" },
  SKIPPED: { color: "#FF9800", backgroundColor: "#FFF3E0", label: "Skipped" },
  PENDING: { color: "#2196F3", backgroundColor: "#E3F2FD", label: "Pending" },
};

export function TodayMedicationItem({
  medication,
  onLog,
}: TodayMedicationItemProps) {
  const statusInfo = statusConfig[medication.status];
  const scheduledTime = new Date(medication.scheduledTime);
  const isOverdue =
    scheduledTime < new Date() && medication.status === "PENDING";

  const handleLogTaken = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLog(medication, "TAKEN");
  };

  const handleLogMissed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLog(medication, "MISSED");
  };

  const handleLogSkipped = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLog(medication, "SKIPPED");
  };

  return (
    <Card style={{ marginBottom: 12 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#333333",
                flex: 1,
              }}
            >
              {medication.name}
            </Text>

            <View
              style={{
                backgroundColor: statusInfo.backgroundColor,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: statusInfo.color,
                  fontWeight: "600",
                }}
              >
                {statusInfo.label}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 14,
              color: "#666666",
              marginBottom: 4,
            }}
          >
            {medication.dosage}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 14,
                color: isOverdue ? "#F44336" : "#4CAF50",
                fontWeight: "500",
              }}
            >
              {format(scheduledTime, "h:mm a")}
            </Text>

            {isOverdue && (
              <Text
                style={{
                  fontSize: 12,
                  color: "#F44336",
                  fontWeight: "500",
                  marginLeft: 8,
                }}
              >
                • Overdue
              </Text>
            )}

            {medication.actualTime && medication.status === "TAKEN" && (
              <Text
                style={{
                  fontSize: 12,
                  color: "#666666",
                  marginLeft: 8,
                }}
              >
                • Taken at {format(new Date(medication.actualTime), "h:mm a")}
              </Text>
            )}
          </View>
        </View>
      </View>

      {medication.status === "PENDING" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Button
            title="✓ Taken"
            variant="primary"
            size="sm"
            onPress={handleLogTaken}
            style={{ flex: 1 }}
          />

          <Button
            title="Skip"
            variant="outline"
            size="sm"
            onPress={handleLogSkipped}
            style={{ flex: 1 }}
          />

          <Button
            title="Missed"
            variant="danger"
            size="sm"
            onPress={handleLogMissed}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </Card>
  );
}
