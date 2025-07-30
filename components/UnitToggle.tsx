import React, {memo, useCallback} from "react";
import {Text, TextStyle, TouchableOpacity, View, ViewStyle} from "react-native";

const UnitToggle = memo<{
    selectedUnit: "kg" | "lbs";
    onUnitChange: (unit: "kg" | "lbs") => void;
}>(({ selectedUnit, onUnitChange }) => {
    // Memoized button style functions
    const getButtonStyle = useCallback((unit: "kg" | "lbs", isSelected: boolean): ViewStyle => ({
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: isSelected
            ? (unit === "kg" ? "#10B981" : "#6B7280")
            : "transparent",
    }), []);

    const getTextStyle = useCallback((isSelected: boolean): TextStyle => ({
        fontWeight: "600" as const,
        color: isSelected ? "#FFFFFF" : "#6B7280",
    }), []);

    return (
        <View className="flex-row self-center mb-6 bg-gray-200 rounded-full overflow-hidden">
            <TouchableOpacity
                style={getButtonStyle("kg", selectedUnit === "kg")}
                onPress={() => onUnitChange("kg")}
                activeOpacity={0.7}
            >
                <Text style={getTextStyle(selectedUnit === "kg")}>
                    kg
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={getButtonStyle("lbs", selectedUnit === "lbs")}
                onPress={() => onUnitChange("lbs")}
                activeOpacity={0.7}
            >
                <Text style={getTextStyle(selectedUnit === "lbs")}>
                    lbs
                </Text>
            </TouchableOpacity>
        </View>
    );
});

UnitToggle.displayName = "UnitToggle";

export default UnitToggle;