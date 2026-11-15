import { useThemeColors } from "@/constants/theme";
import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import ExerciseLogsComponent from "@/components/logs/AllExersiceLogs";
import WaterLogsComponent from "@/components/logs/AllWaterLogs";
import {Ionicons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import React, {useCallback, useMemo, useRef, useState} from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router, useLocalSearchParams} from "expo-router";


interface LogType {
    id: string;
    name: string;
    icon: string;
    component: React.ComponentType<{
        onEdit?: (logId: number) => void;
        onDelete?: (logId: number) => void;
        onCopyFood?: (logId: number) => void;
    }>;
}

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

const Index = () => {
  const colors = useThemeColors();
    const {log}: {
        log: LogType["id"];
    } = useLocalSearchParams();



    const [selectedLogs, setSelectedLogs] = useState<Set<string>>(
        () => (log ? new Set([log]) : new Set())
    );


    const bottomSheetRef = useRef<BottomSheet | null>(null);
    const snapPoints = useMemo(() => ["50%", "60%"], []);



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
                    className="flex-row items-center py-4 px-6 border-b border-border"
                    onPress={() => handleCheckboxToggle(logType.id)}
                >
                    <View
                        className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
                            isSelected ? "bg-secondary" : "bg-background"
                        }`}
                    >
                        <Ionicons
                            name={logType.icon as any}
                            size={24}
                            className={isSelected ? "text-primary" : "text-muted-foreground"}
                        />
                    </View>
                    <View className="flex-1">
                        <Text
                            className={`text-base font-body-semibold ${
                                isSelected ? "text-secondary-foreground" : "text-foreground"
                            }`}
                        >
                            {logType.name}
                        </Text>
                        <Text className="text-sm text-muted-foreground mt-1">
                            View and manage your {logType.name.toLowerCase()}
                        </Text>
                    </View>
                    <View
                        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                            isSelected
                                ? "bg-primary border-border"
                                : "border-border bg-card"
                        }`}
                    >
                        {isSelected && (
                            <Ionicons name="checkmark" size={14} className="text-primary-foreground"/>
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
                                <View className="w-10 h-10 rounded-full bg-muted items-center justify-center mr-3">
                                    <Ionicons
                                        name={logType.icon as any}
                                        size={20}
                                        className="text-muted-foreground"
                                    />
                                </View>
                                <Text className="text-lg font-body-semibold text-foreground">
                                    {logType.name}
                                </Text>
                            </View>
                            <View className="h-px bg-muted mt-3"/>
                        </View>

                        {/* Component */}
                        <Component

                        />
                    </View>
                );
            });
    }, [logTypes, selectedLogs]);

    return (
        <SafeAreaView className="flex-1 bg-muted">
            <ThemedStatusBar />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-card">
                {/* Back Button */}
                <TouchableOpacity className="p-1" onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} className="text-foreground"/>
                </TouchableOpacity>

                {/* Title */}
                <Text className="text-lg font-body-semibold text-foreground">All Logs</Text>

                {/* Filter Menu Button */}
                <TouchableOpacity className="p-1" onPress={openBottomSheet}>
                    <Ionicons name="filter" size={24} className="text-primary"/>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{paddingVertical: 16}}
                showsVerticalScrollIndicator={false}
            >
                {selectedLogs.size > 0 ? (
                    renderSelectedComponents()
                ) : (
                    /* Empty State */
                    <View className="flex-1 items-center justify-center py-20 mx-4 bg-card rounded-2xl ">
                        <View className="w-20 h-20 bg-muted rounded-full items-center justify-center mb-4">
                            <Ionicons name="document-text" size={32} className="text-muted-foreground"/>
                        </View>
                        <Text className="text-xl font-body-semibold text-muted-foreground mb-2">
                            No Logs Selected
                        </Text>
                        <Text className="text-muted-foreground text-center px-8 mb-4">
                            Use the filter button to select which logs you want to view
                        </Text>
                        <TouchableOpacity
                            className="bg-primary px-6 py-3 rounded-lg"
                            onPress={openBottomSheet}
                        >
                            <Text className="text-primary-foreground font-body-semibold">Select Logs</Text>
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
                backgroundStyle={{backgroundColor: colors.card}}
                handleIndicatorStyle={{backgroundColor: colors.border}}
                onChange={(index) => {
                    // Optional: Handle bottom sheet state changes
                }}
            >
                <BottomSheetView className="flex-1 px-6 py-4 bg-card border-t-2 border-border">
                    {/* Bottom Sheet Header */}
                    <View className="mb-6">
                        <Text className="text-xl font-body-bold text-foreground mb-1">
                            Filter Logs
                        </Text>
                        <Text className="text-sm text-muted-foreground">
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
                                className="flex-1 py-3 px-4 bg-muted rounded-xl items-center"
                            >
                                <Text className="text-foreground font-body-semibold">Select All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleClearAll}
                                className="flex-1 py-3 px-4 bg-muted rounded-xl items-center"
                            >
                                <Text className="text-foreground font-body-semibold">Clear All</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Apply Button */}
                        <TouchableOpacity
                            onPress={handleApplyFilters}
                            className="w-full py-4 bg-primary rounded-xl items-center"
                        >
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="checkmark-circle"
                                    size={20}
                                    className="text-primary-foreground"
                                    style={{marginRight: 8} as any}
                                />
                                <Text className="text-primary-foreground font-body-semibold text-base">
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

export default Index;
