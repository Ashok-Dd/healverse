import React from "react";
import { Text, View } from "react-native";


const MedicalHeader = () => {

    return (
        <View className="bg-white my-1 py-1">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Text className="text-md mr-2">💊</Text>
                    <Text className="text-md font-bold text-green-600">HealVerse</Text>
                </View>
            </View>
        </View>
    )
};


export default MedicalHeader;
