// src/components/medication/MedicationCard.tsx
import { Medication, MedicationType } from "@/types/type";
import * as Haptics from "expo-haptics";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useDeleteMedication } from "../../hooks/useMedications";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface MedicationCardProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onLog?: (medication: Medication) => void;
}

const medicationTypeIcons: Record<MedicationType, string> = {
  TABLET: "💊",
  CAPSULE: "💊",
  LIQUID: "🥤",
  INJECTION: "💉",
  INHALER: "🌬️",
  DROPS: "💧",
};

const frequencyLabels: Record<string, string> = {
  DAILY: "Once daily",
  TWICE_DAILY: "Twice daily",
  THREE_TIMES: "3 times daily",
  WEEKLY: "Weekly",
};

export function MedicationCard({
  medication,
  onEdit,
  onLog,
}: MedicationCardProps) {
  const deleteMedication = useDeleteMedication();

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      "Delete Medication",
      `Are you sure you want to delete ${medication.name}? This will also cancel all scheduled reminders.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMedication.mutate(medication.id);
          },
        },
      ]
    );
  };

  const formatScheduleTimes = () => {
    return medication.schedules
      .filter((schedule) => schedule.isActive)
      .map((schedule) => {
        const [hours, minutes] = schedule.time.split(":");
        const hour = parseInt(hours);
        const minute = minutes.padStart(2, "0");
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minute} ${period}`;
      })
      .join(", ");
  };

  return (
    <Card style={{ marginBottom: 12 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#E8F5E8",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <Text style={{ fontSize: 20 }}>
            {medicationTypeIcons[medication.type]}
          </Text>
        </View>

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
                fontSize: 18,
                fontWeight: "600",
                color: "#333333",
                flex: 1,
              }}
            >
              {medication.name}
            </Text>
            {!medication.isActive && (
              <View
                style={{
                  backgroundColor: "#FFF3E0",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{ fontSize: 12, color: "#F57C00", fontWeight: "500" }}
                >
                  Inactive
                </Text>
              </View>
            )}
          </View>

          <Text
            style={{
              fontSize: 14,
              color: "#666666",
              marginBottom: 4,
            }}
          >
            {medication.dosage} • {frequencyLabels[medication.frequency]}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#4CAF50",
              fontWeight: "500",
            }}
          >
            {formatScheduleTimes()}
          </Text>

          {medication.notes && (
            <Text
              style={{
                fontSize: 14,
                color: "#888888",
                fontStyle: "italic",
                marginTop: 4,
              }}
            >
              {medication.notes}
            </Text>
          )}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button
            title="Edit"
            variant="outline"
            size="sm"
            onPress={() => onEdit(medication)}
          />

          {onLog && (
            <Button
              title="Log Intake"
              variant="secondary"
              size="sm"
              onPress={() => onLog(medication)}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={handleDelete}
          style={{
            padding: 8,
            borderRadius: 8,
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#F44336",
              fontWeight: "500",
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
