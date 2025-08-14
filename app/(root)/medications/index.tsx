import { EmptyState } from "@/components/medication/EmptyState";
import { MedicationCard } from "@/components/medication/MedicationCard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useMedications } from "@/hooks/useMedications";
import { Medication } from "@/types/type";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicationsScreen() {
  const {
    data: medications,
    isLoading,
    refetch,
    isRefetching,
  } = useMedications();
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");

  const handleEditMedication = (medication: Medication) => {
    router.push(`/medication/edit/${medication.id}` as any);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading medications..." />;
  }

  const filteredMedications =
    medications?.filter((med) => {
      if (filter === "all") return true;
      if (filter === "active") return med.isActive;
      if (filter === "inactive") return !med.isActive;
      return true;
    }) || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            paddingTop: 8,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 4,
              }}
            >
              My Medications
            </Text>
            <Text style={{ fontSize: 16, color: "#666" }}>
              Manage your medication schedule
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(root)/(med-tabs)/add-medication")}
            style={{
              backgroundColor: "#4CAF50",
              width: 44,
              height: 44,
              borderRadius: 22,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "600" }}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 4,
            }}
          >
            {[
              {
                key: "active",
                label: "Active",
                count: medications?.filter((m) => m.isActive).length || 0,
              },
              {
                key: "inactive",
                label: "Inactive",
                count: medications?.filter((m) => !m.isActive).length || 0,
              },
              { key: "all", label: "All", count: medications?.length || 0 },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setFilter(tab.key as any)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor:
                    filter === tab.key ? "#4CAF50" : "transparent",
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: filter === tab.key ? "#FFFFFF" : "#666666",
                  }}
                >
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Medications List */}
        <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
          {filteredMedications.length === 0 ? (
            <EmptyState
              title={
                filter === "active"
                  ? "No active medications"
                  : filter === "inactive"
                  ? "No inactive medications"
                  : "No medications found"
              }
              message={
                filter === "active"
                  ? "Add your first medication to get started with tracking."
                  : filter === "inactive"
                  ? "You don't have any inactive medications."
                  : "Start by adding your medications to track your health journey."
              }
              icon={<Text style={{ fontSize: 48 }}>💊</Text>}
              action={
                <Button
                  title="Add Medication"
                  onPress={() =>
                    router.push("/(root)/(med-tabs)/add-medication")
                  }
                />
              }
            />
          ) : (
            filteredMedications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onEdit={handleEditMedication}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
