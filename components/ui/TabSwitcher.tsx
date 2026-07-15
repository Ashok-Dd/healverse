import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface Tab {
    key: string;
    icon: string;
    label: string;
}

interface TabSwitcherProps {
    tabs: Tab[];
    activeTab: string;
    setActiveTab: (key: string) => void;
}

const TabSwitcher = ({ tabs, activeTab, setActiveTab }: TabSwitcherProps) => {
    return (
        <View className="bg-white py-1 border-gray-200">
            <View className="flex-row bg-gray-100 rounded-xl p-1 mx-2">
                {tabs.map((tab: Tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        className={`flex-1 py-1 rounded-xl ${
                            activeTab === tab.key ? "bg-white shadow-sm" : ""
                        }`}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <View className="flex-row items-center justify-center">
                            <Text className="text-xs mr-2">
                                <MaterialCommunityIcons name={tab.icon as any} size={15} />
                            </Text>
                            <Text
                                className={`font-medium ${
                                    activeTab === tab.key ? "text-gray-800" : "text-gray-600"
                                }`}
                            >
                                {tab.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default TabSwitcher;
