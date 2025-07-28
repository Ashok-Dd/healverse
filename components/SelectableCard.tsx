import React from "react";
import { TouchableOpacity, Image, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import {SelectableCardProps} from "@/types/type";

const SelectableCard: React.FC<SelectableCardProps> = ({
                                                           label,
                                                           image,
                                                           selected = false,
                                                           onPress,
                                                           className = "",
                                                           textClassName = "",
                                                           icon,
                                                           showInfoIcon = true, // Add prop to control info icon visibility
                                                       }) => {

    // Function to get icon - use provided icon prop or fallback to activity icons
    const getDisplayIcon = () => {
        // If icon is provided in data (dietary goals), use it
        if (icon !== undefined) return icon;

        // Fallback to activity level icons (for BOY_OPTIONS and GIRL_OPTIONS)
        switch(label) {
            case "Sedentary": return "🪑";
            case "Lightly active": return "🚶";
            case "Moderately active": return "🏃";
            case "Very active": return "🔥";
            default: return "";
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className={`
                flex-row items-center mx-4 my-2 rounded-xl py-1
                ${selected
                ? "bg-gray-200 border-2 border-primary-500"
                : "bg-gray-200 border-2 border-transparent"
            }
                ${className}
            `}
        >
            {/* Icon */}
            <View className="w-12 h-12 mr-3 items-center justify-center">
                <Text className="text-2xl">{getDisplayIcon()}</Text>
            </View>

            {/* Label and Info Icon */}
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Text
                        className={`
                            font-jakarta-medium text-base
                            text-secondary-900"
                            ${textClassName}
                        `}
                    >
                        {label}
                    </Text>
                    {showInfoIcon && (
                        <View className="ml-2">
                            <Ionicons
                                name="information-circle-outline"
                                size={20}
                                color="#3b82f6"
                            />
                        </View>
                    )}
                </View>
            </View>

            {/* Character Image */}
            <View className="ml-4">
                <Image
                    source={image}
                    className="w-32 h-28"
                    resizeMode="contain"
                />
            </View>
        </TouchableOpacity>
    );
};

export default SelectableCard;
