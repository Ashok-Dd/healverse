// components/LogCard.tsx
import {ExerciseLog, FoodLog, WaterLog} from "@/types/type";
import {Feather} from "@expo/vector-icons";
import {ExternalPathString, RelativePathString, router} from "expo-router";
import React from "react";
import {Text, TouchableOpacity, View} from "react-native";

interface LogCardProps<T> {
    icon: string;
    title: string;
    description: string;
    buttonText: string;
    Link?: any;
    showArrow?: boolean;
    emojiIcon?: string;
    backgroundStyle?: string;
    items: T[];
    component: (item: T) => React.JSX.Element;
    onPress?: () => void;
    moveTo?: any;
}


function LogCard<T>({
                        icon,
                        title,
                        description,
                        buttonText,
                        Link,
                        showArrow = true,
                        emojiIcon = "🍽",
                        backgroundStyle = "bg-orange-50",
                        items,
                        component: Component,
                        onPress,
                        moveTo,
                    }: LogCardProps<T>) {
    const hasItems = items && items.length > 0;

    return (
        <View className="bg-white rounded-lg p-4 mx-1 mb-2 gap-1 shadow-sm">
            {/* Header */}
            <View className="flex flex-row justify-between mb-2">
                <View className="flex-row items-center">
                    <Text className="text-xl mr-3">{icon}</Text>
                    <Text className="text-xl font-semibold text-gray-800">{title}</Text>
                </View>
                {showArrow && (
                    <Text className="text-blue-500 text-2xl" onPress={moveTo}>
                        <Feather name="arrow-right-circle" color={"skyblue"} size={20}/>
                    </Text>
                )}
            </View>

            {/* Content */}
            {hasItems ? (
                <>
                    <View className="space-y-2">
                        {items.map((item, index) => (
                            <Component {...item} key={index}/>
                        ))}
                    </View>
                    <TouchableOpacity
                        className="bg-blue-200 px-3 py-1 rounded-full self-end"
                        onPress={Link}
                    >
                        <Text className="text-blue-500 text-xs font-semibold">
                            {buttonText}
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <View className="flex-row bg-gray-100 px-2 py-2 rounded-lg items-center">
                    <View
                        className={`w-16 h-16 ${backgroundStyle} rounded-full items-center justify-center mr-4`}
                    >
                        <Text className="text-3xl">{emojiIcon}</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-600 text-xs">{description}</Text>
                    </View>
                    <TouchableOpacity
                        className="bg-blue-200 px-3 py-1 rounded-full"
                        onPress={Link || onPress}
                    >
                        <Text className="text-blue-500 text-xs font-semibold">
                            {buttonText}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export default LogCard;
