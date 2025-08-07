import ExerciseLogsComponent from "@/components/logs/AllExersiceLogs";
import WaterLogsComponent from "@/components/logs/AllWaterLogs";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LogType {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
}

const AllLogs = () => {
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "60%"], []);

  const logTypes: LogType[] = [
    {
      id: "water",
      name: "Water Logs",
      icon: "water",
      component: WaterLogsComponent,
    },
    {
      id: "exercise",
      name: "Exercise Logs",
      icon: "fitness",
      component: ExerciseLogsComponent,
    },
  ];

  const handleCheckboxToggle = useCallback((logId: string): void => {
    setSelectedLogs((prev) => {
      const newSelectedLogs = new Set(prev);
      if (newSelectedLogs.has(logId)) {
        newSelectedLogs.delete(logId);
      } else {
        newSelectedLogs.add(logId);
      }
      return newSelectedLogs;
    });
  }, []);

  const handleApplyFilters = useCallback((): void => {
    bottomSheetRef.current?.close();
  }, []);

  const handleClearAll = useCallback((): void => {
    setSelectedLogs(new Set());
  }, []);

  const handleSelectAll = useCallback((): void => {
    setSelectedLogs(new Set(logTypes.map((log) => log.id)));
  }, [logTypes]);

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const renderCheckboxItem = useCallback(
    (logType: LogType): React.ReactElement => {
      const isSelected = selectedLogs.has(logType.id);

      return (
        <TouchableOpacity
          key={logType.id}
          className="flex-row items-center py-4 px-6 border-b border-gray-100"
          onPress={() => handleCheckboxToggle(logType.id)}
        >
          <View
            className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
              isSelected ? "bg-blue-100" : "bg-gray-50"
            }`}
          >
            <Ionicons
              name={logType.icon as any}
              size={24}
              color={isSelected ? "#3b82f6" : "#9ca3af"}
            />
          </View>
          <View className="flex-1">
            <Text
              className={`text-base font-medium ${
                isSelected ? "text-blue-900" : "text-gray-800"
              }`}
            >
              {logType.name}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              View and manage your {logType.name.toLowerCase()}
            </Text>
          </View>
          <View
            className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
              isSelected
                ? "bg-blue-500 border-blue-500"
                : "border-gray-300 bg-white"
            }`}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={14} color="white" />
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [selectedLogs, handleCheckboxToggle]
  );

  const renderSelectedComponents = useCallback((): React.ReactElement[] => {
    return logTypes
      .filter((logType) => selectedLogs.has(logType.id))
      .map((logType) => {
        const Component = logType.component;
        return (
          <View key={logType.id} className="mb-6">
            {/* Section Header */}
            <View className="mx-4 mb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                  <Ionicons
                    name={logType.icon as any}
                    size={20}
                    color="#6b7280"
                  />
                </View>
                <Text className="text-lg font-semibold text-gray-800">
                  {logType.name}
                </Text>
              </View>
              <View className="h-px bg-gray-200 mt-3" />
            </View>

            {/* Component */}
            <Component
              onEdit={(logId: number) =>
                console.log(`Edit ${logType.name}:`, logId)
              }
              onDelete={(logId: number) =>
                console.log(`Delete ${logType.name}:`, logId)
              }
              onCopyFood={(logId: number) =>
                console.log(`Copy ${logType.name}:`, logId)
              }
            />
          </View>
        );
      });
  }, [logTypes, selectedLogs]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        {/* Back Button */}
        <TouchableOpacity className="p-1">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-lg font-semibold text-gray-800">All Logs</Text>

        {/* Filter Menu Button */}
        <TouchableOpacity className="p-1" onPress={openBottomSheet}>
          <Ionicons name="filter" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {selectedLogs.size > 0 ? (
          renderSelectedComponents()
        ) : (
          /* Empty State */
          <View className="flex-1 items-center justify-center py-20 mx-4 bg-white rounded-2xl shadow-sm">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="document-text" size={32} color="#9ca3af" />
            </View>
            <Text className="text-xl font-semibold text-gray-600 mb-2">
              No Logs Selected
            </Text>
            <Text className="text-gray-500 text-center px-8 mb-4">
              Use the filter button to select which logs you want to view
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg"
              onPress={openBottomSheet}
            >
              <Text className="text-white font-medium">Select Logs</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sheet for Log Selection */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#f8fafc" }}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB" }}
        onChange={(index) => {
          // Optional: Handle bottom sheet state changes
        }}
      >
        <BottomSheetView className="flex-1 px-6 py-4 bg-slate-50 border-t-2 border-gray-200">
          {/* Bottom Sheet Header */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              Filter Logs
            </Text>
            <Text className="text-sm text-gray-600">
              Choose which logs to display
            </Text>
          </View>

          {/* Log Type Selection */}
          <View className="mb-6">
            {logTypes.map((logType) => renderCheckboxItem(logType))}
          </View>

          {/* Action Buttons */}
          <View className="mt-auto pb-4">
            {/* Quick Actions */}
            <View className="flex-row mb-4 gap-3">
              <TouchableOpacity
                onPress={handleSelectAll}
                className="flex-1 py-3 px-4 bg-gray-100 rounded-xl items-center"
              >
                <Text className="text-gray-700 font-medium">Select All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClearAll}
                className="flex-1 py-3 px-4 bg-gray-100 rounded-xl items-center"
              >
                <Text className="text-gray-700 font-medium">Clear All</Text>
              </TouchableOpacity>
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              onPress={handleApplyFilters}
              className="w-full py-4 bg-blue-500 rounded-xl items-center"
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white font-semibold text-base">
                  Apply Filters{" "}
                  {selectedLogs.size > 0 && `(${selectedLogs.size})`}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default AllLogs;
