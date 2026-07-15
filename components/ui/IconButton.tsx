import React from "react";
import { GestureResponderEvent, TouchableOpacity, View, Text } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type IconType = "Feather" | "MaterialIcons";

interface IconButtonProps {
    iconType?: IconType;
    iconName: string;
    loadingIconName?: string;
    label: string;
    loadingLabel?: string;
    loading?: boolean;
    onPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    bgClass?: string;
    textClass?: string;
    iconColor?: string;
    iconSize?: number;
    textSize?: string;
    rounded?: string;
}

const IconButton = ({
        iconType = "Feather",
        iconName,
        loadingIconName = "loader",
        label,
        loadingLabel = "Loading...",
        loading = false,
        onPress,
        disabled = false,
        bgClass = "bg-blue-100",
        textClass = "text-blue-700",
        iconColor = "#1D4ED8",
        iconSize = 12,
        textSize = "text-xs",
        rounded = "rounded-full"} : IconButtonProps) => {
    const IconComponent = iconType === "MaterialIcons" ? MaterialIcons : Feather;

    return (
        <TouchableOpacity
            className={`${bgClass} px-2 py-1 ${rounded}`}
            onPress={onPress}
            disabled={disabled || loading}
        >
            <View className="flex-row items-center gap-1">
                <IconComponent
                    name={loading ? loadingIconName : iconName}
                    size={iconSize}
                    color={iconColor}
                />
                <Text className={`${textClass} ${textSize}`}>
                    {loading ? loadingLabel : label}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default IconButton;
