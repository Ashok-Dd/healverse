import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { OptionsCardProps } from "@/types/type";

const OptionsCard = <T,>({
                             name,
                             info,
                             icon,
                             isSelected = false,
                             onPress,
                         }: OptionsCardProps<T>) => {
    return (
        <TouchableOpacity
            className={`rounded-xl border-2 px-4 py-3 w-full flex-row justify-between items-center ${
                isSelected ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-300"
            }`}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View className="flex-row gap-3 items-center">
                <Text className="text-lg">{icon}</Text>
                <Text className="font-medium text-base text-gray-800">{name}</Text>
            </View>

            {info && (
                <Link href={info as any}>
                    <Feather name="info" color="#007bff" size={20} />
                </Link>
            )}
        </TouchableOpacity>
    );
};

export default OptionsCard;
